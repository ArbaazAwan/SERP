import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class ImportAttendifyAttendanceService {
  constructor(private http: HttpClient) {}
  getAllAttendifyAttendance(
    employer_id: string,
    start_date: string,
    end_date: string
  ) {
    return this.http.get(
      `http://92.204.170.104:9889/EmployeeAttendanceDetailWithStartAndEndDateERPV3/${employer_id}/${start_date}T00:00:00/${end_date}T00:00:00`,
      {
        headers: headers,
      }
    );
  }
}
