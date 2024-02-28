import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyCodeService } from './company-code.service';
import { BankAccountModel } from '../model/model';

const headers = new HttpHeaders().set(
  'Content-Type',
  'application/json'
);
@Injectable({
  providedIn: 'root',
})
export class ApiProviderService {
  printEmployeeApplicantReport(globalBranchCode: number, routeStoreCode: number, cnicNo: number) {
    throw new Error('Method not implemented.');
  }

  API_URL:string = '';
  REPORTING_API_URL:string = '';

  constructor(
    private http: HttpClient,
    private companyCodeService:CompanyCodeService,
    ) 
    {
       this.API_URL = this.companyCodeService.getCookie('apiUrl') || '';
       this.REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';
    }

  get(endPoint: string, params? : { [ param: string ]: any } , responseType?: any) {
    return this.http.get(this.API_URL + endPoint, {
      headers: headers,
      params: params ? {...params}: {},
      // responseType:  responseType ? responseType : 'text' as 'json',
    });
  }

  getReport(endPoint: string, params? : { [ param: string ]: any }, ) {
    return this.http.get(this.REPORTING_API_URL + endPoint, {
      responseType: 'blob'
    });
  }

  post(data: any, endPoint: String, paramData?: any): Observable<any> {
    return this.http.post<any>(this.API_URL + endPoint, data, {
      headers: headers,
      params: paramData ? paramData : { ...data },
      // responseType:  responseType? responseType : 'text' as 'json',
    });
  
  }

  update(data: any, endPoint: String): Observable<any> {
    return this.http.put<any>(this.API_URL + endPoint, data, {
      headers: headers,
      params: { ...data },
      // responseType:  responseType? responseType : 'text' as 'json',
    });
  }

  delete(endPoint: String, params?: { [param: string]: any }) {
    return this.http.delete(this.API_URL + endPoint, {
      headers: headers,
      params: params ? {...params}: {},
      // responseType:  responseType? responseType : 'text' as 'json',
    });
  }

  
  sendData(data: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
  
    return this.http.post(
      `${this.API_URL}api/OGP/CreateOGPDetail`,
      data,
      {
        headers,
        responseType: 'json',
      }
    );
  }
  

}
