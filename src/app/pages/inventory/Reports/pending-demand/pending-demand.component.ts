import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-pending-demand',
  templateUrl: './pending-demand.component.html',
  styleUrls: ['./pending-demand.component.scss'],
})
export class PendingDemandComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  pendingToPRDemandList: any[] = [];
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
  }

  formInit() {
    this.form = this.fb.group({
      StoreCode: ['', Validators.required ],
      DateFrom: ['', Validators.required ],
      DateTo: ['', Validators.required ],
    });
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }

  PendingToPRDemandListReport() {
    this.loading = true;
    this.apiservice
      .printPendingToPRDemandListReport(
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

  getPendingToPRDemandList() {
    this.loading = true;
    this.apiservice
      .getPendingToPRDemandList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.pendingToPRDemandList = res;
      });
  }

  refresh(){
    this.form.reset();
    this.formInit();
  }
}
