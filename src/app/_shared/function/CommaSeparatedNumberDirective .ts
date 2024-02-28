import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCommaSeparatedNumber]'
})
export class CommaSeparatedNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any) {
    let value = event?.target?.value;
    value = value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    } else {
      value = parts.join('.');
    }
    this.el.nativeElement.value = value;
  }
}
