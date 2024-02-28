import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyCodeService } from './company-code.service';
import { Observable } from 'rxjs';
import { ChartofItemModel } from '../model/model';

const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);

@Injectable({
  providedIn: 'root'
})

export class ReportingApiProviderService {

  API_URL:string = '';
  REPORTING_API_URL:string = '';

  constructor(
    private http: HttpClient,
    private companyCodeService:CompanyCodeService,
    )
    {
       this.API_URL = this.companyCodeService.getCookie('apiUrl') || '';
       this.REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';
    }

  post(data: any, endPoint: String, paramData: any ): Observable<any> {
    return this.http.post<any>(this.REPORTING_API_URL + endPoint, data, {
      headers: headers,
      params: paramData? paramData: { ...data },
      // responseType:  responseType? responseType : 'text' as 'json',
    });
  }


  saveChartofItem(data: any, images: File[]): Observable<any> {

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('files', images[i], images[i].name);
    }

    const stores = data.stores.map((store:any) => ({
      ItemCode: data.ItemCode,
      StoreCode: store.StoreCode
    }));

    formData.append('stores', JSON.stringify(stores));

    return this.http.post<any>(
      `${this.API_URL}api/ChartOfItems/CreateNewItem`,
      formData,
      {
        params: { ...data },
        responseType: 'text' as 'json'
      }
    );
  }
}
