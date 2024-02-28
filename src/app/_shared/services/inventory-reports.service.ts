import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
export class InventoryReportsService {
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
  getAllPartyTypes() {
    return this.http.get(`${this.API_URL}api/PartySetup/LoadAllParties`);
  }
  getCOAHeads(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/ChartOfItems/LoadCOAHeads?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }
  getStoreItem(StoreCode: number, BranchCode: number): Observable<any[]> {
    return this.http.get<any>(
      `${this.API_URL}api/Demand/LoadStoreItems?StoreCode=${StoreCode}&BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }
  printStockMovementReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    ItemCode: number,
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StockMovementReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&ItemCategory=${ItemCode}`,
      { responseType: 'blob' }
    );
  }

  StockMovementReportData(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    ItemCode: number,
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StockMovementReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&ItemCategory=${ItemCode}`,
      { responseType: 'json' }
    );
  }

  printStoreStockReport(
    BranchCode: number,
    StoreCode: number,
    ParentItemCode: number,
    StockOnDate: Date,
    PrintByUser: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreStockReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ParentItemCode=${ParentItemCode}&StockOnDate=${StockOnDate}&BranchName=${BranchName}&ReportName=StoreStock&PrintByUser=${PrintByUser}`,
      { responseType: 'blob' }
    );
  }
  StoreStockReportData(
    BranchCode: number,
    StoreCode: number,
    ParentItemCode: number,
    StockOnDate: Date,
    PrintByUser: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreStockReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ParentItemCode=${ParentItemCode}&StockOnDate=${StockOnDate}&BranchName=${BranchName}&ReportName=StoreStock&PrintByUser=${PrintByUser}`,
      { responseType: 'json' }
    );
  }
  printStocktWithRate(
    BranchCode: number,
    StoreCode: number,
    ChartOfItemHeadCode: number,
    StockOnDate: Date,
    PrintByUser: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreStockReportWithRate?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ChartOfItemHeadCode=${ChartOfItemHeadCode}&StockOnDate=${StockOnDate}&BranchName=${BranchName}&ReportName=StoreStock&PrintByUser=${PrintByUser}`,
      { responseType: 'blob' }
    );
  }

  StocktWithRateData(
    BranchCode: number,
    StoreCode: number,
    ChartOfItemHeadCode: number,
    StockOnDate: Date,
    PrintByUser: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreStockReportWithRate?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ChartOfItemHeadCode=${ChartOfItemHeadCode}&StockOnDate=${StockOnDate}&BranchName=${BranchName}&ReportName=StoreStock&PrintByUser=${PrintByUser}`,
      { responseType: 'json' }
    );
  }

  printStocktWithImages(
    BranchCode: number,
    StoreCode: number,
    StockOnDate: Date,
    ChartOfItemHeadCode: number,
    PrintByUser: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreStockReportWithImages?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&StockOnDate=${StockOnDate}&ChartOfItemHeadCode=${ChartOfItemHeadCode}&BranchName=${BranchName}&ReportName=StoreStock&PrintByUser=${PrintByUser}`,
      { responseType: 'blob' }
    );
  }
  printDemandListReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreDemandListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }

  getDemandList(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreDemandListReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
  printPendingToPRDemandListReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePendingToPRDemandListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }

  getPendingToPRDemandList(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePendingToPRDemandListReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
  printUnlockedDemandReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreDemandListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&LockedStatus=0`,
      { responseType: 'blob' }
    );
  }
  printStorePRList(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePRList?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }
  getStorePRList(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePRList?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
  printPendingToPOPRListReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePendingToPOPRListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }

  getPendingToPOPRList(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePendingToPOPRListReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
  printUnlockedPurchaseRequsitionReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreDemandListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&LockedStatus=0`,
      { responseType: 'blob' }
    );
  }
  printStorePendingToReceivePOList(
    BranchCode: number,
    StoreCode: number,
    PartyCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePendingToReceivePOList?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PartyCode=${PartyCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&ReportName=StorePendingToReceivePOList`,
      { responseType: 'blob' }
    );
  }

  getStorePendingToReceivePOList(
    BranchCode: number,
    StoreCode: number,
    PartyCode: number,
    DateFrom: Date,
    DateTo: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePendingToReceivePOList?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PartyCode=${PartyCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&BranchName=${BranchName}&ReportName=StorePendingToReceivePOList`,
      { responseType: 'json' }
    );
  }
  printStorePOListReport(
    BranchCode: number,
    StoreCode: number,
    PartyCode: number,
    DateFrom: Date,
    DateTo: Date,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePOList?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PartyCode=${PartyCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }

  getStorePOList(
    BranchCode: number,
    StoreCode: number,
    PartyCode: number,
    DateFrom: Date,
    DateTo: Date,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StorePOList?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PartyCode=${PartyCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}`,
      { responseType: 'json' }
    );
  }
  printItemsListReport(
    BranchCode: number,
    StoreCode: number,
    ParentItemCode: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/ChartOfItemsListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ParentItemCode=${ParentItemCode}&BranchName=${BranchName}&ReportName=Chart Of Items List`,
      { responseType: 'blob' }
    );
  }

 ItemsListReportData(
    BranchCode: number,
    StoreCode: number,
    ParentItemCode: number,
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/ChartOfItemsListReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&ParentItemCode=${ParentItemCode}&BranchName=${BranchName}&ReportName=Chart Of Items List`,
      { responseType: 'json' }
    );
  }

  PrintstoreIssuanceListReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    StoreName: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoressuanceListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&StoreName=${StoreName}&BranchName=${BranchName}&ReportName=Store Issuance Report`,
      { responseType: 'blob' }
    );
  }

  getStoreIssuanceList(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    StoreName: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoressuanceListReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&StoreName=${StoreName}&BranchName=${BranchName}&ReportName=Store Issuance Report`,
      { responseType: 'json' }
    );
  }

  StoreItemLedgerReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    ItemCode: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreItemLedgerReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&ItemCode=${ItemCode}&BranchName=${BranchName}&ReportName=Item Ledger Report`,
      { responseType: 'blob' }
    );
  }

  StoreItemLedgerReportData(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    ItemCode: string
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/StoreItemLedgerReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&ItemCode=${ItemCode}&BranchName=${BranchName}&ReportName=Item Ledger Report`,
      { responseType: 'json' }
    );
  }
  printGRNListReport(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/GRNListReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}&ReportName=GRN List Report`,
      { responseType: 'blob' }
    );
  }

  getGRNList(
    BranchCode: number,
    StoreCode: number,
    DateFrom: Date,
    DateTo: string,
    LockedStatus: number
  ) {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Store/GRNListReport?FileType=Data&BranchCode=${BranchCode}&StoreCode=${StoreCode}&DateFrom=${DateFrom}&DateTo=${DateTo}&LockedStatus=${LockedStatus}&BranchName=${BranchName}&ReportName=GRN List Report`,
      { responseType: 'json' }
    );
  }

  getChartOfAssetsListReport() {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/Finance/ChartOfAssetListReport?FileType=PDF&BranchName=${BranchName}&ReportName=Assets Report`,
      { responseType: 'blob' }
    );
  }
}
