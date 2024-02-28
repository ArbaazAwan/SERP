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
export class GrnService {
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

  getStoreItem(StoreCode: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStoreItems?StoreCode=${StoreCode}`,
      { headers: headers }
    );
  }

  getWorkOrder(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/WorkOrderMaster/LoadWorkOrders?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }

  getAllGRNMasters(BranchCode: number, StoreCode: number) {
    return this.http.get(
      `${this.API_URL}api/GRN/LoadAllGRN?BranchCode=${BranchCode}&StoreCode=${StoreCode}`,
      { headers: headers }
    );
  }

  getGRNMasterByGRNNo(BranchCode: number, StoreCode: number, GRNNo: number) {
    return this.http.get(
      `${this.API_URL}api/GRN/GetGRNMasterByGRNNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}`,
      {
        headers: headers,
      }
    );
  }
  //TBD----------------------------------------------------------------
  pintGRNReport(
    BranchCode: number,
    StoreCode: number,
    GRNNo: number,
    BranchName: string
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/store/GoodsReceiptNoteReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}&BranchName=${BranchName}&ReportName=Good Receipt Note`,
      { responseType: 'blob' }
    );
  }

  pintIssuanceReport(
    StoreCode: number,
    IssuanceNo: number,
    BranchName: string
  ){
    return this.http.get(
      `${this.REPORTING_API_URL}api/store/StoreIssuanceNoteReport?FileType=PDF&StoreCode=${StoreCode}&IssuanceNo=${IssuanceNo}&BranchName=${BranchName}&ReportName=Store Issuance Report&PrintBy=${localStorage.getItem('Username')}`,
      { responseType: 'blob' }
    );
  }

  pintIssuanceReturnReport(
    StoreCode: number,
    IssuanceReturnNo: number,
    BranchName: string,
    BranchCode : number
  ){
    return this.http.get(
      `${this.REPORTING_API_URL}api/store/StoreIssuanceReturnReport?FileType=PDF&StoreCode=${StoreCode}&IssuanceReturnNo=${IssuanceReturnNo}&BranchName=${BranchName}&BranchCode=${BranchCode}&ReportName=Store Issuance Return Report`,
      { responseType: 'blob' }
    );
  }

  postGRN(data: any) {
    return this.http.post(`${this.API_URL}api/GRN/CreateNewGRN?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'json',
    });
  }

  updateGRNMaster(data: any) {
    return this.http.put(`${this.API_URL}api/GRN/UpdateGRNMaster?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  createGRNDetail(data: any) {
    return this.http.post(`${this.API_URL}api/GRN/CreateGRNDetail?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  createGRNDetailEntry(data: any) {
    return this.http.post(`${this.API_URL}api/GRN/GRNDetailEntry?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  updateGRNDetail(data: any) {
    return this.http.put(`${this.API_URL}api/GRN/UpdateGRNDetail?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  deleteGRNDetail(BranchCode: number, GRNNo: number, GRNSrNo: number) {
    return this.http.delete(
      `${this.API_URL}api/GRN/DeleteGRNDetail?BranchCode=${BranchCode}&GRNNo=${GRNNo}&GRNSrNo=${GRNSrNo}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  getGRNDetailList(GRNNo: number, BranchCode: number, StoreCode: number) {
    return this.http.get(
      `${this.API_URL}api/GRN/LoadGRNDetails?GRNNo=${GRNNo}&BranchCode=${BranchCode}&StoreCode=${StoreCode}`,
      {
        headers: headers,
      }
    );
  }

  loadPendingPODetailsForGRN(
    BranchCode: number,
    PONo: number,
    StoreCode: number
  ) {
    return this.http.get(
      `${this.API_URL}api/GRN/PendingToReceivePOs?BranchCode=${BranchCode}&PONo=${PONo}&StoreCode=${StoreCode}`,
      {
        headers: headers,
      }
    );
  }
  getPreviousGRN(BranchCode: number, StoreCode: number, GRNNo: number) {
    return this.http.get(
      `${this.API_URL}api/GRN/GetPreviousGRNNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}`,
      {
        headers: headers,
      }
    );
  }
  getNextGRN(BranchCode: number, StoreCode: number, GRNNo: number) {
    return this.http.get(
      `${this.API_URL}api/GRN/GetNextGRNNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}`,
      {
        headers: headers,
      }
    );
  }
}
