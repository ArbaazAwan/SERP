import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-transaction-reports',
  templateUrl: './transaction-reports.component.html',
  styleUrls: ['./transaction-reports.component.scss'],
})
export class TransactionReportsComponent implements OnInit {
  form!: FormGroup;
  selectedStore: number = 0;
  selectedCOA: number = 0;
  storeResponse$: any = [];
  globalBranchCode: number = 0;
  loading = false;
  COAResponse$: any = [];

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      DepartmentCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();

    this.assignCurrentDateIfEmpty('DateFrom');
    this.assignCurrentDateIfEmpty('DateTo');
    this.loadCOAHead();
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }
  changeStore(e: any) {
    
    if(e.value != null){
      this.selectedStore = e.value.DepartmentCode
      ;
    }
    else{
      this.selectedStore = 0;
    }

  }

  changeCOA(e: any) {
    
    if(e.value != null){
      this.selectedCOA = e.value.ItemCode;
    }
    else{
      this.selectedCOA = 0;
    }

  }

  loadCOAHead() {
    this.apiservice.getCOAHeads(this.globalBranchCode).subscribe((res: any) => {
      this.COAResponse$ = res.data;
    });
  }

  StockMovementReport() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    this.loading = true;
    this.apiservice
      .printStockMovementReport(
        this.globalBranchCode,
        this.selectedStore,
        DateFrom,
        DateTo,
        this.selectedCOA
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
  trResponse$:any;
  LoadStockMovementReportData() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    this.loading = true;
    this.apiservice
      .StockMovementReportData(
        this.globalBranchCode,
        this.selectedStore,
        DateFrom,
        DateTo,
        this.selectedCOA 
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.trResponse$ = res;
      });
  }

  RefreshVouchersList(){
    this.form.reset();
    this.trResponse$=[];
    this.assignCurrentDateIfRefresh('DateFrom');
    this.assignCurrentDateIfRefresh('DateTo');
   }

   assignCurrentDateIfRefresh(controlName: string){
     
     const control = this.form.get(controlName);
     if (control?.value!= '') {
       const currentDate = new Date().toISOString().split('T')[0];
       control?.setValue(currentDate); // Use safe navigation operator
     }
   }

   assignCurrentDateIfEmpty(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value === '') { // Use safe navigation operator
      const currentDate = new Date().toISOString().split('T')[0];
      control?.setValue(currentDate); // Use safe navigation operator
    }
  }

}
