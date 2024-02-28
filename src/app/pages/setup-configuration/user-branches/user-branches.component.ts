import { ToastService } from 'src/app/_shared/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { UserBranchModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';

@Component({
  selector: 'app-user-branches',
  templateUrl: './user-branches.component.html',
  styleUrls: ['./user-branches.component.scss'],
})
export class UserBranchesComponent implements OnInit {
  selectedBranch!: number;
  form!: FormGroup;
  selectedUser!: number;
  UserBranches$: any = [];
  Usermodel!: UserBranchModel;
  userlist$: any = [];
  branchlist$: any = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      UserId: this.fb.control('', Validators.required),
      BranchCode: this.fb.control('', Validators.required),
      AssignedOn: this.fb.control('', Validators.required),
      AssignedBy: this.fb.control('', Validators.required),
      userDropdown: this.fb.control('', Validators.required),
      branchDropdown: this.fb.control('', Validators.required),
      // userDropdown: new FormArray([]),
      // branchDropdown: new FormArray([]),
    });
    //this.loadallBranchesList();
    this.loadAllUserList();
  }

  changeUsers(e: any) {
    this.selectedUser = +e.target.value;
    this.getId(this.selectedUser);
    this.loadallUserBranchesList(this.selectedUser);
    //let x = this.userlist$.map((x: any) => x.selectedBranch);
  }

  getId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getUserBranchByUserId + '?UserId=' + UserId)
      .subscribe((res) => {
        this.UserBranches$ = res;
      });
  }

  changeBranch(e: any) {
    this.selectedBranch = +e.target.value;
  }

  get userName() {
    return this.form.get('user');
  }

  loadAllUserList() {
    this.apiService.get(ApiEndpoints.getAllUsers).subscribe((res) => {
      this.userlist$ = res;
    });
  }

  get branchName() {
    return this.form.get('branches');
  }

  loadallUserBranchesList(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getAllUserBranches + '?UserId=' + UserId)
      .subscribe((res: any) => {
        this.branchlist$ = res.data;
      });
  }

  save() {
    let val = this.form.value;
    this.Usermodel = val;
    this.apiService
      .post(this.Usermodel, ApiEndpoints.postUserBranches)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'User Branches Saved Successfully!',
          type: NotificationType.success,
        });
        this.getId(this.selectedUser);
        this.loadallUserBranchesList(this.selectedUser);
      });
    this.form.markAsUntouched();
  }

  delete(UserId: number, BranchCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteUserBranches +
              '?UserId=' +
              UserId +
              '&BranchCode=' +
              BranchCode
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'User Branches Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.getId(this.selectedUser);
            this.loadallUserBranchesList(this.selectedUser);
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
    let user = localStorage.getItem('UserId');
    let currentdate = new Date();

    this.form.patchValue({
      BranchCode: +this.selectedBranch,
      UserId: +this.selectedUser,
      AssignedOn: currentdate.toDateString(),
      AssignedBy: +user!,
    });

    if (
      this.form.invalid ||
      this.selectedBranch === undefined ||
      this.selectedUser === undefined
    ) {
      // return this.toastService.sendMessage({
      //    message: 'Form Invalid',
      //    type: NotificationType.error,
      // });
    }
    this.save();
  }

  refresh() {
    this.form.reset();
    this.loadAllUserList();
    //this.loadallBranchesList();
    this.UserBranches$ = [];
  }
}
