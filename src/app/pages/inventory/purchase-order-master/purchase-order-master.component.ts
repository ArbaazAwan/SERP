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
  selector: 'app-purchase-order-master',
  templateUrl: './purchase-order-master.component.html',
  styleUrls: ['./purchase-order-master.component.scss'],
})
export class PurchaseOrderMasterComponent implements OnInit {
  createForm!: FormGroup;
  viewForm!: FormGroup;
  model: any = [];
  isLoadingData: boolean = false;

  //selectedStore!: number;
  selectedDate: string = '';
  selectedParty!: number;
  selectedPOType!: number;
  selectedPartyForView!: number;

  storeResponse$: any = [];
  partyResponse$: any = [];
  tableResponse$: any = [];
  masterResponse$: any = [];

  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  globalBranchCode!: number;
  globalUserCode!: number;
  currentDate!: Date;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  isSticky: boolean = false;
  selectedStore: number = 0;
  selectedProject: number = 0;
  poTypesList:any;
  componentName: string = 'Purchase Order';

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private confirmservice: ConfirmationService,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.masterResponse$.PODate = this.formatDate(this.currentDate);
    this.createForm = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      PartyCode: this.fb.control(''),
      PODate: this.fb.control(''),
    });

    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 3;
    const FormId = 8;
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
      POFromDate: this.fb.control(''),
      POToDate: this.fb.control(''),
      PartyCode: this.fb.control(''),
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
    this.viewForm.controls['POFromDate'].setValue(formattedFirstDate);
    this.viewForm.controls['POToDate'].setValue(formattedLastDate);

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.loadAllParties();
    this.updateSelectedDate();
    this.loadAllPurchaseOrderMasters();
    this.getPoTypeList();
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  loadAllParties() {
    this.apiService.get(ApiEndpoints.LoadAllParties + `?BranchCode=${this.globalBranchCode}`).subscribe((res: any) => {
      this.partyResponse$ = res.data;
    });
  }

  changeParty(e: any) {
    this.selectedParty = +e.value;
  }

  changePOType(e: any) {
    this.selectedPOType = +e.value;
  }

  changePartyForView(e: any) {
    this.selectedPartyForView = +e.value;
  }

  loadStores() {
    this.apiService
      .get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.storeResponse$ = res.data;
      });
  }

  // changeStore(e: any) {
  //   this.selectedStore = +e.target.value;
  // }
  formatedStartDate: any
  formatedEndDate: any
  formatedPODate: any

  getPoTypeList(){
    debugger
    this.apiService.get(ApiEndpoints.PurchaseOrderType + '?BranchCode='+this.globalBranchCode).subscribe({
      next:(res:any)=>{
        debugger
        this.poTypesList = res;
      }
    })
  }


  loadAllPurchaseOrderMasters() {
    if (this.selectedPartyForView == null) {
      this.selectedPartyForView = 0;
    } else {
      this.selectedPartyForView;
    }
    this.isLoadingData = true;
    this.apiService
      .get(
        ApiEndpoints.GetAllPurchaseOrderMasters +
        `?BranchCode=${this.globalBranchCode}&PartyCode=${this.selectedPartyForView}`
      )
      .subscribe((res: any) => {
        this.tableResponse$ = res;
        this.FiltersDialogue = false;
        let startDate = this.datePipe.transform(this.viewForm.controls['POFromDate'].value, 'yyyy-MM-dd');
        if (startDate) {
          this.formatedStartDate = startDate;
        }
        let endDate = this.datePipe.transform(this.viewForm.controls['POToDate'].value, 'yyyy-MM-dd');
        if (endDate) {
          this.formatedEndDate = endDate;
        }
        let response = this.tableResponse$.filter((x: any) => {
          let arr = this.datePipe.transform(x.PODate, 'yyyy-MM-dd');
          if (arr) {
            this.formatedPODate = arr;
          }
          return this.formatedPODate >= this.formatedStartDate && this.formatedPODate <= this.formatedEndDate
        });
        this.tableResponse$ = response;
        this.isLoadingData = false;
      });
  }

  Add() {
    let val = this.createForm.value;
    const date = new Date();
    this.model = val;
    this.model.StoreCode = this.selectedStore;
    this.model.BranchCode = this.globalBranchCode;
    this.model.CreatedBy = this.globalUserCode;
    this.model.POTypeNo = this.selectedPOType || 0;
    if (this.model.PODate.includes('')) {
      let x = val.PODate == '' ? date : val.PODate;
      this.model.PODate = this.datePipe.transform(x, 'MMM-d-y');
    } else {
      this.model.PODate = this.selectedDate;
    }
    this.model.PartyCode = this.selectedParty;
    this.apiService
      .post(this.model, ApiEndpoints.CreatePurchaseOrder + `?`)
      .subscribe((res) => {
        this.model.PONo = res;
        const PONo = this.model.PONo;
        if (PONo != null) {
          localStorage.setItem('PONo', PONo);
          this.router.navigate(['/Inventory/purchase-order-detail'], {
            queryParams: { StoreCode: this.selectedStore, PONo: PONo },
          });
          this.createForm.reset();
          this.createForm.markAsUntouched();
        } else {
          this.toastService.sendMessage({
            message: 'Cannot Create PO Number!',
            type: NotificationType.error,
          });
        }
      });
  }

  addorUpdate() {
    // if (this.createForm.invalid) {
    //   return this.toastService.sendMessage({
    //     message: 'Form Invalid',
    //     type: NotificationType.error,
    //   });
    // }
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

  deletePO(data: any) {
    // this.confirmservice.confirm({
    //   message: 'Are you sure that you want to delete?',
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.apiService.delete(ApiEndpoints.DeletePurchaseRequsition +
    //       `?BranchCode=${localStorage.getItem('BranchCode')}&StoreCode=${this.selectedStore}&DemandNo=${data.PRNo}`)
    //       .subscribe(() => {
    //         this.loadAllPurchaseOrderMasters()
    //         this.toastService.sendMessage({
    //           message: 'Purchase Requsition Deleted Successfully!',
    //           type: NotificationType.deleted,
    //         });
    //       });
    //   },
    //   reject: (type: any) => {
    //     switch (type) {
    //       case ConfirmEventType.REJECT:
    //         break;
    //       case ConfirmEventType.CANCEL:
    //         console.log('Cancel');
    //         break;
    //     }
    //   },
    // });

  }
  hideErrorPopup() {
    this.loadingerror = false;
  }

  getSelectedRow(data: any) {
    this.tableResponse$ = { ...data };
    if (data) {
      const PONo = data.PONo;
      const store = data.StoreCode;
      this.router.navigate(['/Inventory/purchase-order-detail'], {
        queryParams: { StoreCode: store, PONo: PONo },
      });
    }
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

  onSelectedOptionChanged(option: any) {
    if (option) {
      this.selectedStore = option.DepartmentCode; // Updated variable name
      this.selectedProject = option.ProjectCode;
    }
  }
  visible: boolean = false;
  FiltersDialogue: boolean = false;
  showClearFilter: boolean = false
  showDialog() {
    this.visible = true;
  }

  filter() {
    this.FiltersDialogue = true;
  }

  clearFilter() {
    this.showClearFilter = false;
  }

  hideDialogFilter() {
    this.FiltersDialogue = false;
  }
  refreshdetail() {
    this.selectedPartyForView = 0
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
