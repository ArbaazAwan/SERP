import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { IInterviewSchedule } from 'src/app/_shared/model/HR-Payroll';
import { Column } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-interview-result',
  templateUrl: './interview-result.component.html',
  styleUrls: ['./interview-result.component.scss']
})
export class InterviewResultComponent implements OnInit {

  readonly componentName: string = 'Interview Schedule';
  globalFilterFields: string[] = [];
  isLoadingTable: boolean = false;
  cols: Column[] = [];
  isNotAuthorized:boolean = false;
  ModulelistResp$:any = [];
  selectedRow!:IInterviewSchedule;
  isUpdate:boolean = false;
  interviewResult:any;

  constructor(
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _confirmService: ConfirmationService
  ){}

  ngOnInit(): void {
    this.cols = [
      { header: 'Id', field: 'RequirementId' },
      { header: 'Requirement Date', field: 'RequirementDate' },
      { header: 'Designation', field: 'DesignationCode' },
      { header: 'Department', field: 'DepartmentCode' },
      { header: 'Locked', field: 'IsLocked' },
      { header: 'Approved', field: 'IsApproved' },
      { header: 'Hired', field: 'IsHired' },
      { header: 'Action', field: 'action' },
    ];
    this.loadAllInterviews();
  }

  loadAllInterviews() {
    this._apiService.get(ApiEndpoints.InterviewStatus + `/InterviewResult` ).subscribe({
      next :(res: any) => {
        this.interviewResult = res.data;
      },
      error: (err) =>{
        this._toastService.sendMessage({
          message: "Error Occured while Loading Interview Result",
          type: NotificationType.error
        });
      }
    });
  }

  onEdit(interviewSchedule:IInterviewSchedule){
    this.selectedRow = interviewSchedule;
    this.isUpdate = true;
  }

  onDelete(interviewSchedule:IInterviewSchedule){

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

  deleteInterviewSchedule(interviewId: number|undefined){
    this._apiService.delete(ApiEndpoints.InterviewSchedule + `/${interviewId}`)
    .subscribe({
      next: ((res:any) =>{
        this._toastService.sendMessage({
          message: 'Deleted the Interview Schedule',
          type: NotificationType.success
        });
      }),
      error: (err:any) =>{
        this._toastService.sendMessage({
          message: "Error Occured while Deleting Interview Schedule",
          type: NotificationType.error
        });
      }
    });
  }

}
