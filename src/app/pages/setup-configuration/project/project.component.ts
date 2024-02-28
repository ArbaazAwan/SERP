import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ProjectModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { DatePipe } from '@angular/common';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { UtilityService } from 'src/app/_shared/services/utility.service';

interface Project {
  BranchCode: string;
  ProjectName: string;
  ShortName: string;
  Description: string;
  StartDate: any;
  EndDate: any;
  ModifiedBy: any;
  ModifiedOn: any;
};

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  form!: FormGroup;
  project!:Project;
  Branches: any = [];
  projects: any = [];
  model!: ProjectModel;
  isUpdate!: boolean;
  ProjectMaxId!: number;
  datePipe = new DatePipe('en-US');
  tableLength!: number;
  selectedBranch!: number;
  componentName: string = "Project";
  get formValue(): any { return this.form.getRawValue(); }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private utilityService: UtilityService,
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.allBranches();
    this.loadAllProjects();
  }

  formInit(): void {
    this.form = this.fb.group({
      BranchCode: ['', Validators.required],
      ProjectCode: [''],
      ProjectName: ['', Validators.required],
      ShortName: ['', Validators.required],
      Description: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      CreatedBy: [''],
      CreatedOn: [''],
      ModifiedBy: [''],
      ModifiedOn: [''],
      branches: new FormArray([]),
    });
  }

  changeBranch(e: any) {
    this.selectedBranch = e.value;
    if (this.selectedBranch != null) {
      this.LoadAllProjectsByBranchCode(this.selectedBranch);
    }
    else {
      window.location.reload();
    }
  }

  allBranches() {
    this.apiService.get(ApiEndpoints.getAllBranches).subscribe((res) => {
      this.Branches = res;
    });
  }

  loadAllProjects() {
    this.apiService.get(ApiEndpoints.getAllProject).subscribe((res) => {
      this.projects = res;
    });
    this.loadAllProjectsMaxId();
  }
  LoadAllProjectsByBranchCode(BranchCode: number) {
    this.apiService.get(ApiEndpoints.GetProjectsByBranchCode + '?BranchCode=' + BranchCode).subscribe((res) => {
      this.projects = res;
    });
    this.loadAllProjectsMaxId();
  }

  loadAllProjectsMaxId() {
    this.apiService.get(ApiEndpoints.getAllProjectMaxId).subscribe((res) => {
      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
      this.ProjectMaxId = +x.ProjectCode;
    });
  }
  addProjectDetails() {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.form.patchValue({
      ProjectCode: this.ProjectMaxId,
      CreatedBy: +user!,
      CreatedOn: currentDate.toLocaleString(),
    });
    let val = this.form.value;
    this.model = val;
    let x = +this.form.get('ProjectCode')?.value;
    this.model.BranchCode = this.selectedBranch
    this.apiService
      .post(this.model, ApiEndpoints.postProjects)
      .subscribe((res) => {
        if (res.BranchCode == x) {
          this.toastService.sendMessage({
            message: 'Record already exist!',
            type: NotificationType.error,
          });
        } else {
          this.onRefresh();
          this.loadAllProjects();
        }
      });
    this.form.markAsUntouched();
  }

  updateProjectDetails() {
    this.apiService
      .update(this.formValue, ApiEndpoints.putProjects)
      .subscribe((_) => {
        this.form.patchValue({
          ProjectModel: this.project,
        });
        this.toastService.sendMessage({
          message: 'Project Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllProjects();
      });
    this.isUpdate = false;
    this.onRefresh();
  }

  deleteProjectDetails(ProjectCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteProjects + '?ProjectCode=' + ProjectCode)
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Project Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.loadAllProjects();
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

  getSelectedRow(data: any) {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.isUpdate = true;
    this.project = data;
    data.StartDate = this.datePipe.transform(
      data.StartDate,
      'yyyy-MM-dd'
    );
    data.EndDate = this.datePipe.transform(data.EndDate, 'yyyy-MM-dd');
    this.form.patchValue({
      ModifiedBy: +user!,
      ModifiedOn: currentDate.toLocaleString(),
    });
    data.ModifiedBy = this.form.get('ModifiedBy')?.value;
    data.ModifiedOn = this.form.get('ModifiedOn')?.value;
    this.tableLength = Object.keys(this.project).length;
    this.form.patchValue({...data});
  }

  print(e: any) {
  }

  addorUpdate() {
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      this.toastService.sendMessage({
        message: 'Form is Invalid!',
        type: NotificationType.error,
      });
      return;
    }
    if (!this.isUpdate) {
      this.addProjectDetails();
    } else {
      this.updateProjectDetails();
    }
  }

  onRefresh() {
    this.isUpdate = false;
    this.resetForm();
    this.loadAllProjects();
    this.allBranches();
  }

  resetForm() {
    const exclude: string[] = ['ProjectCode'];
    Object.keys(this.form.controls).forEach((key) => {
      if (exclude.findIndex((q) => q === key) === -1) {
        this.form.get(key)?.reset();
      }
    });
  }
}
