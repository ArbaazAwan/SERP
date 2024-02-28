import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'approvedRejected'
})
export class ApprovedRejectedPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? 'Approved' : 'Rejected';
  }
}
