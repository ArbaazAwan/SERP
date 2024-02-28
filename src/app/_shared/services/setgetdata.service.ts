import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetgetdataService {
  private data = new BehaviorSubject<string>(''); // The initial value is an empty string
  data$: Observable<string> = this.data.asObservable();

  constructor() {}

  setData(newData: any) {
    this.data.next(newData);
  }
}
