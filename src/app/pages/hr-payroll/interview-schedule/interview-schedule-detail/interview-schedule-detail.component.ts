import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import {
  IEmployeeSetup,
  IInterviewSchedule,
} from 'src/app/_shared/model/HR-Payroll';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { FileuploadService } from 'src/app/_shared/services/file-upload.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-interview-schedule-detail',
  templateUrl: './interview-schedule-detail.component.html',
  styleUrls: ['./interview-schedule-detail.component.scss'],
})
export class InterViewScheduleDetailComponent implements OnInit {
  @Output() onSaveOrUpdateEmitter = new EventEmitter();
  interviewSForm!: FormGroup;
  interviewStatusList: any[] = [];
  employeeList: IEmployeeSetup[] = [];
  globalUserId!: number;
  isUpdate: boolean = false;
  selectedFile: any;

  get formControls() {
    return this.interviewSForm.controls;
  }
  get formValues() {
    return this.interviewSForm.getRawValue();
  }

  constructor(
    private _fb: FormBuilder,
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _utilityService: UtilityService,
    private _fileUploadService: FileuploadService
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.getAllInterviewStatus();
    this.getAllEmployees();
  }

  getAllInterviewStatus() {
    this._apiService.get(ApiEndpoints.InterviewStatus).subscribe({
      next: (res: any) => {
        this.interviewStatusList = res.data;
      },
      error: (err: any) => {
        this._toastService.sendMessage({
          message: 'Error in fetching Interview Status Data!',
          type: NotificationType.error,
        });
      },
    });
  }

  getAllEmployees() {
    this._apiService
      .get(ApiEndpoints.EmployeeSetup)
      //filter only active employees
      // .pipe(map((data: any) => data.filter((e: any) => e.IsActive)))
      .subscribe({
        next: (res: any) => {
          this.employeeList = res;
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: 'Error Occured while getting employee list',
            type: NotificationType.error,
          });
        },
      });
  }

  updateInterviewSchedule(payLoad: IInterviewSchedule) {
    this._fileUploadService
      .updateDataWithDocument(
        ApiEndpoints.InterviewSchedule,
        payLoad,
        this.selectedFile
      )
      .subscribe({
        next: (res: any) => {
          this._toastService.sendMessage({
            message: 'Interview Schedule Updated Successfully',
            type: NotificationType.success,
          });
          this.formInit();
          this.onSaveOrUpdateEmitter.emit();
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: err.message,
            type: NotificationType.error,
          });
        },
      });
  }

  postInterviewSchedule(payLoad: IInterviewSchedule) {
    this._fileUploadService
      .saveDataWithDocument(
        ApiEndpoints.InterviewSchedule,
        payLoad,
        this.selectedFile
      )
      .subscribe({
        next: (res: any) => {
          this._toastService.sendMessage({
            message: 'Interview Schedule Created Successfully',
            type: NotificationType.success,
          });
          this.formInit();
          this.onSaveOrUpdateEmitter.emit();
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: err.message,
            type: NotificationType.error,
          });
        },
      });
  }

  onFileSelect(event: any): void {
    const files: FileList = event.target.files;
    const fileInput = event.target;
    const file = fileInput.files[0];
    let filePath: string = '';

    if (file) {
      filePath = fileInput.value;
      this.selectedFile = files;
      this.interviewSForm.get('CVPath')?.setValue(filePath);
    } else {
      filePath = '';
      this.selectedFile = null;
    }
  }

  onSubmit() {
    debugger
    if (this.interviewSForm.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(this.interviewSForm);
      this._toastService.sendMessage({
        message: 'Please Check Form Values',
        type: NotificationType.error,
        title: 'Invalid Form',
      });
      return;
    }

    const payLoad: IInterviewSchedule = {
      ...this.formValues,
    };

    if (this.isUpdate) {
      this.updateInterviewSchedule(payLoad);
    } else {
      this.postInterviewSchedule(payLoad);
    }
  }

  refresh() {
    this.isUpdate = false;
    this.selectedFile = null;
    this.formInit();
  }

  formInit(): void {
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.interviewSForm = this._fb.group({
      InterviewId: [null],
      CandidateName: [
        null,
        [
          Validators.required,
          Validators.minLength(2), // Minimum length of 2 characters
          Validators.maxLength(50), // Maximum length of 50 characters
        ],
      ],
      CandidateEmail: [null, [Validators.required, Validators.email]],
      ContactNo: [null, [Validators.required, Validators.maxLength(20)]],
      CVPath: [null],
      CVPathValidation: [null, Validators.required],
      Remarks: [null],
      InterviewOn: [null, [Validators.required]],
      InterviewBy: [null],
      InterviewStatusCode: [null],
      CreatedBy: [this.globalUserId],
      CreatedOn: [null],
      ModifiedBy: [this.globalUserId],
      ModifiedOn: [null],
    });
  }
}
