import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss'],
})
export class DistrictComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  Districtresponse$: any = [];
  Provinceresponse$: any = [];
  Cityresponse$: any = [];
  globalBranchCode!: number;
  globalUserCode!: number;
  DistrictCode: any;
  isUpdate!: boolean;
  districtform!: FormGroup;
  loadingerror = false;
  selectedProvince!: number;
  selectedCity!: number;
  isToastShown = false;

  get districtformValue() {
    return this.districtform.getRawValue();
  }
  get f() {
    return this.districtform.controls;
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
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadAllCities();
    this.loadAllProvinces();
    this.loadAllDistricts();
  }

  formInit() {
    this.districtform = this.fb.group({
      DistrictCode: [null],
      BranchCode: [null],
      ProvinceCode: ['', Validators.required],
      CityCode: ['', Validators.required],
      DistrictName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
    });
  }

  getRowDistrict(data: any) {
    
    this.isUpdate = true;
    this.districtform.patchValue({ ...data });
  }

  loadAllDistricts() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.District + `/${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.Districtresponse$ = res.data;
        this.isLoadingData = false;
      });
  }

  loadAllCities() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.City + `/${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.Cityresponse$ = res.data;
        this.isLoadingData = false;
      });
  }
  loadAllProvinces() {
    this.apiService.get(ApiEndpoints.getAllProvinces).subscribe((res: any) => {
      this.Provinceresponse$ = res;
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateDistrict();
    else this.saveDistrict();
  }

  saveDistrict() {
    
    if (this.districtform.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.districtform);
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
    let payLoad = { ...this.districtformValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.District).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New District Name Saved Successfully!',
        type: NotificationType.success,
      });
      this.districtform.reset();
      this.loadAllDistricts();
    });
  }

  updateDistrict() {
    let payLoad = { ...this.districtformValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    this.apiService.update(payLoad, ApiEndpoints.District).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'District Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.districtform.reset();
      this.loadAllDistricts();
    });
  }

  deleteDistrict(DistrictCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this District?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.District + `/${DistrictCode}`)
          .subscribe((res) => {
            this.loadAllDistricts();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Districts Deleted Successfully!',
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

  changeProvince(e: any) {
    this.selectedProvince = +e.target.value;
  }
  changeCity(e: any) {
    this.selectedCity = +e.target.value;
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.isUpdate = false;
    this.districtform.reset();
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
