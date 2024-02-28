import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilityFunctions {
  constructor() {}

  /** Validate the text passed */
  validateText(
    str: string,
    length?: number | null | undefined,
    maxLength?: number | undefined
  ): boolean {
    str = str ? str.toString() : '';
    if (str) {
      if (
        !str.trim() ||
        str.trim() === '' ||
        (length && str.length < length) ||
        (maxLength && str.length > maxLength)
      ) {
        return false;
      }
      return true;
    }
    return false;
  }

  // Required validator function
  public requiredValidator(fieldName: string = '') {
    return (control: FormControl) => {
      const name = control.value;
      if (!name || !this.validateText(name)) {
        return {
          required: 'Please enter your ' + fieldName,
        };
      }
      return null;
    };
  }

  // Required validator function
  public maxlengthValidator(fieldName: string = '', length: number) {
    return (control: FormControl) => {
      const name = control.value;
      if (name && !this.validateText(name, null, length)) {
        return {
          maxlength: `${fieldName} can't be greater than ${length} characters`,
        };
      }
      return null;
    };
  }

  // Required validator function
  public minlengthValidator(fieldName: string = '', length: number) {
    return (control: FormControl) => {
      const name = control.value;
      if (name && !this.validateText(name, length)) {
        return {
          minlength: `${fieldName} can't be lesser than ${length} characters`,
        };
      }
      return null;
    };
  }

  // Email form control validator function
  public emailValidator = function (control: FormControl) {
    const email = control.value;
    const reg = /^([a-z0-9_\-\.]+)@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
    if (email && !reg.test(email)) {
      return {
        email: 'Please enter a valid email address',
      };
    }
    return null;
  };

  // Only alpha numeric hyphen validator
  public password(fieldName: string = '') {
    return (control: FormControl) => {
      const name = control.value;
      if (
        name &&
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,50}$/.test(
          name
        )
      ) {
        return {
          password:
            fieldName +
            ' must contain minimum 8 and maximum 50 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        };
      }
      return null;
    };
  }
}
