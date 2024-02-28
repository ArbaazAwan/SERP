import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';


@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent implements OnInit {

  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  countryList: any = [];
  statesList: any = [];
  globalUserCode! : number;
  StateCode: any;
  isUpdate!: boolean;
  statesForm!: FormGroup;
  loadingerror = false;
  selectedCountry!: number;
  isToastShown = false;

  get statesFormValue() {return this.statesForm.getRawValue();}
  get f() {return this.statesForm.controls;}

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
    this.loadAllStates();
    this.loadAllCountry();
  }

  formInit() {
    this.statesForm = this.fb.group({
      StateCode: [{ value: null, disabled: true }],
      CountryCode: ['', Validators.required],
      StateName: [null,[Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }

  getRowStates(data: any) {
    debugger
    this.isUpdate = true;
    this.statesForm.patchValue({ ...data });
  }

  loadAllStates() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.States).subscribe({
      next :(res: any) => {
        this.statesList = res.data;
        this.isLoadingData = false;
      },
      error: (err) =>{
        this.isLoadingData = false;
      }
    });
  }

  loadAllCountry() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Country).subscribe({
      next :(res: any) => {
        this.countryList = res.data;
        this.isLoadingData = false;
      },
      error: (err) =>{
        this.isLoadingData = false;
      }
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateState();
    else this.saveState();
  }

  saveState() {
    if (this.statesForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.statesForm);
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
    let payLoad = { ...this.statesFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.States).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New State Name Saved Successfully!',
        type: NotificationType.success,
      });
      this.statesForm.reset();
      this.loadAllStates();
    });
  }

  updateState() {
    let payLoad = { ...this.statesFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService.update(payLoad, ApiEndpoints.States).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'State Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.statesForm.reset();
      this.loadAllStates();
    });
  }

  deleteStates(StateCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this State?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.States + `/${StateCode}`)
          .subscribe((res) => {
            this.loadAllStates();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'State Deleted Successfully!',
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


  changeCountry(e: any) {
    this.selectedCountry = +e.target.value;
  }

  refresh() {
    this.isUpdate = false;
    this.statesForm.reset();
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
