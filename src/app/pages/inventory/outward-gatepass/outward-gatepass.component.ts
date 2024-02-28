import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OGPMasterModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';
import { DatePipe } from '@angular/common';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-outward-gatepass',
  templateUrl: './outward-gatepass.component.html',
  styleUrls: ['./outward-gatepass.component.scss'],
  providers: [DateFormatPipe, DatePipe],
})
export class OutwardGatepassComponent implements OnInit {
  //---------Component Name---------
  componentName: string = 'Outward GatePass';

  //---------Responses From Db -----
  storeResponse$: any = [];
  partyResponse$: any = [];
  purposeResponse$: any = [];
  ModulelistResp$: any = [];
  allOGPDataList: any = [];
  filteredOGPData: any = [];

  //----------Form Names ---------
  filterForm!: FormGroup;
  ogpDataForm!: FormGroup;

  //----------Dropdown Data--------
  status: string[] = ['All','true', 'false'];


  //----------Dialog Variables --------
  filters: boolean = false;
  addNew: boolean = false;

  //-------------Other VARIABLES  ---------
  loadingerror = false;
  UserId: any;
  isLoadingData: boolean = false;
  locationResponse$: any;
  selectedStore: number = 0;
  selectedProject: number = 0;
  globalBranchCode!: number;
  startDate!: Date;
  endDate!: Date;
  selectedFormatKey!: number;
  datePipe = new DatePipe('en-US');

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private router: Router,
    private apiservice: ApiProviderService,
    private storeProjectService: StoreProjectService,
    private dateFormatPipe: DateFormatPipe,
    private confirmService: ConfirmationService,
    private _utilityService:UtilityService,
    private _toastService:ToastService

  ) { }

  ngOnInit(): void {
    this.loadAllCompanyConfig();
    this.addNewFormInIt();
    this.filterFormInIt();

    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });

    //=====================Get User Rights =================
    this.UserId = +localStorage.getItem('UserId')!;
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    if (this.UserId !== null) {
      this.UserId = +this.UserId;
    }
    const ModuleId = 3;
    const FormId = 11;
    this.apiservice
      .get(
        ApiEndpoints.GetUserFormRights +
        '?UserId=' +
        this.UserId +
        '&ModuleId=' +
        ModuleId +
        '&FormId=' +
        FormId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.calculateDates();
    this.loadAllStores();
    this.loadAllParties();
    this.loadAllPurpose();
    this.loadAllLocations();
    this.LoadAllOGPData();
    this.loadOGPMasterFilteredData();
  }

  //---------------------------------------------Assign Start and Last Date of Current Month to filter Dates------------------------------------
  calculateDates() {
    const currentDate = new Date();
    this.startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    this.endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    this.filterForm.get('DateFrom')?.setValue(this.startDate);
    this.filterForm.get('DateTo')?.setValue(this.endDate);
  }

  //---------------------------------All Forms InIt--------------------------------------------

  //-------------Add New Form--------------------------------
  addNewFormInIt() {
    this.ogpDataForm = this.fb.group({
      PartyCode: ['', Validators.required],
      PurposeCode: ['', Validators.required],
      Location: ['', Validators.required],
      OGPDate: ['', Validators.required],
      IsOpen: [false, Validators.required],
    });
  }

  //---------------Filter Form--------------------------------
  filterFormInIt() {
    this.filterForm = this.fb.group({
      PartyCode: [0],
      PurposeCode: [0],
      Location: [''],
      DateFrom: ['', Validators.required],
      DateTo: ['', Validators.required],
      IsOpenFilter: [''],
    });
  }

  //--------------------------------------------ALL CRUD Methods--------------------------------------

  //----------------All Get Data Methods--------------------------------

  //Stores data
  loadAllStores() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.apiservice
      .get(ApiEndpoints.LoadStores + `?BranchCode=${BranchCode}`)
      .subscribe((res: any) => {
        this.storeResponse$ = res.data;
      });
  }

  //Parties Data
  loadAllParties() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.apiservice
      .get(ApiEndpoints.LoadParties + `?BranchCode=${BranchCode}`)
      .subscribe((res: any) => {
        this.partyResponse$ = res;
      });
  }

  //Purpose Data
  loadAllPurpose() {
    this.apiservice.get(ApiEndpoints.LoadPurpose).subscribe((res: any) => {
      
      this.purposeResponse$ = res;
    });
  }

  //Location Data
  loadAllLocations() {
    
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.apiservice
      .get(ApiEndpoints.LoadAllDptLocations + `?BranchCode=${BranchCode}`)
      .subscribe((res: any) => {
        
        this.locationResponse$ = res;
      });
  }

  //All OGP Data
  LoadAllOGPData() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.apiservice
      .get(
        ApiEndpoints.GetOGPMasterDataList +
        `?BranchCode=${BranchCode}&StoreCode=${this.selectedStore}`
      )
      .subscribe((res: any) => {
        
        this.allOGPDataList = res;
      });
  }

  //Filtered Data
  loadOGPMasterFilteredData() {
    let model = this.filterForm.value;
    model.BranchCode = +localStorage.getItem('BranchCode')!;
    model.StoreCode = +this.selectedStore;
    model.DateFrom = this.datePipe.transform(model.DateFrom, 'dd-MMM-yyyy');
    model.DateTo = this.datePipe.transform(model.DateTo, 'dd-MMM-yyyy');

    this.apiservice
      .get(ApiEndpoints.OGPMasterFilters, model)
      .subscribe((res: any) => {
        
        this.filteredOGPData = res.data;
        this.filters = false;
      });
  }

  //----------------Save Data Method--------------------------------

  Add() {
    
    let model = this.ogpDataForm.value;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.UserId;
    model.StoreCode = this.selectedStore;
    model.OGPDate = this.datePipe.transform(model.OGPDate, 'MMM-d-y');
    this.apiservice.post(model, ApiEndpoints.CreateNewOGP).subscribe((res) => {
      this.router.navigate(['/Inventory/outward-gatepass-detail'], {
        queryParams: { StoreCode: this.selectedStore, OGPNo: res },
      });
    });
  }

  //----------------Edit Data Method--------------------------------
  getSelectedRow(data: any) {
    
    this.router.navigate(['/Inventory/outward-gatepass-detail'], {
      queryParams: { StoreCode: data.StoreCode, OGPNo: data.OGPNo },
    });
  }
  //----------------Delete Data Method--------------------------------
  DeleteOGP(data: any) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteOGPMaster +
            `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&OGPNo=${data.OGPNo}`
          )
          .subscribe(() => {
            this.LoadAllOGPData();
            this.toastService.sendMessage({
              message: 'OGP Deleted Successfully!',
              type: NotificationType.error,
              title: 'Success',
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
  //-----------------------------------Data Entry Rights-------------------------------------------
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
    // this.getSelectedRow(data);
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  //-----------------------------Change Store Project Methods-------------------------------------------------------------
  onSelectedOptionChanged(option: any) {
    this.selectedStore = option.DepartmentCode; // Updated variable name
    this.selectedProject = option.ProjectCode;
  }

  //-----------------------------------------------------Open Close Dialog Methods------------------------------------------------

  filterDialogue() {
    this.filters = true;
  }
  addNewDialogue() {
    this.addNew = true;
  }

  //-----------------------------Refresh Forms Methods-----------------------------------------
  refresh() {
    this.ogpDataForm.reset({ IsOpen: false });
  }
  refreshFilterForm(){
    this.filterForm.reset();
  }

  //------------------------------Date Format Working------------------------
  loadAllCompanyConfig() {
    this.apiService
      .get(ApiEndpoints.getAllCompanyConfig)
      .subscribe((res: any) => {
        this.selectedFormatKey = res[0].DateFormatCode;
      });
  }
  currentDate: Date = new Date();
  formatDateForInput(): string {
    return this.dateFormatPipe.transform(this.selectedFormatKey);
  }
  onSubmit() {
    if (this.ogpDataForm.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(
        this.ogpDataForm
      );
      this._toastService.sendMessage({
        message: 'Please Check Form Values',
        type: NotificationType.error,
        title: 'Invalid Form',
      });
      return;
    }
    this.Add();
    // this.addorUpdate();

    // const payLoad: IRecruitmentRequirement = {
    //   ...this.formValues,
    // };

  //   if (this.isUpdate) {
  //     this.updateRecruitmentRequirement(payLoad);
  //   } else {
  //     this.postRecruitmentRequirement(payLoad);
  //   }
  // }
}
}
