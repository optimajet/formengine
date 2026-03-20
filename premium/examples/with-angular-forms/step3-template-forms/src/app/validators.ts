import {AbstractControl, ValidationErrors} from "@angular/forms";

export const validateFullName = (control: AbstractControl): ValidationErrors | null => {
  const parts = control.value.trim().split(' ');

  if (parts.length < 2) {
    return {message: 'Enter full name'};
  }

  return null;
};
