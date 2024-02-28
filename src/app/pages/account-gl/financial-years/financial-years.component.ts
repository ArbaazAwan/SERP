import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { FinancialYearModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { DatePipe } from '@angular/common';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';

@Component({
  selector: 'app-financial-years',
  templateUrl: './financial-years.component.html',
  styleUrls: ['./financial-years.component.scss'],
})
export class FinancialYearsComponent implements OnInit {
  form!: FormGroup;
  financialyears: any = [];
  model!: FinancialYearModel;
  financialYearMaxId!: number;
  isUpdate!: boolean;
  datePipe = new DatePipe('en-US');
  ModulelistResp$: any = [];
  UserId: any;
  //for frozen tbl
  balanceFrozen: boolean = true;
  isLoadingData: boolean = false;
  loadingerror: boolean = false;
  datesCheckStart:any = [];
  datesCheckEnd:any = [];
  //customers!: Customer[];
  customers: any = [];
  //for frozen tbl
  componentName: string = 'Financial Year';

  isSticky: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiservice: ApiProviderService,
    private confirmservice: ConfirmationService,
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
      FinancialYearCode: this.fb.control(''),
      YearTitle: this.fb.control('', Validators.required),
      StartDate: this.fb.control('', Validators.required),
      EndDate: this.fb.control('', Validators.required),
      IsOpenForEntry: this.fb.control(''),
      IsActive: this.fb.control(''),
      CreatedBy: this.fb.control(''),
      CreatedOn: this.fb.control(''),
      ModifiedBy: this.fb.control(''),
      ModifiedOn: this.fb.control(''),
    });
    this.loadAllFinancialYears();
    this.loadFinancialYearMaxId();

    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 1;
    this.apiservice
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
  hideErrorPopup() {
    this.loadingerror = false;
  }

  loadAllFinancialYears() {
    this.isLoadingData = true;
    this.apiservice
      .get(ApiEndpoints.getAllFinancialyear)
      .subscribe((res: any) => {
        this.financialyears = res.data;
        this.isLoadingData = false;
      });
  }

  async loadFinancialYearMaxId() {
    await this.apiservice
      .get(ApiEndpoints.getFinancialYearsMaxId)
      .subscribe((res) => {
        const x = Object.entries(res!)
          .map((x) => x[1])
          .pop();
        this.financialYearMaxId = +x.FinancialYearCode;
      });
  }

  FinancialYearDuplicateCHK() {
    let DateFrom = this.form.value.StartDate;
    let DateTo = this.form.value.EndDate;
    let formattedDateString: string;
    let formattedDateString2: string;
    this.apiservice
      .get(ApiEndpoints.FinancialYearDuplicateCHK +"?DateFrom=" + DateFrom +"&DateTo="+DateTo)
      .subscribe((res: any) => {
        
        //this.datesCheck = res;
        formattedDateString = this.datePipe.transform(this.form.value.StartDate, 'yyyy-MM-dd') || '';
        formattedDateString2 = this.datePipe.transform(this.form.value.EndDate, 'yyyy-MM-dd') || '';
        this.datesCheckStart = res.filter((item:any) => this.datePipe.transform(item.StartDate, 'yyyy-MM-dd') == formattedDateString);
        this.datesCheckEnd = res.filter((item:any) => this.datePipe.transform(item.EndDate, 'yyyy-MM-dd') == formattedDateString2);
        if(this.datesCheckStart.length ==0 && this.datesCheckEnd.length ==0){
          this.save()
        }
        else{
          this.toastService.sendMessage({
            message: 'Financial Years did not created because dates already exist',
            type: NotificationType.error,
          });
        }
      });
  }

  save() {
   
      this.form.patchValue({
        YearTitle: this.datePipe.transform(
          this.form.get('YearTitle')?.value,
          'MMM-y'
        ),
        FinancialYearCode: +this.financialYearMaxId,
      });
      let val = this.form.value;
      this.model = val;
  
      this.apiservice
        .post(this.model, ApiEndpoints.postFinancialYears)
        .subscribe((res) => {
          this.toastService.sendMessage({
            message: 'Financial Years Record Saved Successfully!',
            type: NotificationType.success,
          });
          this.form.markAsUntouched();
  
          this.onRefresh();
        });
    
   
   
  }

  update() {
    debugger
    let model = this.form.value;
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    model.ModifiedBy = user;
    model.ModifiedOn = currentDate.toLocaleString;
    this.apiservice
      .update(model, ApiEndpoints.putFinancialYears)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Financial Years Record Updated Successfully!',
          type: NotificationType.success,
        });
        this.onRefresh();
      });
  }

  delete(FinancialYearCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiservice
          .delete(
            ApiEndpoints.deleteFinancialYears +
              '?FinancialYearCode=' +
              FinancialYearCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Financial Years Record Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.onRefresh();
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

  getSelectedRow(data: any) {
    debugger
    this.isUpdate = true;
    this.financialyears = data;
    this.form.patchValue({...data,
      StartDate:this.datePipe.transform(
        data.StartDate,
        'MMM-d-y'
      ),
      EndDate:this.datePipe.transform(
        data.EndDate,
        'MMM-d-y'
      ),
      YearTitle:this.datePipe.transform(
        data.YearTitle,
        'MMM-y'
      )
    })
  

  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.FinancialYearDuplicateCHK();
  }

  updateAllow() {
    debugger
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

  onRefresh() {
    this.isUpdate = false;
    this.resetForm();
    this.loadAllFinancialYears();
    this.loadFinancialYearMaxId();
  }

  // resetForm() {
  //   const exclude: string[] = ['FinancialYearCode'];
  //   Object.keys(this.form.controls).forEach((key) => {
  //     if (exclude.findIndex((q) => q === key) === -1) {
  //       this.form.get(key)?.reset();
  //     }
  //   });
  // }

  resetForm() {
    const exclude: string[] = ['FinancialYearCode'];

    // Reset the form
    Object.keys(this.form.controls).forEach((key) => {
      if (exclude.findIndex((q) => q === key) === -1) {
        this.form.get(key)?.reset();
      }
    });

    // Set the values of IsOpenForEntry and IsActive back to true
    this.form.get('IsOpenForEntry')?.setValue(true);
    this.form.get('IsActive')?.setValue(true);
  }

  selectYear(event: any) {
    const dateObj = new Date(event.target.value);
    var firstDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    var lastDay = new Date(dateObj.getFullYear() + 1, dateObj.getMonth(), 0);
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.form.patchValue({
      CreatedBy: +user!,
      CreatedOn: currentDate.toLocaleDateString(),
      StartDate: firstDay.toDateString(),
      EndDate: lastDay.toDateString(),
    });
  }
  IsActive() {
    const IsActiveControl = this.form.get('IsActive');
    if (IsActiveControl) {
      IsActiveControl.setValue(!IsActiveControl.value);
    }
  }
  IsOpenForEntry() {
    const IsOpenForEntryControl = this.form.get('IsOpenForEntry');
    if (IsOpenForEntryControl) {
      IsOpenForEntryControl.setValue(!IsOpenForEntryControl.value);
    }
  }

  // For Current Previous and Next Year Data

  getMinMonth(): string {
    const currentYear = new Date().getFullYear();
    return `${currentYear - 1}-01`; // Minimum month (January) of the previous year
  }

  getMaxMonth(): string {
    const currentYear = new Date().getFullYear();
    return `${currentYear + 1}-12`; // Maximum month (December) of the next year
  }
}
