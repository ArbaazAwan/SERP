import { AbstractControl } from '@angular/forms';

// ...

export function passwordMatchValidator(
  newpassword: string,
  confirmpassword: string
) {
  return function (form: AbstractControl) {
    const passwordValue = form.get('newpassword')?.value;
    const confirmpasswordValue = form.get('confirmpassword')?.value;
    if (passwordValue === confirmpasswordValue) {
      return null;
    }
    
    return { passwordMismatchError: true };
  };
}
