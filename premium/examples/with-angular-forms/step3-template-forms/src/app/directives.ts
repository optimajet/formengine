import {Directive} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";
import {validateFullName} from "./validators";

@Directive({
  selector: '[fullName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FullnameValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class FullnameValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return validateFullName(control)
  }
}
