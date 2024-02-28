import { Injectable } from '@angular/core';
import { QualificationModel } from '../model/model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CompanyCodeService } from './company-code.service';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) { }

    API_URL =this.companyCodeService.getCookie('apiUrl') || '';
    REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';


saveQualification(data: QualificationModel, images: File[]): Observable<any> {
  const formData = new FormData();
  for (let i = 0; i < images.length; i++) {
    formData.append('files', images[i], images[i].name);
  }

  data.PassingYear = data.PassingYear?data.PassingYear:0;

  return this.http.post<any>(
    `${this.API_URL}api/EmployeeQualification/AddEmployeeQualification`,
    formData,
    {
      params: { ...data },
      responseType: 'text' as 'json'
    }
  );
}

updateQualification(data: QualificationModel, images: File[]): Observable<any> {

  const formData = new FormData();

  for (let i = 0; i < images.length; i++) {
    formData.append('files', images[i], images[i].name);
  }

  return this.http.post<any>(
    `${this.API_URL}api/EmployeeQualification/AddEmployeeQualification`,
    formData,
    {
      params: { ...data },
      responseType: 'text' as 'json'
    }
  );
}

}
