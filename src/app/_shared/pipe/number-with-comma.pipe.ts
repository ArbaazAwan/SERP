import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithComma'
})
export class NumberWithCommaPipe implements PipeTransform {

  transform(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
