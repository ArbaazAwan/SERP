import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { IInterviewStatus } from 'src/app/_shared/model/HR-Payroll';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-interview-status',
  templateUrl: './interview-status.component.html',
  styleUrls: ['./interview-status.component.scss'],
})
export class InterviewStatusComponent implements OnInit {
  componentName: string = 'Interview Status';
  form!: FormGroup;
  interviewStatusList: IInterviewStatus[] = [];
  isUpdate: boolean = false;
  selectedRow: any;
  isSticky: boolean = false;
  isLaodingTable: boolean = false;
  globalUserId!: number;
  ModulelistResp$: any = [];
  isToastShown: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private apiProviderService: ApiProviderService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.formInit();
    const UserId = localStorage.getItem('UserId');
    const ModuleId = 2;
    const FormId = 1;
    this.apiProviderService
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
    this.getAllInterviewStatus();
    this.globalUserId = +localStorage.getItem('UserId')!;
  }

  formInit() {
    this.form = this.fb.group({
      InterviewStatusCode: [null],
      InterviewStatusText: ['', Validators.required],
      IsActive: [true],
    });
  }

  getAllInterviewStatus() {
    this.isLaodingTable = true;
    this.apiProviderService.get(ApiEndpoints.InterviewStatus).subscribe({
      next: (res: any) => {
        this.interviewStatusList = res.data;
      },
      error: (err: any) => {
        this.toastService.sendMessage({
          message: 'Error in fetching Interview Status Data!',
          type: NotificationType.error,
        });
      },
      complete: () => {
        this.isLaodingTable = false;
      }
    });
  }

  onSubmit() {
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

    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }

  save() {
    let model:IInterviewStatus = this.form.getRawValue();
    model.CreatedBy = this.globalUserId;
    model.IsActive = !!model.IsActive;
    this.apiProviderService
      .post(model, ApiEndpoints.InterviewStatus)
      .subscribe({
        next: (res: any) => {
          this.getAllInterviewStatus();
          this.toastService.sendMessage({
            message: 'Interview Status Saved Successfully!',
            type: NotificationType.success,
          });
          this.clearForm();
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error while saving Interview Status!',
            type: NotificationType.error,
          });
        },
      });
  }

  update() {
    let model = this.form.value;
    model.ModifiedBy = this.globalUserId;
    model.InterviewStatusCode = this.selectedRow.InterviewStatusCode;
    this.apiProviderService
      .update(model, ApiEndpoints.InterviewStatus)
      .subscribe({
        next: (res: any) => {
          this.getAllInterviewStatus();
          this.toastService.sendMessage({
            message: 'Interview Status Updated Successfully!',
            type: NotificationType.success,
          });
          this.clearForm();
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error while Updating Interview Status',
            type: NotificationType.error,
          });
        },
      });
  }

  edit(data: any) {
    this.isUpdate = true;
    this.selectedRow = data;
    this.form.patchValue(data);
  }

  delete(id: any) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confrimation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiProviderService
          .delete(ApiEndpoints.InterviewStatus + `/${id}`)
          .subscribe({
            next: (res: any) => {
              this.getAllInterviewStatus();
              this.toastService.sendMessage({
                message: 'Interview Status Deleted Successfully!',
                type: NotificationType.deleted,
              });
              this.clearForm();
            },
            error: (err: any) => {
              this.toastService.sendMessage({
                message: 'Error while Deleting Interview Status!',
                type: NotificationType.error,
              });
            },
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

  clearForm() {
    this.isUpdate = false;
    this.formInit();
    this.selectedRow = null;
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
