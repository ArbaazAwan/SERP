import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss'],
})
export class GenderComponent implements OnInit {
   
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  GenderList: any = [];
  globalUserCode!: number;
  GenderCode: any;
  isUpdate!: boolean;
  GenderForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get GenderFormValue() {
    return this.GenderForm.getRawValue();
  }
  get f() {
    return this.GenderForm.controls;
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
    this.loadAllGender();
  }

  formInit() {
    this.GenderForm = this.fb.group({
      GenderCode: [{ value: null, disabled: true }],
      GenderName: [
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

  getRowGender(data: any) {
    this.isUpdate = true;
    this.GenderForm.patchValue({ ...data });
  }

  loadAllGender() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Gender).subscribe({
      next: (res: any) => {
        this.GenderList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateGender();
    else this.saveGender();
  }

  saveGender() {
    if (this.GenderForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.GenderForm
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
    let payLoad = { ...this.GenderFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.Gender)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Gender Saved Successfully!',
          type: NotificationType.success,
        });
        this.GenderForm.reset();
        this.loadAllGender();
      });
  }

  updateGender() {
    let payLoad = { ...this.GenderFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.Gender)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Gender Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.GenderForm.reset();
        this.loadAllGender();
      });
  }

  deleteGender(GenderCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Gender?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.Gender + `/${GenderCode}`
          )
          .subscribe((res) => {
            this.loadAllGender();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Gender Deleted Successfully!',
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
    this.GenderForm.reset();
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
