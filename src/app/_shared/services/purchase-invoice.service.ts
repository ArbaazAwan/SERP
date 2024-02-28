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
export class PurchaseInvoiceService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}
  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  // getAllPartyTypes() {
  //   return this.http.get(`${this.API_URL}api/PurchaseInvoice/GetAllParties`);
  // }

  // getAllStore(BranchCode: number) {
  //   return this.http.get(
  //     `${this.API_URL}api/Demand/LoadStores?BranchCode=${BranchCode}`,
  //     { headers: headers }
  //   );
  // }

  // getAllPurchaseInvoiceList(
  //   BranchCode: number,
  //   StoreCode: number,
  //   DateFrom: string,
  //   DateTo: string,
  //   PartyCode: number
  // ) {
  //   return this.http.get(
  //     `${this.API_URL}api/PurchaseInvoice/LoadAllPurchaseInvoices?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&PartyCode=${PartyCode}`,
  //     { headers: headers }
  //   );
  // }

  // getAllPurchaseOrderMasters(
  //   BranchCode: number,
  //   PartyCode: number
  // ): Observable<number> {
  //   return this.http.get<number>(
  //     `${this.API_URL}api/PurchaseOrder/GetAllPurchaseOrderMasters?BranchCode=${BranchCode}&PartyCode=${PartyCode}`,
  //     { headers: headers }
  //   );
  // }

  // getStoreItem(StoreCode: number, BranchCode: number) {
  //   return this.http.get(
  //     `${this.API_URL}api/Demand/LoadStoreItems?StoreCode=${StoreCode}&BranchCode=${BranchCode}`,
  //     { headers: headers }
  //   );
  // }

  // loadPurchaseInvoiceMasterInfo(
  //   BranchCode: number,
  //   StoreCode: number,
  //   PurchaseInvoiceNo: number
  // ) {
  //   return this.http.get(
  //     `${this.API_URL}api/PurchaseInvoice/LoadPurchaseInvoiceMasterInfo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchaseInvoiceNo=${PurchaseInvoiceNo}`,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // getShipmentMode(BranchCode: number) {
  //   return this.http.get(
  //     `${this.API_URL}api/PurchaseOrder/LoadShipmentMode?BranchCode=${BranchCode}`,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  pintPurchaseInvoiceReport(BranchCode: number, StoreCode: number, PINo: number) {
    let BranchName = localStorage.getItem('BranchName');
    //TBD----------------------------------------------------------------
    return this.http.get(
      `${this.REPORTING_API_URL}api/AccountPayable/PurchaseInvoiceReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchaseInvoiceNo=${PINo}&BranchName=${BranchName}&ReportName=Purchase Invoice`,
      { responseType: 'blob' }
    );
  }

  pintOGPReport(BranchCode: number, StoreCode: number, OGPNo: number) {
    let BranchName = localStorage.getItem('BranchName');
    //TBD----------------------------------------------------------------
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/OutwardGatePassReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&OGPNo=${OGPNo}&BranchName=${BranchName}&ReportName=OGP`,
      { responseType: 'blob' }
    );
  }

  pintPurchasePaymentReport(BranchCode: number, StoreCode: number, PPNo: number) {
    let BranchName = localStorage.getItem('BranchName');
    //TBD----------------------------------------------------------------
    return this.http.get(
      `${this.REPORTING_API_URL}api/AccountPayable/PurchasePaymentReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchasePaymentNo=${PPNo}&BranchName=${BranchName}&ReportName=Purchase Payment`,
      { responseType: 'blob' }
    );
  }

  // postPurchaseorder(data: any) {
  //   return this.http.post(
  //     `${this.API_URL}api/PurchaseOrder/CreatePurchaseOrder?`,
  //     data,
  //     { headers: headers, params: { ...data }, responseType: 'json' }
  //   );
  // }

  // updatePurchaseInvoice(data: any) {
  //   return this.http.put(
  //     `${this.API_URL}api/PurchaseInvoice/UpdatePurchaseInvoiceMaster?`,
  //     data,
  //     { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
  //   );
  // }

  // createPurchaseInvoiceMaster(data: any) {
  //   return this.http.post(
  //     `${this.API_URL}api/PurchaseInvoice/CreatePurchaseInvoiceMaster?`,
  //     data,
  //     { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
  //   );
  // }

  // updatePurchaseOrderDetail(data: any) {
  //   return this.http.put(
  //     `${this.API_URL}api/PurchaseOrder/UpdatePurchaseOrderDetail?`,
  //     data,
  //     { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
  //   );
  // }

  // deletePIDetail(
  //   BranchCode: number,
  //   StoreCode: number,
  //   PurchaseInvoiceNo: number,
  //   PurchaseInvoiceSrNo: number
  // ) {
  //   return this.http.delete(
  //     `${this.API_URL}api/PurchaseInvoice/DeletePurchaseInvoiceDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchaseInvoiceNo=${PurchaseInvoiceNo}&PurchaseInvoiceSrNo=${PurchaseInvoiceSrNo}`,
  //     { headers: headers, responseType: 'text' as 'json' }
  //   );
  // }

  // getPurchaseInvoiceDetail(
  //   BranchCode: number,
  //   StoreCode: number,
  //   PurchaseInvoiceNo: number
  // ) {
  //   return this.http.get(
  //     `${this.API_URL}api/PurchaseInvoice/GetPurchaseInvoiceDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchaseInvoiceNo=${PurchaseInvoiceNo}`,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // loadPendingToInvoiceData(
  //   BranchCode: number,
  //   StoreCode: number,
  //   GRNNo: number
  // ) {
  //   return this.http.get(
  //     `${this.API_URL}api/PurchaseInvoice/PurchaseInvoice_PendingToInvoiceData?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}`,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  // saveDetail(data: any) {
  //   return this.http.post(
  //     `${this.API_URL}api/PurchaseInvoice/CreatePurchaseInvoiceDetail?`,
  //     data,
  //     { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
  //   );
  // }
}
