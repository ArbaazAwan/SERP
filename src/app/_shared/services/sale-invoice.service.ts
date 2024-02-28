import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
export class SaleInvoiceService {
  constructor(
    private http: HttpClient,
    private companyCodeService: CompanyCodeService
  ) {}
  API_URL = this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL =
    this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAllSaleTypes() {
    return this.http.get(`${this.API_URL}api/SaleInvoice/GetAllSaleTypes`, {
      headers: headers,
    });
  }
  GetSaleTypeForCopyInvoices(SaleTypeCode: number) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoice/GetSaleTypesForCopyInvoices?SaleTypeCode=${SaleTypeCode}`,
      {
        headers: headers,
      }
    );
  }
  getAllStore(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStores?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }

  getStoreItem(
    StoreCode: number,
    BranchCode: number,
    ItemName: string,
    UPC: number
  ) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStoreItems?StoreCode=${StoreCode}&BranchCode=${BranchCode}&ItemName=${ItemName}&UPC=${UPC}`,
      { headers: headers }
    );
  }

  getAllSaleInvoices(
    BranchCode: number,
    StoreCode: number,
    DateFrom: string,
    DateTo: string,
    ProjectCode: number,
    CustomerId: number,
    SaleType: number,
    SaleTypeCode: number
  ) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoice/LoadAllSaleInvoices?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&ProjectCode=${ProjectCode}&CustomerId=${CustomerId}&TransactionType=${SaleType}&SaleTypeCode=${SaleTypeCode}`,
      { headers: headers }
    );
  }

  getSaleInvoiceMasterInfo(
    BranchCode: number,
    StoreCode: number,
    SaleInvoiceNo: number
  ) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoice/LoadSaleInvoiceMasterInfo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}`,
      {
        headers: headers,
      }
    );
  }

  createSaleInvoiceMaster(data: any) {
    return this.http.post(
      `${this.API_URL}api/SaleInvoice/CreateSaleInvoiceMaster?`,
      data,
      {
        headers: headers,
        params: { ...data },
        responseType: 'json',
      }
    );
  }
  pintSaleInvoiceReport(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    SaleInvoiceNo: number,
    BranchName: string,
    ReportType: string,
    SaleTypeName:any
  ) {
    return this.http.get(
      `${this.REPORTING_API_URL}api/PointOfSale/GetSaleInvoiceReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&SaleInvoiceNo=${SaleInvoiceNo}&BranchName=${BranchName}&ReportType=${ReportType}&ReportName=${SaleTypeName}`,
      { responseType: 'blob' }
    );
  }
  getSaleInvoiceBySrNo(
    StoreCode: number,
    SaleInvoiceNo: number,
    SaleInvoiceSrNo: number
  ) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoice/GetSaleInvoiceDetailBySrNo?StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}&SaleInvoiceSrNo=${SaleInvoiceSrNo}`,
      { headers: headers }
    );
  }

  updateSaleInvoiceMaster(data: any) {
    return this.http.put(
      `${this.API_URL}api/SaleInvoice/UpdateSaleInvoiceMaster?`,
      data,
      {
        headers: headers,
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  createSaleInvoiceDetail(data: any) {
    return this.http.post(
      `${this.API_URL}api/SaleInvoice/CreateSaleInvoiceDetail?`,
      data,
      {
        headers: headers,
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  createGRNDetailEntry(data: any) {
    return this.http.post(`${this.API_URL}api/GRN/GRNDetailEntry?`, data, {
      headers: headers,
      params: { ...data },
      responseType: 'text' as 'json',
    });
  }
  // CopyDataFromInvoices(data: any) {
  //   return this.http.post(`${this.API_URL}api/SaleInvoice/CopyDataFromInvoices?`, data, {
  //     headers: headers,
  //     params: { ...data },
  //     responseType: 'text' as 'json',
  //   });
  // }
  //TBD----------------------------------------------------------------
  CopyDataFromInvoices(
    BranchCode: number,
    ProjectCode: number,
    StoreCode: number,
    SaleInvoiceNo: any,
    RefSaleInvoiceNo: any,
    RefSaleTypeCode: number,
    Createdby: number,
    dataTable: any[]
  ): Observable<string> {
    const url = `${this.API_URL}api/SaleInvoice/CopySaleInvoiceDetails`;
    const body = dataTable;
    return this.http.post<string>(url, body, {
      params: {
        BranchCode: BranchCode.toString(),
        ProjectCode: ProjectCode.toString(),
        StoreCode: StoreCode.toString(),
        SaleInvoiceNo: SaleInvoiceNo.toString(),
        RefSaleInvoiceNo: RefSaleInvoiceNo.toString(),
        RefSaleTypeCode: RefSaleTypeCode.toString(),
        Createdby: Createdby.toString(),
      },
    });
  }

  updateSaleInvoiceDetail(data: any) {
    return this.http.put(
      `${this.API_URL}api/SaleInvoice/UpdateSaleInvoiceDetail?`,
      data,
      {
        headers: headers,
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  deleteSaleInvoiceDetail(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    SaleInvoiceNo: number,
    SaleInvoiceSrNo: number
  ) {
    return this.http.delete(
      `${this.API_URL}api/SaleInvoice/DeleteSaleInvoiceDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&SaleInvoiceNo=${SaleInvoiceNo}&SaleInvoiceSrNo=${SaleInvoiceSrNo}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  getSaleInvoiceDetail(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    SaleInvoiceNo: number
  ) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoice/GetSaleInvoiceDetail?BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&SaleInvoiceNo=${SaleInvoiceNo}`,
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
  CopyDataSaleInvoice(
    BranchCode: number,
    ProjectCode: number,
    StoreCode: number,
    SaleTypeCode: number,
    SaleInvoiceNo: any
  ) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoice/GetToBeCopiedSaleInvoicesDetail?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&StoreCode=${StoreCode}&SaleTypeCode=${SaleTypeCode}&SaleInvoiceNo=${SaleInvoiceNo}`,
      {
        headers: headers,
      }
    );
  }

  UpdateStatus(
    BranchCode: number,
    StoreCode: number,
    SaleInvoiceNo: any,
    Status: number
  ) {
    return this.http.put(
      `${this.API_URL}api/SaleInvoice/UpdateStatus?BranchCode=${BranchCode}
      &StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}&Status=${Status}`,
      {
        headers: headers,
      }
    );
  }
  GetAllStatus() {
    return this.http.get(`${this.API_URL}api/SaleInvoice/GetAllStatus`, {
      headers: headers,
    });
  }
  CreateSaleDocuments(data: any, images: File[]): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('files', images[i], images[i].name);
    }
    const header = new HttpHeaders();
    // header.set('Content-Type', 'multipart/form-data');
    return this.http.post<any>(
      `${this.API_URL}api/SaleInvoiceDocuments/CreateSaleDocuments?BranchCode=${data.BranchCode}&ProjectCode=${data.ProjectCode}&StoreCode=${data.StoreCode}&SaleInvoiceNo=${data.SaleInvoiceNo}&DocumentName=${data.DocumentName}`,
      formData,
      { headers: header, responseType: 'text' as 'json' }
    );
  }
  GetAllnvoiceDocuments(
    BranchCode: number,
    ProjectCode: number,
    StoreCode: number,
    SaleInvoiceNo: any
  ) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoiceDocuments/GetAllnvoiceDocuments?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}`,
      { headers: headers }
    );
  }

  DeleteSaleInvoiceDocument(
    BranchCode: number,
    ProjectCode: number,
    StoreCode: number,
    SaleInvoiceNo: any,
    DocumentId: number
  ) {
    return this.http.delete(
      `${this.API_URL}api/SaleInvoiceDocuments/DeleteSaleInvoiceDocument?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}&DocumentId=${DocumentId}`,
      { headers: headers }
    );
  }
  viewStepDocuments(
    BranchCode: number,
    ProjectCode: number,
    StoreCode: number,
    SaleInvoiceNo: any,
    DocumentId: number
  ): Observable<Blob> {
    const url = `${this.API_URL}api/SaleInvoiceDocuments/ViewSaleInvoiceDocuments?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}&DocumentId=${DocumentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  GetMaxDocumentId(
    BranchCode: number,
    ProjectCode: number,
    StoreCode: number,
    SaleInvoiceNo: any
  ) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoiceDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}`,
      { headers: headers }
    );
  }
  getAllItemDialogue(BranchCode: number): Observable<any> {
    return this.http.get(
      `${this.API_URL}api/PosPreferences/GetPosPreferencesItems`,
      {
        params: { BranchCode },
      }
    );
  }
  filterItemsbyNameandCode(itemName: string, UPC: number) {
    return this.http.get(
      `${this.API_URL}api/ChartOfItems/ChartOfItemByItemCode?ItemName=${itemName}&UPC=${UPC}`
    );
  }
}
