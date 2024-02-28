import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DepartmentLocationModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-department-location',
  templateUrl: './department-location.component.html',
  styleUrls: ['./department-location.component.scss'],
})
export class DepartmentLocationComponent implements OnInit {
  form!: FormGroup;
  dptLocationResponse$: any = [];
  dptTableResponse$: any = [];
  departmentResponse$: any = [];
  selectedDepartment!: number;
  model!: DepartmentLocationModel;
  isUpdate!: boolean;
  tableLength!: number;
  departmentCode!: number;
  loadingerror = false;
  isLoadingData: boolean = false;

  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Department Location';
  isToastShown : boolean = false;
  constructor(
    private fb: FormBuilder,
    private apiservice: ApiProviderService,
    private toastService: ToastService,
    private utilityService : UtilityService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control(''),
      DepartmentCode: this.fb.control('', Validators.required),
      LocationCode: this.fb.control(''),
      LocationName: this.fb.control('', Validators.required),
      LocationNumber: this.fb.control('', Validators.required),
      ConsiderForStock: this.fb.control(false),
      IsActive: this.fb.control(false),
      CreatedOn: this.fb.control(''),
      CreatedBy: this.fb.control(''),
      ModifiedOn: this.fb.control(''),
      ModifiedBy: this.fb.control(''),
    });
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 3;
    const FormId = 2;
    this.apiservice
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

    this.LoadAllDepartment();
  }
  ConsiderForStock() {
    const ConsiderForStock = this.form.get('ConsiderForStock');
    if (ConsiderForStock) {
      ConsiderForStock.setValue(!ConsiderForStock.value);
    }
  }
  IsActive() {
    const IsActive = this.form.get('IsActive');
    if (IsActive) {
      IsActive.setValue(!IsActive.value);
    }
  }
  changeDepartment(e: any) {
    this.selectedDepartment = +e.value;
    this.LoadAllLocations(this.selectedDepartment);
  }
  get Department(): FormArray {
    return this.form.get('DepartmentCode') as FormArray;
  }
  LoadAllDepartment() {
    this.apiservice
      .get(ApiEndpoints.GetAllDepartmentsList)
      .subscribe((res: any) => {
        this.departmentResponse$ = res.data;
      });
  }
  LoadAllLocations(DepartmentCode: number) {
    this.isLoadingData = true;
    this.apiservice
      .get(ApiEndpoints.getLocationById + '?DepartmentCode=' + DepartmentCode)
      .subscribe((res) => {
        this.dptTableResponse$ = res;
        this.isLoadingData = false;
      });
  }
  Add() {
    if(this.form.invalid){
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please fill all required fields',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let user = localStorage.getItem('UserId');
    let branch = localStorage.getItem('BranchCode');
    let currentDate = new Date();
    this.form.patchValue({
      BranchCode: +branch!,
      CreatedBy: +user!,
      CreatedOn: +currentDate!,
      DepartmentCode: this.selectedDepartment,
      ConsiderForStock:
        this.form.get('ConsiderForStock')?.value === undefined ? false : true,
      IsActive: this.form.get('IsActive')?.value === undefined ? false : true,
    });
    let val = this.form.value;
    this.model = val;
    console.table(val);
    console.log(this.form.valid,'val')
    this.apiservice
      .post(this.model, ApiEndpoints.postDepartmentLocation)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Department Location Saved Successfully!',
          type: NotificationType.success,
        });
        this.LoadAllLocations(this.selectedDepartment);
      });
    this.form.markAsUntouched();
    this.form.reset()
  }
  update() {
    this.apiservice
      .update(this.dptLocationResponse$, ApiEndpoints.putDepartmentLocation)
      .subscribe((res) => {
        this.form.patchValue({
          model: this.dptLocationResponse$,
        });
        this.toastService.sendMessage({
          message: 'Department Location Updated Successfully!',
          type: NotificationType.success,
        });
        this.LoadAllLocations(this.selectedDepartment);
      });
    this.isUpdate = false;
    this.form.reset();
  }
  getSelectedRow(data: any) {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.isUpdate = true;
    this.dptLocationResponse$ = data;
    this.form.patchValue({
      ModifiedBy: +user!,
      ModifiedOn: currentDate.toLocaleString(),
    });
    this.dptLocationResponse$.ModifiedBy = this.form.get('ModifiedBy')?.value;
    this.dptLocationResponse$.ModifiedOn = this.form.get('ModifiedOn')?.value;
    //this.departmentCode = this.dptLocationResponse$.DepartmentCode;
    this.tableLength = Object.keys(this.dptLocationResponse$).length;
  }
  addorUpdate() {
    if (this.form.invalid) {
      console.log('INVALID');
    }
    if (!this.isUpdate) {
      this.add();
    } else {
      this.updateAllow();
    }
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.Add();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

  delete() {

    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;

    //   return;
    // }
  }
  hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.LoadAllDepartment();
  }
}
