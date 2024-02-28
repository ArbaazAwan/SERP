import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  static MatchingPasswords(control: AbstractControl) {
    const Password = control.get('Password')?.value;
    const ConfirmPassword = control.get('ConfirmPassword')?.value;
    const currentErrors = control.get('ConfirmPassword')?.errors;
    const confirmControl = control.get('ConfirmPassword');

    if (compare(Password, ConfirmPassword)) {
      confirmControl?.setErrors({ ...currentErrors, not_matching: true });
    } else {
      confirmControl?.setErrors({ currentErrors });
    }
  }
}

function compare(Password: string, ConfirmPassword: string) {
  return Password !== ConfirmPassword && ConfirmPassword !== '';
}
