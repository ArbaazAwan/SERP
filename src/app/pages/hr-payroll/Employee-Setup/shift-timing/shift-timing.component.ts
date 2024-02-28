import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ShiftTiming } from 'src/app/_shared/model/HR-Payroll';

@Component({
  selector: 'app-shift-timing',
  templateUrl: './shift-timing.component.html',
  styleUrls: ['./shift-timing.component.scss'],
})
export class ShiftTimingComponent implements OnInit {
  form!: FormGroup;
  shiftTimings!: any[];
  shiftResponseCode: any = [];
  selectedShiftCode: number = 0;
  shifts: any = [];
  isLoadingData: boolean = false;
  loadingerror = false;
  ModulelistResp$: any = [];
  componentName: string = 'Shift Timings';
  isUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private api: ApiProviderService
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.getUserRights();
    this.loadAllShiftTimings();
    this.loadShifts();
  }

  formInit() {
    this.form = this.fb.group({
      RevisedCode: [null],
      ShiftCode: [null, Validators.required],
      StartTime: [null, Validators.required],
      EndTime: [null, Validators.required],
      BreakStartTime: [null, Validators.required],
      BreakEndTime: [null, Validators.required],
      FlexiTime: [null, Validators.required],

      Monday: [false, Validators.required],
      Tuesday: [false, Validators.required],
      Wednesday: [false, Validators.required],
      Thursday: [false, Validators.required],
      Friday: [false, Validators.required],
      Saturday: [false, Validators.required],
      Sunday: [false, Validators.required],
    });
  }

  getUserRights() {
    const UserId = +localStorage.getItem('UserId')!;
    const ModuleId = 4;
    const FormId = 4;
    this.api
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

  loadAllShiftTimings() {
    this.api.get(ApiEndpoints.getAllShiftTimings)
    .subscribe((res: any) => {
      this.shiftTimings = res;
    });
  }

  loadShifts() {
    this.api.get(ApiEndpoints.Shift).subscribe((res: any) => {
      this.shifts = res;
    });
  }

  onShiftSelection(event: any) {
    this.formInit();
    const selectedShiftCode = +event.value;
    const obj = this.shiftTimings.find(
      (x: any) => selectedShiftCode === x.ShiftCode
    );

    //is the object exists then patch the values
    if (!!obj) {
      this.isUpdate = true;
      const startTime = new Date(obj.StartTime);
      const endTime = new Date(obj.EndTime);
      const breakStartTime = new Date(obj.BreakStartTime);
      const breakEndTime = new Date(obj.BreakEndTime);

      if (!isNaN(startTime.getTime())) {
        obj.StartTime = startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      if (!isNaN(endTime.getTime())) {
        obj.EndTime = endTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      if (!isNaN(breakStartTime.getTime())) {
        obj.BreakStartTime = breakStartTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      if (!isNaN(breakEndTime.getTime())) {
        obj.BreakEndTime = breakEndTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      this.form.patchValue({ ...obj });
    }
    else{
      this.isUpdate = false;
    }
  }

  refresh() {
    this.isUpdate = false;
    this.formInit();
  }

  onSubmit() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    if (this.form.invalid) {
      this.toastService.sendMessage({
        message: 'Please check all form values',
        type: NotificationType.error,
        title: 'Form Invalid',
      });
      return;
    }

    const payLoad: ShiftTiming = this.form.getRawValue();

    //shift timing will be posted in both update and create
    //because we are using versioning
    this.postShiftTiming(payLoad);
  }

  postShiftTiming(payLoad: ShiftTiming) {
    this.api.post(payLoad, ApiEndpoints.ShiftTimings).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Shift Timing Saved Successfully!',
        type: NotificationType.success,
      });
      this.refresh();
      this.loadAllShiftTimings();
    });
  }

  updateShiftTiming(payLoad: ShiftTiming) {
    this.api.update(payLoad, ApiEndpoints.ShiftTimings).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Shift Timing Updated Successfully!',
        type: NotificationType.success,
      });
      this.formInit();
      this.loadShifts();
    });
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    //check if authorized
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    const startTime = new Date(data.StartTime);
    const endTime = new Date(data.EndTime);
    const breakStartTime = new Date(data.BreakStartTime);
    const breakEndTime = new Date(data.BreakEndTime);

    if (!isNaN(startTime.getTime())) {
      data.StartTime = startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (!isNaN(endTime.getTime())) {
      data.EndTime = endTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (!isNaN(breakStartTime.getTime())) {
      data.BreakStartTime = breakStartTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (!isNaN(breakEndTime.getTime())) {
      data.BreakEndTime = breakEndTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    this.form.patchValue({ ...data });
  }

  delete(ShiftCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .delete(ApiEndpoints.ShiftTimings + `/${ShiftCode}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Shift Timing Deleted Successfully!',
              type: NotificationType.error,
              title: 'Deleted',
            });
            this.refresh();
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
}
