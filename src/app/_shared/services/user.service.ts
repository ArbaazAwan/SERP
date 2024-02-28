import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { UserModel } from '../model/model';
import { CompanyCodeService } from './company-code.service';

// const this.API_URL = environment.apiUrl;
const headers = new HttpHeaders().set(
  'Content-Type',
  'text/plain; charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected model!: UserModel;
  API_URL: string = ''
  REPORTING_API_URL: string = ''
  constructor(private http: HttpClient,
    private companyCodeService: CompanyCodeService) {

  }

  ngOnInit() { }

  ngAfterViewInit(){
    this.API_URL = this.companyCodeService.getCookie('apiUrl') || '';
    this.REPORTING_API_URL = this.companyCodeService.getCookie('reportingApiUrl') || '';
  }
  login(username: string, password: string) {
    return this.http.get<Observable<UserModel[]>>(
      `${this.API_URL}api/UserLogin/isValidUser?Username=${username.trim()}&Password=${password.trim()}`
    );
  }

  getAllBranches() {
    this.API_URL = this.companyCodeService.getCookie('apiUrl') || '';
    return this.http.get(`${this.API_URL}api/Branch/GetAllBranchNames`).pipe(
      catchError((err) => {
        console.log('USER_SERVICE_API: getAllBranches() :: ERROR');
        console.error(err);
        return throwError(err);
      })
    );
  }
  //Get Erp-logo-branding
  //http://localhost:1237/api/ERPBranding/GetActiveBrand
  GetActiveBrand() {
    return this.http.get(`${this.API_URL}api/ERPBranding/GetActiveBrand`).pipe(
      catchError((err) => {
        console.log('USER_SERVICE_API: GetActiveBrand() :: ERROR');
        console.error(err);
        return throwError(err);
      })
    );
  }


  // User-Services

  getUserById(UserId: number): Observable<any[]> {
    return this.http.get<any>(
      `${this.API_URL}api/UserLogin/GetUserById?UserId` + UserId
    );
  }
  getAllUserList() {
    return this.http.get(`${this.API_URL}api/UserLogin/GetAllUserList`);
  }

  postUser(data: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.API_URL}api/UserLogin/AddUser?`, data, {
      headers,
      params: { ...data },
      responseType: 'json',
    });
  }

  // login(username: string, password: string, BranchCode: number) {


  //   return this.http.post<Observable<UserModel[]>>(
  //     `${this.API_URL}api/UserLogin/isValidUser?Username=admin&Password=admin@123&BranchCode=1`,{
  //       username:username,
  //       password:password,
  //       BranchCode:BranchCode,
  //         IsActive:true,
  //         Token:Token


  //     }
  //   );
  // }



  putUser(BranchCode: number, data: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(
      `${this.API_URL}api/UserLogin/UpdateUser?${BranchCode}`,
      data,
      { params: { ...data }, responseType: 'json' }
    );
  }

  DeleteUser(UserId: number): Observable<UserModel> {
    return this.http.delete<UserModel>(
      `${this.API_URL}api/UserLogin/DeleteUser?${UserId}`,
      { params: { UserId }, responseType: 'text' as 'json' }
    );
  }

  //change Password
  ChangePassword(username: string, oldpassword: string, newpassword: string): Observable<any> {
    return this.http.get(`${this.API_URL}api/UserLogin/ChangePassword?Username=${username}&old_password=${oldpassword}&new_password=${newpassword}`
      , { responseType: 'text' as 'json' })
  }
}

// User-Services-End

