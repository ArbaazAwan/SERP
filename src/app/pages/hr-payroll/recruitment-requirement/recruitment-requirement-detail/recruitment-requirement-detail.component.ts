import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { IRecruitmentRequirement } from 'src/app/_shared/model/HR-Payroll';
import { DepartmentModel, DesignationModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-recruitment-requirement-detail',
  templateUrl: './recruitment-requirement-detail.component.html',
  styleUrls: ['./recruitment-requirement-detail.component.scss'],
})
export class RecruitmentRequirementDetailComponent implements OnInit {
  recruitmentRForm!: FormGroup;
  departmentList: DepartmentModel[] = [];
  designationList: DesignationModel[] = [];
  globalUserId!: number;
  isUpdate: boolean = false;

  get rControls() {
    return this.recruitmentRForm.controls;
  }
  get formValues() {
    return this.recruitmentRForm.getRawValue();
  }

  constructor(
    private _fb: FormBuilder,
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _utilityService: UtilityService,
    private _router:Router,
    private _route:ActivatedRoute
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.getAllDepartments();
    this.getAllDesignations();

    const data = history.state.data;
    if (!!data) {
      this.isUpdate = true;
      this.recruitmentRForm.patchValue({ ...data });
    } else {
      this.isUpdate = false;
    }
  }

  getAllDepartments(): void {
    this._apiService
      .get(ApiEndpoints.GetAllDepartmentsList)
      .subscribe((res:any) => {

        this.departmentList = res.data;
      });
  }

  getAllDesignations(): void {
    this._apiService
      .get(ApiEndpoints.Designation)
      .subscribe((res:any) => {
        this.designationList = res.data;
      })
  }

  formInit(): void {
    this.recruitmentRForm = this._fb.group({
      RequirementId: [null],
      RequirementDate: [null, Validators.required],
      DepartmentCode: [null, Validators.required],
      DesignationCode: [null, Validators.required],
      SalaryFrom: [null, Validators.min(0)],
      SalaryTo: [null, Validators.min(0)],
      RequiredTillDate: [null],
      IsLocked: [false],
      IsApproved: [false],
      IsHired: [false],
      //TODO: table need to be implemented
      // RecruitmentTypeCode: [null, Validators.required],
      HiringDateTime: [null],
      EmployeeCode: [null],
      ReplacementOfEmployeeCode: [null],
    });
  }

  updateRecruitmentRequirement(payLoad: IRecruitmentRequirement) {
    this._apiService
      .update(payLoad, ApiEndpoints.EmployeeRecruitmentRequirement)
      .subscribe({
        next: (res: any) => {
          if (!!res) {
            this._toastService.sendMessage({
              message: 'Requirment Updated Successfully',
              type: NotificationType.success,
            });
            this.formInit();
          } else {
            this._toastService.sendMessage({
              message: 'Error Occured While Updating Requirement',
              type: NotificationType.error,
            });
          }
          this._router.navigate(['../recruitment-requirement'], {
            relativeTo: this._route
          });
        },
        error: (err: any) => {

          this._toastService.sendMessage({
            message: err.error.message,
            type: NotificationType.error,
          });
        },
        complete: () => {},
      });
  }

  postRecruitmentRequirement(payLoad: IRecruitmentRequirement) {
    debugger
    this._apiService
      .post(payLoad, ApiEndpoints.EmployeeRecruitmentRequirement)
      .subscribe({
        next: (res: any) => {
          if (!!res) {
            this._toastService.sendMessage({
              message: 'Requirment Created Successfully',
              type: NotificationType.success,
            });
            this.formInit();
          } else {
            this._toastService.sendMessage({
              message: 'Error Occured While Creating Requirement',
              type: NotificationType.error,
            });
          }
          this._router.navigate(['../recruitment-requirement'], {
            relativeTo: this._route
          });
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: err.error.message,
            type: NotificationType.error,
          });
        },
        complete: () => {},
      });
  }

  onSubmit() {
    if (this.recruitmentRForm.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(
        this.recruitmentRForm
      );
      this._toastService.sendMessage({
        message: 'Please Check Form Values',
        type: NotificationType.error,
        title: 'Invalid Form',
      });
      return;
    }

    let payLoad: IRecruitmentRequirement = {
      ...this.formValues,
    };

    if (this.isUpdate) {
      this.updateRecruitmentRequirement(payLoad);
    } else {
      this.postRecruitmentRequirement(payLoad);
    }
  }

  refresh() {
    this.isUpdate = false;
    this.formInit();
  }
}
