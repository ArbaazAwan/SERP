import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-employee-action-type',
  templateUrl: './employee-action-type.component.html',
  styleUrls: ['./employee-action-type.component.scss'],
})
export class EmployeeActionTypeComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  EmployeeActionTyperesponse$: any = [];
  globalBranchCode!: number;
  ActionCode: any;
  isUpdate!: boolean;
  globalUserCode!: number;
  EmployeeActionTypeform!: FormGroup;
  selectedFormatKey!: number;
  isToastShown = false;

  get EmployeeActionTypeformValue() {
    return this.EmployeeActionTypeform.getRawValue();
  }
  get f() {
    return this.EmployeeActionTypeform.controls;
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
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.GetAllEmployeeActionType();
  }

  formInit() {
    this.EmployeeActionTypeform = this.fb.group({
      ActionCode: [{ value: null, disabled: true }],
      BranchCode: [null],
      ActionName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
    });
  }

  getRowEmployeeActionType(data: any) {
    this.isUpdate = true;
    this.EmployeeActionTypeform.patchValue({ ...data });
  }

  GetAllEmployeeActionType() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.EmployeeActionType + `/${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.EmployeeActionTyperesponse$ = res.data;
        this.isLoadingData = false;
      });
  }

  addorUpdateEmployeeActionType() {
    if (this.isUpdate) this.updateEmployeeActionType();
    else this.saveEmployeeActionType();
  }

  saveEmployeeActionType() {
    if (this.EmployeeActionTypeform.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.EmployeeActionTypeform
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
    let payLoad = { ...this.EmployeeActionTypeformValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.EmployeeActionType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Employee Action Type Saved Successfully!',
          type: NotificationType.success,
        });
        this.EmployeeActionTypeform.reset();
        this.GetAllEmployeeActionType();
      });
  }

  updateEmployeeActionType() {
    let payLoad = { ...this.EmployeeActionTypeformValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.EmployeeActionType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Employee Action Type Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.EmployeeActionTypeform.reset();
        this.GetAllEmployeeActionType();
      });
  }

  deleteEmployeeActionType(ActionCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Employee Action Type?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.EmployeeActionType + `/${ActionCode}`)
          .subscribe((res) => {
            this.GetAllEmployeeActionType();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Employee Action Type Deleted Successfully!',
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

  refresh() {
    this.isUpdate = false;
    this.EmployeeActionTypeform.reset();
  }

  // Scroll , Sticky
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
