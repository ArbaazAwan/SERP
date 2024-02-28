import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyCodeService } from './company-code.service';

export interface DocumentModel {
  BranchCode: number;
  ProjectCode: number;
  StoreCode: number;
  DemandNo:number;
  DocumentId: number;
  SaleInvoiceNo: number;
  CreatedBy:number;
  DocumentName: string;
  CSNo:number;
  Description: string;
}


@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {

  constructor( private http: HttpClient,
    private companyCodeService:CompanyCodeService,) { }

  API_URL =this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';

  //Sale Invoice Document Upload
  saveSaleDocuments(model: DocumentModel, files: File[]): Observable<any> {
    
    const formData = new FormData();
  
    // Append files to formData
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
  
    // Make the HTTP POST request
    return this.http.post<any>(
      `${this.API_URL}api/SaleInvoiceDocuments/CreateSaleDocuments`,
      formData,
      {
        params: { ...model },
        responseType: 'text' as 'json'
      }
    );
  }


  //------------------------Demands Documentation Upload----------------------------------------------------

  getMaxDocumentId(BranchCode:any,StoreCode:any,DemandNo:any) {
    return this.http.get<any>(`${this.API_URL}api/DemandDocumets/GetMaxDocumentId?BranchCode=${BranchCode}&DemandNo=${DemandNo}&StoreCode=${StoreCode}`);
  }

  getMaxPurchaseInvoiceDocumentId(BranchCode:any,StoreCode:any,PurchaseInvoiceNo:any) {
    return this.http.get<any>(`${this.API_URL}api/PurchaseInvoiceDocument/GetMaxDocumentId?BranchCode=${BranchCode}&PurchaseInvoiceNo=${PurchaseInvoiceNo}&StoreCode=${StoreCode}`);
  }

  getMaxPurchasePaymentDocumentId(BranchCode:any,StoreCode:any,PurchasePaymentNo:any) {
    return this.http.get<any>(`${this.API_URL}api/PurchasePayment/GetMaxDocumentId?BranchCode=${BranchCode}&PurchasePaymentNo=${PurchasePaymentNo}&StoreCode=${StoreCode}`);
  }

  saveDemandDocuments(model: DocumentModel, files: File[]): Observable<any> {
    
    const formData = new FormData();
  
    // Append files to formData
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
  
    // Make the HTTP POST request
    return this.http.post<any>(
      `${this.API_URL}api/DemandDocumets/Post`,
      formData,
      {
        params: { ...model },
        responseType: 'text' as 'json'
      }
    );
  }

  savePurchaseInvoiceDocuments(model: DocumentModel, files: File[]): Observable<any> {
    
    const formData = new FormData();
  
    // Append files to formData
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
  
    // Make the HTTP POST request
    return this.http.post<any>(
      `${this.API_URL}api/PurchaseInvoiceDocument/Post`,
      formData,
      {
        params: { ...model },
        responseType: 'text' as 'json'
      }
    );
  }

  savePurchasePaymentDocuments(model: DocumentModel, files: File[]): Observable<any> {
    
    const formData = new FormData();
  
    // Append files to formData
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
  
    // Make the HTTP POST request
    return this.http.post<any>(
      `${this.API_URL}api/PurchasePayment/Post`,
      formData,
      {
        params: { ...model },
        responseType: 'text' as 'json'
      }
    );
  }
  viewDocuments(
    BranchCode: number,
    StoreCode: number,
    DemandNo: number,
    DocumentId: number
  ): Observable<Blob> {
    
    const url = `${this.API_URL}api/DemandDocumets/ViewDemandDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}&DocumentId=${DocumentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  viewPurchaseInvoiceDocuments(
    BranchCode: number,
    StoreCode: number,
    PurchaseInvoiceNo: number,
    DocumentId: number
  ): Observable<Blob> {
    
    const url = `${this.API_URL}api/PurchaseInvoiceDocument/ViewPurchaseInvoiceDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchaseInvoiceNo=${PurchaseInvoiceNo}&DocumentId=${DocumentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }


  viewPurchasePaymentDocuments(
    BranchCode: number,
    StoreCode: number,
    PurchasePaymentNo: number,
    DocumentId: number
  ): Observable<Blob> {
    
    const url = `${this.API_URL}api/PurchasePayment/ViewPurchasePaymentDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchasePaymentNo=${PurchasePaymentNo}&DocumentId=${DocumentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

    //------------------------Voucher Documentation Upload----------------------------------------------------

    getMaxVoucherDocumentId(BranchCode:any,ProjectCode:any,VoucherId:any) {
      
      return this.http.get<any>(`${this.API_URL}api/VoucherDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&VoucherId=${VoucherId}`);
    }
  
    saveVoucherDocuments(model: DocumentModel, files: File[]): Observable<any> {
      
      const formData = new FormData();
    
      // Append files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    
      // Make the HTTP POST request
      return this.http.post<any>(
        `${this.API_URL}api/VoucherDocuments/Post`,
        formData,
        {
          params: { ...model },
          responseType: 'text' as 'json'
        }
      );
    }
  
  
    viewVoucherDocuments(
      BranchCode: number,
      ProjectCode: number,
      VoucherId: number,
      DocumentId: number
    ): Observable<Blob> {
      
      const url = `${this.API_URL}api/VoucherDocuments/ViewVoucherDocuments?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&VoucherId=${VoucherId}&DocumentId=${DocumentId}`;
      return this.http.get(url, { responseType: 'blob' });
    }

    
    //------------------------PR Documentation Upload----------------------------------------------------

    getMaxPRDocumentId(BranchCode:any,StoreCode:any,PRNo:any) {
      
      return this.http.get<any>(`${this.API_URL}api/PurchaseRequisitionDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`);
    }
  
    savePRDocuments(model: DocumentModel, files: File[]): Observable<any> {
      
      const formData = new FormData();
    
      // Append files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    
      // Make the HTTP POST request
      return this.http.post<any>(
        `${this.API_URL}api/PurchaseRequisitionDocuments/Post`,
        formData,
        {
          params: { ...model },
          responseType: 'text' as 'json'
        }
      );
    }
  
  
    viewPRDocuments(
      BranchCode: number,
      StoreCode: number,
      PRNo: number,
      DocumentId: number
    ): Observable<Blob> {
      
      const url = `${this.API_URL}api/PurchaseRequisitionDocuments/ViewPurchaseRequisitionDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}&DocumentId=${DocumentId}`;
      return this.http.get(url, { responseType: 'blob' });
    }


    //------------------------PO Documentation Upload----------------------------------------------------

    getMaxPODocumentId(BranchCode:any,StoreCode:any,PONo:any) {
      
      return this.http.get<any>(`${this.API_URL}api/PurchaseOrderDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}`);
    }
  
    savePODocuments(model: DocumentModel, files: File[]): Observable<any> {
      
      const formData = new FormData();
    
      // Append files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    
      // Make the HTTP POST request
      return this.http.post<any>(
        `${this.API_URL}api/PurchaseOrderDocuments/Post`,
        formData,
        {
          params: { ...model },
          responseType: 'text' as 'json'
        }
      );
    }
  
  
    viewPODocuments(
      BranchCode: number,
      StoreCode: number,
      PONo: number,
      DocumentId: number
    ): Observable<Blob> {
      
      const url = `${this.API_URL}api/PurchaseOrderDocuments/ViewPurchaseOrderDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}&DocumentId=${DocumentId}`;
      return this.http.get(url, { responseType: 'blob' });
    }

    
    //------------------------GRN Documentation Upload----------------------------------------------------

    getMaxGRNDocumentId(BranchCode:any,StoreCode:any,GRNNo:any) {
      
      return this.http.get<any>(`${this.API_URL}api/GRNDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}`);
    }
  
    saveGRNDocuments(model: DocumentModel, files: File[]): Observable<any> {
      
      const formData = new FormData();
    
      // Append files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    
      // Make the HTTP POST request
      return this.http.post<any>(
        `${this.API_URL}api/GRNDocuments/Post`,
        formData,
        {
          params: { ...model },
          responseType: 'text' as 'json'
        }
      );
    }
  
  
    viewGRNDocuments(
      BranchCode: number,
      StoreCode: number,
      GRNNo: number,
      DocumentId: number
    ): Observable<Blob> {
      
      const url = `${this.API_URL}api/GRNDocuments/ViewGRNDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}&DocumentId=${DocumentId}`;
      return this.http.get(url, { responseType: 'blob' });
    }

    //------------------------IRN Documentation Upload----------------------------------------------------

    getMaxIRNDocumentId(BranchCode:any,StoreCode:any,IRNNo:any) {
      
      return this.http.get<any>(`${this.API_URL}api/IRNDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${IRNNo}`);
    }
  
    saveIRNDocuments(model: DocumentModel, files: File[]): Observable<any> {
      
      const formData = new FormData();
    
      // Append files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    
      // Make the HTTP POST request
      return this.http.post<any>(
        `${this.API_URL}api/IRNDocuments/Post`,
        formData,
        {
          params: { ...model },
          responseType: 'text' as 'json'
        }
      );
    }
  
  
    viewIRNDocuments(
      BranchCode: number,
      StoreCode: number,
      IRNNo: number,
      DocumentId: number
    ): Observable<Blob> {
      
      const url = `${this.API_URL}api/IRNDocuments/ViewIRNDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${IRNNo}&DocumentId=${DocumentId}`;
      return this.http.get(url, { responseType: 'blob' });
    }

    //------------------------Comparative Statement Documentation Upload----------------------------------------------------

    saveCSDocuments(model: DocumentModel, files: File[]): Observable<any> {
      
      const formData = new FormData();
    
      // Append files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    
      // Make the HTTP POST request
      return this.http.post<any>(
        `${this.API_URL}api/CSDocuments`,
        formData,
        {
          params: { ...model },
          responseType: 'text' as 'json'
        }
      );
    }
  
  
    viewCSDocuments(
      BranchCode: number,
      StoreCode: number,
      CSNo: number,
      DocumentId: number
    ): Observable<Blob> {
      
      const url = `${this.API_URL}api/CSDocuments/ViewCSDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${CSNo}&DocumentId=${DocumentId}`;
      return this.http.get(url, { responseType: 'blob' });
    }


        //------------------------SaleInvoice Documentation Upload----------------------------------------------------

        getMaxSaleInvoiceDocumentId(BranchCode:any,StoreCode:any,SaleInvoiceNo:any) {
          
          return this.http.get<any>(`${this.API_URL}api/SaleInvoiceDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}`);
        }
      
        saveSaleInvoiceDocuments(model: DocumentModel, files: File[]): Observable<any> {
          
          const formData = new FormData();
        
          // Append files to formData
          for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i], files[i].name);
          }
        
          // Make the HTTP POST request
          return this.http.post<any>(
            `${this.API_URL}api/SaleInvoiceDocuments/Post`,
            formData,
            {
              params: { ...model },
              responseType: 'text' as 'json'
            }
          );
        }
      
      
        viewSaleInvoiceDocuments(
          BranchCode: number,
          StoreCode: number,
          SaleInvoiceNo: number,
          DocumentId: number
        ): Observable<Blob> {
          
          const url = `${this.API_URL}api/SaleInvoiceDocuments/ViewSaleInvoiceDocuments?BranchCode=${BranchCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}&DocumentId=${DocumentId}`;
          return this.http.get(url, { responseType: 'blob' });
        }


                //------------------------SaleInvoice Documentation Upload----------------------------------------------------

                getMaxLeadDocumentId(BranchCode:any,LeadCode:any) {
                  return this.http.get<any>(`${this.API_URL}api/LeadDocuments/GetMaxDocumentId?BranchCode=${BranchCode}&LeadCode=${LeadCode}`);
                }
              
                saveLeadDocuments(model: DocumentModel, files: File[]): Observable<any> {
                  
                  const formData = new FormData();
                
                  // Append files to formData
                  for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i], files[i].name);
                  }
                
                  // Make the HTTP POST request
                  return this.http.post<any>(
                    `${this.API_URL}api/LeadDocuments/Post`,
                    formData,
                    {
                      params: { ...model },
                      responseType: 'text' as 'json'
                    }
                  );
                }
              
              
                viewLeadDocuments(
                  BranchCode: number,
                  LeadCode: number,
                  DocumentId: number
                ): Observable<Blob> {
                  
                  const url = `${this.API_URL}api/LeadDocuments/ViewLeadDocuments?BranchCode=${BranchCode}&LeadCode=${LeadCode}&DocumentId=${DocumentId}`;
                  return this.http.get(url, { responseType: 'blob' });
                }
        
//------------------------------------------------------------HR-Pyroll Qualification----------------------------------------------


saveQualification(data: any, images: File[]): Observable<any> {
  debugger
  const formData = new FormData();

  for (let i = 0; i < images.length; i++) {
    formData.append('files', images[i], images[i].name);
  }

  return this.http.post<any>(
    `${this.API_URL}api/EmployeeQualification`,
    formData,
    {
      params: { ...data },
      responseType: 'text' as 'json'
    }
  );
}



updateQualification(data: any, images: File[]): Observable<any> {
  debugger
  const formData = new FormData();

  for (let i = 0; i < images.length; i++) {
    formData.append('files', images[i], images[i].name);
  }

  return this.http.put<any>(
    `${this.API_URL}api/EmployeeQualification`,
    formData,
    {
      params: { ...data },
      responseType: 'text' as 'json'
    }
  );
}


}
