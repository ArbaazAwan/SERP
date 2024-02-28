import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CompanyCodeService } from './company-code.service';

// const this.API_URL = environment.apiUrl;
// const Report_URL = environment.reportingURL;

const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class PurchaseRequsitionService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}
    API_URL =this.companyCodeService.getCookie('apiUrl') || '';
    REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';
  // getMaxPRSrNo(PRNo: number) {
  //   return this.http.get<number>(
  //     `${this.API_URL}api/PurchaseRequsition/GetMaxPRSrNo?PRNo=${PRNo}`
  //   );
  // }

  getAllStore() {
    return this.http.get(`${this.API_URL}api/Demand/LoadStores`, {
      headers: headers,
    });
  }

  getWorkOrder(BranchCode: number): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}api/WorkOrderMaster/LoadWorkOrders?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }

  getStoreItem(StoreCode: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStoreItems?StoreCode=${StoreCode}`,
      { headers: headers }
    );
  }

  getPRMasterList(BranchCode: number, StoreCode: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseRequsition/GetPurchaseRequisitionMaster?BranchCode=${BranchCode}&StoreCode=${StoreCode}`,
      {
        headers: headers,
      }
    );
  }

  getPRMasterInfo(BranchCode: number, StoreCode: number, PRNo: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseRequsition/GetPurchaseRequsitionMasterInfo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`,
      {
        headers: headers,
      }
    );
  }

  postPurchaserequsition(data: any) {
    return this.http.post(
      `${this.API_URL}api/PurchaseRequsition/CreateNewPurchaseRequsition?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'json' }
    );
  }

  updatePurchaserequsition(data: any) {
    return this.http.put(
      `${this.API_URL}api/PurchaseRequsition/UpdatePurchaseRequistionNoteMaster?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }

  createPRDetail(data: any) {
    return this.http.post(
      `${this.API_URL}api/PurchaseRequsition/CreatePurchaseRequsitionDetail?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }

  updatePurchaseRequsitionDetail(data: any) {
    return this.http.put(
      `${this.API_URL}api/PurchaseRequsition/UpdatePurchaseRequsitionDetail?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }

  deletePRDetail(
    BranchCode: number,
    StoreCode: number,
    PRNo: number,
    PRSrNo: number
  ) {
    return this.http.delete(
      `${this.API_URL}api/PurchaseRequsition/DeletePurchaseRequistionNoteDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}&PRSrNo=${PRSrNo}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  getPRDetailInfo(BranchCode: number, StoreCode: number, PRNo: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseRequsition/GetPurchaseRequsitionDetailInfo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`,
      {
        headers: headers,
      }
    );
  }

  loadPendingDemandDetailsForPR(
    BranchCode: number,
    StoreCode: number,
    DemandNo: number
  ) {
    return this.http.get(
      `${this.API_URL}api/PurchaseRequsition/LoadPendingDemandDetailsForPR?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}`,
      {
        headers: headers,
      }
    );
  }
  printPurchaseRequsitionReport(
    BranchCode: number,
    StoreCode: number,
    PRNo: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    //TBD----------------------------------------------------------------
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/PurchaseRequsitionReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}&BranchName=${BranchName}&ReportName=Purchase Requsition&PrintBy=Admin`,
      { responseType: 'blob' }
    );
  }
  getPreviousPR(BranchCode: number, StoreCode: number, PRNo: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseRequsition/GetPreviousPRNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`,
      {
        headers: headers,
      }
    );
  }
  getNextPR(BranchCode: number, StoreCode: number, PRNo: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseRequsition/GetNextPRNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`,
      {
        headers: headers,
      }
    );
  }
}
