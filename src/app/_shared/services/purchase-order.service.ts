import { Observable } from 'rxjs';
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
export class PurchaseOrderService {
  constructor(private http: HttpClient,
  private companyCodeService:CompanyCodeService,) {}
  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAllPartyTypes() {
    return this.http.get(`${this.API_URL}api/PartySetup/LoadAllParties`);
  }
  getAllPaymentterms() {
    DocumentType: String;
    return this.http.get(
      `${this.API_URL}api/PaymentTerms/GetPaymentTerms?DocumentType=Purchase Order`
    );
  }
  getAllStore(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStores?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }

  getAllPurchaseOrderMasters(
    BranchCode: number,
    PartyCode: number
  ): Observable<number> {
    return this.http.get<number>(
      `${this.API_URL}api/PurchaseOrder/GetAllPurchaseOrderMasters?BranchCode=${BranchCode}&PartyCode=${PartyCode}`,
      { headers: headers }
    );
  }

  getStoreItem(StoreCode: number, BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStoreItems?StoreCode=${StoreCode}&BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }

  getPOMasterInfo(BranchCode: number, StoreCode: number, PONo: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseOrder/GetAllPurchaseOrderMaster?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}`,
      {
        headers: headers,
      }
    );
  }

  getShipmentMode(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseOrder/LoadShipmentMode?BranchCode=${BranchCode}`,
      {
        headers: headers,
      }
    );
  }

  pintPurchaseOrderReport(BranchCode: number, StoreCode: number, PONo: number) {
    let BranchName = localStorage.getItem('BranchName');
    //TBD----------------------------------------------------------------
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/PurchaseOrderReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}&BranchName=${BranchName}&ReportName=Purchase Order`,
      { responseType: 'blob' }
    );
  }

  postPurchaseorder(data: any) {
    return this.http.post(
      `${this.API_URL}api/PurchaseOrder/CreatePurchaseOrder?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'json' }
    );
  }

  updatePurchaseOrder(data: any) {
    return this.http.put(
      `${this.API_URL}api/PurchaseOrder/UpdatePurchaseOrder?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }

  createPODetail(data: any) {
    return this.http.post(
      `${this.API_URL}api/PurchaseOrder/InsertNewPODetail?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }

  updatePurchaseOrderDetail(data: any) {
    return this.http.put(
      `${this.API_URL}api/PurchaseOrder/UpdatePurchaseOrderDetail?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }

  deletePODetail(
    BranchCode: number,
    StoreCode: number,
    POSrNo: number,
    PONo: number
  ) {
    return this.http.delete(
      `${this.API_URL}api/PurchaseOrder/DeletePurchaseOrderDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&POSrNo=${POSrNo}&PONo=${PONo}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  getPODetailList(BranchCode: number, StoreCode: number, PONo: number) {
    return this.http.get(
      `${this.API_URL}api/PurchaseOrder/GetAllPurchaseOrderDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}`,
      {
        headers: headers,
      }
    );
  }

  loadPendingPRDetailsForPO(
    BranchCode: number,
    StoreCode: number,
    PRNo: number
  ) {
    return this.http.get(
      `${this.API_URL}api/PurchaseOrder/PendingPRDetailsToBeAddedInPO?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`,
      {
        headers: headers,
      }
    );
  }
  getPreviousPO(
    BranchCode: number,
    StoreCode: number,
    PartyCode: number,
    PONo: number
  ) {
    return this.http.get(
      `${this.API_URL}api/PurchaseOrder/GetPreviousPONo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PartyCode=${PartyCode}&PONo=${PONo}`,
      {
        headers: headers,
      }
    );
  }
  getNextPO(
    BranchCode: number,
    StoreCode: number,
    PartyCode: number,
    PONo: number
  ) {
    return this.http.get(
      `${this.API_URL}api/PurchaseOrder/GetNextPONo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PartyCode=${PartyCode}&PONo=${PONo}`,
      {
        headers: headers,
      }
    );
  }
}
