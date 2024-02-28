import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import {
  IEmployeeApplicantView,
  IEmployeeSetup,
} from 'src/app/_shared/model/HR-Payroll';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { BasicinfoComponent } from './basicinfo/basicinfo.component';
import { FileuploadService } from 'src/app/_shared/services/file-upload.service';
import { Column } from 'src/app/_shared/model/model';
@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.scss'],
})
export class EmployeeRegistrationComponent implements OnInit {
  @Input() isUpdate: boolean = false;
  @Input() selectedRow: any;
  @ViewChild(BasicinfoComponent) basicInfoComponent!: BasicinfoComponent;
  generalForm!: FormGroup;
  employeeregistration: any = [];
  selectedTab!: any;
  employee: any = [];
  QualificationCode: any = [];
  employeeCode: number = 0;
  selecteEmployee!: number;
  EmployeData$: any = [];
  employeeTypes: any = [];
  genders: any = [];
  bloodGroups: any = [];
  nationalities: any = [];
  religions: any = [];
  maritalStatuses: any = [];
  jobLevels: any = [];
  designations: any = [];
  departments: any = [];
  departmentDivisions: any = [];
  cities: any = [];
  presentDistricts: any = [];
  countries: any = [];
  states: any = [];
  timeZones: any = [];
  disabilityNatures: any = [];
  loadingerror: boolean = false;
  datePipe = new DatePipe('en-US');
  UserId: any;
  ModulelistResp$: any = [];
  activeIndex: number = 0;
  globalBranchCode!: number;
  isToastShown: boolean = false;
  mainHeader!: string;
  mainDialog!: boolean;
  isLoadingData: boolean = false;
  EmployeeApplicantList: IEmployeeApplicantView[] = [];
  filteredEmployeeApplicantList: IEmployeeApplicantView[] = [];
  searchInputValue: string = '';

  isFilterApplied: boolean = false;
  cols: Column[] = [
    { header: 'Employee Name', field: 'EmployeeName' },
    { header: 'CNIC', field: 'CNIC' },
    { header: 'Designation', field: 'DesignationName' },
    { header: 'Status', field: 'ApplicantStatus' },
    { header: 'Action', field: 'action' },
  ];

  //Form Properties --------------------------------
  get BasicInfoForm(): FormGroup {
    return this.generalForm.get('BasicInfoForm') as FormGroup;
  }
  get PersonalInfoForm(): FormGroup {
    return this.generalForm.get('PersonalInfoForm') as FormGroup;
  }
  get ProfessionalExForm(): FormGroup {
    return this.generalForm.get('ProfessionalExForm') as FormGroup;
  }
  get QualificationForm(): FormGroup {
    return this.generalForm.get('QualificationForm') as FormGroup;
  }
  get TrainingForm(): FormGroup {
    return this.generalForm.get('TrainingForm') as FormGroup;
  }
  get Addresses(): FormGroup {
    return this.generalForm.get('Addresses') as FormGroup;
  }
  get PresentAddressForm(): FormGroup {
    return this.Addresses.get('PresentAddressForm') as FormGroup;
  }
  get PermanentAddressForm(): FormGroup {
    return this.Addresses.get('PermanentAddressForm') as FormGroup;
  }

  constructor(
    private _fb: FormBuilder,
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _utilityService: UtilityService,
    private _fileUploadService: FileuploadService
  ) {
    this.generalFormInit();
  }

  ngOnInit(): void {
    const data = history.state.data;
    if (data) {
      this.patchFormValues({ ...data });
    }

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.getUserRights();
    this.loadAllEmployeeDefinitions();
    this.getAllEmployeeApplicant();
  }

