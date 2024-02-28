import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { escape } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  datePipe = new DatePipe('en-US');

  constructor() {}

  //returns object in an array by filtering on any property
  findObjectByKey(array: any[], Object: { key: string; value: any }): any {
    if (array && array.length > 0)
      return array.find((obj) => obj[Object.key] === Object.value);
    return null;
  }

  filterObjectsByKey(array: any[], Object: { key: string; value: any }): any[] {
    if (array && array.length > 0)
      return array.filter((obj) => obj[Object.key] === Object.value);
    return [];
  }

  filterObjectsByMultipleKeys(
    array: any[],
    filters: { key: string; value: any }[]
  ): any[] {
    if (array && array.length > 0 && filters && filters.length > 0) {
      return array.filter((obj) => {
        return filters.every((filter) => obj[filter.key] === filter.value);
      });
    }
    return [];
  }

  filterObjectsByAnyKey(
    array: any[],
    filters: { key: string; value: any }[]
  ): any[] {
    if (array && array.length > 0 && filters && filters.length > 0) {
      return array.filter((obj) => {
        return filters.some((filter) => obj[filter.key] === filter.value);
      });
    }
    return [];
  }

  updateObject(
    array: any[],
    Object: { key: string; value: any },
    updatedObject: any
  ): boolean {
    const index = array.findIndex((obj) => obj[Object.key] === Object.value);
    if (index !== -1) {
      array[index] = { ...array[index], ...updatedObject };
      return true;
    }
    return false;
  }

  deleteObject(array: any[], Object: { key: string; value: any }): boolean {
    const index = array.findIndex((obj) => obj[Object.key] === Object.value);
    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }
    return false;
  }

  filterObjectsByDateRange(
    array: any[],
    fromDate: Date,
    toDate: Date,
    dateKey: string
  ): any[] {
    if (array && array.length > 0 && fromDate && toDate && dateKey) {
      return array.filter((obj) => {
        const date = this.datePipe.transform(obj[dateKey], 'yyyy-MM-dd');
        const fDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
        const tDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');
        if (date == null || tDate == null || fDate == null) return false;
        return date >= fDate && date <= tDate;
      });
    }
    return [];
  }

  markAllFieldsAsDirtyAndTouched(form: FormGroup) {
    for (const controlName in form.controls) {
      if (form.controls.hasOwnProperty(controlName)) {
        const control = form.get(controlName);
        control?.markAsDirty();
        control?.markAsTouched();
      }
    }
  }

  // hasDuplicateValueInArray(object:any, propertyName:string, array:any[], isUpdate:boolean=false) {

  //   // Create an array of values of the specified property
  //   const propertyValues = array.map(item => item[propertyName]);

  //   if (isUpdate) {
  //     const index = propertyValues.indexOf(object[propertyName]);
  //     if (index !== -1) {
  //       propertyValues.splice(index, 1);
  //     }
  //   }
  //   // Count occurrences of the specified value in the property values array
  //   const occurrences = propertyValues.filter(propertyValue => propertyValue === object[propertyName]).length;

  //   // If occurrences is greater than 1, there are duplicates
  //   return occurrences > 1;
  // }

  hasDuplicateValue(
    value: any,
    propertyName: string,
    array: any[],
    isUpdate: boolean = false,
    columnPK?: string
  ) {
    debugger;
    let compareValue: any = null;
    if (isUpdate && columnPK) {
      array = array.filter((x: any) => x[columnPK] != value[columnPK]);
      if (typeof(value) == 'string') {
        compareValue = value.toLowerCase();
      }
      else {
        compareValue = value[propertyName];
      }
     
    } else {
      if (typeof(value) == 'string') {
        compareValue = value.toLowerCase();
      }
      else {
        compareValue = value;
      } 
    }
    const propertyValues = array.map((item) => item[propertyName]);
    const occurrences = propertyValues.filter((propertyValue: any) =>  propertyValue == compareValue).length;
    return occurrences > 0;
  }
}
