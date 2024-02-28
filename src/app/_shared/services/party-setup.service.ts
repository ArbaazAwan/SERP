import { GetPartyItemRates, PartySetupModel } from './../model/model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';
import { CompanyCodeService } from './company-code.service';

// const API_URL = environment.apiUrl;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class PartySetupService {
  constructor(
    private http: HttpClient,
    private companyCodeService: CompanyCodeService
  ) {}

  API_URL = this.companyCodeService.getCookie('apiUrl') || '';
  REPORTING_API_URL =
    this.companyCodeService.getCookie('reportingApiUrl') || '';

  getAccountTitle() {
    return this.http.get(`${this.API_URL}api/ChartOfAccounts/GetAccountTitle`, {
      headers: headers,
    });
  }
  getAllPartyId() {
    return this.http.get(`${this.API_URL}api/PartySetup/LoadAllPartyTypes`);
  }

  getAllParties() {
    return this.http.get(`${this.API_URL}api/PartySetup/LoadAllParties`);
  }

  postPartySetup(data: PartySetupModel) {
    return this.http
      .post<PartySetupModel>(
        `${this.API_URL}api/PartySetup/CreatePartySetup?`,
        data,
        {
          headers: headers,
          params: { ...data },
          responseType: 'text' as 'json',
          observe: 'response',
        }
      )
      .pipe(
        map((res) => {
          return res.status;
        })
      );
  }

  updatePartySetup(data: PartySetupModel) {
    return this.http
      .put<PartySetupModel>(
        `${this.API_URL}api/PartySetup/UpdatePartySetup?`,
        data,
        {
          headers: headers,
          params: { ...data },
          responseType: 'text' as 'json',
          observe: 'response',
        }
      )
      .pipe(
        map((res) => {
          return res.status;
        })
      );
  }

  deletePartySetup(PartyCode: number) {
    return this.http
      .delete(`${this.API_URL}api/PartySetup/DeletePartySetup?`, {
        headers: headers,
        params: { PartyCode },
        responseType: 'text' as 'json',
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return res.status;
        })
      );
  }
  GetPartyItemRates(PartyCode: number) {
    return this.http.get(
      `${this.API_URL}api/PartyItemRates/GetPartyItemRates`,
      {
        headers: headers,
        params: { PartyCode: PartyCode.toString() }, // Convert the number to string
        responseType: 'json', // Use 'json' instead of 'text'
        observe: 'response',
      }
    );
  }
  PostPartyItemRates(data: GetPartyItemRates) {
    return this.http
      .post<GetPartyItemRates>(
        `${this.API_URL}api/PartyItemRates/PostPartyItemRates?`,
        data,
        {
          headers: headers,
          params: { ...data },
          responseType: 'text' as 'json',
          observe: 'response',
        }
      )
      .pipe(
        map((res) => {
          return res.status;
        })
      );
  }

  DeletePartyItemRates(PartyCode: number, ItemCode: string) {
    return this.http
      .delete(`${this.API_URL}api/PartyItemRates/DeletePartyItemRates?`, {
        headers: headers,
        params: { PartyCode, ItemCode },
        responseType: 'text' as 'json',
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return res.status;
        })
      );
  }
  //http://localhost:1237/api/PartyItemRates/PutPartyItemRates?PartyCode=10&ItemCode=01010101&Rate=100
  PutPartyItemRates(PartyCode: any, ItemCode: any, Rate: any) {
    return this.http.put(
      `${this.API_URL}api/PartyItemRates/PutPartyItemRates?PartyCode=${PartyCode}&ItemCode=${ItemCode}&Rate=${Rate}`,
      { responseType: 'text' as 'json' }
    );
  }
  // PutPartyItemRates(data: GetPartyItemRates) {
  //   return this.http
  //     .put<GetPartyItemRates>(
  //       `${API_URL}api/PartyItemRates/UpdatePartyItemRates?`,
  //       data,
  //       {
  //         headers: headers,
  //         params: { ...data },
  //         responseType: 'text' as 'json',
  //         observe: 'response',
  //       }
  //     )
  //     .pipe(
  //       map((res) => {
  //         return res.status;
  //       })
  //     );
  // }
  getCustomerLastVisitDate(PartyCode: number) {
    return this.http.get(
      `${this.API_URL}api/SaleInvoice/LastVisitDate?CustomerId=${PartyCode}`
    );
  }
}
