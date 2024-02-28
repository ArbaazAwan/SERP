import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Column } from 'src/app/_shared/model/model';
import {
  IEmployeeApplicant,
  IEmployeeApplicantView,
} from 'src/app/_shared/model/HR-Payroll';
import { DatePipe } from '@angular/common';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-employee-applicant',
  templateUrl: './employee-applicant.component.html',
  styleUrls: ['./employee-applicant.component.scss'],
})
export class EmployeeApplicantComponent implements OnInit {
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  EmployeeApplicantList: IEmployeeApplicantView[] = [];
  DesignationCode: any;
  isUpdate!: boolean;
  loadingerror = false;
  private _datePipe:DatePipe = new DatePipe('en-US');
  cols: Column[] = [
    { header: 'Employee', field: 'EmployeeName' },
    { header: 'S/O', field: 'FatherName' },
    // { header: 'Gatepass Type', field: 'GatepassType' },
    { header: 'From', field: 'GatepassDateFrom' },
    { header: 'To', field: 'GatepassDateTo' },
    { header: 'Gender', field: 'GenderName' },
    { header: 'Joining', field: 'DateOfJoining' },
    // { header: 'Mobile#', field: 'Mobile' },
    { header: 'Designation', field: 'DesignationName' },
    { header: 'Status', field: 'ApplicantStatus' },
    // { header: 'Employee Type', field: 'EmployeeTypeName' },
    { header: 'Action', field: 'action' },
  ];

  constructor(
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _confirmService: ConfirmationService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.getAllEmployeeApplicant();
  }

  getAllEmployeeApplicant() {
    this.isLoadingData = true;
    this._apiService.get(ApiEndpoints.EmployeeApplicant).subscribe({
      next: (res: any) => {
        this.EmployeeApplicantList = res.data;
      },
      error: (err) => {
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

  onAddNew() {
    this._router.navigate(['../employee-applicant-detail'], {
      relativeTo: this._route,
    });
  }

  onEdit(rowData: IEmployeeApplicant) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: rowData,
      },
    };
    this._router.navigate(['../employee-applicant-detail'], {
      relativeTo: this._route,
      ...navigationExtras,
    });
  }

  onDelete(ApplicantCode: number) {
    this._confirmService.confirm({
      message: `Are you sure that you want to delete this Employee Applicant?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteApplicant(ApplicantCode);
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

  deleteApplicant(ApplicantCode: number) {
    this._apiService
      .delete(ApiEndpoints.EmployeeApplicant + `/${ApplicantCode}`)
      .subscribe((res) => {
        debugger;
        if (res === true) {
          this._utilityService.deleteObject(this.EmployeeApplicantList, {key: 'ApplicantCode', value: ApplicantCode})
          return this._toastService.sendMessage({
            message: 'Employee Applicant Deleted Successfully!',
            type: NotificationType.deleted,
            title: 'Deleted',
          });
        }
      });
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

  hideErrorPopup() {
    this.loadingerror = false;
  }
}
