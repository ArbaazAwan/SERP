import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss'],
})
export class LeaveTypeComponent implements OnInit {
  form!: FormGroup;
  LeaveType: any = [];
  LeaveTyperesponse$: any = [];
  globalBranchCode!: number;
  isUpdate!: boolean;
  tableLength!: number;
  componentName: string = "Leave Type";

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      LeaveTypeCode: this.fb.control('', Validators.required),
      LeaveType: this.fb.control('', Validators.required),
      ShortName: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required),
      Period: this.fb.control('', Validators.required),
      Quota: this.fb.control('', Validators.required),
      CarryForward: this.fb.control('', Validators.required),
      AllowedGender: this.fb.control('', Validators.required),
      EncashmentAllowed: this.fb.control('', Validators.required),
      EmployeeType: this.fb.control('', Validators.required),
      PayFactor: this.fb.control('', Validators.required),
      PayType: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;

    this.loadAllLeaveType();
  }
  EncashmentAllowed(){
    const EncashmentAllowed = this.form.get('EncashmentAllowed');
    if (EncashmentAllowed) {
      EncashmentAllowed.setValue(!EncashmentAllowed.value);
    }
  }
  CarryForward(){
    const CarryForward = this.form.get('CarryForward');
    if (CarryForward) {
      CarryForward.setValue(!CarryForward.value);
    }
  }
  IsActive(){
    const IsActive = this.form.get('IsActive');
    if (IsActive) {
      IsActive.setValue(!IsActive.value);
    }
  }
  loadAllLeaveType() {
    this.apiServices.get(ApiEndpoints.getAllLeaveType).subscribe((res: any) => {
      this.LeaveTyperesponse$ = res;
    });
    this.loadMaxLeaveTypeCode();
  }

  loadMaxLeaveTypeCode() {
    this.apiServices
      .get(ApiEndpoints.getMaxLeaveTypeCode)
      .subscribe((res: any) => {
        this.LeaveType.LeaveTypeCode = res[0].LeaveTypeCode;
      });
  }

  save() {
    let model = this.form.value;
    
    if (!model.IsActive) {
      model.IsActive = false;
    }
    if (!model.CarryForward) {
      model.CarryForward = false;
    }
    if (!model.EncashmentAllowed) {
      model.EncashmentAllowed = false;
    }
    model.LeaveTypeCode = this.LeaveType.LeaveTypeCode;
    model.LeaveType = this.LeaveType.LeaveType;
    model.ShortName = this.LeaveType.ShortName;
    model.Period = this.LeaveType.Period;
    model.Quota = this.LeaveType.Quota;
    model.AllowedGender = this.LeaveType.AllowedGender;
    model.EmployeeType = this.LeaveType.EmployeeType;
    model.PayFactor = this.LeaveType.PayFactor;
    model.PayType = this.LeaveType.PayType;
    model.BranchCode = this.globalBranchCode!;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices.post(model, ApiEndpoints.postLeaveType).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Leave Type Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllLeaveType();
      this.form.reset();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.LeaveType = { ...data };
    this.tableLength = Object.keys(this.LeaveType).length;
  }

  update() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    this.apiServices.update(model, ApiEndpoints.putLeaveType).subscribe(() => {
      this.loadAllLeaveType();
      this.toastService.sendMessage({
        message: 'Leave Type Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(LeaveTypeCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(
            ApiEndpoints.deleteLeaveType + '?LeaveTypeCode=' + LeaveTypeCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Leave Type Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllLeaveType();
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

  addorUpdate() {
    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }
  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllLeaveType();
  }
}
