import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'timeFormat' })
export class TimePipe implements PipeTransform {
  transform(value: string, format: string = 'h:mm a'): string {
    const date = new Date();
    const [hours, minutes, seconds] = value.split(':').map((s) => Number(s));
    date.setHours(hours, minutes, seconds);
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format)!;
  }
}
