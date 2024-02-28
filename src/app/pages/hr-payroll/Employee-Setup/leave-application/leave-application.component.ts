import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { LeaveApplication } from 'src/app/_shared/model/HR-Payroll';
import { DatePipe } from '@angular/common';
import { Column } from 'src/app/_shared/model/model';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss'],
})
export class LeaveApplicationComponent implements OnInit {
  form!: FormGroup;
  LeavesHistoryresponse$: any = [];
  globalUser: number = 0;
  isUpdate!: boolean;
  tableLength!: number;
  EmployeeResponse$: any = [];
  LeaveTypeResponse$: any = [];
  LeaveApplicationResponse$: any = [];
  componentName: string = 'Leave Application';
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  approvalOptions:any[] = [
    {label: "Approved", value: true },
    {label: "Rejected", value: false }
  ];
  datePipe = new DatePipe('en-US');
  cols: Column[] = [
    { header: 'Leave Type', field: 'LeaveType' },
    { header: 'Employee Name', field: 'EmployeeName' },
    { header: 'Leave Date', field: 'LeaveDate' },
    { header: 'Leave Days', field: 'LeaveDays' },
    { header: 'Approval Status', field: 'ApprovalStatus' },
    { header: 'Action', field: 'action' },
  ];
  balanceCols: Column[] = [
    { header: 'Leave Type', field: 'LeaveType' },
    { header: 'Availed', field: 'AvailedLeaves' },
    { header: 'Quota', field: 'Quota' },
  ]
  constructor(
    private _fb: FormBuilder,
    private _apiServices: ApiProviderService,
    private _confirmService: ConfirmationService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.globalUser = +localStorage.getItem('UserId')!;

    this.loadEmployee();
    // this.loadEmployeeLeaveBalance();
    this.loadAllLeaveApplication();
  }

  formInit() {
    this.form = this._fb.group({
      LeaveApplicationCode: [null],
      LeaveTypeCode: [null, Validators.required],
      EmployeeCode: [null, Validators.required],
      LeaveDays: [null, Validators.required],
      LeaveDate: [null, Validators.required],
      Remarks: [null],
      ApprovalStatus: [{value:null, disabled: true}],
    });
  }

  loadEmployeeLeaves(LeaveTypeCode: number, EmployeeCode: number) {
    this._apiServices
      .get(
        ApiEndpoints.getEmployeeLeaves +
          '?LeaveTypeCode=' +
          LeaveTypeCode +
          '&EmployeeCode=' +
          EmployeeCode
      )
      .subscribe((res: any) => {
        this.LeavesHistoryresponse$ = res;
      });
  }

  loadEmployeeLeaveBalance(
    EmployeeCode: number,
    LeaveDate: string
  ) {
    this._apiServices
      .get(
        ApiEndpoints.LeaveApplication + `/${EmployeeCode}/${LeaveDate}`
      )
      .subscribe((res: any) => {
        this.LeaveTypeResponse$ = res.leaveTypeBalances;
      });
  }

  triggerLeaveBalanceData() {
    debugger
    const model = this.form.getRawValue();
    if(model.EmployeeCode && model.LeaveDate){
      this.loadEmployeeLeaveBalance(model.EmployeeCode, model.LeaveDate);
    }
  }

  loadAllLeaveApplication() {
    this._apiServices
      .get(ApiEndpoints.LeaveApplication)
      .subscribe({
        next: (res: any) => {
        this.LeaveApplicationResponse$ = res.data;
      },
      error: (err: any) => {
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

  loadEmployee() {
    this._apiServices.get(ApiEndpoints.EmployeeSetup).subscribe((res: any) => {
      this.EmployeeResponse$ = res;
    });
  }

  save() {
    let model: LeaveApplication = this.form.getRawValue();
    model.CreatedBy = this.globalUser;
    this._apiServices
      .post(model, ApiEndpoints.LeaveApplication)
      .subscribe(() => {
        this._toastService.sendMessage({
          message: 'Leave Application Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllLeaveApplication();
        this.loadEmployeeLeaves(model.LeaveTypeCode, model.EmployeeCode);
      });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    data.LeaveDate = this.datePipe.transform(
      data.LeaveDate,
      'yyyy-MM-dd'
    );
    this.form.patchValue({ ...data });
    this.tableLength = Object.keys(data).length;
    
  }

  update() {
    let model: LeaveApplication = this.form.getRawValue();
    model.ModifiedBy = this.globalUser;
    
    this._apiServices
      .update(model, ApiEndpoints.LeaveApplication)
      .subscribe(() => {
        this.loadEmployeeLeaves(model.LeaveTypeCode, model.EmployeeCode);
        this._toastService.sendMessage({
          message: 'Leave Application Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.loadAllLeaveApplication();
    this.isUpdate = false;
    this.form.reset();
  }

  delete(model: LeaveApplication) {
    this._confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._apiServices
          .delete(
            ApiEndpoints.LeaveApplication +
              `/${model.LeaveApplicationCode}`
          )
          .subscribe(() => {
            this._toastService.sendMessage({
              message: 'Leave Application Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllLeaveApplication();
            this.loadEmployeeLeaves(model.LeaveTypeCode, model.EmployeeCode);
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

  addorUpdate() {
    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
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
}
