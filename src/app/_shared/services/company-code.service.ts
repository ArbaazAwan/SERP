import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.gateWayApiUrl;



@Injectable({
  providedIn: 'root'
})
export class CompanyCodeService {
  constructor(
    private http: HttpClient) {}

  //  https://localhost:44320/api/ServerInfo/GetServerBaseURL?CompanyCode=10
//    http://localhost:44320/api/ServerInfo/GetServerBaseURL?CompanyCode=10

    GetByCompanyCode(CompanyCode: any) {

    return this.http.get(
      `${API_URL}api/ServerInfo/GetServerBaseURL?CompanyCode=${CompanyCode}`
    );
  }


  //--------------------------------Save Data to Cookies--------------------------------


  getCookie(name: string): string | null {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }

  setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  setApiUrlCookie(name: string, value: string, days: number){
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  setReportingApiUrlCookie(name: string, value: string, days: number){
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  deleteCookie(name: string) {
    const date = new Date();
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
