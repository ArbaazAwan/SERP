import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

interface LockStatus {
  value: number;
  name: string;
}
@Component({
  selector: 'app-polist-report',
  templateUrl: './polist-report.component.html',
  styleUrls: ['./polist-report.component.scss'],
})
export class PolistReportComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  selectedParty!: number;
  storeResponse$: any = [];
  partyResponse$: any = [];
  lockStatus!: LockStatus[];
  loading = false;
  globalBranchCode!: number;
  storePOList: any[] = [];
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
    this.loadPartyTypes();
  }

  formInit(){
    this.form = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      PartyCode: this.fb.control('', Validators.required),
      LockedStatus: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
    });
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }

  loadPartyTypes() {
    this.apiservice.getAllPartyTypes().subscribe((res: any) => {
      this.partyResponse$ = res.data;
    });
  }

  printStorePOListReport() {
    this.loading = true;
    this.apiservice
      .printStorePOListReport(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.PartyCode,
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

  getStorePOList() {
    this.loading = true;
    this.apiservice
      .getStorePOList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.PartyCode,
        this.formValue.DateFrom,
        this.formValue.DateTo,
        this.formValue.LockedStatus
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.storePOList = res;
      });
  }

  refresh(){
    this.formInit();
    this.storePOList = [];
  }
}
