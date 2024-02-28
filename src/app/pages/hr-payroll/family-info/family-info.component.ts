import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-family-info',
  templateUrl: './family-info.component.html',
  styleUrls: ['./family-info.component.scss'],
  providers: [DateFormatPipe,DatePipe],
})
export class FamilyInfoComponent implements OnInit {

  isSticky: boolean = false;
  isLoadingData: boolean = false;
  loadingerror = false;
  FamilyInfoForm!: FormGroup;
  model: any = [];
  FamilyRelationsresponse$: any = [];
  Genderresponse$: any = [];
  GetEmployeeData$: any = [];
  globalBranchCode!: number;
  globalUserCode!: number;
  isUpdate!: boolean;
  selectedFamilyRelations!: number;
  selectedGender!: number;
  selectedEmployee!: number;

  private datePipe = new DatePipe('en-US');
  selectedFormatKey!: number;


  get FamilyInfoFormValue() {
    return this.FamilyInfoForm.getRawValue();
  }
  get formatDateForInput(): string {
    return this.dateFormatPipe.transform(this.selectedFormatKey);
  }
  get f() { return this.FamilyInfoForm.controls; }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private utilityService: UtilityService,
    private dateFormatPipe:DateFormatPipe,
    private datesPipe: DatePipe,
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.loadAllCompanyConfig();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadAllFamilyRelations();
    this.LoadAllGender();
    const defaultEmployeeCode = -1;
    this.LoadAllEmployeeData(defaultEmployeeCode);
  }

  formInit() {
    this.FamilyInfoForm = this.fb.group({
      FamilyInfoCode: [null],
      BranchCode: [null],
      EmployeeCode: [null, Validators.required],
      FamilyRelationCode: [null, Validators.required],
      GuardianName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      GenderCode: [null, Validators.required],
      IDCard: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      DOB: [null, Validators.required],
      PhoneNumber: [null, [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedOn: [null],
      ModifiedBy: [null],
    });
  }

  LoadAllEmployeeData(EmployeeCode: number) {
    this.apiService
      .get(ApiEndpoints.EmployeeSetup + `/${EmployeeCode}`)
      .subscribe((res) => {
        this.GetEmployeeData$ = res;
      });
  }

  loadAllFamilyRelations() {
    this.apiService
      .get(ApiEndpoints.FamilyRelations + `/${this.globalBranchCode}`)
      .subscribe((res:any) => {
        this.FamilyRelationsresponse$ = res.data;
      });
  }

  LoadAllGender() {
    this.apiService.get(ApiEndpoints.GET_ALL_GENDERS).subscribe((res) => {
      this.Genderresponse$ = res;
    });
  }

  loadAllCompanyConfig() {
    this.apiService
      .get(ApiEndpoints.getAllCompanyConfig)
      .subscribe((res: any) => {
        this.selectedFormatKey = res[0].DateFormatCode;
      });
  }






  refresh() {
    this.isUpdate = false;
    this.FamilyInfoForm.reset();
  }

  changeEmployee(e: any) {
    this.selectedEmployee = +e.target.value;
  }

  changeFamilyRelations(e: any) {
    this.selectedFamilyRelations = +e.target.value;
  }

  changeGenders(e: any) {
    this.selectedGender = +e.target.value;
  }

  hideErrorPopup() {
    this.loadingerror = false;
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

  parseAndFormatDate(dateString: string): Date {
    let targetFormat = 'yyyy-MM-dd';
    const parsedDate: string | null = this.datePipe.transform(
      dateString,
      targetFormat
    );

    if (parsedDate !== null)
      return new Date(parsedDate);
    else {
      console.error(`Failed to parse date: ${dateString}`);
      return new Date();
    }
  }


}

