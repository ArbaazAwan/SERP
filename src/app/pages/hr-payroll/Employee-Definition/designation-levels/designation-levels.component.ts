import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-designation-levels',
  templateUrl: './designation-levels.component.html',
  styleUrls: ['./designation-levels.component.scss'],
})
export class DesignationLevelsComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  designationlevelslist: any = [];
  globalUserId!: number;
  DesignationLevelCode: any;
  isUpdate!: boolean;
  designationlevelsform!: FormGroup;
  loadingerror = false;
  isToastShown = false;
  get designationlevelsformValue() {
    return this.designationlevelsform.getRawValue();
  }
  get f() {
    return this.designationlevelsform.controls;
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
    //=====================Get User Rights ================
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.loadAlldesignationlevels();
  }

  formInit() {
    this.designationlevelsform = this.fb.group({
      DesignationLevelCode: [{ value: null, disabled: true }],
      DesignationLevelName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      ShortName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }

  getRowdesignationlevels(data: any) {
    this.isUpdate = true;
    this.designationlevelsform.patchValue({ ...data });
  }

  loadAlldesignationlevels() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.DesignationLevels).subscribe({
      next: (res: any) => {
        this.designationlevelslist = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updatedesignationlevels();
    else this.savedesignationlevels();
  }

  savedesignationlevels() {
    debugger;
    if (this.designationlevelsform.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(
        this.designationlevelsform
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
    let payLoad = { ...this.designationlevelsformValue };
    payLoad.CreatedBy = this.globalUserId;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.DesignationLevels)
      .subscribe((res) => {
        this.toastService.sendMessage({
          title: 'Success',
          message: 'Designation Level Saved Successfully!',
          type: NotificationType.success,
        });
        this.designationlevelsform.reset();
        this.loadAlldesignationlevels();
      });
  }

  updatedesignationlevels() {
    let payLoad = { ...this.designationlevelsformValue };
    payLoad.ModifiedBy = this.globalUserId;
    this.apiService
      .update(payLoad, ApiEndpoints.DesignationLevels)
      .subscribe((res) => {
        this.toastService.sendMessage({
          title: 'Success',
          message: 'Designation Level Updated Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.designationlevelsform.reset();
        this.loadAlldesignationlevels();
      });
  }

  deletedesignationlevels(DesignationLevelCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete Designation Level?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DesignationLevels + `/${DesignationLevelCode}`)
          .subscribe((res) => {
            this.loadAlldesignationlevels();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Designation Level Deleted Successfully!',
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
    this.designationlevelsform.reset();
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
