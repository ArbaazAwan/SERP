import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  countryResponse$: any = [];
  globalUserId! : number;
  CountryCode: any;
  isUpdate!: boolean;
  Countryform!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get countryFormValue() {return this.Countryform.getRawValue();}
  get f() {return this.Countryform.controls;}

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private utilityService: UtilityService,
   ) {
    this.formInit();
   }

  ngOnInit(): void {
    //=====================Get User Rights ================
    this.globalUserId = +localStorage.getItem('UserId')!
    this.loadAllCountries();
  }

  formInit() {
    this.Countryform = this.fb.group({
      CountryCode: [{value: null, disabled: true}],
      CountryName: [null,[Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      ShortName: [null,[Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }

  getRowCountry(data: any) {
    this.isUpdate = true;
    this.Countryform.patchValue({ ...data });
  }

  loadAllCountries() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Country).subscribe({
      next :(res: any) => {
        this.countryResponse$ = res.data;
        this.isLoadingData = false;
      },
      error: (err) =>{
        this.isLoadingData = false;
      }
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateCountry();
    else this.saveCountry();
  }

  saveCountry() {
    
    if (this.Countryform.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.Countryform);
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
    let payLoad = { ...this.countryFormValue };
    payLoad.CreatedBy = this.globalUserId;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.Country).subscribe((res) => {
      this.toastService.sendMessage({
        title: 'Success',
        message: 'Country Saved Successfully!',
        type: NotificationType.success,
      });
      this.Countryform.reset();
      this.loadAllCountries();
    });
  }

  updateCountry() {
    let payLoad = { ...this.countryFormValue };
    payLoad.ModifiedBy = this.globalUserId;
    this.apiService.update(payLoad, ApiEndpoints.Country).subscribe((res) => {
      this.toastService.sendMessage({
        title: 'Success',
        message: 'Country Updated Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.Countryform.reset();
      this.loadAllCountries();
    });
  }

  deleteCountry(CountryCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete Country?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.Country+ `/${CountryCode}`)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              title: 'Deleted',
              message: 'Country Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllCountries();
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
    this.Countryform.reset();
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
