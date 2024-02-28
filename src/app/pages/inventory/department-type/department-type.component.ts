import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-department-type',
  templateUrl: './department-type.component.html',
  styleUrls: ['./department-type.component.scss'],
})
export class DepartmentTypeComponent implements OnInit {
  form!: FormGroup;
  departmenttype: any = [];
  departmenttyperesponse$: any = [];
  DepartmentTypeMAxCode: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  globalBranchCode!: number;
  componentName: string = 'Department Type';
  isLoadingData: boolean = false;
  globalUser: any;

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUser = localStorage.getItem('UserId');

    this.refresh();
  }

  formInit() {
    this.form = this.fb.group({
      BranchCode: [null],
      DepartmentTypeCode: [null],
      DepartmentTitle: [null, Validators.required],
      IsActive: [true, Validators.required],
    });
  }

  loadAllDepartmentType() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.GetAllDepartmentType)
      .subscribe((res: any) => {
        this.departmenttyperesponse$ = res.data;
        this.isLoadingData = false;
      });
    this.loadDepartmentTypeMAxCode();
  }

  loadDepartmentTypeMAxCode() {
    this.apiServices
      .get(ApiEndpoints.GetMaxDepartmentTypeCode)
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.DepartmentTypeMAxCode = +x.DepartmentTypeCode;
        this.form
          .get('DepartmentTypeCode')
          ?.setValue(this.DepartmentTypeMAxCode);
      });
  }

  save() {
    let model = this.form.getRawValue();
    model.BranchCode = this.globalBranchCode!;
    model.CreatedBy = this.globalUser;
    this.apiServices
      .post(model, ApiEndpoints.CreateDepartmentType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Department Type Saved Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
      });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.departmenttype = { ...data };
    this.form.patchValue({...data});
    this.tableLength = Object.keys(this.departmenttype).length;
  }

  update() {
    let payLoad = this.form.getRawValue();
    payLoad.BranchCode = this.globalBranchCode!;
    payLoad.CreatedBy = this.globalUser;
    this.apiServices
      .update(payLoad, ApiEndpoints.UpdateDepartmentType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Department Type Updated Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(DepartmentTypeCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(
            ApiEndpoints.DeleteDepartmentType +
              '?DepartmentTypeCode=' +
              DepartmentTypeCode
          )
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Department Type Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllDepartmentType();
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

    if(this.form.invalid){
      this.toastService.sendMessage({
        message:"Please check you form values",
        type: NotificationType.error,
        title:"Invalid Form"
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
    this.formInit();
    this.loadAllDepartmentType();
  }
}
