import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class StoreProjectService {
  public selectedOptionSubject = new BehaviorSubject<any>(null);
  public selectedOption$ = this.selectedOptionSubject.asObservable();

  // constructor() {
  //   // Retrieve the initial selectedOption from cookie
  //   const selectedOptionFromCookie = this.getCookie('selectedOption');
  //   this.selectedOptionSubject.next(selectedOptionFromCookie);
  // }

  constructor() {
    const selectedOptionFromCookie = this.getCookie('selectedOption');
    if (selectedOptionFromCookie) {
      this.selectedOptionSubject.next(selectedOptionFromCookie);
    }
  }

  // setSelectedOption(option: any) {
  //   localStorage.setItem('selectedOption', JSON.stringify(option));
  //   this.selectedOptionSubject.next(option);
  // }

  setSelectedOption(option: any, days: number = 7) {
    this.setCookie('selectedOption', option, days);
  }

  private setCookie(name: string, value: any, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(
      value
    )};expires=${expires.toUTCString()};path=/`;
    this.getSelectedOption();
  }

  // getSelectedOption(): Observable<any> {
  //   return this.selectedOptionSubject.asObservable();
  // }

  getSelectedOption(): Observable<any> {
    const selectedOptionFromCookie = this.getCookie('selectedOption');
    if (selectedOptionFromCookie) {
      this.selectedOptionSubject.next(selectedOptionFromCookie);
    }
    return this.selectedOptionSubject.asObservable();
  }

  private getCookie(name: string): any {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookie.split(';');

    for (let i = 0; i < cookiesArray.length; i++) {
      const cookie = cookiesArray[i].trim();
      if (cookie.startsWith(name + '=')) {
        const cookieValue = cookie.substring(name.length + 1);
        return JSON.parse(cookieValue);
      }
    }

    return null;
  }

  getStoredSelectedOption(): any {
    const storedOption = localStorage.getItem('selectedOption');
    return storedOption ? JSON.parse(storedOption) : null;
  }
  // private selectedOptionSubject = new BehaviorSubject<any>(null);
  // setSelectedOption(projectCode: number, departmentCode: number) {
  //   const option = { projectCode, departmentCode };
  //   localStorage.setItem('selectedOption', JSON.stringify(option));
  //   this.selectedOptionSubject.next(option);
  // }
  // getSelectedOption() {
  //   const storedOption = localStorage.getItem('selectedOption');
  //   return storedOption ? JSON.parse(storedOption) : null;
  // }
}
