import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CompanyCodeService } from './company-code.service';

// const API_URL = environment.apiUrl;
// const Report_URL = environment.reportingURL;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);
@Injectable({
  providedIn: 'root',
})
export class GlReportsService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}


  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAllBranches() {
    return this.http.get(`${this.API_URL}api/Branch/GetAllBranchNames`);
  }
  getAllProject() {
    return this.http.get(`${this.API_URL}api/Projects/GetAllProjects`);
  }
  getAllFinancialyear() {
    return this.http.get(`${this.API_URL}api/FinancialYears/GetAllFinancialYears`, {
      headers: headers,
    });
  }
  getUserProjects(BranchCode: number, UserId: number) {
    return this.http.get(
      `${this.API_URL}api/UserProjects/GetUserProjects?BranchCode=${BranchCode}&UserId=${UserId}`,
      {
        headers: headers,
      }
    );
  }
  getUserVoucherTypes(UserId: number) {
    return this.http.get(
      `${this.API_URL}api/UserVoucherType/GetUserVoucherTypes?UserId=${UserId}`,
      {
        headers: headers,
      }
    );
  }
  getAllFinancialMonth(FinancialYearCode: number) {
    return this.http.get(
      `${this.API_URL}api/FinancialYears/LoadFinantialMonths?FinancialYearCode=${FinancialYearCode}`,
      {
        headers: headers,
      }
    );
  }
  //TBD----------------------------------------------------------------
  pintGeneralLedgerReport(
    BranchCode: number,
    BranchName:string,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    AccountCodeFrom: number,
    AccountCodeTo: number
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&AccountCodeFrom=${AccountCodeFrom}&AccountCodeTo=${AccountCodeTo}&BranchName=${BranchName}&ReportName=purchase order`,
      { responseType: 'blob' }
    );
  }

  GeneralLedgerReportData(
    globalBranchCode: number,
    BranchName:string,
    selectedProject: number,
    DateFrom: Date,
    DateTo: Date,
    AccountCodeFrom: number,
    AccountCodeTo: number
  ) {
    
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerReport?FileType=Data&BranchCode=${globalBranchCode}&ProjectCode=${selectedProject}&DateFrom=${DateFrom}&DateTo=${DateTo}&AccountCodeFrom=${AccountCodeFrom}&AccountCodeTo=${AccountCodeTo}&BranchName=${BranchName}&ReportName=purchase order`,
      { responseType: 'json' }
    );
  }

  GeneralLedgerPartyData(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    partycode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerPartyReport?FileType=Data&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&PartyCode=${partycode}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }

  printGeneralLedgerPartyReport(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    partycode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerPartyReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&PartyCode=${partycode}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }

  printGeneralLedgerEmployeeInfoReport(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    employeeCode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerEmployeeInfoReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&EmployeeCode=${employeeCode}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }
  GeneralLedgerEmployeeInfoData(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    employeeCode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerEmployeeInfoReport?FileType=Data&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&EmployeeCode=${employeeCode}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
  printGeneralLedgerChartOfAssetsReport(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    assetCode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerChartOfAssetsReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&AssetCode=${assetCode}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }

  GeneralLedgerChartOfAssetsReportData(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    assetCode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerChartOfAssetsReport?FileType=Data&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&AssetCode=${assetCode}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }

  printGeneralLedgerWorkOrderReport(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    workorderCode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerWorkOrderReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&wo_number=${workorderCode}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }

 GeneralLedgerWorkOrderReportData(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date,
    workorderCode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GeneralLedgerWorkOrderReport?FileType=Data&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&wo_number=${workorderCode}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }

  pintTrialBalanceReport(BranchCode: number, FinacialYearCode: number,ReportType:string, DateFrom:any,DateTo:any,BranchName:string) {
    
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/TrialBalanceReport?FileType=PDF&BranchCode=${BranchCode}&FinacialYearCode=${FinacialYearCode}&BranchName=${BranchName}&ReportName=Trial Balance Report&PrintBy=Admin&ReportType=${ReportType}&DateFrom=${DateFrom}&DateTo=${DateTo}`,
      { responseType: 'blob' }
    );
  }

  pintTrialBalance12MonthsReport(BranchCode: number, FinacialYearCode: number,ReportType:string,BranchName:string) {
    let PrintBy =localStorage.getItem('Username')
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/TrialBalanceReportMonthlyComparison?FileType=PDF&BranchCode=${BranchCode}&FinacialYearCode=${FinacialYearCode}&BranchName=${BranchName}&ReportName=Trial Balanace Month Wise Report&PrintBy=${PrintBy}&ReportType=${ReportType}`,
      { responseType: 'blob' }
    );
  }
  TrialBalanceReportData(BranchCode: number, FinacialYearCode: number,ReportType:string,DateFrom:any,DateTo:any,BranchName:string) {
    
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/TrialBalanceReport?FileType=Data&BranchCode=${BranchCode}&FinacialYearCode=${FinacialYearCode}&BranchName=${BranchName}&ReportName=Trial Balance Report&PrintBy=Admin&ReportType=${ReportType}&DateFrom=${DateFrom}&DateTo=${DateTo}`,
      { responseType: 'json' }
    );
  }

  pintPartySetUpReport() {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/PartyListReport?FileType=PDF&BranchName=${BranchName}&ReportName=PartyList Report&PrintBy=Admin`,
      { responseType: 'blob' }
    );
  }

  printProfitandLossReport(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/ProfitAndLossReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}`,
      { responseType: 'blob' }
    );
  }

    ProfitandLossReportData(
    BranchCode: number,
    ProjectCode: number,
    DateFrom: Date,
    DateTo: Date
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/ProfitAndLossReport?FileType=Data&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&DateFrom=${DateFrom}&DateTo=${DateTo}`,
      { responseType: 'json' }
    );
  }

  //TBD----------------------------------------------------------------
  printBalanceSheetReport(
    BranchCode: number,
    ProjectCode: number,
    FinancialYearCode: number,
    DateTo: Date
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/BalanceSheetReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&FinancialYearCode=${FinancialYearCode}&DateTo=${DateTo}`,
      { responseType: 'blob' }
    );
  }

BalanceSheetReportData(
    BranchCode: number,
    ProjectCode: number,
    FinancialYearCode: number,
    DateTo: Date
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/BalanceSheetReport?FileType=Data&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&FinancialYearCode=${FinancialYearCode}&DateTo=${DateTo}`,
      { responseType: 'json' }
    );
  }
  GetVoucherListReport(ProjectCode: number,VoucherTypeCode:number,DateFrom: Date, DateTo: Date, BranchName:string,BranchCode:number) {
    
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GetVoucherListReport?FileType=PDF&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&VoucherTypeCode=${VoucherTypeCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&PrintBy=Admin`,
      { responseType: 'blob' }
    );
  }
  GetVoucherListReportData(ProjectCode: number,VoucherTypeCode:number,DateFrom: Date, DateTo: Date, BranchName:string,BranchCode:number){
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/GetVoucherListReport?FileType=Data&BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&VoucherTypeCode=${VoucherTypeCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&PrintBy=Admin`,
      { responseType: 'json' }
    );
  }


  GetBudgetVarianceReportData(BranchName:string,BranchCode:number){
    return this.http.get(
      `${this.REPORTING_API_URL}api/Finance/GetBudgetVariance?FileType=PDF&BranchCode=${BranchCode}&BranchName=${BranchName}&PrintBy=Admin`,
      { responseType: 'blob' }
    );
  }

 
}


// https://localhost:44341/api/GL/GetVoucherListReport?FileType=PDF&BranchCode=0&ProjectCode=0&VoucherTypeCode=0&DateFrom=2023-11-01&DateTo=2023-11-07&BranchName=Swati Technologies&PrintBy=admin