import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeQualificationModel } from '../model/model';
import { CompanyCodeService } from './company-code.service';

// const API_URL = environment.apiUrl;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class EmployeequalificationsService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}

  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAllQualification() {
    return this.http.get(
      `${this.API_URL}api/EducationalQualification/GetAllQualification`,
      {
        headers: headers,
      }
    );
  }
  getAllEmployeeQualification(EmployeeCode: number) {
    return this.http.get(
      `${this.API_URL}api/EmployeeQualification/GetEmployeeQualificationCode?EmployeeCode=${EmployeeCode}`,
      {
        headers: headers,
      }
    );
  }

  getCurrencyMaxId() {
    return this.http.get(
      `${this.API_URL}api/EmployeeQualification/GetMaxCurrencyCode`,
      {
        headers: headers,
      }
    );
  }

  postEmployeeQualification(data: any, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('BranchCode', data.BranchCode);
    formData.append('EmployeeCode', data.EmployeeCode);
    formData.append('QualificationCode', data.QualificationCode);
    formData.append('DegreeTitle', data.DegreeTitle);
    formData.append('InstitutionName', data.InstitutionName);
    formData.append('BoardOrUniversityName', data.BoardOrUniversityName);
    formData.append('Subject', data.Subject);
    formData.append('PassingYear', data.PassingYear);
    formData.append('DivisionOrGrade', data.DivisionOrGrade);
    formData.append('Documents', image, image.name);
    const header = new HttpHeaders();
    header.set('Content-Type', 'multipart/form-data');
    return this.http.post<any>(
      `${this.API_URL}api/EmployeeQualification/AddEmployeeQualification?`,
      formData,
      { headers: header, responseType: 'text' as 'json' }
    );
  }

  putEmployeeQualification(
    data: EmployeeQualificationModel
  ): Observable<EmployeeQualificationModel> {
    return this.http.put<EmployeeQualificationModel>(
      `${this.API_URL}api/EmployeeQualification/UpdateEmployeeQualification?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }
  deleteEmployeeQualification(EmpQualificationCode: number) {
    return this.http.delete<any>(
      `${this.API_URL}api/EmployeeQualification/DeleteEmployeeQualification?EmpQualificationCode=${EmpQualificationCode}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }
  //TBD----------------------------------------------------------------
  downloadImage(Documents: string) {
    return this.http.get(
      `${this.API_URL}api/EmployeeQualification/GetEmployeeQualificationDocuments?Documents=${Documents}`,
      { responseType: 'blob' }
    );
  }

  // Download Qualification Document

  downloadQualificationDocuments(
    EmployeeCode: number,
    QualificationCode: number
  ): Observable<Blob> {
    
    const url = `${this.API_URL}api/EmployeeQualification/DownloadQualificationDocuments?EmployeeCode=${EmployeeCode}&QualificationCode=${QualificationCode}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
