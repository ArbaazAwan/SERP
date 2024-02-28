import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyCodeService } from './company-code.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileuploadService {
  constructor(
    private _http: HttpClient,
    private _companyCodeService: CompanyCodeService
  ) {}

  readonly API_URL = this._companyCodeService.getCookie('apiUrl') || '';
  readonly REPORTING_API_URL =
    this._companyCodeService.getCookie('reportingApiUrl') || '';

  saveDataWithDocument<T>(
    endPoint: string,
    data: T,
    file: File | undefined
  ): Observable<any> {
    const formData = new FormData();
    if (!!file) {
      const blob = new Blob([file], { type: file.type });
      formData.append('Files', blob, file.name);
    }

    formData.append('Data', JSON.stringify(data));

    return this._http.post<any>(`${this.API_URL}${endPoint}`, formData);
  }

  updateDataWithDocument(
    endPoint: string,
    data: any,
    file: File
  ): Observable<any> {
    const formData = new FormData();
    if (!!file) {
      const blob = new Blob([file], { type: file.type });
      formData.append('Files', blob, file.name);
    }
    formData.append('data', JSON.stringify(data));

    return this._http.put<any>(`${this.API_URL}${endPoint}`, formData);
  }

  viewDocument(endPoint: string): Observable<Blob> {
    const url = `${this.API_URL}${endPoint}`;
    return this._http.get(url, { responseType: 'blob' });
  }
}
