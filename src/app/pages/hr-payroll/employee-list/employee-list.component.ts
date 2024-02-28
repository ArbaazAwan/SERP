import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { PersonalInfoModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { EmployeeRegistrationComponent } from '../employee-registration/employee-registration.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  @ViewChild('dt') dt!: any;
  @ViewChild('dt2') dt2!: any;
  @ViewChild(EmployeeRegistrationComponent)
  employeeRegistrationComponent!: EmployeeRegistrationComponent;
  isLoadingData: boolean = false;
  loadingerror: boolean = false;
  isUpdate: boolean = false;
  employeeTableResponse!: PersonalInfoModel[];
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Employee List';
  globalBranchCode: number = 0;
  selectedRow: any;
  globalFilters: string[] = [
    'EmployeeCode',
    'BranchCode',
    'EmployeeName',
    'DepartmentName',
    'DesignationName',
    'DivisionName',
    'CNIC'
  ];

  constructor(
    private _apiService: ApiProviderService,
    private _confirmService: ConfirmationService,
    private _toastService: ToastService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllEmployee();
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 4;
    const FormId = 2;
    this._apiService
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

  hideErrorPopup() {
    this.loadingerror = false;
  }

  loadAllEmployee() {
    this._apiService
      .get(ApiEndpoints.EmployeeSetup)
      .subscribe({
        next: (res: any) => {
          this.employeeTableResponse = res.sort(
            (a: { EmployeeCode: any }, b: { EmployeeCode: any }) =>
              a.EmployeeCode - b.EmployeeCode
          );
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: 'Error Occured while getting employee list',
            type: NotificationType.warning,
          });
        },
      });
  }

  delete(EmployeeCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this._confirmService.confirm({
      message: `Are you sure that you want to delete this Employee Code ${EmployeeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._apiService
          .delete(
            ApiEndpoints.EmployeeSetup + `/${EmployeeCode}`
          )
          .subscribe((res) => {
            this.loadAllEmployee();
            if (res === 200) {
              return this._toastService.sendMessage({
                message: 'Employee Deleted Successfully!',
                type: NotificationType.warning,
                title: 'Deleted',
              });
            }
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

  openNew(event?: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: event,
      },
    };

    this._router.navigate(['../employee-detail'], {
      relativeTo: this._route,
      ...navigationExtras,
    });
  }

  addorUpdate() {
    this.employeeRegistrationComponent.addorUpdate();
    this.isUpdate = this.employeeRegistrationComponent.isUpdate;
  }

  refresh() {
    this.employeeRegistrationComponent.refresh();
    this.isUpdate = this.employeeRegistrationComponent.isUpdate;
  }

  filter(event: any) {
    const value = event.target.value;
    this.dt2.filterGlobal(value, 'contains');
  }
}
