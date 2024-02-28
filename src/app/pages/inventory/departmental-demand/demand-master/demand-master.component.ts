import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DemandDetailModel,
  DemandMasterModel,
} from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DepartmentaldemandService } from 'src/app/_shared/services/departmentaldemand.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-demand-master',
  templateUrl: './demand-master.component.html',
  styleUrls: ['./demand-master.component.scss'],
})
export class DemandMasterComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  Viewform!: FormGroup;
  model!: DemandMasterModel;
  modelDetail!: DemandDetailModel;
  selectDepartment!: number;
  departmentResponse$: any = [];
  selectStore!: number;
  StoreResponse$: any = [];
  StoreResponseforView$: any = [];
  // selectedStore!: number;
  selectWorkOrder!: number;
  WorkOrderResponse$: any = [];
  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  tableViewResponse$: any = [];
  isUpdate!: boolean;
  iscreated!: boolean | false;
  selectStoreItem!: number;
  StoreItemResponse$: any = [];
  tableLength!: number;
  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  selectedDate: string = '';
  currentDate: any;
  ViewResponse$: any = [];
  departmentViewResponse$: any = [];
  selectViewDepartment!: number;
  loadingerror = false;
  isLoadingData: boolean = false;
  ModulelistResp$: any = [];
  UserId: any;
  FiltersDialogue: boolean = false;
  showClearFilter: boolean = false;
  //========================================================
  selectedStore: number = 0;
  selectedProject: number = 0;
  componentName: string = "Demand";
  formatedStartDate: any
  formatedEndDate: any
  formatedDemandDate: any;
  isSticky: boolean = false

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
    private apiservice: DepartmentaldemandService,
    private storeProjectService: StoreProjectService,
  ) { }

  ngOnInit(): void {
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    (this.currentDate = new Date()),
      (this.masterResponse$.DemandDate = this.formatDate(this.currentDate)),
      (this.Masterform = this.fb.group({
        DemandNo: this.fb.control('', Validators.required),
        DemandRaisedByDeptCode: this.fb.control('', Validators.required),
        BranchCode: this.fb.control('', Validators.required),
        StoreCode: this.fb.control('', Validators.required),
        DemandDate: this.fb.control('', Validators.required),
        wo_number: this.fb.control(''),
      }));
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 3;
    const FormId = 6;
    this.apiService.get(ApiEndpoints.GetUserFormRights + '?UserId=' + UserId + '&ModuleId=' + ModuleId + '&FormId=' + FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });

    this.Viewform = this.fb.group({
      StoreCode: this.fb.control(''),
      DemandRaisedByDeptCode: this.fb.control(''),
      DateFrom: this.fb.control(''),
      DateTo: this.fb.control(''),
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
    this.Viewform.controls['DateFrom'].setValue(formattedFirstDate);
    this.Viewform.controls['DateTo'].setValue(formattedLastDate);
    this.LoadAllDepartment();
    // this.LoadStores();
    this.LoadAllWorkOrder();
    // this.LoadStoresforView();
    this.updateSelectedDate();
    this.loadMastersViewList();
    //========================================================================


  }
  filter() {
    this.FiltersDialogue = true;
  }

  clearFilter() {
    // this.voucherResponse$ = [];
    // this.filterForm.reset();
    // this.FiltersDialogue = false;
    this.showClearFilter = false;
  }

  hideDialogFilter() {
    this.FiltersDialogue = false;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  //  =====DepartmentDropdown-Start=====
  get Departments() {
    return this.Masterform.get('BranchCode');
  }
  changeDepartment(e: any) {
    this.selectDepartment = e.value;
  }
  LoadAllDepartment() {
    this.apiservice.getAllDepartments().subscribe((res: any) => {
      this.departmentResponse$ = res.data;
    });
  }
  //  =====DepartmentDropdown-End=====


  //  =====StoreDropdown-Start=====
  get Store() {
    return this.Masterform.get('DepartmentCode');
  }
  // changeStore(e: any) {
  //   this.selectStore = +e.target.value;
  //   let x = this.StoreResponse$.find((x: any) => {
  //     return x.DepartmentCode === this.selectStore;
  //   });
  //   if (x.DepartmentName === 'General & Technical Store') {
  //     this.isDisabled = true;
  //   } else {
  //     this.isDisabled = false;
  //   }
  // }
  // LoadStores() {
  //   let x: number = +localStorage.getItem('BranchCode')!;
  //   this.apiservice.getAllStore(x).subscribe((res: any) => {
  //     this.StoreResponse$ = res.data;
  //   });
  // }

  // changeStoreforView(e: any) {
  //   this.selectedStore = +e.target.value;
  // }

  // LoadStoresforView() {
  //   let x: number = +localStorage.getItem('BranchCode')!;
  //   this.apiservice.getAllStore(x).subscribe((res: any) => {
  //     this.StoreResponseforView$ = res.data;
  //   });
  // }
  //  =====StoreDropdown-End=====
  //  =====WorkOrderDropdown-Start=====
  get WorkOrder() {
    return this.Masterform.get('wo_number');
  }
  changeWorkOrder(e: any) {
    this.selectWorkOrder = +e.value;
  }
  LoadAllWorkOrder() {
    let y: number = +localStorage.getItem('BranchCode')!;
    this.apiservice.getWorkOrder(y).subscribe((res: any) => {
      this.WorkOrderResponse$ = res.data;
    });
  }
  //  =====WorkOrderDropdown-End=====

  changeDepartmentforView(e: any) {
    this.selectViewDepartment = +e.value;

  }
  LoadAllDepartmentforView() {
    this.apiservice.getAllDepartments().subscribe((res: any) => {
      this.departmentViewResponse$ = res.data;
    });
  }
  //  =====Created New Demand=====

  add() {
    // debugger
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.Add();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  Add() {
    let user = localStorage.getItem('UserId');
    let branch = localStorage.getItem('BranchCode');
    let newDate = new Date().toISOString().split('T')[0];
    let currentDate = new Date();
    this.Masterform.patchValue({
      BranchCode: +branch!,
      CreatedOn: +currentDate!,
      DemandDate: newDate
    });
    this.iscreated = true;
    let val = this.Masterform.value;
    this.model = val;
    this.model.DemandRaisedByDeptCode = this.Masterform.controls['DemandRaisedByDeptCode'].value;
    this.model.DemandRaisedByUserId = +user!;
    if (this.isDisabled) {
      this.model.wo_number = 0;
    } else {
      this.model.wo_number = this.Masterform.controls['wo_number'].value;
    }
    this.model.StoreCode = this.selectedStore;
    this.model.CreatedBy = +user!;
    if (this.model.wo_number == null) {
      this.model.wo_number = 0
    }
    this.apiservice.postDemand(this.model).subscribe((res) => {
      this.masterResponse$.DemandNo = res;
      if (this.masterResponse$.DemandNo) {
        const DemandNo = this.masterResponse$.DemandNo;
        localStorage.setItem('DemandNo', DemandNo);
        if (DemandNo !== null) {
          this.router.navigate(['/Inventory/departmental-demand'], {
            queryParams: { StoreCode: this.selectedStore, DemandNo: DemandNo },
          });
          this.Masterform.reset();
          this.Masterform.markAsUntouched();
        } else {
          this.toastService.sendMessage({
            message: 'Cannot Create Demand No!',
            type: NotificationType.error,
          });
        }
      }
    });
    this.Masterform.markAsUntouched();
  }
  //  =====Button-Add-Update=====
  // addorUpdate() {
  //   if (this.Masterform.invalid) {
  //     console.log('INVALID');
  //   }
  //   if (!this.isUpdate) {
  //     this.Add();
  //   } else {
  //     // this.update();
  //   }
  // }

  updateAllow(data: any) {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.getSelectedRow(data);
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.tableResponse$ = data;
    //this.masterResponse$ = data;
    if (data) {
      let demand = data.DemandNo;
      let store = data.StoreCode;
      this.router.navigate(['/Inventory/departmental-demand'], {
        queryParams: { StoreCode: store, DemandNo: demand },
      });
    }
  }

  loadMastersViewList() {

    let BranchCode = +localStorage.getItem('BranchCode')!;
    let storeCode = this.selectedStore;
    // let departmentCode = this.Viewform.controls['DemandRaisedByDeptCode'].value
    if (this.selectViewDepartment === undefined) {
      this.selectViewDepartment = 0;
    }
    this.apiservice
      .getDemandMastersList(BranchCode, storeCode, this.selectViewDepartment)
      .subscribe((res: any) => {
        this.tableViewResponse$ = res.data;
        let startDate = this.datePipe.transform(this.Viewform.controls['DateFrom'].value, 'yyyy-MM-dd');
        if (startDate) {
          this.formatedStartDate = startDate;
        }
        let endDate = this.datePipe.transform(this.Viewform.controls['DateTo'].value, 'yyyy-MM-dd');
        if (endDate) {
          this.formatedEndDate = endDate;
        }
        let response = this.tableViewResponse$.filter((x: any) => {
          let arr = this.datePipe.transform(x.DemandDate, 'yyyy-MM-dd');
          if (arr) {
            this.formatedDemandDate = arr;
          }
          return this.formatedDemandDate >= this.formatedStartDate && this.formatedDemandDate <= this.formatedEndDate
        });
        this.tableViewResponse$ = response;
      });
    this.FiltersDialogue = false
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
    if (option) {
      this.selectedStore = option.DepartmentCode; // Updated variable name
      this.selectedProject = option.ProjectCode;
    }

  }

  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }

  deleteDemand(data: any) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteDepartmentDemandMaster +
          `?BranchCode=${localStorage.getItem('BranchCode')}&StoreCode=${this.selectedStore}&DemandNo=${data.DemandNo}`)
          .subscribe(() => {
            this.loadMastersViewList()
            this.toastService.sendMessage({
              message: 'Demand Deleted Successfully!',
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
  refreshdetail() {
    this.selectViewDepartment = 0
    this.ngOnInit()
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
  
}
