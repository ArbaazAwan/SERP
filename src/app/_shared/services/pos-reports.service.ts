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
export class PosReportsService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}
  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAllStore(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStores?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }
  getAllBranches() {
    return this.http.get(`${this.API_URL}api/Branch/GetAllBranchNames`);
  }
  getUserProjects(BranchCode: number, UserId: number) {
    return this.http.get(
      `${this.API_URL}api/UserProjects/GetUserProjects?BranchCode=${BranchCode}&UserId=${UserId}`,
      {
        headers: headers,
      }
    );
  }
  getAllCustomers() {
    return this.http.get(`${this.API_URL}api/Customer/GetAllCustomers`, {
      headers: headers,
    });
  }
  getAllSalesMan() {
    return this.http.get(`${this.API_URL}api/SalesMan/GetAllSalesMan`, {
      headers: headers,
    });
  }
  printSaleInvoiceListReport(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    LockedStatus: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/PointOfSale/SaleInvoiceListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&LockedStatus=${LockedStatus}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }
  SaleInvoiceListReportData(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    LockedStatus: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/PointOfSale/SaleInvoiceListReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&LockedStatus=${LockedStatus}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
  printSaleMenWise(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    CustomerId: number,
    SalesManId: number,
    DateFrom: string,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    //TBD-----------------------------------------
    return this.http.get(
      `${this.REPORTING_API_URL}api/PointOfSale/SaleSummaryReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&CustomerId=${CustomerId}&SalesManId=${SalesManId}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }
    //Pre Sales----------------------------------------------------------


    PreSalesReport(
      BranchCode: number,
      BranchName: string,
    ) {
      return this.http.get(
        `${this.REPORTING_API_URL}api/PointOfSale/LeadsInfoReport?FileType=PDF&BranchCode=${BranchCode}&BranchName=${BranchName}`,
        { responseType: 'blob' }
      );
    }

    PreSalesReportData(
      BranchCode: number,
      BranchName: string,
    ) {
      return this.http.get(
        `${this.REPORTING_API_URL}api/PointOfSale/LeadsInfoReport?FileType=Data&BranchCode=${BranchCode}&BranchName=${BranchName}`,
        { responseType: 'json' }
      );
    }

  getSaleSummaryList(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    CustomerId: number,
    SalesManId: number,
    DateFrom: string,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/PointOfSale/SaleSummaryReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&CustomerId=${CustomerId}&SalesManId=${SalesManId}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
}
