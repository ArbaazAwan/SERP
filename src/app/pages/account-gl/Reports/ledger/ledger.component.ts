import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { VoucherDetailModel } from 'src/app/_shared/model/model';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss'],
})
export class LedgerComponent implements OnInit {
  form!: FormGroup;
  voucherlist$: any = [];
  Branches: any = [];
  selectBranch: any = null;
  selectedProjectNumber!: number;
  projectResponse$: any = [];
  // FinancialYearResponse$: any = [];
  // selectedFinancialYear!: number;
  // selectedFinancialMonthNumber!: number;
  // voucherMonthResponse$: any = [];
  globalBranchCode!: number;
  generalresponse: any = [];
  accountDescriptionResponse$: any = [];
  accountToResponse$: any = [];
  voucherDetailResponse$: any = [];
  voucherDetailToResponse$: any = [];
  selectedAccountCode: any = [];
  selectedAccountCodeTo: any = [];
  detailModel: any = [];
  BranchName!:string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiservice: GlReportsService,
    private apiService: ApiProviderService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      AccountName: this.fb.control('', Validators.required),
      AccountCode: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
      AccountCodeFrom: this.fb.control('', Validators.required),
      AccountCodeTo: this.fb.control('', Validators.required),
      FinancialYearCode: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.LoadallBranches();
    this.loadUserProjects();
    this.loadAccountTitle();
    this.loadAccountTitleTo();
    // this.loadAllFinancialYear();
  }
  changeACDescription(e: any) {
    this.selectedAccountCode = e.value;
    let x = this.accountDescriptionResponse$.find((x: VoucherDetailModel) => {
      return this.selectedAccountCode == x.AccountCode;
    });
    Object.assign(this.detailModel, x);
  }
  loadAccountTitle() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.accountDescriptionResponse$ = res;
    });
  }
  changeACTo(e: any) {
    this.selectedAccountCodeTo = e.value;
    let x = this.accountToResponse$.find((x: VoucherDetailModel) => {
      return this.selectedAccountCodeTo == x.AccountCode;
    });
    Object.assign(this.detailModel, x);
  }
  loadAccountTitleTo() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.accountToResponse$ = res;
    });
  }
  changeBranch(e: any) {
    this.selectBranch = +e.target.value;
  }
  LoadallBranches() {
    this.apiService.get(ApiEndpoints.getAllBranches)
    .subscribe((res: any) => {
      this.Branches = res;
    });
  }
  changeProjectCode(e: any) {
    this.selectedProjectNumber = +e.target.value;
  }

  loadUserProjects() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let UserId = +localStorage.getItem('UserId')!;

    this.apiservice
      .getUserProjects(BranchCode, UserId)
      .subscribe((res: any) => {
        this.projectResponse$ = res;
      });
  }
  // pintGeneralLedgerReport() {
  //   let DateFrom = this.form.get('DateFrom')?.value;
  //   let DateTo = this.form.get('DateTo')?.value;
  //   let AccountCodeFrom = this.selectedAccountCode;
  //   let AccountCodeTo = this.selectedAccountCodeTo;
  //   this.loading = true;
  //   //TBD----------------------------------------------------------------
  //   this.apiservice
  //     .pintGeneralLedgerReport(
  //       this.selectBranch,
  //       this.BranchName,
  //       this.selectedProjectNumber,
  //       DateFrom,
  //       DateTo,
  //       AccountCodeFrom,
  //       AccountCodeTo
  //     )
  //     .subscribe((pdf: any) => {
  //       const file = new Blob([pdf], {
  //         type: 'application/pdf',
  //       });
  //       this.loading = false;
  //       const fileURL = URL.createObjectURL(file);
  //       window.open(fileURL);
  //     });
  // }

  // changeFinancialYear(e: any) {
  //   this.selectedFinancialYear = +e.target.value;
  //   console.log(this.selectedFinancialYear);
  //   this.loadAllFinancialMonth(this.selectedFinancialYear);
  // }
  // loadAllFinancialYear() {
  //   this.apiservice.getAllFinancialyear().subscribe((res) => {
  //     this.FinancialYearResponse$ = res;
  //   });
  // }
  // changeFinancialMonth(e: any) {
  //   this.selectedFinancialMonthNumber = +e.target.value;
  // }
  // loadAllFinancialMonth(num: number) {
  //   this.apiservice.getAllFinancialMonth(num).subscribe((res) => {
  //     this.voucherMonthResponse$ = res;
  //   });
  // }
}
