import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { Shift } from 'src/app/_shared/model/HR-Payroll';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss'],
})
export class ShiftComponent implements OnInit {
  form!: FormGroup;
  Shiftresponse$: any = [];
  isUpdate!: boolean;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  isSticky: boolean = false;
  isLoadingData: boolean = false;

  constructor(
    private _apiServices: ApiProviderService,
    private _confirmService: ConfirmationService,
    private _toastService: ToastService,
    private _fb: FormBuilder,
    private _utilityService: UtilityService
  ) {
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

  ngOnInit(): void {
    this.getUserRights();
    this.loadAllShifts();
  }

  formInit() {
    const userId = +localStorage.getItem('UserId')!;
    this.form = this._fb.group({
      ShiftCode: [{ value: null, disabled: true }],
      ShiftName: [null, Validators.required],
      ShortName: [null, Validators.required],
      IsActive: [true],
      CreatedBy: [userId],
      ModifiedBy: [userId],
    });
  }

  getUserRights() {
    const UserId = +localStorage.getItem('UserId')!;
    this.UserId = UserId;
    const ModuleId = 4;
    const FormId = 24;
    this._apiServices
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

  loadAllShifts() {
    this._apiServices.get(ApiEndpoints.Shift).subscribe((res: any) => {
      this.Shiftresponse$ = res;
    });
  }

  save() {
    let payload: Shift = this.form.getRawValue();
    this._apiServices.post(payload, ApiEndpoints.Shift).subscribe((res) => {
      this._toastService.sendMessage({
        message: 'Shift Saved Successfully!',
        type: NotificationType.success,
      });
      this.refresh();
    });
  }

  getSelectedRow(data: Shift) {
    this.isUpdate = true;
    this.form.patchValue(data);
  }

  update() {
    let model: Shift = this.form.getRawValue();
    this._apiServices.update(model, ApiEndpoints.Shift).subscribe(() => {
      this._toastService.sendMessage({
        message: 'Shift Updated Successfully!',
        type: NotificationType.success,
      });
      this.refresh();
    });
  }

  onDeleteShift(ShiftCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this._confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteShift(ShiftCode);
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

  deleteShift(ShiftCode: number) {
    this._apiServices
      .delete(ApiEndpoints.Shift + `/${ShiftCode}`)
      .subscribe(() => {
        this._toastService.sendMessage({
          message: 'Shift Deleted Successfully!',
          type: NotificationType.error,
          title: 'Shift Deleted',
        });
        this.loadAllShifts();
      });
  }

  addorUpdate() {
    if (this.form.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      this._toastService.sendMessage({
        message: 'Invalid Form Please Check All Form Fields!',
        type: NotificationType.error,
        title: 'Invalid Form',
      });
      return;
    }

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

  hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.isUpdate = false;
    this.formInit();
    this.loadAllShifts();
  }
}
