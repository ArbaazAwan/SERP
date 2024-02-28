import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { DatePipe } from '@angular/common';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-holiday-type',
  templateUrl: './holiday-type.component.html',
  styleUrls: ['./holiday-type.component.scss'],
  providers: [DateFormatPipe, DatePipe],
})
export class HolidayTypeComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  Holidayresponse$: any = [];
  globalBranchCode!: number;
  globalUserCode!: number;
  HolidayTypeCode: any;
  isUpdate!: boolean;
  Holidayform!: FormGroup;
  private datePipe = new DatePipe('en-US');
  selectedFormatKey!: number;
  isToastShown :boolean = false
  get holidayFormValue() {
    return this.Holidayform.getRawValue();
  }
  get formatDateForInput(): string {
    return this.dateFormatPipe.transform(this.selectedFormatKey);
  }
  get f() {return this.Holidayform.controls;}
  
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private dateFormatPipe: DateFormatPipe,
    private utilityService: UtilityService,
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.loadAllCompanyConfig();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.getAllHoliday();
  }

  formInit() {
    this.Holidayform = this.fb.group({
      HolidayTypeCode: [{value: null, disabled: true}],
      BranchCode: [null],
      HolidayName: [null,[Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
      HolidayDate: [null, Validators.required],
      IsActive: [false, Validators.required],
      CreatedBy: [null],
      CreatedOn: [null],
    });
  }

  getRowHolidayType(data: any) {
    this.isUpdate = true;
    data.HolidayDate = this.parseAndFormatDate(data.HolidayDate);
    this.Holidayform.patchValue({ ...data });
  }

  getAllHoliday() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.Holiday + `/${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.Holidayresponse$ = res.data;
        this.isLoadingData = false;
      });
  }

  loadAllCompanyConfig() {
    this.apiService
      .get(ApiEndpoints.getAllCompanyConfig)
      .subscribe((res: any) => {
        this.selectedFormatKey = res[0].DateFormatCode;
      });
  }

  addorUpdateHolidayType() {
    if (this.isUpdate) this.updateHolidayType();
    else this.saveHolidayType();
  }

  saveHolidayType() {
    if(this.Holidayform.invalid){
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.Holidayform);
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
    let payLoad = { ...this.holidayFormValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.HolidayDate = this.datePipe.transform(
      payLoad.HolidayDate,
      'yyyy-MM-dd'
    );
    this.apiService.post(payLoad, ApiEndpoints.Holiday).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New Holiday Type Saved Successfully!',
        type: NotificationType.success,
      });
      this.Holidayform.reset();
      this.getAllHoliday();
    });
  }

  updateHolidayType() {
    let payLoad = { ...this.holidayFormValue };
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.HolidayDate = this.datePipe.transform(
      payLoad.HolidayDate,
      'yyyy-MM-dd'
    );
    this.apiService.update(payLoad, ApiEndpoints.Holiday).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Holiday Type Update Successfully!',
        type: NotificationType.success,
      });
      this.isUpdate = false;
      this.Holidayform.reset();
      this.getAllHoliday();
    });
  }

  deleteHolidayType(HolidayTypeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Holiday Type?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.Holiday + `/${HolidayTypeCode}`)
          .subscribe((res) => {
            this.getAllHoliday();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Holiday Type Deleted Successfully!',
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
    this.Holidayform.reset();
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

    // Scroll , Sticky
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
