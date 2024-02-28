import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-religion',
  templateUrl: './religion.component.html',
  styleUrls: ['./religion.component.scss'],
})
export class ReligionComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  ReligionList: any = [];
  globalUserCode!: number;
  ReligionCode: any;
  isUpdate!: boolean;
  ReligionForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get ReligionFormValue() {
    return this.ReligionForm.getRawValue();
  }
  get f() {
    return this.ReligionForm.controls;
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
    this.loadAllReligion();
  }

  formInit() {
    this.ReligionForm = this.fb.group({
      ReligionCode: [{ value: null, disabled: true }],
      ReligionName: [
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

  getRowReligion(data: any) {
    this.isUpdate = true;
    this.ReligionForm.patchValue({ ...data });
  }

  loadAllReligion() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Religion).subscribe({
      next: (res: any) => {
        this.ReligionList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateReligion();
    else this.saveReligion();
  }

  saveReligion() {
    if (this.ReligionForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.ReligionForm
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
    let payLoad = { ...this.ReligionFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.Religion)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Religion Saved Successfully!',
          type: NotificationType.success,
        });
        this.ReligionForm.reset();
        this.loadAllReligion();
      });
  }

  updateReligion() {
    let payLoad = { ...this.ReligionFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.Religion)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Religion Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.ReligionForm.reset();
        this.loadAllReligion();
      });
  }

  deleteReligion(ReligionCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Religion?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.Religion + `/${ReligionCode}`
          )
          .subscribe((res) => {
            this.loadAllReligion();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Religion Deleted Successfully!',
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
    this.ReligionForm.reset();
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
