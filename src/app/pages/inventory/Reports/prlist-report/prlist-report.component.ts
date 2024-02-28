import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

interface LockStatus {
  value: number;
  name: string;
}
@Component({
  selector: 'app-prlist-report',
  templateUrl: './prlist-report.component.html',
  styleUrls: ['./prlist-report.component.scss'],
})
export class PrlistReportComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  lockStatus!: LockStatus[];
  storePRList: any[] = [];
  get formValue() { return this.form.getRawValue() }

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {
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
  }

  formInit() {
    this.form = this.fb.group({
      StoreCode: ['', Validators.required],
      DateFrom: ['', Validators.required],
      DateTo: ['', Validators.required],
      LockedStatus: ['', Validators.required],
    });
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }

  printStorePRList() {
    this.loading = true;
    this.apiservice
      .printStorePRList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo,
        this.formValue.LockedStatus
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

  getStorePRList() {
    this.loading = true;
    this.apiservice
      .getStorePRList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo,
        this.formValue.LockedStatus
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.storePRList = res;
      });
  }

  refresh(){
    this.formInit();
    this.storePRList = [];
  }
}
