import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

interface LockStatus {
  value: number;
  name: string;
}
@Component({
  selector: 'app-demand-list',
  templateUrl: './demand-list.component.html',
  styleUrls: ['./demand-list.component.scss'],
})
export class DemandListComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  lockStatus!: LockStatus[];
  demandList: any[] = [];
  get formValue(){ return this.form.getRawValue() }

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {
    this.lockStatus = [
      { value: 0, name: 'UnLocked' },
      { value: 1, name: 'Locked' },
      { value: 2, name: 'All' },
    ];
    this.formInit();
  }

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();
  }

  formInit() {
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

  printDemandListReport() {
    this.loading = true;
    this.apiservice
      .printDemandListReport(
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

  getDemandList() {
    this.loading = true;
    this.apiservice
      .getDemandList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo,
        this.formValue.LockedStatus
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.demandList = res;
      });
  }

  refresh(){
    this.formInit();
    this.demandList = [];
  }
}
