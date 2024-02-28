import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { DatePipe } from '@angular/common';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';

@Component({
  selector: 'app-pay-heads',
  templateUrl: './pay-heads.component.html',
  styleUrls: ['./pay-heads.component.scss'],
  providers: [DateFormatPipe, DatePipe],
})
export class PayHeadsComponent implements OnInit {
  componentName: string = 'Pay Heads';
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  salaryPayHeadTypeList: any = [];
  periodTypeList: any = [];
  accountList: any = [];
  salaryPayHeadsList: any = [];
  globalUserCode!: number;
  PayHeadCode: any;
  isUpdate!: boolean;
  form!: FormGroup;
  loadingerror = false;
  isToastShown = false;
  private datePipe = new DatePipe('en-US');
  selectedFormatKey!: number;
  selectedPayHeadType!: number;
  selectedPeriodType!: number;
  selectedAccount!: number;

  get formValue() {
    return this.form.getRawValue();
  }
  get f() {
    return this.form.controls;
  }
  get formatDateForInput(): string {
    return this.dateFormatPipe.transform(this.selectedFormatKey);
  }
  changePeriodType(e: any) {
    this.selectedPeriodType = +e.target.value;
  }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private utilityService: UtilityService,
    private dateFormatPipe: DateFormatPipe
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.loadAllSalaryPayHeadTypes();
    this.loadAllPeriodType();
    this. loadAllAccounts();
    this.loadAllSalaryPayHeads();
    this.loadAllCompanyConfig();
  }

  formInit() {
    this.form = this.fb.group({
      PayHeadCode: [{ value: null, disabled: true }],
      PayHeadTypeCode: ['', Validators.required],
      PayHeadName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      ShortName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      PeriodTypeCode: ['', Validators.required],
      IsAuto: [false],
      DateFrom: [null, Validators.required],
      DateTo: [null, Validators.required],
      AccountCode: [null, Validators.required],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }
  
  getRowPayHeads(data: any) {
    debugger
    this.isUpdate = true;
    data.DateFrom = this.parseAndFormatDate(data.DateFrom);
    data.DateTo = this.parseAndFormatDate(data.DateTo);
    this.form.patchValue(data);
  }

  loadAllSalaryPayHeadTypes() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.PayHeadType).subscribe({
      next: (res: any) => {
        this.salaryPayHeadTypeList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  loadAllPeriodType() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.PeriodType).subscribe({
      next: (res: any) => {
        this.periodTypeList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  loadAllAccounts() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetAllChartOfAccounts).subscribe({
      next: (res: any) => {
        debugger
        this.accountList = res;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  loadAllSalaryPayHeads() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.SalaryPayHead).subscribe({
      next: (res: any) => {
        debugger
        this.salaryPayHeadsList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  loadAllCompanyConfig() {
    this.apiService
      .get(ApiEndpoints.getAllCompanyConfig)
      .subscribe((res: any) => {
        this.selectedFormatKey = res[0].DateFormatCode;
      });
  }

  addorUpdate() {
    if (this.isUpdate) this.updatePayHead();
    else this.savePayHead();
  }

  savePayHead() {
    debugger
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
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


     // Check for duplicate designation name
     const existingPayHead = this.utilityService.hasDuplicateValue(this.formValue.PayHeadName,"PayHeadName", this.salaryPayHeadsList);
     if (existingPayHead) {
       this.toastService.sendMessage({
         message: 'Pay Head with the same name already exists!',
         type: NotificationType.error,
       });
       return;
     }

     const payLoad = {
      ...this.formValue,
      CreatedBy: this.globalUserCode,
      IsActive: this.formValue.IsActive ?? false
    };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService.post(payLoad, ApiEndpoints.SalaryPayHead).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Pay Head Saved Successfully!',
        type: NotificationType.success,
      });
      this.formInit();
      this.loadAllSalaryPayHeads();
    });
  }

  updatePayHead() {
    debugger
    let payLoad = { ...this.formValue };
    payLoad.ModifiedBy = this.globalUserCode;

    const existingPayHead = this.utilityService.hasDuplicateValue(payLoad,"PayHeadName", this.salaryPayHeadsList, true, "PayHeadCode");
     if (existingPayHead) {
       this.toastService.sendMessage({
         message: 'Pay Head with the same name already exists!',
         type: NotificationType.error,
       });
       return;
     }
    this.apiService.update(payLoad, ApiEndpoints.SalaryPayHead).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Pay Head Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.formInit();
      this.loadAllSalaryPayHeads();
    });
  }

  deletePayHead(PayHeadCode: number) {
    debugger
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Pay Head?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.SalaryPayHead + `/${PayHeadCode}`)
          .subscribe((res) => {
            this.loadAllSalaryPayHeads();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Pay Head Deleted Successfully!',
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

  hideErrorPopup() {
    this.loadingerror = false;
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
