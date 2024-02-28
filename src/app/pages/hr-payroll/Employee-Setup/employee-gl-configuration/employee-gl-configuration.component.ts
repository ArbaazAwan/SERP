import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-employee-gl-configuration',
  templateUrl: './employee-gl-configuration.component.html',
  styleUrls: ['./employee-gl-configuration.component.scss'],
})
export class EmployeeGlConfigurationComponent implements OnInit {
  form!: FormGroup;
  PayHeads: any = [];
  PayHeadsresponse$: any = [];
  globalBranchCode: number = 0;
  isUpdate!: boolean;
  tableLength!: number;
  componentName: string = "Employee GL Configuration";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      PayHeadsCode: this.fb.control('', Validators.required),
      PayHeadsName: this.fb.control('', Validators.required),
      ShortName: this.fb.control('', Validators.required),
      Nature: this.fb.control('', Validators.required),
      Status: this.fb.control('', Validators.required),
    });
    this.loadAllPayHeads();
  }
  Status(){
    const Status = this.form.get('Status');
    if (Status) {
      Status.setValue(!Status.value);
    }
  }

  loadAllPayHeads() {
    this.apiService.get(ApiEndpoints.GetAllEmployeeGLConfiguration)
    .subscribe((res: any) => {
      this.PayHeadsresponse$ = res;
    });
    this.loadMaxPayHeadsCode();
  }

  loadMaxPayHeadsCode() {
    this.apiService.get(ApiEndpoints.GetMaxEmployeeGLConfigurationCode)
      .subscribe((res: any) => {
        this.PayHeads.PayHeadsCode = res[0].PayHeadsCode;
      });
  }

  save() {
    let model = this.form.value;
    if (!model.Status) {
      model.Status = false;
    }
    model.PayHeadsCode = this.PayHeads.PayHeadsCode;
    model.PayHeadsName = this.PayHeads.PayHeadsName;
    model.ShortName = this.PayHeads.ShortName;
    model.Nature = this.PayHeads.Nature;
    model.BranchCode = this.globalBranchCode!;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiService.post(model, ApiEndpoints.AddEmployeeGLConfiguration)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Employee GL Configuration Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllPayHeads();
      this.form.reset();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.PayHeads = { ...data };
    this.tableLength = Object.keys(this.PayHeads).length;
  }

  update() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    this.apiService.update(model, ApiEndpoints.UpdateEmployeeGLConfiguration + `?`)
    .subscribe(() => {
      this.loadAllPayHeads();
      this.toastService.sendMessage({
        message: 'Employee GL Configuration Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(PayHeadsCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteEmployeeGLConfiguration + 
          `?EmployeeGLConfigurationCode=${PayHeadsCode}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Employee GL Configuration Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllPayHeads();
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
      this.save();
    } else {
      this.update();
    }
  }
  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllPayHeads();
  }
}
