import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

interface LockStatus {
  value: number;
  name: string;
}
@Component({
  selector: 'app-grn-list',
  templateUrl: './grn-list.component.html',
  styleUrls: ['./grn-list.component.scss'],
})
export class GrnListComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  lockStatus!: LockStatus[];
  storeItemResponse$: any = [];
  detailResponse$: any = [];
  GNRList: any[] = [];
  get formValue(){ return this.form.getRawValue() }

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

  formInit(){
    this.form = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
      LockedStatus: this.fb.control('', Validators.required),
    });
  }
  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }
  printGRNListReport() {
    this.loading = true;
    this.apiservice
      .printGRNListReport(
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

  getGRNList() {
    this.loading = true;
    this.apiservice
      .getGRNList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo,
        this.formValue.LockedStatus
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.GNRList = res;
      });
  }

  refresh() {
    this.GNRList = [];
    this.formInit();
  }
}
