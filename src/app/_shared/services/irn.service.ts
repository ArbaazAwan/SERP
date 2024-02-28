import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyCodeService } from './company-code.service';

const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
)

@Injectable({
  providedIn: 'root'
})
export class IrnService {
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

  getAllIRNMasters(BranchCode: number, StoreCode: number) {
    return this.http.get(
      `${this.API_URL}api/IRN/LoadAllIRN?BranchCode=${BranchCode}&StoreCode=${StoreCode}`,
      { headers: headers }
    );
  }

  getIRNMasterByIRNNo(BranchCode: number, StoreCode: number, IRNNo: number) {
    return this.http.get(
      `${this.API_URL}api/IRN/GetIRNMasterByIRNNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${IRNNo}`,
      {
        headers: headers,
      }
    );
  }
  //TBD----------------------------------------------------------------
  pintIRNReport(
    BranchCode: number,
    StoreCode: number,
    IRNNo: number,
    BranchName: string
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/store/GoodsReceiptNoteReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${IRNNo}&BranchName=${BranchName}&ReportName=Good Receipt Note`,
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

  postIRN(data: any) {
    return this.http.post(`${this.API_URL}api/IRN/CreateNewIRN?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'json',
    });
  }

  updateIRNMaster(data: any) {
    return this.http.put(`${this.API_URL}api/IRN/UpdateIRNMaster?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  createIRNDetail(data: any) {
    return this.http.post(`${this.API_URL}api/IRN/CreateIRNDetail?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  createIRNDetailEntry(data: any) {
    return this.http.post(`${this.API_URL}api/IRN/IRNDetailEntry?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  updateIRNDetail(data: any) {
    return this.http.put(`${this.API_URL}api/IRN/UpdateIRNDetail?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }

  deleteIRNDetail(BranchCode: number, IRNNo: number, IRNSrNo: number) {
    return this.http.delete(
      `${this.API_URL}api/IRN/DeleteIRNDetail?BranchCode=${BranchCode}&IRNNo=${IRNNo}&IRNSrNo=${IRNSrNo}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  getIRNDetailList(IRNNo: number, BranchCode: number, StoreCode: number) {
    return this.http.get(
      `${this.API_URL}api/IRN/LoadIRNDetails?IRNNo=${IRNNo}&BranchCode=${BranchCode}&StoreCode=${StoreCode}`,
      {
        headers: headers,
      }
    );
  }

  loadPendingPODetailsForIRN(
    BranchCode: number,
    PONo: number,
    StoreCode: number
  ) {
    return this.http.get(
      `${this.API_URL}api/IRN/PendingToReceivePOs?BranchCode=${BranchCode}&PONo=${PONo}&StoreCode=${StoreCode}`,
      {
        headers: headers,
      }
    );
  }
  getPreviousIRN(BranchCode: number, StoreCode: number, IRNNo: number) {
    return this.http.get(
      `${this.API_URL}api/IRN/GetPreviousIRNNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${IRNNo}`,
      {
        headers: headers,
      }
    );
  }
  getNextIRN(BranchCode: number, StoreCode: number, IRNNo: number) {
    return this.http.get(
      `${this.API_URL}api/IRN/GetNextIRNNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${IRNNo}`,
      {
        headers: headers,
      }
    );
  }
}
