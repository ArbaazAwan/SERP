import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-issuance-list-item',
  templateUrl: './issuance-list-item.component.html',
  styleUrls: ['./issuance-list-item.component.scss'],
})
export class IssuanceListItemComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  storeIssuanceList: any[] = [];
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

  formInit(){
    this.form = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
    });
  }

  loadStores() {
    this.apiservice.getAllStore(this.globalBranchCode).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }
  changeStore(e: any) {
    this.selectedStore = +e.target.value;
  }

  storeIssuanceListReport() {
    const StoreCode = this.formValue.StoreCode;
    const StoreName = this.storeResponse$.find((x:any)=>x.DepartmentCode == StoreCode)?.DepartmentName;
    this.loading = true;
    this.loading = true;
    this.apiservice
      .PrintstoreIssuanceListReport(
        this.globalBranchCode,
        StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo,
        StoreName
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

  getStoreIssuanceList() {
    
    const StoreCode = this.formValue.StoreCode;
    const StoreName = this.storeResponse$.find((x:any)=>x.DepartmentCode == StoreCode)?.DepartmentName;
    this.loading = true;
    this.apiservice
      .getStoreIssuanceList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.DateFrom,
        this.formValue.DateTo,
        StoreName
      )
      .subscribe((res: any) => {
        
        this.loading = false;
        this.storeIssuanceList = res;
      });
  }

  refresh(){
    this.formInit();
    this.storeIssuanceList = [];
  }
}