  patchFormValues(data: any) {
    this.isUpdate = true;
    data.DateOfBirth = this.datePipe.transform(data.DateOfBirth, 'yyyy-MM-dd');
    data.DateOfJoining = this.datePipe.transform(
      data.DateOfJoining,
      'yyyy-MM-dd'
    );
    data.CNICValidityDate = this.datePipe.transform(
      data.CNICValidityDate,
      'yyyy-MM-dd'
    );
    this.BasicInfoForm.patchValue(data);
    this.PersonalInfoForm.patchValue(data);
    this.PresentAddressForm.patchValue(data);
    this.PermanentAddressForm.patchValue(data);
  }

  getUserRights() {
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 4;
    const FormId = 2;
    this._apiService
      .get(
        ApiEndpoints.GetUserFormRights +
          '?UserId=' +
          UserId +
          '&ModuleId=' +
          ModuleId +
          '&FormId=' +
          FormId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
  }

  refresh() {
    this.isUpdate = false;
    this.generalFormInit();
    this.basicInfoComponent.clearFile();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  loadAllEmployeeDefinitions() {
    this.LoadAllEmployeeType();
    this.LoadAllGender();
    this.LoadAllBloodGroup();
    this.LoadAllNationality();
    this.LoadAllNatureOfDisabilities();
    this.LoadAllReligions();
    this.LoadAllMaritalStatus();
    this.LoadAllDepartment();
    this.LoadAllDesignation();
    this.LoadAllCities();
    this.LoadAllCountries();
    this.LoadAllStates();
    this.LoadAllTimeZones();
  }

  LoadAllEmployeeType() {
    this._apiService.get(ApiEndpoints.EmployeeType).subscribe((res: any) => {
      this.employeeTypes = res.data;
    });
  }

  LoadAllTimeZones() {
    this._apiService.get(ApiEndpoints.GetAllTimeZones).subscribe({
      next: (timeZones: any) => {
        this.timeZones = timeZones;
      },
      error: (err: any) => {},
    });
  }

  LoadAllGender() {
    this._apiService.get(ApiEndpoints.Gender).subscribe((res: any) => {
      this.genders = res.data;
    });
  }

  LoadAllBloodGroup() {
    this._apiService.get(ApiEndpoints.BloodGroups).subscribe((res: any) => {
      this.bloodGroups = res.data;
    });
  }

  LoadAllNationality() {
    this._apiService
      .get(ApiEndpoints.GET_ALL_NATIONALITIES)
      .subscribe((res) => {
        this.nationalities = res;
      });
  }

  LoadAllReligions() {
    this._apiService.get(ApiEndpoints.Religion).subscribe((res: any) => {
      this.religions = res.data;
    });
  }

  LoadAllMaritalStatus() {
    this._apiService.get(ApiEndpoints.MaritalStatus).subscribe((res: any) => {
      this.maritalStatuses = res.data;
    });
  }

  LoadAllNatureOfDisabilities() {
    this._apiService
      .get(ApiEndpoints.DisabilityNature)
      .subscribe((res: any) => {
        this.disabilityNatures = res.data;
      });
  }

  LoadAllDesignation() {
    this._apiService.get(ApiEndpoints.Designation).subscribe((res: any) => {
      this.designations = res.data;
    });
  }

  LoadAllDepartment() {
    this._apiService
      .get(ApiEndpoints.GetAllDepartmentsList)
      .subscribe((res: any) => {
        this.departments = res.data;
      });
  }

  LoadAllCities() {
    this._apiService.get(ApiEndpoints.City).subscribe((res: any) => {
      this.cities = res.data;
    });
  }

  LoadAllCountries() {
    this._apiService.get(ApiEndpoints.Country).subscribe((res: any) => {
      this.countries = res.data;
    });
  }

  LoadAllStates() {
    this._apiService.get(ApiEndpoints.States).subscribe((res: any) => {
      this.states = res.data;
    });
  }

  addorUpdate() {
    if (!this.isUpdate) {
      this.add();
    } else {
      this.updateAllow();
    }
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.save();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

  save() {
    debugger
    if (this.BasicInfoForm.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(this.BasicInfoForm);
      if (!this.isToastShown) {
        this._toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      this.activeIndex = 0;
      return;
    }

    const basicForm = this.BasicInfoForm.getRawValue();
    const personalForm = this.PersonalInfoForm.getRawValue();
    const presentForm = this.PresentAddressForm.getRawValue();
    const permanentForm = this.PermanentAddressForm.getRawValue();
    const selectedFile = this.basicInfoComponent.selectedFile;

    const model: IEmployeeSetup = {
      ...basicForm,
      ...personalForm,
      ...presentForm,
      ...permanentForm,
    };
    this.datePipe.transform(model.CNICValidityDate, 'MMM-d-y');
    this.datePipe.transform(model.DateOfJoining, 'MMM-d-y');
    this.datePipe.transform(model.DateOfBirth, 'MMM-d-y');


    this._fileUploadService.saveDataWithDocument(ApiEndpoints.EmployeeSetup, model, selectedFile)
    .subscribe((res: any) => {
      this.BasicInfoForm.get('EmployeeCode')?.setValue(res[0].EmployeeCode);
      this.isUpdate = true;
      this._toastService.sendMessage({
        message: 'Employee Saved Successfully!',
        type: NotificationType.success,
      });
      // this.generalFormInit();
    });
  }

  update() {
    if (this.BasicInfoForm.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(this.BasicInfoForm);
      if (!this.isToastShown) {
        this._toastService.sendMessage({
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

    const basicForm = this.BasicInfoForm.getRawValue();
    const personalForm = this.PersonalInfoForm.getRawValue();
    const presentForm = this.PresentAddressForm.getRawValue();
    const permanentForm = this.PermanentAddressForm.getRawValue();
    const selectedFile = this.basicInfoComponent.selectedFile;

    const model: IEmployeeSetup = {
      ...basicForm,
      ...personalForm,
      ...presentForm,
      ...permanentForm,
    };

    this.datePipe.transform(model.CNICValidityDate, 'MMM-d-y');
    this.datePipe.transform(model.DateOfJoining, 'MMM-d-y');
    this.datePipe.transform(model.DateOfBirth, 'MMM-d-y');

    this._fileUploadService.updateDataWithDocument(ApiEndpoints.EmployeeSetup, model, selectedFile)
    .subscribe({
      next: (res) => {
        this._toastService.sendMessage({
          message: 'Employee Updated Successfully!',
          type: NotificationType.success,
        });
        // this.refresh();
      },
      error: (err) => {
        this._toastService.sendMessage({
          message: 'Error Occured while Employee Update!',
          type: NotificationType.error,
        });
      },
      complete: () => {}
    });
  }

  generalFormInit() {
    this.generalForm = this._fb.group({
      BasicInfoForm: this._fb.group({
        EmployeeCode: [{ value: null, disabled: true }],
        ApplicantCode: [null],
        EmployeeName: [null, Validators.required],
        FatherName: [null, Validators.required],
        CNIC: [null, Validators.required],
        GenderCode: [null, Validators.required],
        Mobile: [null, Validators.required],
        TimeZone: [null, Validators.required],
        HealthInsuranceCardNo: [null],
        DateOfBirth: [null, Validators.required],
        EmployeeTypeCode: [null, Validators.required],
        DepartmentCode: [null, Validators.required],
        DesignationCode: [null, Validators.required],
        AttendifyEmployeeId: [null],
      }),

      PersonalInfoForm: this._fb.group({
        CNICValidityDate: [null],
        EOBINo: [null],
        SSNo: [null],
        PlaceOfBirth: [null],
        BloodGroupCode: [null],
        NationalityCode: [null],
        ReligionCode: [null],
        MaritalStatusCode: [null],
        Email: [null],
        EmergencyContactNos: [null],
        DateOfJoining: [null],
        JDDelivered: [false],
        KPIDelivered: [false],
        PassportNo: [null],
        PassportValidityDate: [null],
        NTN: [null],
        Disability: [false],
        DisabilityNatureCode: [{ value: null, disabled: true }],
        Remarks: [null],
      }),

      Addresses: this._fb.group({
        PresentAddressForm: this._fb.group({
          PresentAddress: [null],
          PresentAddressPhoneNo: [null],
          PresentCountryCode: [null],
          PresentStateCode: [null],
          PresentCityCode: [null],
        }),
        PermanentAddressForm: this._fb.group({
          PermanentAddress: [null],
          PermanentAddressPhoneNo: [null],
          PermanentCountryCode: [null],
          PermanentStateCode: [null],
          PermanentCityCode: [null],
        }),
      }),

      ProfessionalExForm: this._fb.group({
        ExperiencesCode: [null],
        JobTitle: [null, Validators.required],
        CompanyName: [null, Validators.required],
        StartDate: [null, Validators.required],
        EndDate: [null, Validators.required],
        Address: [null],
        Salary: [null, Validators.min(0)],
        ReasonForLeaving: [null],
        ContactWithPreviousCompany: [false],
        Remarks: [null],
      }),

      QualificationForm: this._fb.group({
        QualificationCode: [null],
        EmployeeCode: [null],
        QualificationLevelCode: [null, Validators.required],
        DegreeTitle: [
          null,
          [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
        ],
        InstitutionName: [
          null,
          [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
        ],
        BoardOrUniversityName: [
          null,
          [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
        ],
        Subject: [
          null,
          [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
        ],
        PassingYear: [null],
        DivisionOrGrade: [null],
        DocumentsPath: [null],
        CreatedBy: [null],
        CreatedOn: [null],
        ModifiedBy: [null],
        ModifiedOn: [null],
      }),

      TrainingForm: this._fb.group({
        EmployeeCode: [null],
        TrainingCode: [null],
        TrainingTitle: [null, Validators.required],
        Duration: [null],
        Institute: [null],
        Completion: [false],
      }),
    });
  }

  openNew() {
    this.mainHeader = 'Import Employee';
    this.mainDialog = true;
    this.isUpdate = false;
  }

  getAllEmployeeApplicant() {
    this.isLoadingData = true;
    this._apiService.get(ApiEndpoints.EmployeeApplicant).subscribe({
      next: (res: any) => {
        this.EmployeeApplicantList = res.data;
      },
      error: (err) => {
        this._toastService.sendMessage({
          message: 'Error Occured while loading EmployeeApplicants',
          type: NotificationType.error,
        });
      },
      complete: () => {
        this.isLoadingData = false;
      },
    });
  }

  filterEmployeeApplicant(event: any){
    let searchText = event.target.value;
    if(!!searchText){
      this.isLoadingData = true;
      this._apiService.get(ApiEndpoints.EmployeeApplicant + `/search/${searchText}`)
      .subscribe({
        next: (res: any) => {
          this.filteredEmployeeApplicantList = res.data;
        },
        error: (err) => {
        },
        complete: () => {
          this.isLoadingData = false;
        },
      });
      this.isFilterApplied = true;
      searchText = '';
    }
    else{
      this.filteredEmployeeApplicantList = this.EmployeeApplicantList
    }
  }

  importApplicantData(data: any) {
    this.generalFormInit();
    data.DateOfBirth = this.datePipe.transform(
      data.DateOfBirth,
      'yyyy-MM-dd'
    );
    data.DateOfJoining = this.datePipe.transform(
      data.DateOfJoining,
      'yyyy-MM-dd'
    );
    this.BasicInfoForm.patchValue(data);
    this.PersonalInfoForm.patchValue(data);
    this.PresentAddressForm.patchValue(data);
    this.PermanentAddressForm.patchValue(data);
    this.mainDialog = false;
    this.searchInputValue = '';
    this.filteredEmployeeApplicantList = this.EmployeeApplicantList;
  }

  clearSearchInput() {
    this.searchInputValue = '';
    this.filteredEmployeeApplicantList = this.EmployeeApplicantList;
  }
}
