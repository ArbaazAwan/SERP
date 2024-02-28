import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss'],
})
export class DesignationComponent implements OnInit {

  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  DesignationList: any = [];
  designationlevelslist: any = [];
  globalUserCode!: number;
  DesignationCode: any;
  isUpdate!: boolean;
  DesignationForm!: FormGroup;
  loadingerror = false;
  selectedDesignationLevel!: number;
  isToastShown = false;

  get designationFormValue() {
    return this.DesignationForm.getRawValue();
  }
  get f() { return this.DesignationForm.controls; }

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
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.getAllDesignation();
    this.loadAlldesignationlevels();
  }

  formInit() {
    this.DesignationForm = this.fb.group({
      DesignationCode: [{ value: null, disabled: true }],
      DesignationLevelCode: ['', Validators.required],
      DesignationName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }

  getRowDesignation(data: any) {
    this.isUpdate = true;
    this.DesignationForm.patchValue({ ...data });
  }

  getAllDesignation() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.Designation)
      .subscribe((res: any) => {
        this.DesignationList = res.data;
        this.isLoadingData = false;
      });
  }

  loadAlldesignationlevels() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.DesignationLevels).subscribe({
      next :(res: any) => {
        this.designationlevelslist = res.data;
        this.isLoadingData = false;
      },
      error: (err) =>{
        this.isLoadingData = false;
      }
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateDesignation();
    else this.saveDesignation();
  }

  saveDesignation() {
    if (this.DesignationForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.DesignationForm);
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
    let payLoad = { ...this.designationFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.Designation).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New Designation Saved Successfully!',
        type: NotificationType.success,
      });
      this.DesignationForm.reset();
      this.getAllDesignation();
    });
  }

  updateDesignation() {
    let payLoad = { ...this.designationFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService.update(payLoad, ApiEndpoints.Designation).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Designation Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.DesignationForm.reset();
      this.getAllDesignation();
    });
  }

  deleteDesignation(DesignationCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Designation?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.Designation + `/${DesignationCode}`)
          .subscribe((res) => {
            this.getAllDesignation();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Designation Deleted Successfully!',
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
    this.DesignationForm.reset();
  }

  changeDesignationLevel(e: any) {
    this.selectedDesignationLevel = +e.target.value;
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
