import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-blood-group',
  templateUrl: './blood-group.component.html',
  styleUrls: ['./blood-group.component.scss'],
})
export class BloodGroupComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  BloodGroupList: any = [];
  globalUserCode!: number;
  isUpdate!: boolean;
  bloodGroupForm!: FormGroup;
  isToastShown = false;

  get bloodGroupFormValue() {
    return this.bloodGroupForm.getRawValue();
  }
  get f() {
    return this.bloodGroupForm.controls;
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
    this.getAllBloodGroup();
  }

  formInit() {
    this.bloodGroupForm = this.fb.group({
      BloodGroupCode: [{ value: null, disabled: true }],
      BloodGroupName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s+-]+$/)],
      ],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }

  getRowBloodGroup(data: any) {
    this.isUpdate = true;
    this.bloodGroupForm.patchValue({ ...data });
  }

  getAllBloodGroup() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.BloodGroups).subscribe({
      next: (res: any) => {
        this.BloodGroupList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdateBloodGroup() {
    // if (this.isUpdate) this.updateBloodGroup();
    // else this.saveBloodGroup();

    this.isUpdate ? this.updateBloodGroup() : this.saveBloodGroup();

  }

  saveBloodGroup() {
    if (this.bloodGroupForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.bloodGroupForm);
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
    let payLoad = { ...this.bloodGroupFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.BloodGroups).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New Blood Group Name Saved Successfully!',
        type: NotificationType.success,
      });
      this.bloodGroupForm.reset();
      this.getAllBloodGroup();
    });
  }

  updateBloodGroup() {
    let payLoad = { ...this.bloodGroupFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.BloodGroups)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Blood Group Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.bloodGroupForm.reset();
        this.getAllBloodGroup();
      });
  }

  deleteBloodGroup(BloodGroupCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Blood Group?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.BloodGroups + `/${BloodGroupCode}`)
          .subscribe((res) => {
            this.getAllBloodGroup();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Blood Group Deleted Successfully!',
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
    this.bloodGroupForm.reset();
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
