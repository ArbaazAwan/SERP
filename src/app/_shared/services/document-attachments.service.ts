import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentAttachmentsModel } from '../model/model';
import { CompanyCodeService } from './company-code.service';

// const API_URL = environment.apiUrl;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);
@Injectable({
  providedIn: 'root',
})
export class DocumentAttachmentsService {

  constructor(private http: HttpClient,
    private companyCodeService:CompanyCodeService,) {}

  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  GetProjectsByBranchCode(branchCode:any) {
    return this.http.get(`${this.API_URL}api/Projects/GetProjectsByBranchCode?BranchCode=${branchCode}`, {
      headers: headers,
    });
  }
  getAllStore(BranchCode: number) {
    return this.http.get(
      `${this.API_URL}api/Demand/LoadStores?BranchCode=${BranchCode}`,
      { headers: headers }
    );
  }
  getAllDocumentTypes() {
    return this.http.get(`${this.API_URL}api/DocumentTypes/GetAllDocumentTypes`, {
      headers: headers,
    });
  }
  getDocumentAttachments(DocumentTypeId: number) {
    return this.http.get(
      `${this.API_URL}api/DocumentAttachments/GetDocumentAttachments?DocumentTypeId=${DocumentTypeId}`,
      {
        headers: headers,
      }
    );
  }
  // getAllDocumentAttachments() {
  //   return this.http.get(
  //     `${API_URL}api/DocumentAttachments/GetAllDocumentAttachments`,
  //     {
  //       headers: headers,
  //     }
  //   );
  // }

  getDocumentAttachmentsByDocTypeId(DocumentTypeId: number) {
    return this.http.get(
      `${this.API_URL}api/DocumentAttachments/GetDocumentAttachmentsByDocTypeId?DocumentTypeId=${DocumentTypeId}`,
      {
        headers: headers,
      }
    );
  }

  //TBD-------------------------------------------------------------
  postDocumentAttachments(data: any, image: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('BranchCode', data.BranchCode);
    formData.append('AttachmentAutoId', data.AttachmentAutoId);
    formData.append('DocumentTypeId', data.DocumentTypeId);
    formData.append('AttachmentTypeId', data.AttachmentTypeId);
    formData.append('DocumentNo', data.DocumentNo);
    formData.append('StoreCode', data.StoreCode);
    formData.append('ProjectCode', data.ProjectCode);
    for (let i = 0; i < image.length; i++) {
      formData.append('AttachmentPath', image[i], image[i].name);
    }
    // formData.append('AttachmentPath', image[i], image[i].name);
    // formData.append('AttachmentPath', data.AttachmentPath);
    formData.append('Remarks', data.Remarks);
    // formData.append('Documents', image, image.name);
    const header = new HttpHeaders();
    header.set('Content-Type', 'multipart/form-data');
    return this.http.post<any>(
      `${this.API_URL}api/DocumentAttachments/AddDocumentAttachments?`,
      formData,
      { headers: header, responseType: 'text' as 'json' }
    );
  }
  putDocumentAttachments(
    data: DocumentAttachmentsModel
  ): Observable<DocumentAttachmentsModel> {
    return this.http.put<DocumentAttachmentsModel>(
      `${this.API_URL}api/DocumentAttachments/UpdateDocumentAttachments?`,
      data,
      { headers: headers, params: { ...data }, responseType: 'text' as 'json' }
    );
  }
  deleteDocumentAttachments(BranchCode: number, AttachmentAutoId: number) {
    return this.http.delete<any>(
      `${this.API_URL}api/DocumentAttachments/DeleteDocumentAttachments?BranchCode=${BranchCode}&AttachmentAutoId=${AttachmentAutoId}`,
      { headers: headers, responseType: 'text' as 'json' }
    );
  }

  UpdateAttachmentType(
    BranchCode:number,
    AttachmentTypeId:number,
    StoreCode:number,
  ) {
    return this.http.put(
      `${this.API_URL}api/DocumentAttachments/UpdateAttachmentType?BranchCode=${BranchCode}&AttachmentTypeId=${AttachmentTypeId}
      &StoreCode=${StoreCode}`,
      {
        headers: headers,
      }
    );
  }

}
