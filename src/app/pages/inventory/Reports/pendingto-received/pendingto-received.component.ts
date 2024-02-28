import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-pendingto-received',
  templateUrl: './pendingto-received.component.html',
  styleUrls: ['./pendingto-received.component.scss'],
})
export class PendingtoReceivedComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  selectedParty!: number;
  storeResponse$: any = [];
  partyResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  storePendingToReceivePOList: any[] = [];
  get formValue(){ return this.form.getRawValue() }

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {
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
  printStorePendingToReceivePOList() {
    this.loading = true;
    this.apiservice
      .printStorePendingToReceivePOList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.PartyCode,
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

  getStorePendingToReceivePOList() {
    this.loading = true;
    this.apiservice
      .getStorePendingToReceivePOList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.PartyCode,
        this.formValue.DateFrom,
        this.formValue.DateTo
      )
      .subscribe((res: any) => {
        
        this.loading = false;
        this.storePendingToReceivePOList = res;
      });
  }

  refresh(){
    this.storePendingToReceivePOList = [];
    this.formInit();
  }
}
