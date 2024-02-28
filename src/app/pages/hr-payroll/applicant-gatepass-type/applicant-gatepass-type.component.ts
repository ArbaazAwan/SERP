import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { IGatepassType } from 'src/app/_shared/model/HR-Payroll';
import { Column } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-applicant-gatepass-type',
  templateUrl: './applicant-gatepass-type.component.html',
  styleUrls: ['./applicant-gatepass-type.component.scss'],
})
export class ApplicantGatepassTypeComponent implements OnInit {
  componentName: string = 'Applicant Gate Pass Type';
  gatepassTypeForm!: FormGroup;
  gatePassTypeList: IGatepassType[] = [];
  isUpdate: boolean = false;
  isModalOpen:boolean = true;
  isLoadingTable:boolean = false;
  cols: Column[] = [
    { header: 'Gatepass Type', field: 'GatepassType' },
    { header: 'For Employment', field: 'IsForEmployment' },
    { header: 'Is Active', field: 'IsActive' },
    { header: 'Action', field: 'action' },
  ];
  globalUserId!: number;

  get formValue() {
    return this.gatepassTypeForm.getRawValue();
  }

  constructor(
    private _fb: FormBuilder,
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _utilityService: UtilityService,
    private _confirmService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.initForm();
    this.getAllGatePassTypes();
  }

  getAllGatePassTypes() {
    this.isLoadingTable = true;
    this._apiService.get(ApiEndpoints.ApplicantGatePassType)
    .subscribe({
      next: (res: any) => {
        this.gatePassTypeList = res;
      },
      error: (error: any) => {
        this._toastService.sendMessage({
          message:"Error Occured While Fetching Gate Pass Types",
          type: NotificationType.error
        });
      },
      complete: () => {
        this.isLoadingTable = false;
      }
    });
  }

  postApplicantGatePassTypes(payLoad: IGatepassType){
    this._apiService.post(payLoad, ApiEndpoints.ApplicantGatePassType)
    .subscribe({
      next: (res:any) => {
        if(!!res){
          this._toastService.sendMessage({
            message: 'Application Gate Pass Type Created Successfully',
            type: NotificationType.success,
          });
          this.refresh();
          this.getAllGatePassTypes();
        } else {
          this._toastService.sendMessage({
            message: 'Error Occured While Creating Application Gate Pass Type',
            type: NotificationType.error,
          });
        }
      },
      error: (err:any) => {
        this._toastService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    })
  }

  updateApplicantGatePassTypes(payLoad: IGatepassType){
    this._apiService.update(payLoad, ApiEndpoints.ApplicantGatePassType)
    .subscribe({
      next: (res:any) => {
        if(!!res){
          this._toastService.sendMessage({
            message: 'Application Gate Pass Type Updated Successfully',
            type: NotificationType.success,
          });
          this.refresh();
          this.getAllGatePassTypes();
        } else {
          this._toastService.sendMessage({
            message: 'Error Occured While Updating Application Gate Pass Type',
            type: NotificationType.error,
          });
        }
      },
      error: (err:any) => {
        this._toastService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    })
  }

  deleteApplicantGatePassType(id:number){
    this._apiService.delete(ApiEndpoints.ApplicantGatePassType + `/${id}`)
    .subscribe({
      next: (res:any) => {
        if(!!res){
          this._toastService.sendMessage({
            message: 'Application Gate Pass Type Deleted Successfully',
            type: NotificationType.error,
            title: 'Deleted',
          });
          this.refresh();
          this.getAllGatePassTypes();
        } else {
          this._toastService.sendMessage({
            message: 'Error Occured While Deleting Application Gate Pass Type',
            type: NotificationType.error,
          });
        }
      },
      error: (err:any) => {
        this._toastService.sendMessage({
          message: err.error.message,
          type: NotificationType.error,
        });
      }
    })
  }

  initForm(): void {
    this.gatepassTypeForm = this._fb.group({
      GatepassTypeCode: [null],
      GatepassType: [null, Validators.required],
      IsForEmployment: [false],
      IsActive: [true],
      CreatedBy: [null],
      ModifiedBy: [null],
    });
  }

  onEdit(applicantGatePass: IGatepassType){
    this.isUpdate = true;
    this.gatepassTypeForm.patchValue({...applicantGatePass});
  }

  onDelete(id:number) {
    this._confirmService.confirm({
      message: `Want to delete this Applicant Gate Pass Type?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteApplicantGatePassType(id);
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

  onSubmit(): void {
    if (this.gatepassTypeForm.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(
        this.gatepassTypeForm
      );
      this._toastService.sendMessage({
        message: 'Please Check All Fields',
        type: NotificationType.error,
        title: 'Invalid Form',
      });
      return;
    }
    let payLoad: IGatepassType = {...this.formValue};
    if(this.isUpdate){
      payLoad.ModifiedBy = this.globalUserId;
      this.updateApplicantGatePassTypes(payLoad);
    }else{
      payLoad.CreatedBy = this.globalUserId;
      this.postApplicantGatePassTypes(payLoad);
    }

  }

  refresh(){
    this.isUpdate = false;
    this.initForm();
  }
}
