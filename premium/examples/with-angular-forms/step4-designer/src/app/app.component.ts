import {CommonModule} from '@angular/common';
import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {AngularReactModule} from '@bubblydoo/angular-react';
import {createElement, ForwardedRef} from 'react';
import {
  ltrCssLoader,
  RsLocalizationWrapper,
  RsViewWrapper,
  rSuiteComponents,
  rtlCssLoader
} from "@react-form-builder/components-rsuite";
import {BiDi, createView, FormViewer, FormViewerProps, IFormData, IFormViewer} from "@react-form-builder/core";
import {BuilderView, FormBuilder} from "@react-form-builder/designer";
import type {FormBuilderProps, IFormStorage} from "@react-form-builder/designer";
import {customValidators} from "./validators";
import form from './form.json';

import '@react-form-builder/core/assets/styles.css'

const componentsMetadata = rSuiteComponents.map(definer => definer.build())
const viewerComponents = componentsMetadata.map((componentMetadata) => componentMetadata.model)

const builderView = new BuilderView(componentsMetadata)
  .withViewerWrapper(RsViewWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)

const viewerView = createView(viewerComponents)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)

// We're hiding the form panel because it's not fully functional in this example
const customization = {
  Forms_Tab: {
    hidden: true
  }
}

const formName = 'form'
const defaultFormSchema = JSON.stringify(form)

export const formStorage: IFormStorage = {
  getForm: async () => localStorage.getItem(formName) || defaultFormSchema,
  saveForm: async (_, schema) => localStorage.setItem(formName, schema),
  getFormNames: () => Promise.resolve([formName]),
  removeForm: () => Promise.resolve()
}

export const loadForm = () => formStorage.getForm('')
const Builder = (props: FormBuilderProps) => createElement(FormBuilder, props);
const Viewer = (props: FormViewerProps) => createElement(FormViewer, props);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AngularReactModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly Builder = Builder;
  protected readonly Viewer = Viewer;
  @ViewChild('resultDialog') resultDialog?: ElementRef<HTMLDialogElement>;
  title = 'FormEngine with Angular designer';
  formSchema = localStorage.getItem(formName) || defaultFormSchema;
  previewVisible = true;
  previewData: Record<string, unknown> = {
    persons: [{name: '', email: ''}],
    checkin: null
  };
  previewErrors: Record<string, unknown> = {};
  viewerRef: IFormViewer | null = null;
  dialogMessage = '';
  builderProps: FormBuilderProps;
  viewerProps: FormViewerProps;

  constructor(private readonly ngZone: NgZone) {
    const viewerRef: ForwardedRef<IFormViewer> = (ref) => (this.viewerRef = ref);

    this.builderProps = {
      view: builderView,
      getForm: this.loadCurrentForm.bind(this),
      formStorage,
      validators: customValidators,
      onFormSchemaChange: this.onFormSchemaChange.bind(this),
      customization
    }

    this.viewerProps = {
      view: viewerView,
      getForm: this.loadCurrentForm.bind(this),
      validators: customValidators,
      initialData: this.previewData,
      onFormDataChange: this.onPreviewDataChange.bind(this),
      viewerRef
    };
  }

  onSubmitPreview(): void {
    const runResultDialog = () => {
      this.ngZone.run(() => {
        const errors = this.collectFormEngineErrors(this.previewErrors);
        if (errors.length > 0) {
          this.dialogMessage = 'Form data incomplete';
        } else {
          this.dialogMessage = 'Thank you! Your request will be processed!';
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
        // Validation failures are reflected in previewErrors and handled below.
      })
      .finally(() => {
        runResultDialog();
      });
  }

  closeDialog(): void {
    this.resultDialog?.nativeElement.close();
  }

  private async loadCurrentForm(): Promise<string> {
    return this.formSchema;
  }

  private onPreviewDataChange(formData: IFormData): void {
    const {data, errors} = formData;
    this.ngZone.run(() => {
      this.previewData = data;
      this.previewErrors = errors as Record<string, unknown>;
    });
  }

  private onFormSchemaChange(nextSchema: unknown): void {
    const normalizedSchema = this.normalizeSchema(nextSchema);

    this.ngZone.run(() => {
      this.formSchema = normalizedSchema;
      localStorage.setItem(formName, normalizedSchema);
      this.viewerProps = {
        ...this.viewerProps,
        // Freeze the schema snapshot to avoid races with async persistence.
        getForm: async () => normalizedSchema
      };
      this.refreshPreview();
    });
  }

  private collectFormEngineErrors(value: unknown, path = ''): Array<string> {
    if (Array.isArray(value)) {
      return value.flatMap((item, index) => this.collectFormEngineErrors(item, `${path}[${index}]`));
    }

    if (value && typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>).flatMap(([key, nestedValue]) => {
        const nextPath = path ? `${path}.${key}` : key;
        return this.collectFormEngineErrors(nestedValue, nextPath);
      });
    }

    if (typeof value === 'string' && path) {
      return [`${path}: ${value}`];
    }

    return [];
  }

  private openDialog(): void {
    const dialog = this.resultDialog?.nativeElement;
    if (!dialog) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }
  }

  private refreshPreview(): void {
    // Force destroy/create of the preview viewer on the next macrotask.
    this.previewVisible = false;
    setTimeout(() => {
      this.ngZone.run(() => {
        this.previewVisible = true;
      });
    }, 0);
  }

  private normalizeSchema(schema: unknown): string {
    if (typeof schema === 'string') {
      return schema;
    }

    try {
      return JSON.stringify(schema);
    } catch {
      return defaultFormSchema;
    }
  }
}
