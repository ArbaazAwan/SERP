import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompanyCodeService } from './company-code.service';


//const API_URL = environment.apiUrl;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);
@Injectable({
  providedIn: 'root'
})
export class UserFormRightsService {

  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}
    API_URL =this.companyCodeService.getCookie('apiUrl') || '';
    REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';
  //TBD----------------------------------------------------------------
  createNewUserFormRights(moduleId: number, userId: number, dataTable: any[]): Observable<string> {
    const url = `${this.API_URL}api/UserFormRights/CreateNewUserFormRights`;
    const body = dataTable;

    return this.http.post<string>(url, body, {
      params: { ModuleId: moduleId.toString(), UserId: userId.toString() }
    });
  }



}
