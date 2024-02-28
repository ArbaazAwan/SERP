import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractFileName'
})
export class ExtractFileNamePipe implements PipeTransform {

  transform(value: string): string {
    const parts = value.split('\\');
    return parts[parts.length - 1];
  }

}
