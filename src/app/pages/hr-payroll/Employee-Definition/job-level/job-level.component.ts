import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-job-level',
  templateUrl: './job-level.component.html',
  styleUrls: ['./job-level.component.scss'],
})
export class JobLevelComponent implements OnInit {
  
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  JobLevelList: any = [];
  globalUserCode!: number;
  JobLevelCode: any;
  isUpdate!: boolean;
  JobLevelForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get JobLevelFormValue() {
    return this.JobLevelForm.getRawValue();
  }
  get f() {
    return this.JobLevelForm.controls;
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
    this.loadAllJobLevel();
  }

  formInit() {
    this.JobLevelForm = this.fb.group({
      JobLevelCode: [{ value: null, disabled: true }],
      JobLevelName: [
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

  getRowJobLevel(data: any) {
    this.isUpdate = true;
    this.JobLevelForm.patchValue({ ...data });
  }

  loadAllJobLevel() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.JobLevel).subscribe({
      next: (res: any) => {
        this.JobLevelList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateJobLevel();
    else this.saveJobLevel();
  }

  saveJobLevel() {
    if (this.JobLevelForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.JobLevelForm
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
    let payLoad = { ...this.JobLevelFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.JobLevel)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Job Level Saved Successfully!',
          type: NotificationType.success,
        });
        this.JobLevelForm.reset();
        this.loadAllJobLevel();
      });
  }

  updateJobLevel() {
    let payLoad = { ...this.JobLevelFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.JobLevel)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Job Level Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.JobLevelForm.reset();
        this.loadAllJobLevel();
      });
  }

  deleteJobLevel(JobLevelCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Job Level?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.JobLevel + `/${JobLevelCode}`
          )
          .subscribe((res) => {
            this.loadAllJobLevel();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Job Level Deleted Successfully!',
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
    this.JobLevelForm.reset();
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
