import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-good-receipt-note',
  templateUrl: './good-receipt-note.component.html',
  styleUrls: ['./good-receipt-note.component.scss'],
})
export class GoodReceiptNoteComponent implements OnInit {
  createForm!: FormGroup;
  viewForm!: FormGroup;
  model: any = [];
  isLoadingData: boolean = false;

  // selectedStore!: number;
  selectedDate: string = '';
  selectedParty!: number;

  storeResponse$: any = [];
  tableResponse$: any = [];

  masterResponse$: any = [];
  currentDate!: Date;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;

  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  globalBranchCode!: number;
  globalUserCode!: number;
  isSticky: boolean = false
  selectedStore: number = 0;
  selectedProject: number = 0;
  componentName: string = 'Good Receipt Note';
  purposeList: any = []
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private router: Router,
    private storeProjectService: StoreProjectService
  ) {
    this.purposeList = [
      { value: 'Purchase', viewValue: 'Purchase' },
      { value: 'Return Back', viewValue: 'Return Back' },
      { value: 'After Repair', viewValue: 'After Repair' },
      { value: 'After Process', viewValue: 'After Process' },
    ]
  }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.masterResponse$.GRNDate = this.formatDate(this.currentDate);
    this.createForm = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      GRNPurpose: this.fb.control(''),
      GRNDate: this.fb.control(''),
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
    const FormId = 9;
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
      StoreCode: this.fb.control(''),
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
    this.updateSelectedDate();
    this.loadAllGRNMasters();
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
    //api/Demand/LoadStores?BranchCode=${BranchCode}
    this.apiService
      .get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.storeResponse$ = res.data;
      });
  }

  // changeStore(e: any) {
  //   this.selectedStore = +e.target.value;
  // }
  formatedStartDate: any;
  formatedEndDate: any;
  formatedPODate: any
  loadAllGRNMasters() {
    if (this.selectedStore == null) {
      this.selectedStore = 0;
    } else {
      this.selectedStore;
    }
    this.apiService
      .get(
        ApiEndpoints.LoadAllGRN +
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}`
      )
      .subscribe((res: any) => {
        this.tableResponse$ = res;
        this.FiltersDialogue = false
        let startDate = this.datePipe.transform(this.viewForm.controls['POFromDate'].value, 'yyyy-MM-dd');
        if (startDate) {
          this.formatedStartDate = startDate;
        }
        let endDate = this.datePipe.transform(this.viewForm.controls['POToDate'].value, 'yyyy-MM-dd');
        if (endDate) {
          this.formatedEndDate = endDate;
        }
        let response = this.tableResponse$.filter((x: any) => {
          let arr = this.datePipe.transform(x.GRNDate, 'yyyy-MM-dd');
          if (arr) {
            this.formatedPODate = arr;
          }
          return this.formatedPODate >= this.formatedStartDate && this.formatedPODate <= this.formatedEndDate
        });
        this.tableResponse$ = response;
      });
  }

  Add() {
    let val = this.createForm.value;
    const date = new Date();
    this.model = val;
    this.model.StoreCode = this.selectedStore;
    this.model.BranchCode = this.globalBranchCode;
    this.model.CreatedBy = this.globalUserCode;
    this.model.IsLocked = false;
    if (this.model.GRNDate.includes('')) {
      let x = val.GRNDate == '' ? date : val.GRNDate;
      this.model.GRNDate = this.datePipe.transform(x, 'MMM-d-y');
    } else {
      this.model.GRNDate = this.selectedDate;
    }
    this.apiService
      .post(this.model, ApiEndpoints.CreateNewGRN + `?`)
      .subscribe((res) => {
        this.model.GRNNo = res;
        const GRNNo = this.model.GRNNo;
        if (GRNNo != null) {
          localStorage.setItem('GRNNo', GRNNo);
          this.router.navigate(['/Inventory/good-receipt-note-detail'], {
            queryParams: { StoreCode: this.selectedStore, GRNNo: GRNNo },
          });
          this.createForm.reset();
          this.createForm.markAsUntouched();
        } else {
          this.toastService.sendMessage({
            message: 'Cannot Create GRN Number!',
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

  hideErrorPopup() {
    this.loadingerror = false;
  }

  getSelectedRow(data: any) {
    this.tableResponse$ = { ...data };
    if (data) {
      const GRNNo = data.GRNNo;
      const store = data.StoreCode;
      this.router.navigate(['/Inventory/good-receipt-note-detail'], {
        queryParams: { StoreCode: store, GRNNo: GRNNo },
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
    this.selectedStore = option.DepartmentCode; // Updated variable name
    this.selectedProject = option.ProjectCode;
  }

  visible: boolean = false;
  showClearFilter: boolean = false;
  FiltersDialogue: boolean = false;
  showDialog() {
    this.visible = true;
  }

  clearFilter() {
    this.showClearFilter = false;
  }
  filter() {
    this.FiltersDialogue = true;
  }
  hideDialogFilter() {
    this.FiltersDialogue = false;
  }
  refreshdetail() {
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
