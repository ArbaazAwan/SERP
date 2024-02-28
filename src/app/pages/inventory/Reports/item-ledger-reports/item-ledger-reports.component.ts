import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-item-ledger-reports',
  templateUrl: './item-ledger-reports.component.html',
  styleUrls: ['./item-ledger-reports.component.scss'],
})
export class ItemLedgerReportsComponent implements OnInit {
  form!: FormGroup;
  model: any = [];
  selectedStore: number = 0;
  storeResponse$: any = [];
  storeItemResponse$: any = [];
  detailResponse$: any = [];
  selectedStoreItem: number = 0;
  loading = false;
  globalBranchCode!: number;

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      DepartmentCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
      ItemCode: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();

    this.assignCurrentDateIfEmpty('DateFrom');
    this.assignCurrentDateIfEmpty('DateTo');
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }

  changeStore(e: any) {
    if (e.value != null) {
      this.selectedStore = e.value.DepartmentCode;
    } else {
      this.selectedStore = 0;
    }

    this.loadStoreItem(this.selectedStore, this.globalBranchCode);
  }

  loadStoreItem(StoreCode: number, BranchCode: number) {
    this.apiservice
      .getStoreItem(StoreCode, BranchCode)
      .subscribe((res: any) => {
        this.storeItemResponse$ = res.data;
      });
  }

  changeStoreItem(e: any) {
    if (e.value != null) {
      this.selectedStoreItem = e.value;
    } else {
      this.selectedStoreItem = 0;
    }
  }

  StoreItemLedgerReport() {
    // let DateFrom = this.form.get('DateFrom')?.value;
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    let ItemCode = this.selectedStoreItem.toString();
    this.loading = true;
    this.apiservice
      .StoreItemLedgerReport(
        this.globalBranchCode,
        this.selectedStore,
        DateFrom,
        DateTo,
        ItemCode
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

  ilResponse$: any;

  LoadStoreItemLedgerReportData() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    let ItemCode = this.selectedStoreItem.toString();
    this.loading = true;
    this.apiservice
      .StoreItemLedgerReportData(
        this.globalBranchCode,
        this.selectedStore,
        DateFrom,
        DateTo,
        ItemCode
      )
      .subscribe((res: any) => {
        this.ilResponse$ = res;
        this.loading = false;
      });
  }

  RefreshVouchersList() {
    this.form.reset();
    this.ilResponse$ = [];
    this.assignCurrentDateIfRefresh('DateFrom');
    this.assignCurrentDateIfRefresh('DateTo');
  }

  assignCurrentDateIfRefresh(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value != '') {
      const currentDate = new Date().toISOString().split('T')[0];
      control?.setValue(currentDate); // Use safe navigation operator
    }
  }

  assignCurrentDateIfEmpty(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value === '') {
      // Use safe navigation operator
      const currentDate = new Date().toISOString().split('T')[0];
      control?.setValue(currentDate); // Use safe navigation operator
    }
  }
}
