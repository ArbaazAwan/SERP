import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-user-modules',
  templateUrl: './user-modules.component.html',
  styleUrls: ['./user-modules.component.scss']
})
export class UserModulesComponent implements OnInit {

  selectedModule!: number;
  form!: FormGroup;
  selectedUser!: number;
  userlist$: any = [];
  Modulelist$: any = [];
  UserModulelist$: any = [];
  ModulelistResp$: any = [];
  userlistResp$: any = [];
  tableLength!: number;
  componentName: string = "User Modules";


  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,

    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      UserId: this.fb.control('', Validators.required),
      ModuleId: this.fb.control('', Validators.required),
    });
    this.loadAllUserList();
  }

  changeUsers(e: any) {
    this.selectedUser = +e.value;
    this.loadallModule(this.selectedUser);
    this.loadallUserModule(this.selectedUser)

  }
  changeModule(e: any) {
    this.selectedModule = +e.value;


  }
  loadAllUserList() {
    this.apiService.get(ApiEndpoints.getAllUsers).subscribe((res) => {
      this.userlist$ = res;
    });
  }

  loadallModule(UserId : number) {
    this.apiService.get(ApiEndpoints.GetAllModulesforuser+'?UserId='+UserId).subscribe((res: any) => {
      this.Modulelist$ = res;
    });
  }

  loadallUserModule(UserId : number) {
    this.apiService.get(ApiEndpoints.GetAllUserModules+'?UserId='+UserId).subscribe((res: any) => {
      this.UserModulelist$ = res;
    });
  }


  saveUserModules() {
    let model = this.form.value;
    model.UserId=this.selectedUser;
    model.ModuleId=this.selectedModule;
    this.apiService
      .post(model, ApiEndpoints.CreateNewUserModules)
      .subscribe((res : any) => {
        this.toastService.sendMessage({
          message: 'User Module Saved Successfully!',
          type: NotificationType.success,
        });
        this.form.reset();
        this.loadallUserModule(this.selectedUser);
        this.loadallModule(this.selectedUser);

      });
      this.form.markAsUntouched();
      window.location.reload();
  }
  deleteUserModule(ModuleId :number) {
    let UserId =this.selectedUser;
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DeleteUserModule + '?UserId=' + UserId+ '&ModuleId=' + ModuleId)
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'User Module Deleted Successfully!',
              type: NotificationType.deleted,
            });
        this.loadallUserModule(this.selectedUser);
        this.loadallModule(this.selectedUser);
        window.location.reload();
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


}
