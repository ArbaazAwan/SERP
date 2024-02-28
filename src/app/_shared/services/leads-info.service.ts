import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompanyCodeService } from './company-code.service';

// const API_URL = environment.apiUrl;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);
@Injectable({
  providedIn: 'root',
})
export class LeadsInfoService {
  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}


  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  private editableData: any;

  setEditableData(data: any) {
    this.editableData = data;
  }

  getEditableData() {
    return this.editableData;
  }

  updateEditableData(updatedData: any) {
    this.editableData = updatedData;
  }

  // ==================Leads-Info-Master==================
  getMasterInfo(BranchCode: number, LeadCode: number) {
    return this.http.get(
      `${this.API_URL}api/LeadInfo/GetMasterInfo?BranchCode=${BranchCode}&LeadCode=${LeadCode}`,
      {
        headers: headers,
      }
    );
  }
  getAllLeadsMaster(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/LeadInfo/GetAllLeadMaster?BranchCode=${BranchCode}`,
      {
        headers: headers,
      }
    );
  }
  getLeadMasterDetailInfo(BranchCode: number, LeadCode: number) {
    return this.http.get(
      `${this.API_URL}api/LeadInfo/GetLeadMasterDetailInfo?BranchCode=${BranchCode}&LeadCode=${LeadCode}`,
      {
        headers: headers,
      }
    );
  }

  getMaxLeadsMasterCode(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/LeadInfo/GetMaxLeadCode?BranchCode=${BranchCode}`,
      {
        headers: headers,
      }
    );
  }
  CreatLeadMaster(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}api/LeadInfo/CreateLeadMaster?`,
      data,
      {
        headers: headers,
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }
  putLeadsMaster(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}api/LeadInfo/UpdateLeadMaster?`,
      data,
      {
        headers: headers,
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }
  deleteLeadsMaster(LeadCode: number) {
    return this.http.delete<any>(
      `${this.API_URL}api/LeadInfo/DeleteLeadMaster?LeadCode=${LeadCode}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  // ==================Leads-Info-Detail==================

  getAllLeadDetails(LeadCode: number) {
    return this.http.get(
      `${this.API_URL}api/LeadInfo/GetAllLeadDetail?LeadCode=${LeadCode}`,
      {
        headers: headers,
      }
    );
  }

  postLeadsDetail(data: any, images: File[]): Observable<any> {

    const formData = new FormData();
 if(images.length != 0){
  for (let i = 0; i < images.length; i++) {
    formData.append('files', images[i], images[i].name);
  }
 }
    const header = new HttpHeaders();
    // header.set('Content-Type', 'multipart/form-data');
    return this.http.post<any>(
      `${this.API_URL}api/LeadInfo/CreateLeadDetail?BranchCode=${data.BranchCode}&LeadCode=${data.LeadCode}&StageCode=${data.StageCode}&StepDate=${data.StepDate}&AccountManagerName=${data.AccountManagerName}&LeadPercentage=${data.LeadPercentage}&Remarks=${data.Remarks}&ReferenceSaleTypeCode=${data.Doctype}&ReferenceSaleInvoiceNo=${data.ReferenceSaleInvoiceNo}&CreatedBy=${data.CreatedBy}`,
      formData,
      { headers: header, responseType: 'text' as 'json' }
    );
  }



  putLeadsDetail(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.API_URL}api/LeadInfo/UpdateLeadDetail?`,
      data,
      {
        headers: headers,
        params: { ...data },
        responseType: 'text' as 'json',
      }
    );
  }
  deleteLeadsDetail(LeadCode: number, StepCode: number) {
    return this.http.delete<any>(
      `${this.API_URL}api/LeadInfo/DeleteLeadDetail?LeadCode=${LeadCode}&StepCode=${StepCode}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }
  deleteLeadsDetailImage(BranchCode:number,LeadCode: number, StepCode: number, DocumentId:number) {
    return this.http.delete<any>(
      `${this.API_URL}api/StepDocuments/DeleteStepDocuments?BranchCode=${BranchCode}&LeadCode=${LeadCode}&StepCode=${StepCode}&DocumentId=${DocumentId}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }
  //TBD----------------------------------------------------------------
  viewStepDocuments(
    BranchCode: number,
    LeadCode: number,
    StepCode: number,
    DocumentId: number
  ): Observable<Blob> {
    const url = `${this.API_URL}api/LeadInfo/ViewStepDocuments?BranchCode=${BranchCode}&LeadCode=${LeadCode}&StepCode=${StepCode}&DocumentId=${DocumentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  GetAllDocuments() {
    return this.http.get(`${this.API_URL}api/LeadInfo/GetAllDocument`, {
      headers: headers,
    });
  }
  GetDocumentsByCodes(LeadCode: number, StepCode: number) {
    return this.http.get(
      `${this.API_URL}api/LeadInfo/GetAllLeadDocument?LeadCode=${LeadCode}&StepCode=${StepCode}`,
      {
        headers: headers,
      }
    );
  }

  //-------------------------Remarks--------------------------------

  postRemarks(data: any): Observable<any> {

    const header = new HttpHeaders();
    return this.http.post<any>(
      `${this.API_URL}api/LeadStageRemarks/AddLeadStageRemarks?BranchCode=${data.BranchCode}&LeadCode=${data.LeadCode}&LeadStepCode=${data.StepCode}&Remarks=${data.Remarks}&CreatedBy=${data.UserId}`,
      { headers: header, responseType: 'text' as 'json' }
    );
  }

  updateRemarks(data: any): Observable<any> {

        const header = new HttpHeaders();
        return this.http.put<any>(
          `${this.API_URL}api/LeadStageRemarks/UpdateLeadStatus?BranchCode=${data.BranchCode}&LeadCode=${data.LeadCode}&LeadStepCode=${data.StepCode}&RemarksId=${data.RemarksId}&Remarks=${data.Remarks}&ModifiedBy=${data.UserId}`,
          { headers: header, responseType: 'text' as 'json' }
        );
      }

      deleteRemarks(BranchCode:any,LeadCode:any,LeadStepCode:any,RemarksId:any): Observable<any> {

            const header = new HttpHeaders();
            return this.http.delete<any>(
              `${this.API_URL}api/LeadStageRemarks/DeleteLeadStatus?BranchCode=${BranchCode}&LeadCode=${LeadCode}&LeadStepCode=${LeadStepCode}&RemarksId=${RemarksId}`,
              { headers: header, responseType: 'text' as 'json' }
            );
          }

  GetRemarks(BranchCode:number, LeadCode: number, StepCode: number) {
    return this.http.get(
      `${this.API_URL}api/LeadStageRemarks/GetLeadStageRemarks?BranchCode=${BranchCode}&LeadCode=${LeadCode}&LeadStepCode=${StepCode}`,
      {
        headers: headers,
      }
    );
  }

  GetCustomersByEmpCode(EmployeeCode:number) {
    return this.http.get(
      `${this.API_URL}api/LeadOwnerCustomers/GetLeadOwnerCustomers?EmployeeCode=${EmployeeCode}`,
      {
        headers: headers,
      }
    );
  }



}
