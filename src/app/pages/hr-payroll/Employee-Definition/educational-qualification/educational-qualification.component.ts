import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-educational-qualification',
  templateUrl: './educational-qualification.component.html',
  styleUrls: ['./educational-qualification.component.scss'],
})
export class EducationalQualificationComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  QualificationLevelList: any = [];
  globalUserCode!: number;
  QualificationLevelCode: any;
  isUpdate!: boolean;
  QualificationLevelForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get QualificationLevelFormValue() {
    return this.QualificationLevelForm.getRawValue();
  }
  get f() {
    return this.QualificationLevelForm.controls;
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
    this.loadAllQualificationLevel();
  }

  formInit() {
    this.QualificationLevelForm = this.fb.group({
      QualificationLevelCode: [{ value: null, disabled: true }],
      LevelName: [
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

  getRowQualificationLevel(data: any) {
    this.isUpdate = true;
    this.QualificationLevelForm.patchValue({ ...data });
  }

  loadAllQualificationLevel() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.QualificationLevel).subscribe({
      next: (res: any) => {
        this.QualificationLevelList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateQualificationLevel();
    else this.saveQualificationLevel();
  }

  saveQualificationLevel() {
    if (this.QualificationLevelForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.QualificationLevelForm
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
    let payLoad = { ...this.QualificationLevelFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.QualificationLevel)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Qualification Level Saved Successfully!',
          type: NotificationType.success,
        });
        this.QualificationLevelForm.reset();
        this.loadAllQualificationLevel();
      });
  }

  updateQualificationLevel() {
    let payLoad = { ...this.QualificationLevelFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.QualificationLevel)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Qualification Level Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.QualificationLevelForm.reset();
        this.loadAllQualificationLevel();
      });
  }

  deleteQualificationLevel(QualificationLevelCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Qualification Level?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.QualificationLevel + `/${QualificationLevelCode}`
          )
          .subscribe((res) => {
            this.loadAllQualificationLevel();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Qualification Level Deleted Successfully!',
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
    this.QualificationLevelForm.reset();
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
