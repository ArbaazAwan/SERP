import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-allowance-deduction',
  templateUrl: './allowance-deduction.component.html',
  styleUrls: ['./allowance-deduction.component.scss'],
})
export class AllowanceDeductionComponent implements OnInit {
  componentName: string = 'Allowance & Deduction';
  userAuthorization: any;
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  typelist: any = [];
  AllowanceDeductionList: any = [];
  globalUserCode!: number;
  CityCode: any;
  isUpdate!: boolean;
  form!: FormGroup;
  loadingerror = false;
  selectedState!: number;
  selectedCountry!: number;
  isToastShown = false;

  get formValue() {
    return this.form.getRawValue();
  }
  get f() { return this.form.controls; }


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
    this.loadAllTypes();
    this.loadAllAllowanceDeduction();
  }

  formInit() {
    this.form = this.fb.group({
      AllowanceDeductionId: [{ value: null, disabled: true }],
      TypeID: ['', Validators.required],
      AllowanceDeductionName: [
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

  getRowCity(data: any) {
    debugger
    this.isUpdate = true;
    this.form.patchValue({ ...data });
  }

  loadAllTypes() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.City).subscribe({
      next :(res: any) => {
        this.typelist = res.data;
        this.isLoadingData = false;
      },
      error: (err) =>{
        this.isLoadingData = false;
      }
    });
  }

  loadAllAllowanceDeduction() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Country).subscribe({
      next :(res: any) => {
        this.AllowanceDeductionList = res.data;
        this.isLoadingData = false;
      },
      error: (err) =>{
        this.isLoadingData = false;
      }
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateCity();
    else this.saveCity();
  }

  saveCity() {
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
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
    let payLoad = { ...this.formValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.City).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Allowance / Deduction Saved Successfully!',
        type: NotificationType.success,
      });
      this.form.reset();
      this.loadAllAllowanceDeduction();
    });
  }

  updateCity() {
    let payLoad = { ...this.formValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService.update(payLoad, ApiEndpoints.City).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Allowance / Deduction Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.form.reset();
      this.loadAllAllowanceDeduction();
    });
  }

  deleteCity(AllowanceDeductionId: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Allowance / Deduction?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.City + `/${AllowanceDeductionId}`)
          .subscribe((res) => {
            this.loadAllAllowanceDeduction();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'City Deleted Successfully!',
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
    this.formInit();
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
