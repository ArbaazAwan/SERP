import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-employee-bank',
  templateUrl: './employee-bank.component.html',
  styleUrls: ['./employee-bank.component.scss']
})
export class EmployeeBankComponent implements OnInit {
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  cityList: any = [];
  globalUserCode!: number;
  CityCode: any;
  isUpdate!: boolean;
  cityForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get cityFormValue() { return this.cityForm.getRawValue();}
  get f() { return this.cityForm.controls; }

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
    this.loadAllCities();
  }

  formInit() {
    this.cityForm = this.fb.group({
      CityCode: [{ value: null, disabled: true }],
      CountryCode: ['', Validators.required],
      StateCode: ['', Validators.required],
      CityName: [
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
    this.cityForm.patchValue({ ...data });
  }

  loadAllCities() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.City).subscribe({
      next :(res: any) => {
        this.cityList = res.data;
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
    
    if (this.cityForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.cityForm);
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
    let payLoad = { ...this.cityFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.City).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New City Name Saved Successfully!',
        type: NotificationType.success,
      });
      this.cityForm.reset();
      this.loadAllCities();
    });
  }

  updateCity() {
    let payLoad = { ...this.cityFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService.update(payLoad, ApiEndpoints.City).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'City Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.cityForm.reset();
      this.loadAllCities();
    });
  }

  deleteCity(CityCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this City?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.City + `/${CityCode}`)
          .subscribe((res) => {
            this.loadAllCities();
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

  refresh() {
    this.isUpdate = false;
    this.cityForm.reset();
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

  hideErrorPopup() {
    this.loadingerror = false;
  }
}

