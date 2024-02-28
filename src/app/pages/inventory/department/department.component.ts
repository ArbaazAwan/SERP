import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

interface Option {
  key: string;
  value: string;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent implements OnInit {
  Department: any = [];
  formDepartment!: FormGroup;
  model: any = [];
  isUpdate: boolean = false;
  selectedDepartment: any = [];
  options: Option[];
  DptDivisionresponse$: any = [];
  selectedDivision!: number;
  StoreType: any = [];
  isDisabled = true;
  selectedStoreType!: number;
  loadingerror = false;
  BranchCode!: number;
  ModulelistResp$: any = [];
  UserId: any;
  departmenttyperesponse$: any;
  selectedDepartmentType: any;
  tableLength!: number;
  componentName: string = "Department";
  isLoadingData: boolean = false;
  isSticky: boolean = false;
  selectedStore: number = 0;
  selectedProject: number = 0;
  isToastShown : boolean = false
  DepartmantCode : number = 0;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private storeProjectService: StoreProjectService,
    private utilityService :UtilityService

  ) {
    this.options = [
      { key: '1', value: 'General Division' },
      { key: '2', value: 'Fabric Division' },
      { key: '3', value: 'Garment Division' },
      { key: '4', value: 'Stitching Unit' },
      { key: '5', value: 'Finishing Unit' },
      { key: '6', value: 'Packing Division' },
    ];
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

  ngOnInit(): void {
    this.formDepartment = this.fb.group({
      DepartmentType: this.fb.control('', Validators.required),
      DivisionCode: this.fb.control('', Validators.required),
      DepartmentName: this.fb.control('', Validators.required),
      ShortName: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false, Validators.required),
      IsStore: this.fb.control(false),
      ConsiderForStock: this.fb.control(false),
      StoreTypeCode: this.fb.control(''),
    });
    //=====================Get User Rights =================
    this.UserId = localStorage.getItem('UserId');
    this.BranchCode = +localStorage.getItem('BranchCode')!;
    this.formDepartment.controls['IsActive'].setValue(true)
    this.storeProjectService.getSelectedOption().subscribe((option: any) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    const ModuleId = 4;
    const FormId = 21;
    this.apiService.get(ApiEndpoints.GetUserFormRights + '?UserId=' + this.UserId + '&ModuleId=' + ModuleId + '&FormId=' + FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.loadAllDepartments();
    this.loadAllDepartmentType();
    this.loadAllDivision();
    this.loadAllStoreType();
  }

  loadAllDivision() {
    this.apiService
      .get(ApiEndpoints.Division)
      .subscribe((res: any) => {
        this.DptDivisionresponse$ = res.data;
      });
  }
  loadAllDepartments() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetAllDepartmentsList).subscribe((res: any) => {
      this.Department = res.data;
      this.isLoadingData = false;
    });
  }

  loadAllStoreType() {
    this.apiService
      .get(ApiEndpoints.GetAllStoreTypeList)
      .subscribe((res) => {
        this.StoreType = res;
      });
  }

  AddOrUpdateDepartment() {
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

    this.AddNewDepartment();
  }

  updateAllow() {


    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.isUpdate = false;
    this.formDepartment.markAsUntouched();
    this.formDepartment.reset();
    this.formDepartment.controls['IsActive'].setValue(true)
    this.loadAllDepartments();
  }

  AddNewDepartment() {
    if(this.formDepartment.invalid){
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formDepartment);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    this.model = this.formDepartment.value;
    this.model.BranchCode = this.BranchCode;
    this.model.CreatedBy = this.UserId;
    if(this.formDepartment.controls['StoreTypeCode'].value==null){
      this.model.StoreTypeCode = 0
    }
    this.apiService
      .post(this.model, ApiEndpoints.PostDepartment)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Department Saved Successfully!',
          type: NotificationType.success,
        });
        this.selectedDepartmentType = null;
      });
    this.refresh();
    this.loadAllDepartments()
  }

  getSelectedRow(data: any) {
    this.formDepartment.patchValue({ ...data });
    this.isUpdate = true;
    this.DepartmantCode = data.DepartmentCode
    this.selectedDepartmentType = data.DepartmentType;
    this.tableLength = Object.keys(this.model).length;
  }

  update() {
    debugger
    this.model = this.formDepartment.value;
    this.model.BranchCode = this.BranchCode;
    this.model.ModifiedBy = this.UserId;
    this.model.DepartmentCode = this.DepartmantCode
    this.apiService.update(this.model, ApiEndpoints.PutDepartment)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Department Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllDepartments();
      });
    this.isUpdate = false;
    this.formDepartment.reset();
  }

  loadAllDepartmentType() {
    this.apiService.get(ApiEndpoints.GetAllDepartmentType).subscribe((res: any) => {
      this.departmenttyperesponse$ = res.data;
    });

  }

  DeleteDepartment(DepartmentCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: `Are you sure that you want to delete Department Code ${DepartmentCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteDepartment + '?DepartmentCode=' + DepartmentCode
          )
          .subscribe((res) => {
            this.loadAllDepartments();
            this.toastService.sendMessage({
              message: 'Department Deleted Successfully!',
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
    this.formDepartment.markAsUntouched();
  }

  GetSelectedRow(data: any) {
    this.isUpdate = true;
    this.model = { ...data };
    let x = Object.values(this.options).find((y: any) => {
      return y.value === this.model.DepartmentType;
    });
    this.model = x;
  }
}
