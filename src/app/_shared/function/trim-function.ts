import { FormControl } from '@angular/forms';

export class TrimFormControl extends FormControl {
  private _value!: string | null;

  //  get value(): string | null {
  //   return this._value;
  // }

  // override set value(value: string | null) {
  //   this._value = value ? value.trim() : value;
  // }
}
