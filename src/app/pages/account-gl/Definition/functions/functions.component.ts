import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss'],
})
export class FunctionsComponent implements OnInit {
  form!: FormGroup;
  Function: any = [];
  Functionresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
ModulelistResp$: any = [];
UserId:any;
componentName: string = "Functions";
isLoadingData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      FunctionCode: this.fb.control('', Validators.required),
      Name: this.fb.control('', Validators.required),
    });
        //=====================Get User Rights =================
        const UserId  = localStorage.getItem('UserId');

        if (UserId !== null) {
          this.UserId = +UserId;
        }
        const ModuleId = 1;
        const FormId = 16;
        this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
          .subscribe((res: any) => {
            this.ModulelistResp$ = res;
          });
    this.loadAllFunctions();
  }

  loadAllFunctions() {
    this.isLoadingData = true;
    this.apiServices.get(ApiEndpoints.getAllFunctions).subscribe((res: any) => {
      this.Functionresponse$ = res;
      this.isLoadingData = false;
    });
    this.loadMaxFunctionsCode();
  }

  loadMaxFunctionsCode() {
    this.apiServices
      .get(ApiEndpoints.getMaxFunctionsCode)
      .subscribe((res: any) => {
        this.Function.FunctionCode = res[0].FunctionCode;
      });
  }

  save() {
    let model = this.form.value;
    model.FunctionCode = this.Function.FunctionCode;
    model.Name = this.Function.Name;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices.post(model, ApiEndpoints.postFunctions).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Functions Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllFunctions();
      this.form.reset();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.Function = { ...data };
    this.tableLength = Object.keys(this.Function).length;
  }

  update() {
    let model = this.form.value;
    this.apiServices.update(model, ApiEndpoints.putFunctions).subscribe(() => {
      this.loadAllFunctions();
      this.toastService.sendMessage({
        message: 'Functions Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(FunctionCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(
            ApiEndpoints.deleteFunctions + '?FunctionCode=' + FunctionCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Function Deleted Succesfully!',
              type: NotificationType.deleted,
            });
            this.loadAllFunctions();
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


  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.save();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

 hideErrorPopup() {
    this.loadingerror = false;
  }
  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllFunctions();
  }
}
