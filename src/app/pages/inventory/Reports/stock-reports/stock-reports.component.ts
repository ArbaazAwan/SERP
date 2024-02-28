import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-stock-reports',
  templateUrl: './stock-reports.component.html',
  styleUrls: ['./stock-reports.component.scss'],
})
export class StockReportsComponent implements OnInit {
  form!: FormGroup;
  selectedStore: number = 0;
  selectedCOA: number = 0;
  storeResponse$: any = [];
  COAResponse$: any = [];
  globalBranchCode!: number;
  globalUser!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      DepartmentCode: this.fb.control('', Validators.required),
      ItemCode: this.fb.control('', Validators.required),
      StockOnDate: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUser = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.loadCOAHead();
    this.assignCurrentDateIfEmpty('StockOnDate');
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

  loadCOAHead() {
    this.apiservice.getCOAHeads(this.globalBranchCode).subscribe((res: any) => {
      this.COAResponse$ = res.data;
    });
  }



  changeCOA(e: any) {
    
    if(e.value != null){
      this.selectedCOA = e.value.ItemCode;
    }
    else{
      this.selectedCOA = 0;
    }

  }

  StoreStockReport() {
    
    let StockOnDate = this.form.get('StockOnDate')?.value;
    this.loading = true;
    this.apiservice
      .printStoreStockReport(
        this.globalBranchCode,
        this.selectedStore,
        this.selectedCOA,
        StockOnDate,
        this.globalUser
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

  srResponse$:any;
  LoadStoreStockReport() {
    let StockOnDate = this.form.get('StockOnDate')?.value;
    this.loading = true;
    this.apiservice
      .StoreStockReportData(
        this.globalBranchCode,
        this.selectedStore,
        this.selectedCOA,
        StockOnDate,
        this.globalUser
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.srResponse$ = res

      });
  }

  RefreshVouchersList(){
    this.form.reset();
    this.srResponse$=[];
    this.assignCurrentDateIfRefresh('StockOnDate');
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
