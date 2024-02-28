import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomerDetailComponent } from '../customers/customer-detail/customer-detail.component';

@Component({
  selector: 'app-pos-sale',
  templateUrl: './pos-sale.component.html',
  styleUrls: ['./pos-sale.component.scss'],
})
export class POSSaleComponent implements OnInit {
  createForm!: FormGroup;
  viewForm!: FormGroup;
  model: any = [];
  selectedStore: number = 0;
  selectedCustomer: number = 0;
  selectedProject: number = 0;
  selectedDate: string = '';
  selectedParty!: number;
  selectedSaleType: number = 0;

  storeResponse$: any = [];
  tableResponse$: any = [];
  projectResponse$: any = [];
  customerResponse$: any = [];
  saleTypeResponse$: any = [];
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  masterResponse$: any = [];
  currentDate!: Date;

  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  globalBranchCode!: number;
  globalUserCode!: number;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.masterResponse$.SaleDate = this.formatDate(this.currentDate);
    this.createForm = this.fb.group({
      StoreCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      SaleDate: this.fb.control(''),
      SaleType: this.fb.control(''),
    });

    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 5;
    const FormId = 6;
    this.apiService
      .get(
        ApiEndpoints.GetUserFormRights +
          '?UserId=' +
          UserId +
          '&ModuleId=' +
          ModuleId +
          '&FormId=' +
          FormId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });

    this.viewForm = this.fb.group({
      DateFrom: this.fb.control(''),
      DateTo: this.fb.control(''),
      StoreCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      CustomerId: this.fb.control(''),
    });
    this.currentDate = new Date();
    const firstDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    const formattedFirstDate = this.formatDate(firstDate);
    const formattedLastDate = this.formatDate(lastDate);
    this.viewForm.controls['DateFrom'].setValue(formattedFirstDate);
    this.viewForm.controls['DateTo'].setValue(formattedLastDate);
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.loadProjects();
    this.loadCustomer();
    this.loadSaleTypes();
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  changeParty(e: any) {
    this.selectedParty = +e.target.value;
  }

  loadStores() {
    this.apiService.get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }

  // loadProjects() {
  //   this.apiproject.getAllProject().subscribe((res: any) => {
  //     this.projectResponse$ = res;
  //   });
  // }
  loadProjects() {
    this.apiService.get(ApiEndpoints.GetProjectsByBranchCode + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.projectResponse$ = res;
      });
  }

  loadCustomer() {
    this.apiService.get(ApiEndpoints.LoadAllParties)
    .subscribe((res: any) => {
      this.customerResponse$ = res.data;
    });
  }

  loadSaleTypes() {
    this.apiService.get(ApiEndpoints.GetAllSaleTypes)
    .subscribe((res: any) => {
      this.saleTypeResponse$ = res.data;
    });
  }

  changeStore(e: any) {
    this.selectedStore = +e.target.value;
  }

  changeProject(e: any) {
    this.selectedProject = +e.target.value;
  }

  changeCustomer(e: any) {
    this.selectedCustomer = +e.target.value;
  }

  changeSaleType(e: any) {
    this.selectedSaleType = +e.target.value;
  }
  SaleTypeCode = 6;
  loadAllSaleInvoices() {
    let val = this.viewForm.value;
    this.apiService.get(ApiEndpoints.LoadAllSaleInvoices + 
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&DateFrom=${val.DateFrom}&DateTo=${val.DateTo}&ProjectCode=${this.selectedProject}&CustomerId=${this.selectedCustomer}&TransactionType=${this.selectedSaleType}&SaleTypeCode=${this.SaleTypeCode}`)
      .subscribe((res: any) => {
        this.tableResponse$ = res;
      });
  }
  Add() {
    let val = this.createForm.value;
    const date = new Date();
    this.model = val;
    this.model.StoreCode = this.selectedStore;
    this.model.SaleTypeCode = this.selectedSaleType;
    this.model.ProjectCode = this.selectedProject;
    this.model.BranchCode = this.globalBranchCode;
    this.model.CreatedBy = this.globalUserCode;
    this.model.IsLocked = false;
    if (this.model.SaleDate.includes('')) {
      let x = val.SaleDate == '' ? date : val.SaleDate;
      this.model.SaleDate = this.datePipe.transform(x, 'MMM-d-y');
    } else {
      this.model.SaleDate = this.selectedDate;
    }
    this.apiService.post(this.model, ApiEndpoints.CreateSaleInvoiceMaster + `?`)
    .subscribe((res) => {
      this.model.SaleInvoiceNo = res;
      const SaleInvoiceNo = this.model.SaleInvoiceNo;
      if (SaleInvoiceNo != null) {
        localStorage.setItem('StoreCode', this.selectedStore.toString());
        localStorage.setItem('ProjectCode', this.selectedProject.toString());
        localStorage.setItem('SaleType', this.selectedSaleType.toString());
        localStorage.setItem('SaleDate', this.model.SaleDate);
        localStorage.setItem('SaleInvoiceNo', SaleInvoiceNo);

        this.router.navigate(['/dash-board2/possaledetails'], {
          queryParams: {
            StoreCode: this.selectedStore,
            SaleInvoiceNo: SaleInvoiceNo,
          },
        });
        this.createForm.reset();
        this.createForm.markAsUntouched();
      } else {
        this.toastService.sendMessage({
          message: 'Cannot Create Sale Invoice Number!',
          type: NotificationType.error,
        });
      }
    });
  }

  // Add() {
  //   let val = this.createForm.value;
  //   const date = new Date();
  //   this.model = val;
  //   this.model.StoreCode = this.selectedStore;
  //   this.model.SaleTypeCode = this.selectedSaleType;
  //   this.model.ProjectCode = this.selectedProject;
  //   this.model.BranchCode = this.globalBranchCode;
  //   this.model.CreatedBy = this.globalUserCode;
  //   this.model.IsLocked = false;
  //   if (this.model.SaleDate.includes('')) {
  //     let x = val.SaleDate == '' ? date : val.SaleDate;
  //     this.model.SaleDate = this.datePipe.transform(x, 'MMM-d-y');
  //   } else {
  //     this.model.SaleDate = this.selectedDate;
  //   }
  //   this.apiservice.createSaleInvoiceMaster(this.model).subscribe((res) => {
  //     this.model.SaleInvoiceNo = res;
  //     const SaleInvoiceNo = this.model.SaleInvoiceNo;
  //     if (SaleInvoiceNo != null) {
  //       localStorage.setItem('SaleInvoiceNo', SaleInvoiceNo);
  //       this.router.navigate(['/dash-board2/possaledetails'], {
  //         queryParams: {
  //           StoreCode: this.selectedStore,
  //           SaleInvoiceNo: SaleInvoiceNo,
  //         },
  //       });
  //       this.createForm.reset();
  //       this.createForm.markAsUntouched();
  //     } else {
  //       this.toastService.sendMessage({
  //         message: 'Cannot create Sale Invoice Number!',
  //         type: NotificationType.error,
  //       });
  //     }
  //   });
  // }

  addorUpdate() {
    if (this.createForm.invalid) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }
    this.add();
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.Add();
  }

  updateAllow(data: any) {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.getSelectedRow(data);
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  getSelectedRow(data: any) {
    this.tableResponse$ = { ...data };
    if (data) {
      const SaleInvoiceNo = data.SaleInvoiceNo;
      const store = data.StoreCode;
      this.router.navigate(['/dash-board2/possaledetails'], {
        queryParams: { StoreCode: store, SaleInvoiceNo: SaleInvoiceNo },
      });
    }
  }

  dateChange(e: any) {
    const date = this.datePipe.transform(e.target.value, 'MMM-d-y');
    this.selectedDate = date!;
  }
}
