import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DemandDetailModel, DemandMasterModel } from '../model/model';
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
export class DepartmentaldemandService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}

  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAllDepartments() {
    return this.http.get(`${this.API_URL}api/Department/GetAllDepartments`, {
      headers: headers,
    });
  }
  getAllStore(BranchCode: number): Observable<any[]> {
    return this.http.get<any>(
      `${this.API_URL}api/Demand/LoadStores?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }
  getWorkOrder(BranchCode: number): Observable<any[]> {
    return this.http.get<any>(
      `${this.API_URL}api/WorkOrderMaster/LoadWorkOrders?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }
  getStoreItem(StoreCode: number, BranchCode: number): Observable<any[]> {
    return this.http.get<any>(
      `${this.API_URL}api/Demand/LoadStoreItems?StoreCode=${StoreCode}&BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }
  //======Demand-Master-Post=======
  postDemand(data: DemandMasterModel): Observable<DemandMasterModel> {
    return this.http.post<DemandMasterModel>(
      `${this.API_URL}api/Demand/CreateNewDemandMaster?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }
  //======Demand-Master-Update=======
  putDemandMaster(data: DemandMasterModel): Observable<DemandMasterModel> {
    return this.http.put<DemandMasterModel>(
      `${this.API_URL}api/Demand/UpdateDepartmentDemandMaster?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }

  //======Demand-Detail-Post=======
  postDemandDetail(data: DemandDetailModel): Observable<DemandDetailModel> {
    return this.http.post<DemandDetailModel>(
      `${this.API_URL}api/Demand/CreateDepartmentDemandDetail?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }
  //======Demand-Detail-Put=======
  putDemandDetail(data: DemandDetailModel): Observable<DemandDetailModel> {
    return this.http.put<DemandDetailModel>(
      `${this.API_URL}api/Demand/UpdateDepartmentDemandDetail?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }
  //======Demand-Detail-Delete=======
  deleteDemand(BranchCode: number, StoreCode: number, DemandSrNo: number) {
    return this.http.delete<any>(
      `${this.API_URL}api/Demand/DeleteDepartmentDemandDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandSrNo=${DemandSrNo}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  getDemandMastersList(
    BranchCode: number,
    StoreCode: number,
    DemandRaisedByDeptCode: number
  ) {
    return this.http.get(
      `${this.API_URL}api/Demand/GetDemandMastersList?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandRaisedByDeptCode=${DemandRaisedByDeptCode}`,
      {
        headers: headers,
      }
    );
  }
  getDemandDetails(BranchCode: number, StoreCode: number, DemandNo: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadDemandDetails?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}`,
      {
        headers: headers,
      }
    );
  }
  getDemandMasterInfo(BranchCode: number, StoreCode: number, DemandNo: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/GetDemandMasterInfo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}`,
      { headers: headers }
    );
  }
  pintDemandDetailReport(
    BranchCode: number,
    StoreCode: number,
    DemandNo: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/DemandDetailReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}&BranchName=${BranchName}&ReportName=Demand Detail Report&PrintBy=Admin`,
      { responseType: 'blob' }
    );
  }
  getPreviousDemand(BranchCode: number, StoreCode: number, DemandNo: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/GetPreviousDemandNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}`,
      {
        headers: headers,
      }
    );
  }
  getNextDemand(BranchCode: number, StoreCode: number, DemandNo: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/GetNextDemandNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}`,
      {
        headers: headers,
      }
    );
  }
}
