import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { PosReportsService } from 'src/app/_shared/services/pos-reports.service';

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html',
  styleUrls: ['./sales-summary.component.scss'],
})
export class SalesSummaryComponent implements OnInit {
  form!: FormGroup;
  globalBranchCode!: number;

  selectedStore!: number;
  selectedProjectNumber!: number;
  selectedCustomer!: number;

  saleResponse$: any = [];
  storeResponse$: any = [];
  projectResponse$: any = [];
  customerResponse$: any = [];
  salesSummaryList: any[] = [];

  loading = false;

  get formValue(){ return this.form.getRawValue() }

  constructor(
    private fb: FormBuilder, 
    private apiservice: PosReportsService,
    private apiService: ApiProviderService,
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
      StoreCode: ['', Validators.required ],
      ProjectCode: ['', Validators.required ],
      DateFrom: ['', Validators.required ],
      DateTo: ['', Validators.required ],
      CustomerId: ['', Validators.required ],
      SalesManId: ['', Validators.required ],
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
    this.loading = true;
    this.checkFormValuesBeforeSubmit();
    this.apiservice
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

  getSalesSummaryList(){
    this.loading = true;
    this.checkFormValuesBeforeSubmit();
    this.apiservice
      .getSaleSummaryList(
        this.globalBranchCode,
        this.formValue.StoreCode,
        this.formValue.ProjectCode,
        this.formValue.CustomerId,
        this.formValue.SalesManId,
        this.formValue.DateFrom,
        this.formValue.DateTo
      )
      .subscribe((res: any) => {
        
        this.salesSummaryList = res;
        this.loading = false;
      });
  }

  checkFormValuesBeforeSubmit(){
    if(!this.formValue.SalesManId || this.formValue.SalesMan == null || this.formValue.SalesMan== undefined){
      this.form.get('SalesManId')?.setValue(0);
    }
    if(!this.formValue.CustomerId || this.formValue.Customer == null || this.formValue.Customer == undefined){
      this.form.get('CustomerId')?.setValue(0);
    }
    if(!this.formValue.ProjectCode || this.formValue.ProjectCode == null || this.formValue.ProjectCode == undefined){
      this.form.get('ProjectCode')?.setValue(0);

    }
    if(!this.formValue.StoreCode || this.formValue.StoreCode == null || this.formValue.StoreCode == undefined){
      this.form.get('StoreCode')?.setValue(0);

    }
    if(!this.formValue.DateFrom || this.formValue.DateFrom == null || this.formValue.DateFrom == undefined){
      this.form.get('DateFrom')?.setValue(new Date());

    }
    if(!this.formValue.DateTo || this.formValue.DateTo == null || this.formValue.DateTo == undefined){
      this.form.get('DateTo')?.setValue(new Date());
    }
  }

  refresh(){
    this.form.reset();
    this.salesSummaryList = [];
  }
}
