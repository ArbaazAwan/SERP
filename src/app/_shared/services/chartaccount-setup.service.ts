import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ChartOfAccountModel, ChartofItemModel } from '../model/model';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs';
import { CompanyCodeService } from './company-code.service';

//const API_URL = environment.apiUrl;
//const Report_URL = environment.reportingURL;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class ChartaccountSetupService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}

  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAllChartofAccount() {
    return this.http.get<ChartOfAccountModel>(
      `${this.API_URL}api/ChartOfAccounts/GetAllChartOfAccounts`
    );
  }

  getAllParentCode() {
    return this.http.get(`${this.API_URL}api/ChartOfAccounts/GetParentAccountCode`);
  }

  getNewAccountLevelCode(ParentAccountCode: string) {
    return this.http.get(
      `${this.API_URL}api/ChartOfAccounts/GetNewAccountLevelCode?ParentAccountCode=${ParentAccountCode}`
    );
  }

  getAllCategories() {
    return this.http.get(
      `${this.API_URL}api/ChartOfAccounts/LoadChartOfAccountCategories`
    );
  }

  getSubCategory(CategoryId: number) {
    return this.http.get(
      `${this.API_URL}api/ChartOfAccounts/LoadChartOfAccountSubCategories?CategoryId=${CategoryId}`
    );
  }

  getAllCashFlowCategories() {
    return this.http.get(`${this.API_URL}api/ChartOfAccounts/GetCashFlowCategories`);
  }

  getCashFlowSubCategory(CategoryCode: number) {
    return this.http.get(
      `${this.API_URL}api/ChartOfAccounts/GetCashFlowSubCategories?CategoryCode=${CategoryCode}`
    );
  }

  saveChartofAccount(
    data: ChartOfAccountModel
  ): Observable<ChartOfAccountModel> {
    return this.http.post<ChartOfAccountModel>(
      `${this.API_URL}api/ChartOfAccounts/AddChartOfAccount?`,
      data,
      {
        headers,
        params: { ...data },
        responseType: 'json',
      }
    );
  }

  updateChartofAccount(
    data: ChartOfAccountModel
  ): Observable<ChartOfAccountModel> {
    return this.http.put<ChartOfAccountModel>(
      `${this.API_URL}api/ChartOfAccounts/UpdateChartOfAccount?`,
      data,
      {
        headers,
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }

  deleteChartofAccount(AccountCode: string): Observable<ChartOfAccountModel> {
    return this.http.delete<ChartOfAccountModel>(
      `${this.API_URL}api/ChartOfAccounts/DeleteChartOfAccount?`,
      { params: { AccountCode }, responseType: 'text' as 'json' }
    );
  }

  printChartOfAccountsReport() {
    let BranchName = localStorage.getItem('BranchName');
    return this.http.get(
      `${this.REPORTING_API_URL}api/GL/ChartOfAccountListReport?FileType=PDF&BranchName=${BranchName}`,
      { responseType: 'blob' }
    );
  }
  //GetchartofAccounts Tree
  getAllOfAccountsTree() {
    return this.http.get<ChartOfAccountModel>(
      `${this.API_URL}api/ChartOfAccounts/GetChartOfAccountsTree`
    );
  }
  GetChartOfItemsTree() {
    return this.http.get<ChartofItemModel>(
      `${this.API_URL}api/ChartOfItems/GetChartOfItemsTree`
    );
  }
  getAllBalanceSheetCategory() {
    return this.http.get(
      `${this.API_URL}api/BalanceSheet/GetAllBalanceSheetCategory`,
      {
        headers: headers,
      }
    );
  }
  getBalanceSheetSubCategorybyCode(BalanceSheetCode: number) {
    return this.http.get(
      `${this.API_URL}api/BalanceSheet/GetBalanceSheetSubCategorybyCode?BalanceSheetCode=${BalanceSheetCode}`,
      {
        headers: headers,
      }
    );
  }
  GetCodeBalanceSheetNote(BalanceSheetCode: number) {
    return this.http.get(
      `${this.API_URL}api/BalanceSheet/GetCodeBalanceSheetNote?BalanceSheetNoteCode=${BalanceSheetCode}`,
      {
        headers: headers,
      }
    );
  }
  GetMaxAccountCode(ParentAccountCode: number) {
    return this.http.get(
      `${this.API_URL}api/ChartOfAccounts/GetMaxAccountCode?ParentAccountCode=${ParentAccountCode}`,
      {
        headers: headers,
      }
    );
  }
}
