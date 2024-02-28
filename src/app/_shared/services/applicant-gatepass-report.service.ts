import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DemandDetailModel, DemandMasterModel } from '../model/model';
import { CompanyCodeService } from './company-code.service';
import { IEmployeeApplicantView } from '../model/HR-Payroll';

// const API_URL = environment.apiUrl;
// const Report_URL = environment.reportingURL;

const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);
@Injectable({
  providedIn: 'root',
})
export class ApplicantGatepassReportService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}

  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  printEmployeeApplicantReport(
    CNIC: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    let PrintBy = localStorage.getItem('Username')
    return this.http.get(
      `${this.REPORTING_API_URL}api/HR/GetEmployeeApplicantReport?FileType=PDF&PrintBy=${PrintBy}&BranchName=${BranchName}&CNIC=${CNIC}&ReportName=Employee Applicant Gate Pass`,
      { responseType: 'blob' }
    );
  }
}
