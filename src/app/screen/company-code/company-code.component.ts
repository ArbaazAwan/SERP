import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Brand } from 'src/app/_shared/model/model';
import { CompanyCodeService } from 'src/app/_shared/services/company-code.service';
import { environment } from 'src/environments/environment';

let API_URL = environment.apiUrl;
let LANDING_URL = environment.LandingPageURL;
let REPORTING_API_URL = environment.reportingURL;

interface CompanyData {
  serverId: number;
  companyCode: string;
  erpApiURL: string;
  erpReportingURL: string;
}
@Component({
  selector: 'app-company-code',
  templateUrl: './company-code.component.html',
  styleUrls: ['./company-code.component.scss'],
})
export class CompanyCodeComponent implements OnInit {
  CompanyCode!: FormGroup;
  data: CompanyData[] = [];
  code: string = '';
  loadingerror = false;
  loading = false;
  activeBrand!:Brand;

  constructor(
    private companyCodeService: CompanyCodeService,
    private fb: FormBuilder,
    private router :Router
  ) {}

  ngOnInit(): void {

    this.code = this.companyCodeService.getCookie('companyCode') || '';
    // API_URL = this.companyCodeService.getCookie('apiUrl') || '';
    if (this.code) {
      this.redirectToURL(LANDING_URL);
    }

    this.CompanyCode = this.fb.group({
      Code: this.fb.control('', Validators.required),
    });

    this.activeBrand = JSON.parse(localStorage.getItem('activeBrand')!);

  }

  SaveAndNext() {
    this.code = this.CompanyCode.value.Code;
    this.getByCompanyCode();
  }

  getByCompanyCode() {

    this.loading = true;

    this.companyCodeService

      .GetByCompanyCode(this.code)
      .subscribe((res: any) => {

        if (res.data && res.data.length === 0) {
          this.loadingerror = true;
        } else {
          this.data = res.data;
          API_URL = this.data[0].erpApiURL;
          REPORTING_API_URL = this.data[0].erpReportingURL;
          this.companyCodeService.setCookie('companyCode', this.code, 365);
          this.companyCodeService.setApiUrlCookie('apiUrl', API_URL, 365);
          this.companyCodeService.setReportingApiUrlCookie(
            'reportingApiUrl',
            REPORTING_API_URL,
            365
          );
          if (this.data[0].erpApiURL) {
            this.redirectToURL(LANDING_URL);
          } else {
            console.error('Invalid data received from the API.');
          }
          console.log(res);
        }
        this.loading = false;
      });
  }

  private redirectToURL(url: string) {

    this.router.navigate(['/Login'])
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }
}
