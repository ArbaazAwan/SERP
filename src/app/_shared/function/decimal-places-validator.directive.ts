import { Directive, HostListener, Input } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[appDecimal2]',
})
export class DecimalPlacesValidatorDirective {
  @Input() appDecimal2!: number;
  private control: AbstractControl;

  constructor(private ngControl: NgControl) {
    this.control = this.ngControl.control!;
  }

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const trimmed = input.value.trim();

    // allow input of 0 or an empty string
    if (trimmed === '0' || trimmed === '') {
      input.value = trimmed;
      this.control?.setValue(trimmed);
      return;
    }

    const regex = new RegExp(`^\\d*\\.?\\d{0,${this.appDecimal2}}$`);
    const isValid = regex.test(trimmed);

    if (!isValid) {
      const oldValue = input.getAttribute('data-old-value');
      input.value = oldValue ? oldValue : '';
      this.control?.setValue(oldValue ? oldValue : '');
    } else {
      input.setAttribute('data-old-value', trimmed);
      this.control?.setValue(trimmed);
    }
  }
}
