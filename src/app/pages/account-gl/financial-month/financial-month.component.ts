import { ToastService } from 'src/app/_shared/services/toast.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { FinancialMonthModel } from 'src/app/_shared/model/model';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { DatePipe, formatDate } from '@angular/common';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
@Component({
  selector: 'app-financial-month',
  templateUrl: './financial-month.component.html',
  styleUrls: ['./financial-month.component.scss'],
})
export class FinancialMonthComponent implements OnInit {
  form!: FormGroup;
  financial: any = [];
  FinancialMonth: any = [];
  AllfinancialMonths: any;
  selectfinancialYear!: number;
  financialYearTitle: any;
  financialMonthMaxId!: any;
  model!: FinancialMonthModel;
  globalMonth!: string;
  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  tableLength!: number;
  branchCode!: number;
  financialYearCode!: number;
  months!: string[];
  StartDate!: string;
  EndDate!: string;
  StartMonth!: string;
  EndMonth!: string;
  loadingerror = false;
  componentName: string = 'Financial Month';
  ModulelistResp$: any = [];
  UserId: any;
  isLoadingData: boolean = false;
  isSticky: boolean = false;
  isOpen!: boolean;
  isActiveVal!: boolean;
  monthAbbrevs = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      FinancialYearCode: this.fb.control('', Validators.required),
      MonthTitle: this.fb.control('', Validators.required),
      StartDate: this.fb.control(''),
      EndDate: this.fb.control(''),
      IsOpenForEntry: this.fb.control(true),
      IsActive: this.fb.control(true),
      CreatedBy: this.fb.control(''),
      CreatedOn: this.fb.control(''),
      ModifiedBy: this.fb.control(''),
      ModifiedOn: this.fb.control(''),
      // branches: new FormArray([]),
      // financialyear: new FormArray([]),
    });

    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 2;
    this.apiService
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
    this.loadAllFinancialMonth();
    this.getFinancialMonthId();
    this.allFinancialYear();
    this.selectfinancialYear = new Date().getFullYear();
  }
  financialyears: any = [];


  GetFinancialYearByCode(FinancialYearCode: any) {
    this.apiService
      .get(
        ApiEndpoints.getFinancialYearById +
          '?FinancialYearCode=' +
          FinancialYearCode
      )
      .subscribe((res: any) => {
        this.financialyears = res[0];
        this.StartMonth = this.datePipe.transform(res[0].StartDate, 'YYYY-MM')!;
        this.EndMonth = this.datePipe.transform(res[0].EndDate, 'YYYY-MM')!;
      });
  }

  changeFinancialYear(e: any) {
    
    this.selectfinancialYear = +e.target.value;
    this.GetFinancialYearByCode(this.selectfinancialYear);
    let x = this.financial.find((x: any) => {
      return this.selectfinancialYear === x.FinancialYearCode;
    });
    this.financialYearTitle = x.YearTitle;
    this.StartDate = this.datePipe.transform(x.StartDate, 'YYYY-MM')!;
    this.EndDate = this.datePipe.transform(x.EndDate, 'YYYY-MM')!;
  }

  loadAllFinancialMonth() {
    
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllFinancialMonth).subscribe((res) => {
      
      this.AllfinancialMonths = res;
      this.isLoadingData = false;
    });
  }
  OpenCheck() {
    
    const hasDetailControl = this.form.get('IsOpenForEntry');
    if (hasDetailControl) {
      hasDetailControl.setValue(!hasDetailControl.value);
    }
    this.isOpen = hasDetailControl?.value;
  }
  isActive() {
    const hasDetailControl = this.form.get('IsActive');
    if (hasDetailControl) {
      hasDetailControl.setValue(!hasDetailControl.value);
    }
    this.isActiveVal = hasDetailControl?.value;
  }

  allFinancialYear() {
    this.apiService
      .get(ApiEndpoints.getAllFinancialyear)
      .subscribe((res: any) => {
        debugger
        this.financial = res.data;
      });
  }
  getFinancialMonthId() {
    
    this.apiService
      .get(ApiEndpoints.getFinancialMonthMaxId)
      .subscribe((res: any) => {
        
        this.financialMonthMaxId = res[0].FinancialMonthCode;
      });
  }

  formatDateToMMM_D_YYYY(date: Date): string {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return `${monthNames[monthIndex]}-${day}-${year}`;
  }

  addFinancialMonthDetails() {
    
    const monthTitleFormatted = this.formatDateToMMM_D_YYYY(
      new Date(this.form.get('MonthTitle')?.value)
    );
    const startDateFormatted = this.formatDateToMMM_D_YYYY(
      new Date(this.form.get('StartDate')?.value)
    );
    const endDateFormatted = this.formatDateToMMM_D_YYYY(
      new Date(this.form.get('EndDate')?.value)
    );
debugger
    // Patch the formatted values into the form controls
    this.form.get('MonthTitle')?.patchValue(monthTitleFormatted);
    this.form.get('StartDate')?.patchValue(startDateFormatted);
    this.form.get('EndDate')?.patchValue(endDateFormatted);
    let val = this.form.value;
    this.model = val;
    this.model.FinancialMonthCode = +this.financialMonthMaxId;
    console.table(val);
    let x = +this.form.get('FinancialMonthCode')?.value;
    this.apiService
      .post(this.model, ApiEndpoints.postFinancialMonth)
      .subscribe((res) => {
        if (res.FinancialMonthCode == x) {
          this.toastService.sendMessage({
            message: 'Record already exist',
            type: NotificationType.error,
          });
        } else {
          this.refresh();
          this.loadAllFinancialMonth();
        }
      });
    this.form.markAsUntouched();
  }

  updateFinancialMonthDetails() {
    
    if (this.isOpen != null) {
      this.model.IsOpenForEntry = this.isOpen;
    }
    if (this.isActiveVal != null) {
      this.model.IsActive = this.isActiveVal;
    }
    this.model.ModifiedBy = +localStorage.getItem('UserId')!;
    this.model.FinancialMonthCode = +this.FinancialMonth.FinancialMonthCode;
    this.apiService
      .update(this.model, ApiEndpoints.putFinancialMonth)
      .subscribe((res) => {
        this.form.patchValue({
          FinancialMonthModel: this.FinancialMonth,
        });
        this.toastService.sendMessage({
          message: 'Financial Month Record Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllFinancialMonth();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  deleteFinancialMonthDetails(FinancialMonthCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.deleteFinancialMonth +
              '?FinancialMonthCode=' +
              FinancialMonthCode
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Financial Month Record Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllFinancialMonth();
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

    this.form.markAsUntouched();
  }

  // Function to handle the selected row
  getSelectedRow(data: any) {
    debugger
    
    this.isUpdate = true;
    this.FinancialMonth = data;
    this.model = { ...data };
    this.FinancialMonth.StartDate = this.datePipe.transform(
      this.FinancialMonth.StartDate,
      'MMM-d-y'
    );
    this.FinancialMonth.EndDate = this.datePipe.transform(
      this.FinancialMonth.EndDate,
      'MMM-d-y'
    );

    this.FinancialMonth.MonthTitle = this.parseAndFormatDate(
      this.FinancialMonth.MonthTitle
    );
    const [month, year] = this.FinancialMonth.MonthTitle.split('-');
    this.FinancialMonth.MonthTitle = new Date(
      parseInt(year),
      parseInt(month) - 1,
      1
    );
    this.tableLength = Object.keys(this.model).length;
    this.form.patchValue({
      IsOpenForEntry:data.IsOpenForEntry,
      IsActive:data.IsActive,
    
    })
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();

    this.form.patchValue({
      CreatedBy: +user!,
      CreatedOn: currentDate.toLocaleString(),
      //FinancialYearCode: this.selectfinancialYear!,
    });

    this.addFinancialMonthDetails();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();

    this.form.patchValue({
      CreatedBy: +user!,
      CreatedOn: currentDate.toLocaleString(),
      FinancialYearCode: this.selectfinancialYear!,
    });
    this.updateFinancialMonthDetails();
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.form.get('IsOpenForEntry')?.setValue(true);
    this.form.get('IsActive')?.setValue(true);
    this.loadAllFinancialMonth();
    this.allFinancialYear();
  }

  selectMonth(event: any) {
    
    const dateObj = new Date(event);
    this.globalMonth = event;
    var firstDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    var lastDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
    this.form.patchValue({
      FinancialMonthCode: +this.financialMonthMaxId,
      //MonthTitle: this.form.get('MonthTitle')?.value,
      StartDate: firstDay.toDateString(),
      EndDate: lastDay.toDateString(),
      IsActive:
        this.form.get('IsActive')?.value === undefined
          ? false
          : this.form.get('IsActive')?.value,
      IsOpenForEntry:
        this.form.get('IsOpenForEntry')?.value === undefined
          ? false
          : this.form.get('IsActive')?.value,
    });
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  month: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  FinancialMonths = {
    FinancialYearTitle: 'this.financialYearTitle',
  };

  selectFinancialYear(event: Event): void {
    const selectedYear = this.FinancialMonths.FinancialYearTitle.split('-')[0];

    const selectedMonths = this.month.slice(
      0,
      parseInt(selectedYear, 10) - 2023 + 1
    );
  }

  getMinMonth(): string {
    if (this.financialYearTitle) {
      const startYear = parseInt(this.financialYearTitle.split('-')[0], 10);
      return `${startYear}-01`;
    }
    return '';
  }

  getMaxMonth(): string {
    if (this.financialYearTitle) {
      const endYear = parseInt(this.financialYearTitle.split('-')[1], 10);
      return `${endYear}-12`;
    }
    return '';
  }

  parseAndFormatDate(dateString: string): string {
    
    let targetFormat = 'MM-yyyy';

    const parsedDate: string | null = this.datePipe.transform(
      dateString,
      targetFormat
    );

    if (parsedDate !== null) {
      return parsedDate;
    } else {
      console.error(`Failed to parse date: ${dateString}`);
      return '';
    }
  }
}
