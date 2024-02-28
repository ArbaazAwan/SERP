import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-item-reports',
  templateUrl: './item-reports.component.html',
  styleUrls: ['./item-reports.component.scss'],
})
export class ItemReportsComponent implements OnInit {
  form!: FormGroup;
  model: any = [];
  selectedStore: number = 0;
  selectedCOA: number = 0;
  storeResponse$: any = [];
  COAResponse$: any = [];
  globalBranchCode!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiservice: InventoryReportsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      DepartmentCode: this.fb.control('', Validators.required),
      // ItemCode: this.fb.control('', Validators.required),
      ParentItemCode: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();
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
  printitemListReport() {
    let ParentItemCode = this.selectedCOA.toString();
    this.loading = true;
    this.apiservice
      .printItemsListReport(
        this.globalBranchCode,
        this.selectedStore,
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
  irResponse$:any;
  LoadprintitemListReportData() {
    let ParentItemCode = this.selectedCOA.toString();
    this.loading = true;
    this.apiservice
      .ItemsListReportData(
        this.globalBranchCode,
        this.selectedStore,
         this.selectedCOA
      )
      .subscribe((res: any) => {
        this.irResponse$ = res;
        this.loading = false;

      });
  }


  RefreshVouchersList(){
    this.form.reset();
    this.irResponse$=[];
   }
}
