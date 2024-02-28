import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { PartySetupService } from 'src/app/_shared/services/party-setup.service';
@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss'],
})
export class SaleInvoiceComponent implements OnInit, AfterViewInit {
  createForm!: FormGroup;
  viewForm!: FormGroup;
  model: any = [];

  isLoadingData: boolean = false;

  selectedCustomer: number = 0;

  selectedDate: string = '';
  selectedParty!: number;
  selectedSaleType: any;

  selectedStore: number = 0;
  selectedProject: number = 0;
  componentName: string = '';
  componentNameDispaly: string = 'Sales Order';
  storeResponse$: any = [];
  tableResponse$: any = [];
  projectResponse$: any = [];
  customerResponse$: any = [];
  saleTypeResponse$: any = [];

  masterResponse$: any = [];
  currentDate!: Date;

  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  globalBranchCode!: number;
  globalUserCode!: number;
  dropdownOptions: any;
  selectedDropdownValue!: string;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  selectedSaleTypeCode: any;
  SaleTypeCode: number = 0;
  isLoading: boolean = false;
  formattedFirstDate: any;
  formattedLastDate: any;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiProviderService,
    private storeProject: StoreProjectService,
    private apiCustomer: PartySetupService,
    private storeProjectService: StoreProjectService
  ) {}

  ngOnInit(): void {
    this.GetAllStatus();
    // if (this.storeProject) {
    //   setTimeout(() => {
    //     this.storeProject.selectedOptionSubject.subscribe((res) => {
    //       this.selectedStore = res.DepartmentCode;
    //       this.selectedProject = res.ProjectCode;
    //     });
    //   }, 2000);
    // }
    this.currentDate = new Date();
    this.masterResponse$.SaleDate = this.formatDate(this.currentDate);
    this.createForm = this.fb.group({
      StoreCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      SaleDate: this.fb.control(''),
      SaleType: this.fb.control(''),
    });

    // ======Current route
    let currentUrl = this.route.snapshot.url[0].path;
    this.componentName = currentUrl?.split('-').join(' ');
    const saleTypeName = this.route.snapshot.url[0].path;
    if (saleTypeName == 'quotation') {
      this.SaleTypeCode = 1;
      localStorage.setItem('saleTypeName', 'Quotation');
    } else if (saleTypeName == 'performa-invoice') {
      this.SaleTypeCode = 2;
      localStorage.setItem('saleTypeName', 'Performa Invoice');
    } else if (saleTypeName == 'sales-invoice') {
      this.SaleTypeCode = 3;
      localStorage.setItem('saleTypeName', 'Sale Invoice');
    } else if (saleTypeName == 'sales-order') {
      this.SaleTypeCode = 4;
      localStorage.setItem('saleTypeName', 'Sale Order');
    } else if (saleTypeName == 'delivery-challan') {
      this.SaleTypeCode = 5;
      localStorage.setItem('saleTypeName', 'Delivery Challan');
    } else if (saleTypeName == 'point-of-sale') {
      this.SaleTypeCode = 6;
    }
    localStorage.setItem('componentName', saleTypeName);
    this.componentNameDispaly = saleTypeName.split('-').join(' ');

    // console.log(this.route.snapshot.url[0].path,'snapshot')
    // console.log(this.route.url,'url')
    // console.log(SaleTypeName,'SaleTypeName')
    this.selectedSaleTypeCode = this.SaleTypeCode;
    localStorage.setItem('saletypecode', this.selectedSaleTypeCode);
    this.selectedSaleType = this.componentName;
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 5;
    const FormId = 4;
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
      SaleType: this.fb.control(''),
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

    this.formattedFirstDate = this.formatDate(firstDate);
    this.formattedLastDate = this.formatDate(lastDate);
    this.viewForm.controls['DateFrom'].setValue(this.formattedFirstDate);
    this.viewForm.controls['DateTo'].setValue(this.formattedLastDate);
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.loadProjects();
    this.loadCustomer();
    this.loadSaleTypes();

    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadAllSaleInvoices();
    }, 2000);
  }
  GetAllStatus() {
    this.apiService.get(ApiEndpoints.GetAllStatus).subscribe((res: any) => {
      this.dropdownOptions = res.data;
    });
  }
  onDropdownChange(rowData: any, event: any) {
    let branchcode = parseInt(localStorage.getItem('BranchCode') || '0', 10);
    rowData.BranchCode = branchcode;

    this.apiService
      .update(
        {},
        ApiEndpoints.UpdateStatus +
          `?BranchCode=${rowData.BranchCode}&StoreCode=${rowData.StoreCode}&SaleInvoiceNo=${rowData.SaleInvoiceNo}&Status=${rowData.StatusId}`
      )
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Sales Invoice Updated Successfully!',
          type: NotificationType.success,
        });
      });
  }
  openNewDocuments(data: any) {
    // this.shouldReloadDocuments = false;
    // localStorage.setItem('LeadCode', data.LeadCode);
    // localStorage.setItem('StepCode', data.StepCode);
    // this.header = 'You Can View Documents';
    // this.saveorUpdate = 'Save';
    // this.submitted = false;
    // this.productDialogDocuments = true;
    // this.isUpdate = false;
    // this.customerform.reset();
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
    this.apiService
      .get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.storeResponse$ = res.data;
      });
  }

  // loadProjects() {
  //   this.apiproject.getAllProject().subscribe((res) => {
  //     this.projectResponse$ = res;
  //   });
  // }

  loadProjects() {
    this.apiService
      .get(
        ApiEndpoints.GetProjectsByBranchCode +
          `?BranchCode=${this.globalBranchCode}`
      )
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }
  loadCustomer() {
    this.apiService.get(ApiEndpoints.GetAllCustomers).subscribe((res: any) => {
      this.customerResponse$ = res.data;
    });
  }
  // loadCustomer() {
  //   this.apicustomer.getAllCustomers().subscribe((res: any) => {
  //     this.customerResponse$ = res.data;
  //   });
  // }

  loadSaleTypes() {
    this.apiService.get(ApiEndpoints.GetAllSaleTypes).subscribe((res: any) => {
      this.saleTypeResponse$ = res.data;
      // console.log("sales type",this.saleTypeResponse$)
    });
  }

  changeStore(e: any) {
    this.selectedStore = e.value.DepartmentCode;
  }

  changeProject(e: any) {
    this.selectedProject = e.value.ProjectCode;
  }

  changeCustomer(e: any) {
    // this.selectedCustomer = +e.target.value;
    this.selectedCustomer = +e.value.CustomerId;
  }

  changeSaleType(e: any) {
    this.selectedSaleTypeCode = e.value.SaleTypeCode;
    this.selectedSaleType = e.value;
  }
  totalItems: number = 0;
  intemsPerPage: number = 15;
  totalPages: number = 0;
  items: any;
  startIndex: number = 0;
  endIndex: number = 14;
  loadAllSaleInvoices() {
    this.isLoading = true;
    let val = this.viewForm.value;
    let customerid = this.selectedCustomer ? this.selectedCustomer : 0;
    let projectcode = this.selectedProject ? this.selectedProject : 0;
    let SaleType = this.selectedSaleTypeCode ? this.selectedSaleTypeCode : 0;
    let SaleTypeCode = this.SaleTypeCode;
    this.isLoadingData = true;
    this.apiService
      .get(
        ApiEndpoints.LoadAllSaleInvoices +
          `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&DateFrom=${val.DateFrom}&DateTo=${val.DateTo}&ProjectCode=${projectcode}&CustomerId=${customerid}&TransactionType=${SaleType}&SaleTypeCode=${SaleTypeCode}`
      )
      .subscribe((res: any) => {
        this.isLoading = false;
        this.tableResponse$ = res;
        this.isLoadingData = false;
        this.totalItems = res.length;
        this.totalPages = this.totalItems / this.intemsPerPage;
        this.items = res.slice(this.startIndex, this.endIndex);
        this.startIndex++;
        this.endIndex = this.endIndex + this.endIndex;
      });
  }

  Add() {
    let val = this.createForm.value;
    const date = new Date();
    this.model = val;
    this.model.StoreCode = this.selectedStore;
    this.model.SaleTypeCode = this.selectedSaleTypeCode;
    this.model.SaleType = this.selectedSaleType;
    localStorage.setItem('saletypecode', this.model.SaleTypeCode);
    this.model.ProjectCode = this.selectedProject;
    localStorage.setItem('projectCode', this.model.ProjectCode);
    this.model.BranchCode = this.globalBranchCode;
    this.model.CreatedBy = this.globalUserCode;
    this.model.IsLocked = false;
    this.model.InstrumentTypeId = 1;
    if (this.model.SaleDate.includes('')) {
      let x = val.SaleDate == '' ? date : val.SaleDate;
      this.model.SaleDate = this.datePipe.transform(x, 'MMM-d-y');
    } else {
      this.model.SaleDate = this.selectedDate;
    }
    localStorage.setItem('SaleType', this.selectedSaleTypeCode.toString());
    localStorage.setItem('SaleDate', this.model.SaleDate);
    this.apiService
      .post(this.model, ApiEndpoints.CreateSaleInvoiceMaster + `?`)
      .subscribe((res) => {
        this.model.SaleInvoiceNo = res;
        const SaleInvoiceNo = this.model.SaleInvoiceNo;
        if (SaleInvoiceNo != null) {
          localStorage.setItem('SaleInvoiceNo', SaleInvoiceNo);
          if (this.model.SaleTypeCode == 6) {
            this.router.navigate(['/POS/possaledetails'], {
              queryParams: {
                StoreCode: this.selectedStore,
                SaleInvoiceNo: SaleInvoiceNo,
              },
            });
          } else if (this.model.SaleTypeCode == 1) {
            this.router.navigate(['/POS/quotation-detail'], {
              queryParams: {
                StoreCode: this.selectedStore,
                SaleInvoiceNo: SaleInvoiceNo,
              },
            });
          } else if (this.model.SaleTypeCode == 2) {
            this.router.navigate(['/POS/performa-invoice-detail'], {
              queryParams: {
                StoreCode: this.selectedStore,
                SaleInvoiceNo: SaleInvoiceNo,
              },
            });
          } else if (this.model.SaleTypeCode == 3) {
            this.router.navigate(['/POS/sale-invoice-detail'], {
              queryParams: {
                StoreCode: this.selectedStore,
                SaleInvoiceNo: SaleInvoiceNo,
              },
            });
          } else if (this.model.SaleTypeCode == 4) {
            this.router.navigate(['/POS/sale-order-detail'], {
              queryParams: {
                StoreCode: this.selectedStore,
                SaleInvoiceNo: SaleInvoiceNo,
              },
            });
          } else if (this.model.SaleTypeCode == 5) {
            this.router.navigate(['/POS/delivery-challan-detail'], {
              queryParams: {
                StoreCode: this.selectedStore,
                SaleInvoiceNo: SaleInvoiceNo,
              },
            });
          }
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

  hideErrorPopup() {
    this.loadingerror = false;
  }

  getSelectedRow(data: any) {
    this.tableResponse$ = { ...data };
    if (data) {
      const SaleInvoiceNo = data.SaleInvoiceNo;
      const store = data.StoreCode;
      localStorage.setItem('StoreCode', data.StoreCode);
      if (data.SaleType == 'Point of Sale') {
        this.router.navigate(['/POS/possaledetails'], {
          queryParams: {
            StoreCode: this.selectedStore,
            SaleInvoiceNo: SaleInvoiceNo,
          },
        });
      } else if (data.SaleType == 'Sale Invoice') {
        this.router.navigate(['/POS/sale-invoice-detail'], {
          queryParams: { StoreCode: store, SaleInvoiceNo: SaleInvoiceNo },
        });
      } else if (data.SaleType == 'Quotation') {
        this.router.navigate(['/POS/quotation-detail'], {
          queryParams: { StoreCode: store, SaleInvoiceNo: SaleInvoiceNo },
        });
      } else if (data.SaleType == 'Performa Invoice') {
        this.router.navigate(['/POS/performa-invoice-detail'], {
          queryParams: { StoreCode: store, SaleInvoiceNo: SaleInvoiceNo },
        });
      } else if (data.SaleType == 'Sale Order') {
        this.router.navigate(['/POS/sale-order-detail'], {
          queryParams: { StoreCode: store, SaleInvoiceNo: SaleInvoiceNo },
        });
      } else if (data.SaleType == 'Delivery Challan') {
        this.router.navigate(['/POS/delivery-challan-detail'], {
          queryParams: { StoreCode: store, SaleInvoiceNo: SaleInvoiceNo },
        });
      }
    }
  }

  dateChange(e: any) {
    const date = this.datePipe.transform(e.target.value, 'MMM-d-y');
    this.selectedDate = date!;
  }

  handleSelectedValueChange(selectedValue: any) {}

  // clearFilters(){
  //   this.viewForm.controls['DateFrom'].setValue(this.formattedFirstDate);
  //   this.viewForm.controls['DateTo'].setValue(this.formattedLastDate);
  //   this.viewForm.controls['CustomerId'].setValue(0);
  //   // this.apiService.get(ApiEndpoints.LoadAllSaleInvoices +
  //   //   `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&DateFrom=${this.viewForm.controls['DateFrom'].value}&DateTo=${val.DateTo}&ProjectCode=${projectcode}&CustomerId=${customerid}&TransactionType=${SaleType}&SaleTypeCode=${SaleTypeCode}`)
  //   //   .subscribe((res: any) => {
  //   //     this.isLoading = false;
  //   //     this.tableResponse$ = res;
  //   //     this.totalItems = res.length;
  //   //     this.totalPages = this.totalItems / this.intemsPerPage;
  //   //     this.items = res.slice(this.startIndex, this.endIndex);
  //   //     this.startIndex++;
  //   //     this.endIndex = this.endIndex + this.endIndex;
  //   //   });
  // }
}
