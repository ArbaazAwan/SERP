import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {



  transform(formatType: number): string {
    return this.getFormat(formatType);
  }

  private getFormat(formatType: number): string {
    switch (formatType) {
      case 1:
        return 'dd-M-yy';
      case 2:
        return 'dd/MM/yy';
      case 3:
        return 'M.D.yy';
      case 4:
        return 'DD/MM/yy';
      case 5:
        return 'M-dd-yy';
      case 6:
        return 'dd-M-yy';
      default:
        return 'YY-dd-MM'; // You can provide a default format here
    }
  }

}
