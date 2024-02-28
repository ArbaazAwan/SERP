import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserBranchModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UserFormRightsService } from 'src/app/_shared/services/user-form-rights.service';
interface ModuleItem {
  FormID: number;
  FormName: string;
  Add: boolean;
  Edit: boolean;
  Delete: boolean;
  SpeicalRight1: boolean;
  SpeicalRight2: boolean;
  SpeicalRight3: boolean;
  // ... other properties ...
}
@Component({
  selector: 'app-user-data-entryright',
  templateUrl: './user-data-entryright.component.html',
  styleUrls: ['./user-data-entryright.component.scss'],
})
export class UserDataEntryrightComponent implements OnInit {
  selectedModule!: number;
  form!: FormGroup;
  selectedUser!: number;
  UserBranches$: any = [];
  Usermodel!: UserBranchModel;
  userlist$: any = [];
  Modulelist$: any = [];
  ModulelistResp$: any = [];
  userlistResp$: any = [];
  visibleTable = false;
  componentName: string = 'User Data Entry Rights';
  masterCheckboxAdd: boolean = false;
  masterCheckboxEdit: boolean = false;
  masterCheckboxDelete: boolean = false;
  masterCheckboxSR1: boolean = false;
  masterCheckboxSR2: boolean = false;
  masterCheckboxSR3: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private apiServices: UserFormRightsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      UserId: this.fb.control('', Validators.required),
      BranchCode: this.fb.control('', Validators.required),
      AssignedOn: this.fb.control('', Validators.required),
      AssignedBy: this.fb.control('', Validators.required),
      userDropdown: this.fb.control('', Validators.required),
      ModuleDropdown: this.fb.control('', Validators.required),
    });
    this.loadAllUserList();
    this.loadallUserModule();
  }

  changeUsers(e: any) {
    this.selectedUser = +e.value;
    this.GetAllUserFormRights(this.selectedUser, this.selectedModule);
    this.visibleTable = true;
  }

  changeModule(e: any) {
    this.selectedModule = +e.value;
    this.GetAllUserFormRights(this.selectedUser, this.selectedModule);
    this.visibleTable = true;
  }

  loadAllUserList() {
    this.apiService.get(ApiEndpoints.getAllUsers).subscribe((res) => {
      this.userlist$ = res;
    });
  }

  loadallUserModule() {
    this.apiService.get(ApiEndpoints.GetAllModules).subscribe((res: any) => {
      this.Modulelist$ = res;
    });
  }

  GetAllUserFormRights(UserId: any, ModuleId: any) {
    this.apiService
      .get(
        ApiEndpoints.GetAllUserFormRights +
          '?UserId=' +
          UserId +
          '&ModuleId=' +
          ModuleId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;

        this.masterCheckboxAdd = res.every((item: any) => item['Add']);
        this.masterCheckboxEdit = res.every((item: any) => item['Edit']);
        this.masterCheckboxDelete = res.every((item: any) => item['Delete']);
        this.masterCheckboxSR1 = res.every(
          (item: any) => item['SpecialRight1']
        );
        this.masterCheckboxSR2 = res.every(
          (item: any) => item['SpecialRight2']
        );
        this.masterCheckboxSR3 = res.every(
          (item: any) => item['SpecialRight3']
        );
      });
  }

  saveorUpdate() {
    let user = localStorage.getItem('UserId');
    let currentdate = new Date();
    this.form.patchValue({
      BranchCode: +this.selectedModule,
      UserId: +this.selectedUser,
      AssignedOn: currentdate.toDateString(),
      AssignedBy: +user!,
    });
  }

  refresh() {
    this.form.reset();
    this.loadAllUserList();
    this.UserBranches$ = [];
  }

  saveUserRights() {
    const updatedData = this.ModulelistResp$.map((item: any) => {
      return {
        FormId: item.FormID,
        Add: item.Add,
        Edit: item.Edit,
        Delete: item.Delete,
        SpecialRight1: item.SpecialRight1,
        SpecialRight2: item.SpecialRight2,
        SpecialRight3: item.SpecialRight3,
      };
    });
    const moduleId = this.selectedModule;
    const userId = this.selectedUser;
    this.apiServices
      .createNewUserFormRights(moduleId, userId, updatedData)
      .subscribe();
      this.toastService.sendMessage({
        message: 'User Rights Saved Successfully!',
        type: NotificationType.success,
      });
  }

  selectAllCheckboxes(column: string, event: any) {
    const toggle: boolean = event.target.checked;
    if (toggle) {
      this.ModulelistResp$.forEach((item: any) => {
        item[column] = true;
      });
    } else {
      this.ModulelistResp$.forEach((item: any) => {
        item[column] = false;
      });
    }
    switch (column) {
      case 'Add':
        this.masterCheckboxAdd = toggle;
        break;
      case 'Edit':
        this.masterCheckboxEdit = toggle;
        break;
      case 'Delete':
        this.masterCheckboxDelete = toggle;
        break;
      case 'SpecialRight1':
        this.masterCheckboxSR1 = toggle;
        break;
      case 'SpecialRight2':
        this.masterCheckboxSR2 = toggle;
        break;
      case 'SpecialRight3':
        this.masterCheckboxSR3 = toggle;
        break;
      default:
        break;
    }
  }
}
