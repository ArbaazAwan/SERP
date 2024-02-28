import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviation'
})
export class AbbreviationPipe implements PipeTransform {

  transform(value: string): string {
    let val = value.trim();
    if (!val) {
      return '';
    }
    let words = val.split(' ');
     let abbreviation = words.map(word => word.slice(0, 3)).join('-');

    return abbreviation.toUpperCase();
  }

}
