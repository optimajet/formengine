import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule, JsonPipe} from '@angular/common';
import {validateFullName} from "../validators";

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [JsonPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  dialogMessage: string = '';
  dialogOpen: boolean = false;

  constructor() {
    this.bookingForm = new FormGroup({
      guests: new FormArray([
        this.createGuestFormGroup()
      ]),
      checkin: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  createGuestFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, validateFullName]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  get guests(): FormArray<FormGroup> {
    return this.bookingForm?.get('guests') as FormArray<FormGroup>
  }

  addGuest(): void {
    this.guests.push(this.createGuestFormGroup());
  }

  removeGuest(index: number): void {
    this.guests.removeAt(index);
  }

  onSubmit(): void {
    const formErrors = this.getFormErrors();
    if (formErrors.length > 0) {
      console.log(formErrors)
      this.dialogMessage = 'Form data incomplete'
    } else {
      console.log(this.bookingForm?.value);
      this.dialogMessage = 'Thank you! Your request will be processed!'
    }
    this.dialogOpen = true;
  }

  get errors(): Array<string> {
    return this.getFormErrors()
  }

  getFormErrors(form = this.bookingForm, errorMessages: Array<string> = []): Array<string>{
    Object.keys(form.controls).forEach((controlName) => {
      const control = form.get(controlName);
      if (control instanceof FormGroup) {
        this.getFormErrors(control, errorMessages);
      } else if (control instanceof FormArray) {
        control.controls.forEach((c) => {
          // @ts-ignore
          this.getFormErrors(c, errorMessages);
        })
      } else if (control instanceof FormControl) {
        const errors = control.errors;
        if (errors) {
          Object.keys(errors).forEach((errorKey) => {
            errorMessages.push(`${controlName} - ${errorKey}: ${errors[errorKey]}`);
          });
        }
      }
    });

    return errorMessages
  }

  closeDialog() {
    this.dialogOpen = false;
  }
}
