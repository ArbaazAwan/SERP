import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-purchase-requsition-master',
  templateUrl: './purchase-requsition-master.component.html',
  styleUrls: ['./purchase-requsition-master.component.scss'],
})
export class PurchaseRequsitionMasterComponent implements OnInit {
  form!: FormGroup;
  model: any = [];
  showClearFilter: boolean = false
  FiltersDialogue: boolean = false
  //selectedStore!: number;
  selectedWorkOrder!: number;
  selectedPrType!: number;
  selectedDate: string = '';
  isLoadingData: boolean = false;

  workOrderResponse$: any = [];
  masterResponse$: any = [];
  storeResponse$: any = [];
  tableResponse$: any = [];
  prTypesList:any;
  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  globalBranchCode!: number;
  globalUserCode!: number;
  currentDate!: Date;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  formatedStartDate: any = '';
  formatedEndDate: any = '';
  formatedPRDate: any = '';
  //--------------------------------------------
  selectedStore: number = 0;
  selectedProject: number = 0;
  componentName: string = 'Purchase Requisition';
  isSticky: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private router: Router,
    private confirmservice: ConfirmationService,
    private storeProjectService: StoreProjectService
  ) { }

  ngOnInit(): void {
    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    this.currentDate = new Date();
    this.masterResponse$.PRDate = this.formatDate(this.currentDate);
    this.form = this.fb.group({
      // StoreCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control(''),
      DateTo: this.fb.control(''),
      wo_number: this.fb.control(''),
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
    this.form.controls['DateFrom'].setValue(formattedFirstDate);
    this.form.controls['DateTo'].setValue(formattedLastDate);
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 3;
    const FormId = 7;
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

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.LoadAllWorkOrder();
    this.updateSelectedDate();
    this.loadPRMasterList();
    this.getPRTypeList();
    //========================================================================

  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  loadStores() {
    this.apiService.get(ApiEndpoints.LoadStores).subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }
  clearFilter() {
    // this.voucherResponse$ = [];
    // this.filterForm.reset();
    // this.FiltersDialogue = false;
    this.showClearFilter = false;
  }
  filter() {
    this.FiltersDialogue = true;
  }
  hideDialogFilter() {
    this.FiltersDialogue = false;
  }

  changeStore(e: any) {
    this.selectedStore = +e.target.value;
    let x = this.storeResponse$.find((x: any) => {
      return x.DepartmentCode === this.selectedStore;
    });
    if (x.DepartmentName === 'General & Technical Store') {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  changeWorkOrder(e: any) {
    this.selectedWorkOrder = +e.target.value;
  }

  changePRType(e: any) {
    debugger
    this.selectedPrType = +e.value;
  }

  LoadAllWorkOrder() {
    this.apiService
      .get(ApiEndpoints.LoadWorkOrders + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.workOrderResponse$ = res.data;
      });
  }

  Add() {
    let val = this.form.value;
    const date = new Date();
    let newDate = new Date().toISOString().split('T')[0];
    this.model = val;
    this.model.PRTypeNo = this.selectedPrType;
    this.model.wo_number = this.form.controls['wo_number'].value
    this.model.StoreCode = this.selectedStore;
    this.model.BranchCode = this.globalBranchCode;
    this.model.CreatedBy = this.globalUserCode;
    if (newDate.includes('')) {
      this.model.PRDate = this.datePipe.transform(date, 'MMM-d-y');
    } else {
      this.model.PRDate = newDate;
    }
    this.apiService
      .post(this.model, ApiEndpoints.CreateNewPurchaseRequsition + `?`)
      .subscribe((res) => {
        this.model.PRNo = res;
        const PRNo = this.model.PRNo;
        if (PRNo != null) {
          localStorage.setItem('PRNo', PRNo);
          this.router.navigate(['/Inventory/purchase-requsition-detail'], {
            queryParams: { StoreCode: this.selectedStore, PRNo: PRNo },
          });
          this.form.reset();
          this.form.markAsUntouched();
        } else {
          this.toastService.sendMessage({
            message: 'Cannot Create PR Number!',
            type: NotificationType.error,
          });
        }
      });
  }

  addorUpdate() {
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
      const PRNo = data.PRNo;
      const store = data.StoreCode;
      this.router.navigate(['/Inventory/purchase-requsition-detail'], {
        queryParams: { StoreCode: store, PRNo: PRNo },
      });
    }
  }

  getPRTypeList(){
    debugger
    this.apiService.get(ApiEndpoints.PurchaseRequistionType + '?BranchCode='+this.globalBranchCode).subscribe({
      next:(res:any)=>{
        debugger
        this.prTypesList = res;
      }
    })
  }

  loadPRMasterList() {
    this.isLoadingData = true;
    this.apiService
      .get(
        ApiEndpoints.GetPurchaseRequisitionMaster +
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}`
      )
      .subscribe((res) => {
        this.tableResponse$ = res;
        this.isLoadingData = false;
        let startDate = this.datePipe.transform(this.form.controls['DateFrom'].value, 'yyyy-MM-dd');
        if (startDate) {
          this.formatedStartDate = startDate;
        }
        let endDate = this.datePipe.transform(this.form.controls['DateTo'].value, 'yyyy-MM-dd');
        if (endDate) {
          this.formatedEndDate = endDate;
        }
        let response = this.tableResponse$.filter((x: any) => {
          let arr = this.datePipe.transform(x.PRDate, 'yyyy-MM-dd');
          if (arr) {
            this.formatedPRDate = arr;
          }
          return this.formatedPRDate >= this.formatedStartDate && this.formatedPRDate <= this.formatedEndDate
        });
        this.tableResponse$ = response;
        if (this.form.controls['wo_number'].value) {
          let response = this.tableResponse$.filter((x: any) => {
            return x.wo_number == this.form.controls['wo_number'].value
          });
          this.tableResponse$ = response;
        }
        this.FiltersDialogue = false
      });
  }

  dateChange(e: any) {
    const date = this.datePipe.transform(e.target.value, 'MMM-d-y');
    this.selectedDate = date!;
  }

  updateSelectedDate() {
    const currentDate = new Date();

    const date = this.datePipe.transform(currentDate, 'MMM-d-y');

    if (date !== null) {
      this.selectedDate = date;
    } else {
      this.selectedDate = '';
    }
  }

  //============================================================
  onSelectedOptionChanged(option: any) {
    this.selectedStore = option.DepartmentCode; // Updated variable name
    this.selectedProject = option.ProjectCode;
  }

  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }

  refreshdetail() {
    this.form.reset();
  }

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }
  deletePR(data: any){
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeletePurchaseRequsition +
          `?BranchCode=${localStorage.getItem('BranchCode')}&StoreCode=${this.selectedStore}&DemandNo=${data.PRNo}`)
          .subscribe(() => {
            this.loadPRMasterList()
            this.toastService.sendMessage({
              message: 'Purchase Requsition Deleted Successfully!',
              type: NotificationType.deleted,
            });
          });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            console.log('Cancel');
            break;
        }
      },
    });
  }
}
