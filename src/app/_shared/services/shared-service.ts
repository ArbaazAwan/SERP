import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private parentCodeSubject = new BehaviorSubject<any>(null);
  parentCode$ = this.parentCodeSubject.asObservable();

  private isUpdate = new BehaviorSubject<any>(null);
  isUpdate$ = this.isUpdate.asObservable();

  updateParentCode(data: any) {
    this.parentCodeSubject.next(data);
  }

  updateIsUpdateValue(IsUpdate:any){
    return this.isUpdate.next(IsUpdate)
  }
  
}
