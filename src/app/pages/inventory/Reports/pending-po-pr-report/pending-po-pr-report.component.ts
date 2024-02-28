import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-pending-po-pr-report',
  templateUrl: './pending-po-pr-report.component.html',
  styleUrls: ['./pending-po-pr-report.component.scss'],
})
export class PendingPoPrReportComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  pendingToPOPRList: any[] = [];
  get formValue() { return this.form.getRawValue() }
  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();
  }

  formInit(){
    this.form = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
    });
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }

  PendingToPOPRListReport() {
    this.loading = true;
    this.apiservice
      .printPendingToPOPRListReport(
        this.globalBranchCode,
        this.formValue.StoreCode,
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

  getPendingToPOPRList() {
    this.loading = true;
    this.apiservice
      .getPendingToPOPRList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.pendingToPOPRList = res;
      });
  }

  refresh() {
    this.formInit();
    this.pendingToPOPRList = [];
  }
}
