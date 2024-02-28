import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.scss'],
})
export class UserRightsComponent implements OnInit {
  selectedBranch!: number;
  form!: FormGroup;
  selectedUser!: number;
  userlist$: any = [];
  UserBranches$: any = [];
  branchlist$: any = [];
  project$: any = [];
  UserProjects$: any = [];
  branch$: any = [];
  
 componentName: string = "User Rights";
  checkboxStates: { [key: string]: boolean } = {};

  uservoucherTypeId: any = [];
  uservoucherTypeUserId: any = [];
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.selectedBranch;
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
    this.loadAllUserList();
  }
  changeUsers(e: any) {

    // this.selectedUser = +e.target.value;
    this.selectedUser = +e.value;
    localStorage.setItem('selectedUser', this.selectedUser.toString());
    this.getId(this.selectedUser);
    this.loadallUserBranchesList(this.selectedUser);
    this.loadUserVouchersTypebyUserId(this.selectedUser);

    //let x = this.userlist$.map((x: any) => x.selectedBranch);
  }
  loadUserVoucherTypebyId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getUserVoucherTypeById + '?UserId=' + UserId)
      .subscribe((res) => {
        this.uservoucherTypeId = res;
      });
  }
  loadUserVouchersTypebyUserId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.GetAllUsersVouchersTypes + '?UserId=' + UserId)
      .subscribe((res) => {
        this.uservoucherTypeUserId = res;
      });
  }

  getId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.GetAllUsersBranches + '?UserId=' + UserId)
      .subscribe((res) => {
        this.UserBranches$ = res;
      });
  }

  handleCheckboxChange(rowData: any, event: any) {

    this.selectedBranch = rowData.BranchCode;
    // let userId = parseInt(localStorage.getItem('UserId') || '0', 10);
     let userId = parseInt(localStorage.getItem('selectedUser') || '0', 10);

    rowData.userId = this.selectedUser;
    rowData.AssignedBy = userId;
    let model = rowData;
    this.checkboxStates[rowData.IsAllowed] = event.target.checked;
    if (event.target.checked) {
      // this.getBranchProjects(this.selectedBranch);
      this.apiService
        .post(model, ApiEndpoints.postUserBranches)
        .subscribe((res) => {
          this.toastService.sendMessage({
            message: 'Save Successfully',
            type: NotificationType.success,
          });
          this.getId(this.selectedUser);
          this.loadallUserBranchesList(this.selectedUser);
        });
    } else {
      this.delete(this.selectedUser, this.selectedBranch);
      // this.DeleteUserProjectByBranchId(this.selectedUser, this.selectedBranch);
    }
  }

  handleCheckboxProjectsChange(rowData: any, event: any) {
    // this.selectedBranch = rowData.BranchCode;
    let branchcode = parseInt(localStorage.getItem('BranchCode') || '0', 10);
    rowData.BranchCode = branchcode;
    let userId = parseInt(localStorage.getItem('UserId') || '0', 10);
    rowData.userId = this.selectedUser;
    rowData.AssignedBy = userId;
    let model = rowData;
    this.checkboxStates[rowData.IsAllowed] = event.target.checked;
    if (event.target.checked) {
      // this.getBranchProjects(this.selectedBranch);
      this.apiService
        .post(model, ApiEndpoints.CreateNewUserProjects)
        .subscribe((res) => {
          this.toastService.sendMessage({
            message: 'Save Successfully',
            type: NotificationType.success,
          });
          this.getId(this.selectedUser);
          this.loadallUserBranchesList(this.selectedUser);
        });
    } else {
      this.deleteProjects(
        this.selectedUser,
        rowData.BranchCode,
        rowData.ProjectCode
      );
    }
  }

  projectdata(data: any) {
    //localStorage.setItem('BranchCode', data.BranchCode);
    // let userId = parseInt(localStorage.getItem('UserId') || '0', 10);
    let userId = parseInt(localStorage.getItem('selectedUser') || '0', 10)
    data.UserId = userId;
    if (data.IsAllowed == 1) {
      this.getBranchProjects(data.BranchCode, data.UserId);
    } else {
      this.toastService.sendMessage({
        message: 'Please Allow branch',
        type: NotificationType.warning,
      });
    }
  }

  handleCheckboxVoucherChange(rowData: any, event: any) {

    rowData.userId = this.selectedUser;

    let model = rowData;
    if (event.target.checked) {
      // this.getBranchProjects(this.selectedBranch);
      this.apiService
        .post(model, ApiEndpoints.postUserVoucherType)
        .subscribe((res) => {
          this.toastService.sendMessage({
            message: 'Save Successfully',
            type: NotificationType.success,
          });
          this.getId(this.selectedUser);
          this.loadUserVouchersTypebyUserId(this.selectedUser);
        });
    } else {
      this.deleteVoucher(this.selectedUser, rowData.VoucherTypeCode);
    }
  }

  get userName() {
    return this.form.get('user');
  }
  loadAllUserList() {
    this.apiService.get(ApiEndpoints.getAllUsers).subscribe((res) => {
      this.userlist$ = res;
    });
  }
  // changeBranch(e: any) {
  //   this.selectedBranch = +e.target.value;
  //   this.getBranchProjects(this.selectedBranch);
  // }
  // getBranchProjects(BranchCode: number) {
  //   this.apiService
  //     .get(ApiEndpoints.GetBranchProjects + '?BranchCode=' + BranchCode)
  //     .subscribe((res) => {
  //       this.project$ = res;
  //     });
  // }
  getBranchProjects(BranchCode: number, UserId: number) {
    this.apiService
      .get(
        ApiEndpoints.GetUserProjects +
          '?BranchCode=' +
          BranchCode +
          '&UserId=' +
          UserId
      )
      .subscribe((res:any) => {
        this.project$ = res.data
      });
  }
  getUserBranchesbyUserId(UserId: number) {
    this.apiService
      .get(ApiEndpoints.getUserBranchesByUserId + '?UserId=' + UserId)
      .subscribe((res) => {
        this.branch$ = res;
      });
  }
  // save() {
  //   let val = this.form.value;
  //   this.Usermodel = val;
  //   this.apiService
  //     .post(this.Usermodel, ApiEndpoints.postUserBranches)
  //     .subscribe((res) => {
  //       this.toastService.sendMessage({
  //         message: 'Save Successfully',
  //         type: NotificationType.success,
  //       });
  //       this.getId(this.selectedUser);
  //       this.loadallUserBranchesList(this.selectedUser);
  //     });
  //   this.form.markAsUntouched();
  // }
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
              message: 'Record deleted!',
              type: NotificationType.warning,
            });
            this.getId(this.selectedUser);
            this.loadallUserBranchesList(this.selectedUser);
            // this.DeleteUserProjectByBranchId(UserId, BranchCode);
            this.deleteprojectsBranch(UserId, BranchCode)
          }
          );
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
  deleteprojectsBranch(userid:any,branchcode:any){
    this.apiService
          .delete(
            ApiEndpoints.DeleteUserProjectByBranchId +
              '?UserId=' +
              userid+
              '&BranchCode=' +
              branchcode
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Projects Record deleted!',
              type: NotificationType.warning,
            });

            this.getId(this.selectedUser);
            this.loadallUserBranchesList(this.selectedUser);
          });
  }
  DeleteUserProjectByBranchId(UserId: number, BranchCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteUserProjectByBranchId +
              '?UserId=' +
              UserId +
              '&BranchCode=' +
              BranchCode
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Record deleted!',
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
  deleteVoucher(UserId: number, VoucherTypeCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteUserVoucherType +
              '?UserId=' +
              UserId +
              '&VoucherTypeCode=' +
              VoucherTypeCode
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Voucher Deleted Successfully!',
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
  deleteProjects(UserId: number, BranchCode: number, ProjectCode: number) {
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
              '&BranchCode=' +
              BranchCode +
              '&ProjectCode=' +
              ProjectCode
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Project Deleted Successfully!',
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
  refresh() {
    this.form.reset();
    this.loadAllUserList();
    //this.loadallBranchesList();
    // this.UserBranches$ = [];
  }
}
