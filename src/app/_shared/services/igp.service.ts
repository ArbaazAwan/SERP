import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyCodeService } from './company-code.service';

@Injectable({
  providedIn: 'root'
})
export class IGPService {

  API_URL:string = '';
  REPORTING_API_URL:string = '';

  constructor(
    private http: HttpClient,
    private companyCodeService:CompanyCodeService,
  ) { 
    this.API_URL = this.companyCodeService.getCookie('apiUrl') || '';
    this.REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';
  }



  sendData(data: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
  
    return this.http.post(
      `${this.API_URL}api/IGP/CreateIGPDetail`,
      data,
      {
        headers,
        responseType: 'json',
      }
    );
  }

  sendBudgetEntryData(data: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
  
    return this.http.put(
      `${this.API_URL}api/BudgetEntry/UpdateBudgetEntryDetails`,
      data,
      {
        headers,
        responseType: 'json',
      }
    );
  }

  

}
