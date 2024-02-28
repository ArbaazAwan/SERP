import { AbstractControl, ValidatorFn } from "@angular/forms";

export class CustomValidations {
  alphabetsOnly(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^[a-zA-Z]*$/.test(control.value);
      return isValid ? null : { 'alphabetsOnly': true };
    };
  }
}
