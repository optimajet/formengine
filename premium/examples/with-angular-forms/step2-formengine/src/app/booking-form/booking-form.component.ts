import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import { AngularReactModule } from "@bubblydoo/angular-react";
import { createElement, ForwardedRef } from "react";
import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader,
} from "@react-form-builder/components-rsuite";
import {
  BiDi,
  createView,
  FormViewer,
  FormViewerProps,
  IFormData,
  IFormViewer,
} from "@react-form-builder/core";

import form from "./form.json";
import { customValidators } from "./validators";

export const loadForm = () => JSON.stringify(form);
const Viewer = (props: FormViewerProps) => createElement(FormViewer, props);

const viewerComponents = rSuiteComponents.map((c) => c.build().model);

const viewerView = createView(viewerComponents)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader("common", formEngineRsuiteCssLoader);

interface PersonInfo {
  email: string;
  name: string;
}

interface BookingFormData {
  persons: Array<PersonInfo>;
  checkin?: Date | null | string;
}

@Component({
  selector: "app-booking-form",
  standalone: true,
  imports: [JsonPipe, CommonModule, AngularReactModule],
  templateUrl: "./booking-form.component.html",
  styleUrl: "./booking-form.component.css",
})
export class BookingFormComponent {
  protected readonly Viewer = Viewer;
  @ViewChild("resultDialog") resultDialog?: ElementRef<HTMLDialogElement>;
  bookingForm: BookingFormData = {
    persons: [this.createPerson()],
    checkin: null,
  };
  dialogMessage: string = "";
  dialogOpen: boolean = false;
  viewerRef: IFormViewer | null = null;
  viewerProps: FormViewerProps;
  formEngineErrors: Record<string, unknown> = {};

  constructor(private readonly ngZone: NgZone) {
    const viewerRef: ForwardedRef<IFormViewer> = (ref) => (this.viewerRef = ref);

    this.viewerProps = {
      view: viewerView,
      getForm: loadForm,
      validators: customValidators,
      initialData: this.toViewerData(this.bookingForm),
      onFormDataChange: this.syncFormData.bind(this),
      viewerRef,
    };
  }

  createPerson(): PersonInfo {
    return {
      name: "",
      email: "",
    };
  }

  syncFormData(formData: IFormData): void {
    const { data, errors } = formData;

    this.ngZone.run(() => {
      const persons = this.normalizePersons(data["persons"] ?? this.bookingForm.persons);
      this.bookingForm = {
        persons: persons.length > 0 ? persons : [this.createPerson()],
        checkin: this.normalizeCheckin(data["checkin"] ?? this.bookingForm.checkin),
      };

      this.formEngineErrors = errors as Record<string, unknown>;
    });
  }

  onSubmit(): void {
    const runResultDialog = () => {
      this.ngZone.run(() => {
        const formErrors = this.errors;
        if (formErrors.length > 0) {
          console.log(formErrors);
          this.dialogMessage = "Form data incomplete";
        } else {
          console.log(this.bookingForm);
          this.dialogMessage = "Thank you! Your request will be processed!";
        }
        this.openDialog();
      });
    };

    const validatePromise = this.viewerRef?.formData.validate();
    if (!validatePromise) {
      runResultDialog();
      return;
    }

    validatePromise
      .catch(() => {
        // Validation failures are reflected in form errors and handled in runResultDialog.
      })
      .finally(() => {
        runResultDialog();
      });
  }

  get errors(): Array<string> {
    return this.collectFormEngineErrors(this.formEngineErrors);
  }

  closeDialog(): void {
    this.resultDialog?.nativeElement.close();
    this.dialogOpen = false;
  }

  private normalizePersons(value: unknown): Array<PersonInfo> {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((person) => {
      const item = typeof person === "object" && person !== null ? (person as Record<string, unknown>) : {};

      return {
        name: typeof item["name"] === "string" ? item["name"] : "",
        email: typeof item["email"] === "string" ? item["email"] : "",
      };
    });
  }

  private normalizeCheckin(value: unknown): Date | string | null {
    if (value instanceof Date || typeof value === "string") {
      return value;
    }

    return null;
  }

  private toViewerData(bookingForm: BookingFormData): Record<string, unknown> {
    return {
      persons: bookingForm.persons.map((person) => ({
        name: person.name,
        email: person.email,
      })),
      checkin: bookingForm.checkin ?? null,
    };
  }

  private collectFormEngineErrors(value: unknown, path = ""): Array<string> {
    if (Array.isArray(value)) {
      return value.flatMap((item, index) => this.collectFormEngineErrors(item, `${path}[${index}]`));
    }

    if (value && typeof value === "object") {
      return Object.entries(value as Record<string, unknown>).flatMap(([key, nestedValue]) => {
        const nextPath = path ? `${path}.${key}` : key;
        return this.collectFormEngineErrors(nestedValue, nextPath);
      });
    }

    if (typeof value === "string" && path) {
      return [`${path}: ${value}`];
    }

    return [];
  }

  private openDialog(): void {
    const dialog = this.resultDialog?.nativeElement;
    if (!dialog) {
      this.dialogOpen = true;
      return;
    }

    this.dialogOpen = true;
    if (!dialog.open) {
      dialog.showModal();
    }
  }
}
