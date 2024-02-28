import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';


@Component({
  selector: 'app-marital-status',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.scss'],
})
export class MaritalStatusComponent implements OnInit {
   
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  MaritalStatusList: any = [];
  globalUserCode!: number;
  MaritalStatusCode: any;
  isUpdate!: boolean;
  MaritalStatusForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get MaritalStatusFormValue() {
    return this.MaritalStatusForm.getRawValue();
  }
  get f() {
    return this.MaritalStatusForm.controls;
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
    this.loadAllMaritalStatus();
  }

  formInit() {
    this.MaritalStatusForm = this.fb.group({
      MaritalStatusCode: [{ value: null, disabled: true }],
      MaritalStatusName: [
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

  getRowMaritalStatus(data: any) {
    this.isUpdate = true;
    this.MaritalStatusForm.patchValue({ ...data });
  }

  loadAllMaritalStatus() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.MaritalStatus).subscribe({
      next: (res: any) => {
        this.MaritalStatusList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateMaritalStatus();
    else this.saveMaritalStatus();
  }

  saveMaritalStatus() {
    if (this.MaritalStatusForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.MaritalStatusForm
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
    let payLoad = { ...this.MaritalStatusFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.MaritalStatus)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Marital Status Saved Successfully!',
          type: NotificationType.success,
        });
        this.MaritalStatusForm.reset();
        this.loadAllMaritalStatus();
      });
  }

  updateMaritalStatus() {
    let payLoad = { ...this.MaritalStatusFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.MaritalStatus)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Marital Status Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.MaritalStatusForm.reset();
        this.loadAllMaritalStatus();
      });
  }

  deleteMaritalStatus(MaritalStatusCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Marital Status?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.MaritalStatus + `/${MaritalStatusCode}`
          )
          .subscribe((res) => {
            this.loadAllMaritalStatus();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Marital Status Deleted Successfully!',
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
    this.MaritalStatusForm.reset();
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
