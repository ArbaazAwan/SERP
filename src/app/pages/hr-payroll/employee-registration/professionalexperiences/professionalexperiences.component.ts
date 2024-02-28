import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { Column } from 'src/app/_shared/model/model';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-professionalexperiences',
  templateUrl: './professionalexperiences.component.html',
  styleUrls: ['./professionalexperiences.component.scss'],
})
export class ProfessionalexperiencesComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() generalForm!: FormGroup;
  get EmployeeCode() {
    return +(this.generalForm.get('BasicInfoForm') as FormGroup).get(
      'EmployeeCode'
    )?.value;
  }
  get EmployeeName() {
    return (this.generalForm.get('BasicInfoForm') as FormGroup).get(
      'EmployeeName'
    )?.value;
  }
  professionalExList: any = [];
  datePipe = new DatePipe('en-US');
  isUpdate!: boolean;
  cols: Column[] = [
    { header: 'Employee Name', field: 'EmployeeName' },
    { header: 'Job Title', field: 'JobTitle' },
    { header: 'Company Name', field: 'CompanyName' },
    { header: 'Start Date', field: 'StartDate' },
    { header: 'End Date', field: 'EndDate' },
    { header: 'Action', field: 'action' },
  ];
  constructor(
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private utilityService: UtilityService
  ) {}
  ngOnInit(): void {
    if (this.EmployeeCode)
      this.loadAllProfessionalExperiences(this.EmployeeCode);
  }

  loadAllProfessionalExperiences(EmployeeCode: number) {
    this.apiService
      .get(ApiEndpoints.ProfessionalExperiences + `/${EmployeeCode}`)
      .subscribe((res: any) => {
        this.professionalExList = res;
      });
  }

  save() {
    let model = this.form.getRawValue();
    model.EmployeeCode = this.EmployeeCode;

    this.apiService
      .post(model, ApiEndpoints.ProfessionalExperiences)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Professional Experience Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllProfessionalExperiences(this.EmployeeCode);
        this.form.reset();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    data.StartDate = this.datePipe.transform(data.StartDate, 'yyyy-MM-dd');
    data.EndDate = this.datePipe.transform(data.EndDate, 'yyyy-MM-dd');
    this.form.patchValue({ ...data });
  }

  update() {
    let model = this.form.getRawValue();
    model.EmployeeCode = this.EmployeeCode;
    this.apiService
      .update(model, ApiEndpoints.ProfessionalExperiences)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Professional Experience Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllProfessionalExperiences(this.EmployeeCode);
        this.isUpdate = false;
        this.form.reset();
      });
  }

  delete(ExperiencesCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.ProfessionalExperiences + `/${ExperiencesCode}`)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              title: 'Deleted!',
              message: 'Professional Experience Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllProfessionalExperiences(this.EmployeeCode);
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
    this.loadAllProfessionalExperiences(this.EmployeeCode);
  }
}
