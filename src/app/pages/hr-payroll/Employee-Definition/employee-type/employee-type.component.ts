import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-employee-type',
  templateUrl: './employee-type.component.html',
  styleUrls: ['./employee-type.component.scss'],
})
export class EmployeeTypeComponent implements OnInit {
  
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  EmployeeTypeList: any = [];
  globalUserCode!: number;
  EmployeeTypeCode: any;
  isUpdate!: boolean;
  EmployeeTypeForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get EmployeeTypeFormValue() {
    return this.EmployeeTypeForm.getRawValue();
  }
  get f() {
    return this.EmployeeTypeForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private utilityService: UtilityService
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadAllEmployeeType();
  }

  formInit() {
    this.EmployeeTypeForm = this.fb.group({
      EmployeeTypeCode: [{ value: null, disabled: true }],
      EmployeeTypeName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null]
    });
  }

  getRowEmployeeType(data: any) {
    this.isUpdate = true;
    this.EmployeeTypeForm.patchValue({ ...data });
  }

  loadAllEmployeeType() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.EmployeeType).subscribe({
      next: (res: any) => {
        this.EmployeeTypeList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateEmployeeTypeList();
    else this.saveEmployeeTypeList();
  }

  saveEmployeeTypeList() {
    if (this.EmployeeTypeForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.EmployeeTypeForm
      );
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
    let payLoad = { ...this.EmployeeTypeFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.EmployeeType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Employee Type Saved Successfully!',
          type: NotificationType.success,
        });
        this.EmployeeTypeForm.reset();
        this.loadAllEmployeeType();
      });
  }

  updateEmployeeTypeList() {
    let payLoad = { ...this.EmployeeTypeFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.EmployeeType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Employee Type Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.EmployeeTypeForm.reset();
        this.loadAllEmployeeType();
      });
  }

  deleteEmployeeType(EmployeeTypeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Employee Type?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.EmployeeType + `/${EmployeeTypeCode}`
          )
          .subscribe((res) => {
            this.loadAllEmployeeType();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Employee Type Deleted Successfully!',
                type: NotificationType.deleted,
                title: 'Deleted',
              });
            }
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

  hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.isUpdate = false;
    this.EmployeeTypeForm.reset();
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
