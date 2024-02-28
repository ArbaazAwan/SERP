import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-disability-nature',
  templateUrl: './disability-nature.component.html',
  styleUrls: ['./disability-nature.component.scss']
})
export class DisabilityNatureComponent implements OnInit {

  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  DisabilityNatureList: any = [];
  globalUserCode!: number;
  isUpdate!: boolean;
  DisabilityNatureForm!: FormGroup;
  isToastShown = false;

  get DisabilityNatureFormValue() {
    return this.DisabilityNatureForm.getRawValue();
  }
  get f() {
    return this.DisabilityNatureForm.controls;
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
    this.getAllDisabilityNature();
  }

  formInit() {
    this.DisabilityNatureForm = this.fb.group({
      DisabilityNatureCode: [{ value: null, disabled: true }],
      DisabilityNature: [
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

  getRowDisabilityNature(data: any) {
    this.isUpdate = true;
    this.DisabilityNatureForm.patchValue({ ...data });
  }

  getAllDisabilityNature() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.DisabilityNature).subscribe({
      next: (res: any) => {
        this.DisabilityNatureList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdateDisabilityNature() {
    if (this.isUpdate) this.updateDisabilityNature();
    else this.saveDisabilityNature();
  }

  saveDisabilityNature() {
    debugger;
    if (this.DisabilityNatureForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.DisabilityNatureForm);
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
    let payLoad = { ...this.DisabilityNatureFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.DisabilityNature).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New Disability Nature Saved Successfully!',
        type: NotificationType.success,
      });
      this.DisabilityNatureForm.reset();
      this.getAllDisabilityNature();
    });
  }

  updateDisabilityNature() {
    let payLoad = { ...this.DisabilityNatureFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.DisabilityNature)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Disability Nature Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.DisabilityNatureForm.reset();
        this.getAllDisabilityNature();
      });
  }

  deleteDisabilityNature(DisabilityNatureCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Disability Nature?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DisabilityNature + `/${DisabilityNatureCode}`)
          .subscribe((res) => {
            this.getAllDisabilityNature();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Disability Nature Deleted Successfully!',
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
    this.DisabilityNatureForm.reset();
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
