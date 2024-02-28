import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { UserVoucherTypeModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-uservouchertype',
  templateUrl: './uservouchertype.component.html',
  styleUrls: ['./uservouchertype.component.scss'],
})
export class UservouchertypeComponent implements OnInit {
  form!: FormGroup;
  uservoucherType: any = [];
  model!: UserVoucherTypeModel;
  selectUser!: number;
  selectvouchertype!: number;
  user$: any;
  uservoucher: any;
  uservoucherTypeId: any = [];
  uservoucherTypeUserId: any = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      UserId: this.fb.control('', Validators.required),
      VoucherTypeCode: this.fb.control('', Validators.required),
      voucherTypeDropdown: new Array([]),
      userDropdown: new Array([]),
    });
    //this.loadAllUserVoucherType();
    this.loadAllUser();
    //this.loadAllVouchertype();
  }

  changeUsers(e: any) {
    this.selectUser = +e.target.value;
    this.loadUserVoucherTypebyId(this.selectUser);
    this.loadUserVouchersTypebyUserId(this.selectUser);
  }

  get userName() {
    return this.form.get('userDropdown');
  }
  loadAllUser() {
    this.apiService.get(ApiEndpoints.getAllUsers).subscribe((res: any) => {
      this.user$ = res;
    });
  }

  changeVoucherType(e: any) {
    this.selectvouchertype = +e.target.value;
  }

  get VoucherType() {
    return this.form.get('voucherTypeDropdown');
  }
  // loadAllVouchertype() {
  //   this.apiService.getAllVoucherType().subscribe((res: any) => {
  //     this.uservoucher = res;
  //   });
  // }
  loadUserVoucherTypebyId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getUserVoucherTypeById + '?UserId=' + UserId)
      .subscribe((res) => {
        this.uservoucherTypeId = res;
      });
  }
  loadUserVouchersTypebyUserId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getUserVouchersTypeByUserId + '?UserId=' + UserId)
      .subscribe((res) => {
        this.uservoucherTypeUserId = res;
      });
  }

  save() {
    this.form.patchValue({
      UserId: this.selectUser,
      VoucherTypeCode: this.selectvouchertype,
    });
    let val = this.form.value;
    this.model = val;
    this.apiService
      .post(this.model, ApiEndpoints.postUserVoucherType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'User Voucher Type Record Added Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
        this.loadUserVoucherTypebyId(this.selectUser);
        this.loadUserVouchersTypebyUserId(this.selectUser);
      });
    this.form.markAsUntouched();
  }

  delete(UserId: number, VoucherTypeCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteUserVoucherType +
              '?UserId=' +
              UserId +
              '&VoucherTypeCode=' +
              VoucherTypeCode
          )
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'User Voucher Type Record Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.loadUserVoucherTypebyId(this.selectUser);
            this.loadUserVouchersTypebyUserId(this.selectUser);
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

  saveorUpdate() {
    if (
      this.form.invalid ||
      this.selectvouchertype === undefined ||
      this.selectUser === undefined
    ) {
      // return this.toastService.sendMessage({
      //   message: 'Form Invalid',
      //   type: NotificationType.error,
      // });
    }
    this.save();
  }

  refresh() {
    this.form.reset();
    this.loadUserVoucherTypebyId(this.selectUser);
    this.loadAllUser();
    this.loadUserVouchersTypebyUserId(this.selectUser);
    //this.loadAllVouchertype();
  }
}
