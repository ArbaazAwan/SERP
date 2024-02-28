import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { PosReportsService } from 'src/app/_shared/services/pos-reports.service';

@Component({
  selector: 'app-salesman-wise',
  templateUrl: './salesman-wise.component.html',
  styleUrls: ['./salesman-wise.component.scss'],
})
export class SalesmanWiseComponent implements OnInit {
  form!: FormGroup;
  selectedStore!: number;
  storeResponse$: any = [];
  globalBranchCode!: number;
  loading = false;
  storeItemResponse$: any = [];
  detailResponse$: any = [];
  projectResponse$: any = [];
  selectedProjectNumber!: number;
  customerResponse$: any = [];
  selectedCustomer!: number ;
  saleResponse$: any = [];

  get formValue(){ return this.form.getRawValue() }

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiProviderService,
    private posReportsService: PosReportsService,
    ) {
      this.formInit();
    }

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadStores();
    this.loadUserProjects();
    this.loadCustomer();
    this.loadSaleMan();
  }

  formInit(){
    this.form = this.fb.group({
      StoreCode: [''],
      ProjectCode: [''],
      DateFrom: [''],
      DateTo: [''],
      CustomerId: [''],
      SalesManId: [''],
    });
  }
  loadStores() {
    this.apiService.get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }
  loadUserProjects() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let UserId = +localStorage.getItem('UserId')!;
    this.apiService.get(ApiEndpoints.GetUserProjects + `?BranchCode=${BranchCode}&UserId=${UserId}`)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }
  loadCustomer() {
    this.apiService.get(ApiEndpoints.GetAllCustomers)
    .subscribe((res:any) => {
      this.customerResponse$ = res.data;
    });
  }
  loadSaleMan() {
    this.apiService.get(ApiEndpoints.GetAllSalesMan)
    .subscribe((res:any) => {
      this.saleResponse$ = res.data;
    });
  }
  printSaleMenWise() {
    
    this.formValue;
    this.loading = true;
    this.posReportsService
      .printSaleMenWise(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.ProjectCode,
        this.formValue.CustomerId,
        this.formValue.SalesManId,
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
}
