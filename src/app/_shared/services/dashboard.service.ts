import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
const url = environment.realEstateURL;

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(private http: HttpClient) { }
  sendData(data: any) {
    const response = this.http.post(url, data, {responseType: 'text' as 'json'}).pipe(
      map((res:any) => {
        return res.status;
      })
    );
    return response;
  }
}
