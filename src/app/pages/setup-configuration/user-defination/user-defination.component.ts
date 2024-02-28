import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { CustomValidators } from 'src/app/_shared/function/CustomValidators';
import { UserModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-user-defination',
  templateUrl: './user-defination.component.html',
  styleUrls: ['./user-defination.component.scss'],
})
export class UserDefinationComponent implements OnInit {
  form!: FormGroup;
  Branches: any = [];
  userdefination: any = [];
  userdefinationResponse$: any = [];
  employeeTableResponse: any = [];
  selectBranch: any = null;
  model!: UserModel;
  isUpdate: boolean = false;
  selectUser: any;
  UserId: number = 0;
  ShowAdd: boolean | undefined;
  users: any;
  UserModel: any;
  tableLength!: number;
  selectedEmplyeeCode: number = 0;
  componentName: string = 'User Definition';
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.UserId = +localStorage.getItem('UserId')!;
    this.LoadallBranches();
    this.LoadAllUserlist();
    this.loadAllEmployee();
    this.formInit();
  }

  formInit() {
    this.form = this.fb.group(
      {
        // BranchCode: this.fb.control('', Validators.required),
        // UserId: this.fb.control('', Validators.required),
        Username: this.fb.control('', Validators.required),
        Password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ],
        ],
        ConfirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ],
        ],
        EmployeeCode: this.fb.control(''),
        IsActive: this.fb.control(true),
        branches: new Array([]),
        validators: this.checkPasswords,
      },
      { validator: CustomValidators.MatchingPasswords }
    );
  }

  loadAllEmployee() {
    this.apiService.get(ApiEndpoints.EmployeeSetup).subscribe((res: any) => {
      this.employeeTableResponse = res;
      console.log('employees=>', this.employeeTableResponse);
    });
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('Password')?.value;
    let confirmPass = group.get('ConfirmPassword')?.value;

    return pass === confirmPass ? null : { notSame: true };
  };

  // changeBranch(e: any) {
  //   this.selectBranch = +e.target.value;
  // }

  get branchName() {
    return this.form.get('branches');
  }

  LoadallBranches() {
    this.apiService.get(ApiEndpoints.getAllBranches).subscribe((res: any) => {
      this.Branches = res;
    });
  }
  LoadAllUserlist() {
    this.apiService.get(ApiEndpoints.getAllUserList).subscribe((res) => {
      this.userdefinationResponse$ = res;
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  AddUser() {
    // this.form.patchValue({
    //   BranchCode: +this.selectBranch,
    //   IsActive: this.form.get('IsActive')?.value === undefined ? true : false,
    // });
    let val = this.form.value;
    this.model = val;
    this.model.EmployeeCode = this.selectedEmplyeeCode;
    this.model.BranchCode =
      this.selectBranch || localStorage.getItem('BranchCode');
    this.apiService.post(this.model, ApiEndpoints.postUser).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'User Definition Saved Successfully!',
        type: NotificationType.success,
      });
      this.LoadAllUserlist();
    });
    this.formInit();
    this.refresh();
  }

  updateUser() {
    let model = this.form.value;
    model.UserId = this.UserId;
    model.EmployeeCode = this.selectedEmplyeeCode;
    this.apiService.update(model, ApiEndpoints.putUser).subscribe((res) => {
      this.form.patchValue({
        UserModel: this.userdefination,
      });
      this.toastService.sendMessage({
        message: 'User Definition Updated Successfully!',
        type: NotificationType.success,
      });
      this.LoadAllUserlist();
    });
    this.isUpdate = false;
    this.formInit();
  }

  changeEmployee(event: any) {
    this.selectedEmplyeeCode = event?.target?.value;
  }

  deleteUser(UserId: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DeleteUser + '?UserId=' + UserId)
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'User Definition Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.LoadAllUserlist();
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
    this.isUpdate = true;
    this.model = { ...data };
    this.userdefination = data;
    this.tableLength = Object.keys(this.userdefination).length;
  }

  addorUpdate() {
    if (!this.isUpdate) {
      this.AddUser();
    } else {
      this.updateUser();
    }
  }

  refresh() {
    this.isUpdate = false;
    this.LoadAllUserlist();
    this.LoadallBranches();
    this.formInit();
  }
}
