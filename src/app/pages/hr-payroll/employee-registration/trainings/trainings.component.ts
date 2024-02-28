import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() generalForm!: FormGroup;
  get EmployeeCode(){ return +(this.generalForm.get('BasicInfoForm') as FormGroup).get('EmployeeCode')?.value }
  TrainingResponse$: any = [];
  isUpdate!: boolean;
  constructor(
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
     if(this.EmployeeCode)
      this.loadAllTrainings(this.EmployeeCode);
    },2000)
  }

  loadAllTrainings(EmployeeCode: number) {
    this.apiService
      .get(ApiEndpoints.Trainings + `/${EmployeeCode}`)
      .subscribe((res: any) => {
        this.TrainingResponse$ = res;
      });
  }

  save() {
    let model = this.form.getRawValue();
    if (!model.Completion) {
      model.Completion = false;
    }
    model.EmployeeCode = this.EmployeeCode;
    this.apiService.post(model, ApiEndpoints.Trainings)
    .subscribe((_) => {
      this.toastService.sendMessage({
        message: 'Training Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllTrainings(this.EmployeeCode);
      this.form.reset();
    });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.form.patchValue({ ...data });
  }

  update() {
    let model = this.form.getRawValue();
    this.apiService.update(model, ApiEndpoints.Trainings)
    .subscribe((res) => {
      if(!res){
        this.toastService.sendMessage({
          message: 'Error Occured while updating Training',
          type: NotificationType.error,
        });
        return;
      }
      this.toastService.sendMessage({
        message: 'Training Updated Successfully!',
        type: NotificationType.success,
      });
      this.loadAllTrainings(this.EmployeeCode);
    });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(TrainingCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.Trainings + `/${TrainingCode}`)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              title:'Deleted!',
              message: 'Training Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllTrainings(this.EmployeeCode);
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

    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      this.toastService.sendMessage({
        message: 'Please Check All Form Fields',
        title: 'Invalid Form',
        type: NotificationType.error,
      });
      return;
    }

    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllTrainings(this.EmployeeCode);
  }
}
