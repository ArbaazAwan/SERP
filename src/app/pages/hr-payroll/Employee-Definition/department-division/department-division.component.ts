import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-department-division',
  templateUrl: './department-division.component.html',
  styleUrls: ['./department-division.component.scss'],
})
export class DepartmentDivisionComponent implements OnInit {

  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  Divisionresponse$: any = [];
  globalBranchCode!: number;
  globalUserCode!: number;
  DivisionCode: any;
  isUpdate!: boolean;
  divisionForm!: FormGroup;
  loadingerror = false;
  isToastShown = false;

  get divisionFormValue() {
    return this.divisionForm.getRawValue();
  }
  get f() { return this.divisionForm.controls; }

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
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.getAllDivision();
  }

  formInit() {
    this.divisionForm = this.fb.group({
      DivisionCode: [{ value: null, disabled: true }],
      BranchCode: [null],
      DivisionName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      ShortName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
    });
  }

  getRowDivision(data: any) {
    this.isUpdate = true;
    this.divisionForm.patchValue({ ...data });
  }

  getAllDivision() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.Division + `/${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.Divisionresponse$ = res.data;
        this.isLoadingData = false;
      });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateDivision();
    else this.saveDivision();
  }

  saveDivision() {
    
    if (this.divisionForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.divisionForm);
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
    let payLoad = { ...this.divisionFormValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.Division).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New Department Divsion Saved Successfully!',
        type: NotificationType.success,
      });
      this.divisionForm.reset();
      this.getAllDivision();
    });
  }

  updateDivision() {
    let payLoad = { ...this.divisionFormValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    this.apiService.update(payLoad, ApiEndpoints.Division).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Department Divsion Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.divisionForm.reset();
      this.getAllDivision();
    });
  }

  deleteDivision(DivisionCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Department Divsion?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.Division + `/${DivisionCode}`)
          .subscribe((res) => {
            this.getAllDivision();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Department Divsion Deleted Successfully!',
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
    this.divisionForm.reset();
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
