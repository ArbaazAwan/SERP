import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { IEmployeeApplicant } from 'src/app/_shared/model/HR-Payroll';
import { DatePipe } from '@angular/common';
import { ApplicantGatepassReportService } from 'src/app/_shared/services/applicant-gatepass-report.service';

@Component({
  selector: 'app-employee-applicant-detail',
  templateUrl: './employee-applicant-detail.component.html',
  styleUrls: ['./employee-applicant-detail.component.scss'],
})
export class EmployeeApplicantDetailComponent implements OnInit {
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  DesignationList: any = [];
  gatepassTypelist: any = [];
  GenderList: any = [];
  BloodGroupList: any = [];
  ReligionList: any = [];
  MaritalStatusList: any = [];
  Departmentlist: any = [];
  employeeTypeList: any = [];
  applicantStatusList: any = [];

  isUpdate!: boolean;
  applicantForm!: FormGroup;
  isNotAuthorized:boolean = false;
  isToastShown:boolean = false;
  _datePipe:DatePipe = new DatePipe('en-US');
  isLoading = false;
  globalBranchName!: string;

  get applicantFormValue() {
    return this.applicantForm.getRawValue();
  }
  get f() {
    return this.applicantForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private utilityService: UtilityService,
    private _applicantGatePassReport: ApplicantGatepassReportService,
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.getAllDesignation();
    this.loadAllApplicantGatepassType();
    this.loadAllGender();
    this.getAllBloodGroup();
    this.loadAllReligion();
    this.loadAllMaritalStatus();
    this.loadAllDepartments();
    this.loadAllEmployeeType();
    this.loadAllApplicantStatus();

    let data = history.state.data;
    if (!!data) {
      this.isUpdate = true;
      data.DateOfBirth = this.parseDate(data.DateOfBirth);
      data.DateOfJoining =this.parseDate(data.DateOfJoining);
      data.GatepassDateFrom = this.parseDate(data.GatepassDateFrom);
      data.GatepassDateTo = this.parseDate(data.GatepassDateTo);
      this.applicantForm.patchValue({ ...data });
    } else {
      this.isUpdate = false;
    }
  }

  getAllDesignation() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Designation)
    .subscribe((res: any) => {
      this.DesignationList = res.data;
    });
  }

  loadAllApplicantStatus() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.EmployeeApplicantStatus)
    .subscribe((res: any) => {
      this.applicantStatusList = res.data;
    });
  }

  loadAllApplicantGatepassType() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.ApplicantGatePassType).subscribe({
      next: (res: any) => {
        this.gatepassTypelist = res;
      },
    });
  }

  loadAllGender() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Gender).subscribe({
      next: (res: any) => {
        this.GenderList = res.data;
      },
    });
  }

  getAllBloodGroup() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.BloodGroups).subscribe({
      next: (res: any) => {
        this.BloodGroupList = res.data;
      },
    });
  }

  loadAllReligion() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.Religion).subscribe({
      next: (res: any) => {
        this.ReligionList = res.data;
      },
    });
  }

  loadAllMaritalStatus() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.MaritalStatus).subscribe({
      next: (res: any) => {
        this.MaritalStatusList = res.data;
      },
    });
  }

  loadAllEmployeeType() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.EmployeeType).subscribe({
      next: (res: any) => {
        this.employeeTypeList = res.data;
      },
    });
  }

  loadAllDepartments() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.GetAllDepartmentsList)
      .subscribe((res: any) => {
        this.Departmentlist = res.data;
      });
  }

  onSubmit() {
    debugger
    if (this.applicantForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.applicantForm);
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

    if (this.isUpdate) {
      this.updateApplicant();
    }
    else{
      this.saveAppicant();
    }
  }

  saveAppicant() {
    let payLoad:IEmployeeApplicant = { ...this.applicantFormValue };
    this.apiService
      .post(payLoad, ApiEndpoints.EmployeeApplicant)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Employee Applicant Saved Successfully!',
          type: NotificationType.success,
        });
        this.formInit();
      });
  }

  updateApplicant() {
    let payLoad = { ...this.applicantFormValue };
    this.apiService
      .update(payLoad, ApiEndpoints.EmployeeApplicant)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Employee Applicant Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.formInit();
      });
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

  formInit() {
    const userId = +localStorage.getItem('UserId')!;
    this.applicantForm = this.fb.group({
      ApplicantCode: [{ value: null, disabled: true }],
      GatepassTypeCode: [null, Validators.required],
      GatepassDateFrom: ['', Validators.required],
      GatepassDateTo: ['', Validators.required],
      EmployeeName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      FatherName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      CNIC: [null, Validators.required],
      GenderCode: [null, Validators.required],
      DateOfJoining: [null, Validators.required],
      DateOfBirth: [null, Validators.required],
      Mobile: [null],
      BloodGroupCode: [null],
      ReligionCode: [null],
      MaritalStatusCode: [null],
      ApplicantStatusCode: [null],
      DepartmentCode: [null],
      DesignationCode: [null],
      EmployeeTypeCode: [null],
      PositionCode: [null],
      PresentAddress: [null],
      PresentAddressPhoneNo: [null],
      PermanentAddress: [null],
      PermanentAddressPhoneNo: [null],
      EmergencyContactNos: [null],
      Remarks: [null],
      IsActive: [true],
      CreatedBy: [userId],
      CreatedOn: [null],
      ModifiedBy: [userId],
      ModifiedOn: [null],
    });
  }

  private parseDate(date: any){
    if(!!date){
      return this._datePipe.transform(new Date(date), 'yyyy-MM-dd');
    }
    return null;
  }

  employeeApplicantPrintPDF() {
    let cnicNo = this.applicantForm.controls['CNIC'].value
    this.isLoading = true;
    this._applicantGatePassReport
      .printEmployeeApplicantReport(
        cnicNo
      ).subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.isLoading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
