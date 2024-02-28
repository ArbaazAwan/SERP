import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-lead-status',
  templateUrl: './lead-status.component.html',
  styleUrls: ['./lead-status.component.scss'],
})
export class LeadStatusComponent implements OnInit {
  form!: FormGroup;
  Status: any = [];
  Statusresponse$: any = [];
  StatusMAxCode: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Leads Status';
  isLoadingData: boolean = false;
  @Input() displayHeader: any;
  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      StatusCode: this.fb.control('', Validators.required),
      StatusTitle: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required),
    });
    this.loadAllStatus();
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 9;
    const FormId = 2;
    this.apiServices
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

  loadAllStatus() {
    this.isLoadingData = true;
    this.apiServices.get(ApiEndpoints.GetAllLeadsStatus)
      .subscribe((res: any) => {
        this.Statusresponse$ = res.data;
        this.isLoadingData = false;
      });
    this.loadStatusMAxCode();
  }
  loadStatusMAxCode() {
    this.apiServices
      .get(ApiEndpoints.GetMaxLeadsStatusCode)
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.StatusMAxCode = +x.StatusCode;
        this.form.get('StatusCode')?.setValue(this.StatusMAxCode);
      });
  }
  save() {
    this.form.patchValue({
      StatusCode: this.StatusMAxCode,
      IsActive: this.form.get('IsActive')?.value === undefined ? false : true,
    });
    let model = this.form.value;
    model.StatusTitle = this.Status.StatusTitle;
    this.apiServices
      .post(model, ApiEndpoints.AddLeadsStatus)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Lead Status Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllStatus();
        this.form.reset();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.Status = { ...data };
    this.tableLength = Object.keys(this.Status).length;
  }
  update() {
    this.apiServices
      .update(this.Status, ApiEndpoints.UpdateLeadsStatus)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Lead Status Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllStatus();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(StatusCode: number) {
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
          .delete(ApiEndpoints.DeleteLeadsStatus + '?StatusCode=' + StatusCode)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Lead Status Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllStatus();
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

  addorUpdate() {
    if (!this.isUpdate) {
      this.add();
    } else {
      this.updateAllow();
    }
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
    this.loadAllStatus();
  }
  IsActive() {
    const IsActiveControl = this.form.get('IsActive');
    if (IsActiveControl) {
      IsActiveControl.setValue(!IsActiveControl.value);
    }
  }
}
