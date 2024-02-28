import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-issuance-return',
  templateUrl: './issuance-return.component.html',
  styleUrls: ['./issuance-return.component.scss'],
})
export class IssuanceReturnComponent implements OnInit {
  createForm!: FormGroup;
  viewForm!: FormGroup;
  model: any = [];
  isLoadingData: boolean = false;
  //selectedStore!: number;
  // selectedIssuanceStore!: number;
  selectedDate: string = '';
  selectedPurpose: any;
  storeResponse$: any = [];
  issuanceResponse$: any = [];
  tableResponse$: any = [];
  purpose: any;
  isDisabled!: boolean;
  datePipe = new DatePipe('en-US');
  globalBranchCode!: number;
  globalUserCode!: number;
  currentDate!: Date;
  masterResponse$: any = [];
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Issuance Return';
  selectedStore: number = 0;
  selectedProject: number = 0;
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.purpose = [
      { name: 'Access Return', code: '01' },
      { name: 'Reject Return', code: '02' },
    ];
    this.currentDate = new Date();
    this.masterResponse$.IssuanceDate = this.formatDate(this.currentDate);

    this.createForm = this.fb.group({
      StoreCode: this.fb.control('', Validators.required),
      DepartmentCode: this.fb.control(''),
      ReturnDate: this.fb.control(''),
      ReturnPurpose: this.fb.control(''),
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
    const FormId = 13;
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
      DepartmentCode : this.fb.control('')
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
    const formatedCUrrentDate = this.formatDate(this.currentDate)
    const formattedFirstDate = this.formatDate(firstDate);
    const formattedLastDate = this.formatDate(lastDate);
    this.createForm.controls['ReturnDate'].setValue(formatedCUrrentDate)
    this.viewForm.controls['DateFrom'].setValue(formattedFirstDate);
    this.viewForm.controls['DateTo'].setValue(formattedLastDate);

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadStores();
    this.loadIssueToDept();

    // Add event listener to the IssuanceDate control
    this.createForm.controls['ReturnDate'].valueChanges.subscribe(
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
    this.loadIssuanceReturnMasterList()
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
  //
  //   this.selectedStore = +e.value;
  // }

  // changeIssuanceStore(e: any) {
  //   this.selectedIssuanceStore = +e.value;
  // }
  // changePurpose(e: any) {
  //   this.selectedPurpose = +e.value;
  // }

  loadIssuanceReturnMasterList() {
    let model = this.viewForm.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.selectedStore;
    if(this.viewForm.controls['DepartmentCode'].value==null || this.viewForm.controls['DepartmentCode'].value==''){
      model.DepartmentCode = 0
    }
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.GetIssuanceReturnMasterList,model)
      .subscribe((res: any) => {
        this.tableResponse$ = res;
        this.FiltersDialogue = false;
        this.isLoadingData = false;
      });
  }

  Add() {
    let model = this.createForm.value;
    const date = new Date();
    model.StoreCode = this.selectedStore;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUserCode;
    if (model.ReturnDate.includes('')) {
      let x = model.ReturnDate == '' ? date : model.ReturnDate;
      model.ReturnDate = this.datePipe.transform(x, 'MMM-d-y');
    } else {
      model.ReturnDate = this.createForm.controls['ReturnDate'].value;
    }
    this.apiService
      .post(model, ApiEndpoints.SaveIssuanceReturnMaster + `?`)
      .subscribe((res) => {
        this.model.IssuanceReturnNo = res;
        const IssuanceReturnNo = this.model.IssuanceReturnNo;
        if (IssuanceReturnNo != null) {
          localStorage.setItem('IssuanceReturnNo', IssuanceReturnNo);
          this.router.navigate(['/Inventory/issuance-return-detail'], {
            queryParams: {
              StoreCode: this.selectedStore,
              IssuanceReturnNo: IssuanceReturnNo,
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
      const IssuanceReturnNo = data.IssuanceReturnNo;
      const store = data.StoreCode;
      this.router.navigate(['/Inventory/issuance-return-detail'], {
        queryParams: { StoreCode: store, IssuanceReturnNo: IssuanceReturnNo },
      });
    }
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
    }
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
}
