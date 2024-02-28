import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-store-issuance',
  templateUrl: './store-issuance.component.html',
  styleUrls: ['./store-issuance.component.scss'],
})
export class StoreIssuanceComponent implements OnInit {
  createForm!: FormGroup;
  viewForm!: FormGroup;
  model: any = [];
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  // selectedStore!: number;
  selectedIssuanceStore!: number;
  selectedDate: string = '';
  isLoadingData: boolean = false;

  storeResponse$: any = [];
  issuanceResponse$: any = [];
  tableResponse$: any = [];

  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  globalBranchCode!: number;
  globalUserCode!: number;
  currentDate!: Date;
  masterResponse$: any = [];
  selectedStore: number = 0;
  selectedProject: number = 0;
  componentName: string = 'Store Issuance';
  isSticky: boolean = false
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.masterResponse$.IssuanceDate = this.formatDate(this.currentDate);
    this.createForm = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      IssuedToDeptCode: this.fb.control(''),
      IssuanceDate: this.fb.control(''),
    });
    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });

    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 3;
    const FormId = 10;
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
      IssuedToDeptCode: this.fb.control(''),
    });
    this.defaultDates()
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.loadIssueToDept();
    this.loadIssuanceMasterList();

    // Add event listener to the IssuanceDate control
    this.createForm.controls['IssuanceDate'].valueChanges.subscribe(
      (newDate) => {
        const selectedDate = new Date(newDate);
        const firstDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        );
        const lastDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0
        );
        const formattedFirstDate = this.formatDate(firstDate);
        const formattedLastDate = this.formatDate(lastDate);
        this.viewForm.controls['DateFrom'].setValue(formattedFirstDate);
        this.viewForm.controls['DateTo'].setValue(formattedLastDate);
      }
    );

    this.updateSelectedDate();
  }

  defaultDates() {
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
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  loadStores() {
    this.apiService
      .get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.storeResponse$ = res.data;
      });
  }

  loadIssueToDept() {
    this.apiService
      .get(
        ApiEndpoints.LoadIssueToDept + `?BranchCode=${this.globalBranchCode}`
      )
      .subscribe((res: any) => {
        this.issuanceResponse$ = res;
      });
  }

  // changeStore(e: any) {
  //   this.selectedStore = +e.target.value;
  // }

  changeIssuanceStore(e: any) {
    this.selectedIssuanceStore = +e.value;
  }
  formatedStartDate: any;
  formatedEndDate: any;
  formatedIssuanceDate: any;
  loadIssuanceMasterList() {
    if (this.selectedIssuanceStore == null) {
      this.selectedIssuanceStore = 0;
    } else {
      this.selectedIssuanceStore;
    }
    this.apiService
      .get(
        ApiEndpoints.GetIssuanceMasterList +
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&IssToDepartmentCode=${this.selectedIssuanceStore}`
      )
      .subscribe((res: any) => {
        this.tableResponse$ = res;
        this.FiltersDialogue = false


        let startDate = this.datePipe.transform(this.viewForm.controls['DateFrom'].value, 'yyyy-MM-dd');
        if (startDate) {
          this.formatedStartDate = startDate;
        }
        let endDate = this.datePipe.transform(this.viewForm.controls['DateTo'].value, 'yyyy-MM-dd');
        if (endDate) {
          this.formatedEndDate = endDate;
        }
        let response = this.tableResponse$.filter((x: any) => {
          let arr = this.datePipe.transform(x.IssuanceDate, 'yyyy-MM-dd');
          if (arr) {
            this.formatedIssuanceDate = arr;
          }
          return this.formatedIssuanceDate >= this.formatedStartDate && this.formatedIssuanceDate <= this.formatedEndDate
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
    // this.model.IssuedToDeptCode = this.selectedIssuanceStore;
    if (this.model.IssuanceDate.includes('')) {
      let x = val.IssuanceDate == '' ? date : val.IssuanceDate;
      this.model.IssuanceDate = this.datePipe.transform(x, 'MMM-d-y');
    } else {
      this.model.IssuanceDate = this.selectedDate;
    }
    this.apiService
      .post(this.model, ApiEndpoints.SaveIssMaster + `?`)
      .subscribe((res) => {
        this.model.IssuanceNo = res;
        const IssuanceNo = this.model.IssuanceNo;
        if (IssuanceNo != null) {
          localStorage.setItem('IssuanceNo', IssuanceNo);
          this.router.navigate(['/Inventory/store-issuance-detail'], {
            queryParams: {
              StoreCode: this.selectedStore,
              IssuanceNo: IssuanceNo,
            },
          });
          this.createForm.reset();
          this.createForm.markAsUntouched();
        } else {
          this.toastService.sendMessage({
            message: 'Cannot Create Issuance Number!',
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
      const IssuanceNo = data.IssuanceNo;
      const store = data.StoreCode;
      this.router.navigate(['/Inventory/store-issuance-detail'], {
        queryParams: { StoreCode: store, IssuanceNo: IssuanceNo },
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
    this.defaultDates()
    this.selectedIssuanceStore = 0
    this.loadIssuanceMasterList()
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
