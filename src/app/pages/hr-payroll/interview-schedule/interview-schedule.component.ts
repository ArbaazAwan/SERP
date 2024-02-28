import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { IInterviewSchedule } from 'src/app/_shared/model/HR-Payroll';
import { Column } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { InterViewScheduleDetailComponent } from './interview-schedule-detail/interview-schedule-detail.component';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { FileuploadService } from 'src/app/_shared/services/file-upload.service';

@Component({
  selector: 'app-interview-schedule',
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.scss'],
})
export class InterviewScheduleComponent implements OnInit {
  readonly componentName: string = 'Interview Schedule';
  @ViewChild(InterViewScheduleDetailComponent)
  detailComponent!: InterViewScheduleDetailComponent;
  InterviewScheduleList: IInterviewSchedule[] = [];
  interviewStatusList: any[] = [];
  globalFilterFields: string[] = [];
  isLoadingTable: boolean = false;
  cols: Column[] = [];
  isNotAuthorized: boolean = false;
  ModulelistResp$: any = [];
  isLoadingData: boolean = false;
  interviewResult: any = [];

  constructor(
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _confirmService: ConfirmationService,
    private _utilityService: UtilityService,
    private _fileUploadService: FileuploadService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { header: 'Id', field: 'InterviewId' },
      { header: 'Candidate Name', field: 'CandidateName' },
      { header: 'Email', field: 'CandidateEmail' },
      { header: 'Contact No', field: 'ContactNo' },
      { header: 'Interview By', field: 'InterviewerName' },
      { header: 'InterviewStatus', field: 'InterviewStatusText' },
      { header: 'Action', field: 'action' },
    ];
    this.getAllInterviewSchedules();
    this.getAllInterviewStatus();
  }

  getAllInterviewSchedules() {
    this.isLoadingTable = true;
    this._apiService.get(ApiEndpoints.InterviewSchedule).subscribe({
      next: (res: any) => {
        this.InterviewScheduleList = res.data;
      },
      error: (err: any) => {
        this._toastService.sendMessage({
          message: 'Error Occured while getting Interview Schedules',
          type: NotificationType.error,
        });
      },
      complete: () => {
        this.isLoadingTable = false;
      },
    });
  }

  loadAllInterviewResults() {
    this.isLoadingData = true;
    this._apiService
      .get(ApiEndpoints.InterviewStatus + `/InterviewResult`)
      .subscribe({
        next: (res: any) => {
          this.interviewResult = res.data;
        },
        complete: () => {
          this.isLoadingData = false;
        },
      });
  }

  getAllInterviewStatus() {
    this._apiService.get(ApiEndpoints.InterviewStatus).subscribe({
      next: (res: any) => {
        this.interviewStatusList = res.data;
      },
      error: (err) => {
        this._toastService.sendMessage({
          message: 'Error Occured while Loading Interview Status List',
          type: NotificationType.error,
        });
      },
    });
  }

  getStatusName(InterviewStatusCode: number) {
    const interviewStatus = this.interviewStatusList.find(
      (x) => x.InterviewStatusCode == InterviewStatusCode
    );
    return interviewStatus?.InterviewStatusText || '';
  }

  onEdit(interviewSchedule: IInterviewSchedule) {
    this.detailComponent.interviewSForm.patchValue({ ...interviewSchedule });
    this.detailComponent.isUpdate = true;
  }

  onDelete(interviewSchedule: IInterviewSchedule) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.isNotAuthorized = true;
    //   return;
    // }

    this._confirmService.confirm({
      message: `Are you sure that you want to delete this Recuirement?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteInterviewSchedule(interviewSchedule.InterviewId);
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

  onViewCV(interviewId: number | null) {
    this._fileUploadService
      .viewDocument(ApiEndpoints.InterviewScheduleViewCV + `/${interviewId}`)
      .subscribe({
        next: (file: Blob) => {
          const fileUrl = URL.createObjectURL(file);
          window.open(fileUrl);
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: 'No CV Found',
            type: NotificationType.info,
          });
        },
      });
  }

  deleteInterviewSchedule(interviewId: number | undefined) {
    this._apiService
      .delete(ApiEndpoints.InterviewSchedule + `/${interviewId}`)
      .subscribe({
        next: (res: any) => {
          this._toastService.sendMessage({
            message: 'Deleted the Interview Schedule',
            type: NotificationType.success,
          });
          this._utilityService.deleteObject(this.InterviewScheduleList, {
            key: 'InterviewId',
            value: interviewId,
          });
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: 'Error Occured while Deleting Interview Schedule',
            type: NotificationType.error,
          });
        },
      });
  }
}
