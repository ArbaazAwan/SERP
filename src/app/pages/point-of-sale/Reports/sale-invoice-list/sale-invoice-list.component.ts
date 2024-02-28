import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PosReportsService } from 'src/app/_shared/services/pos-reports.service';

interface LockStatus {
  value: number;
  name: string;
}
@Component({
  selector: 'app-sale-invoice-list',
  templateUrl: './sale-invoice-list.component.html',
  styleUrls: ['./sale-invoice-list.component.scss'],
})
export class SaleInvoiceListComponent implements OnInit {
  form!: FormGroup;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  lockStatus!: LockStatus[];
  storeItemResponse$: any = [];
  detailResponse$: any = [];
  projectResponse$: any = [];
  saleInvoiceList: any[] = [];

  get formValue(){  return this.form.getRawValue() }

  constructor(private fb: FormBuilder, private apiservice: PosReportsService) {
    this.lockStatus = [
      { value: 2, name: 'All' },
      { value: 1, name: 'Locked' },
      { value: 0, name: 'UnLocked' },
    ];
    this.formInit();
  }

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();
    this.loadUserProjects();
  }

  formInit(): void {
    this.form = this.fb.group({
      StoreCode: ['', Validators.required ],
      ProjectCode: ['', Validators.required ],
      DateFrom: [ new Date(), Validators.required ],
      DateTo: [ new Date(), Validators.required ],
      LockedStatus: ['', Validators.required ],
    });
  }
  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }

  loadUserProjects() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let UserId = +localStorage.getItem('UserId')!;

    this.apiservice
      .getUserProjects(BranchCode, UserId)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }
  printSaleInvoiceListReport() {
    this.formValue;
    this.loading = true;
    this.apiservice
      .printSaleInvoiceListReport(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.ProjectCode,
        this.formValue.LockedStatus,
        this.formValue.DateFrom,
        this.formValue.DateTo
      )
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

silResponse$:any;
  loadSalesInvoiceList(){
    this.formValue;
    this.loading = true;
    this.apiservice
      .SaleInvoiceListReportData(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.ProjectCode,
        this.formValue.LockedStatus,
        this.formValue.DateFrom,
        this.formValue.DateTo
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.silResponse$ = res;
      });
  }

  refresh(){
    this.form.reset();
    this.saleInvoiceList = [];
  }
}
