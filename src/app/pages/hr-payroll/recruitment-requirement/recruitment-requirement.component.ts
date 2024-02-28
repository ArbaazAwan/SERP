import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { IRecruitmentRequirement } from 'src/app/_shared/model/HR-Payroll';
import { Column } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-recruitment-requirement',
  templateUrl: './recruitment-requirement.component.html',
  styleUrls: ['./recruitment-requirement.component.scss'],
})
export class RecruitmentRequirementComponent implements OnInit {

  componentName: string = 'Recruitment Requirement';
  recruitmentRequiremntList: IRecruitmentRequirement[] = [];
  globalFilterFields: string[] = [];
  isLoadingTable: boolean = false;
  cols: Column[] = [];
  isNotAuthorized:boolean = false;
  ModulelistResp$:any = [];

  constructor(
    private _apiService: ApiProviderService,
    private _router: Router,
    private _route: ActivatedRoute,
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
    this.getAllRecruitmentRequirements();
  }

  getAllRecruitmentRequirements() {
    this.isLoadingTable = true;
    this._apiService.get(ApiEndpoints.EmployeeRecruitmentRequirement)
    .subscribe({
      next:(res:any) => {
        this.recruitmentRequiremntList = res;
      },
      error:(err: any) => {},
      complete: () => {
        this.isLoadingTable = false;
      }
    });
  }

  onAddNew(){
    this._router.navigate(['../recruitment-requirement-detail'], {
      relativeTo: this._route
    });
  }

  onEdit(recruitmentRequirement:IRecruitmentRequirement){
    const navigationExtras: NavigationExtras = {
      state: {
        data: recruitmentRequirement,
      },
    };

    this._router.navigate(['../recruitment-requirement-detail'], {
      relativeTo: this._route,
      ...navigationExtras,
    });
  }

  onDelete(recruitmentRequirement:IRecruitmentRequirement){

    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.isNotAuthorized = true;
    //   return;
    // }

    this._confirmService.confirm({
      message: `Are you sure that you want to delete this Recuirement?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecuirement(recruitmentRequirement.RequirementId);
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

  deleteRecuirement(RequirementId: number){
    this._apiService.delete(ApiEndpoints.EmployeeRecruitmentRequirement + `/${RequirementId}`)
    .subscribe({
      next: ((res:any) =>{
        this._toastService.sendMessage({
          message: 'Deleted the Requirement',
          type: NotificationType.success
        });
      }),
      error: (err:any) =>{
        this._toastService.sendMessage({
          message: 'Error Occure While Deleting Requirement',
          type: NotificationType.error
        });
      }
    });
  }

}
