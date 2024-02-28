import { ToastService } from 'src/app/_shared/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.scss'],
})
export class UserProjectsComponent implements OnInit {
  form!: FormGroup;
  model: any = [];
  user$: any = [];
  project$: any = [];
  branch$: any = [];
  UserProjects$: any = [];
  selectUser!: number;
  selectproject!: number;
  selectedBranch!: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      UserId: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      BranchCode: this.fb.control('', Validators.required),
      AssignedOn: this.fb.control('', Validators.required),
      AssignedBy: this.fb.control('', Validators.required),
    });
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.apiService.get(ApiEndpoints.getAllUsers).subscribe((res: any) => {
      this.user$ = res;
    });
  }

  changeUsers(e: any) {
    this.selectUser = +e.target.value;
    this.getUserBranchesbyUserId(this.selectUser);
    this.getUserProjectsbyUserId(this.selectUser);
  }

  changeUsersProjects(e: any) {
    this.selectproject = +e.target.value;
  }

  changeBranch(e: any) {
    this.selectedBranch = +e.target.value;
    this.getBranchProjects(this.selectedBranch);
  }

  getBranchProjects(BranchCode: number) {
    this.apiService
      .get(ApiEndpoints.GetBranchProjects + '?BranchCode=' + BranchCode)
      .subscribe((res) => {
        this.project$ = res;
      });
  }

  getUserBranchesbyUserId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getUserBranchesByUserId + '?UserId=' + UserId)
      .subscribe((res) => {
        this.branch$ = res;
      });
  }

  getUserProjectsbyUserId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getUserProjectByUserId + '?UserId=' + UserId)
      .subscribe((res) => {
        this.UserProjects$ = res;
      });
  }

  get UserId() {
    return this.form.get('UserId');
  }

  get ProjectCode() {
    return this.form.get('ProjectCode');
  }

  get BranchCode() {
    return this.form.get('BranchCode');
  }

  save() {
    let val = this.form.value;
    this.model = val;
    this.apiService
      .post(this.model, ApiEndpoints.postUserProjects)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'User Project Saved Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
        this.getUserProjectsbyUserId(this.selectUser);
        this.getUserBranchesbyUserId(this.selectUser);
        this.getBranchProjects(this.selectedBranch);
      });
    this.form.markAsUntouched();
  }

  delete(UserId: number, ProjectCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteUserProjects +
              '?UserId=' +
              UserId +
              '&ProjectCode=' +
              ProjectCode
          )
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'User Project Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.getUserProjectsbyUserId(this.selectUser);
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

  saveorUpdate() {
    let currentdate = new Date();
    let branchCode = localStorage.getItem('BranchCode');
    let user = localStorage.getItem('UserId');

    this.form.patchValue({
      ProjectCode: +this.selectproject,
      UserId: +this.selectUser,
      BranchCode: +branchCode!,
      AssignedOn: currentdate.toDateString(),
      AssignedBy: +user!,
    });

    if (
      this.form.invalid ||
      this.selectproject === undefined ||
      this.selectUser === undefined
    ) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }
    this.save();
  }

  refresh() {
    this.form.reset();
    this.loadAllUsers();
    this.getUserBranchesbyUserId(this.selectUser);
    this.getBranchProjects(this.selectedBranch);
    this.UserProjects$ = [];
  }
}
