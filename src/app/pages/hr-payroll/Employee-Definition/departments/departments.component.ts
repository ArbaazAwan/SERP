import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

interface Option {
  key: string;
  value: string;
}
@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  form: FormGroup = this.fb.group({
    DepartmentType: ['', Validators.required],
    DivisionCode: ['', Validators.required],
    DepartmentName: ['', Validators.required],
    ShortName: ['', Validators.required],
    IsActive: [false, Validators.required],
    IsStore: [false, Validators.required],
    ConsiderForStock: [false, Validators.required],
  });
  Department: any = [];
  model: any = [];
  isUpdate: boolean = false;
  selectedDepartment: any = [];
  options: Option[];
  DptDivisionresponse$: any = [];
  selectedDivision!: number;
  isSticky: boolean = false;
  isLoadingData: boolean = false;

  constructor(
    private apiService_department: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.options = [
      { key: '1', value: 'General Division' },
      { key: '2', value: 'Fabric Division' },
      { key: '3', value: 'Garment Division' },
      { key: '4', value: 'Stitching Unit' },
      { key: '5', value: 'Finishing Unit' },
      { key: '6', value: 'Packing Division' },
    ];
  }
  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  ngOnInit(): void {
    this.loadAllDepartments();
    this.loadAllDivision();
  }
  changeDivision(e: any) {
    this.selectedDivision = +e.target.value;
  }
  loadAllDivision() {
    this.apiService_department
      .get(ApiEndpoints.Division)
      .subscribe((res: any) => {
        this.DptDivisionresponse$ = res;
      });
  }
  loadAllDepartments() {
    this.isLoadingData = true;
    this.apiService_department
      .get(ApiEndpoints.GetAllDepartmentsList)
      .subscribe((res: any) => {
        this.Department = res.data;
        this.isLoadingData = false;
      });
  }

  AddOrUpdateDepartment() {
    //Checking & Setting Default Checkbox Values
    this.form.patchValue({
      IsActive:
        this.form.get('IsActive')?.value == (undefined || null)
          ? false
          : this.form.get('IsActive')?.value,
      IsStore:
        this.form.get('IsStore')?.value == (undefined || null)
          ? false
          : this.form.get('IsStore')?.value,
      ConsiderForStock:
        this.form.get('ConsiderForStock')?.value == (undefined || null)
          ? false
          : this.form.get('ConsiderForStock')?.value,
    });
    this.selectedDepartment = this.options.find(
      (option) => option.key === this.model.DepartmentType.key
    );
    this.form.get('DepartmentType')?.setValue(this.selectedDepartment?.key);
    if (this.form.invalid) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }
    if (!this.isUpdate) {
      this.AddNewDepartment();
    } else {
      this.UpdateDepartment();
    }
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllDepartments();
  }

  AddNewDepartment() {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.form.patchValue({
      DivisionCode: this.selectedDivision,
      CreatedBy: +user!,
      CreatedOn: currentDate.toLocaleString(),
      ConsiderForStock:
        this.form.get('ConsiderForStock')?.value == (undefined || null)
          ? false
          : this.form.get('ConsiderForStock')?.value,
    });
    let val = this.form.value;
    this.model = val;
    this.model.DepartmentType = this.selectedDepartment?.value;
    this.apiService_department
      .post(this.model, ApiEndpoints.PostDepartment)
      .subscribe((res) => {
        this.loadAllDepartments();
        this.toastService.sendMessage({
          title: 'Success',
          message: 'Department Saved Successfully!',
          type: NotificationType.success,
        });
      });
    this.form.markAsUntouched();
    this.form.reset();
  }

  UpdateDepartment() {
    this.model.ModifiedBy = +localStorage.getItem('UserId')!;
    this.model.ModifiedOn = new Date();
    this.model.DepartmentType = this.model.DepartmentType.value;
    this.form.patchValue({
      ConsiderForStock:
        this.form.get('ConsiderForStock')?.value == (undefined || null)
          ? false
          : this.form.get('ConsiderForStock')?.value,
    });

    this.apiService_department
      .update(this.model, ApiEndpoints.PutDepartment)
      .subscribe((res) => {
        this.form.patchValue({
          DepartmentModel: this.Department,
        });
        this.loadAllDepartments();
        this.toastService.sendMessage({
          title: 'Success',
          message: 'Department Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
  }

  DeleteDepartment(DepartmentCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete Department Code ${DepartmentCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService_department
          .delete(
            ApiEndpoints.DeleteDepartment + '?DepartmentCode=' + DepartmentCode
          )
          .subscribe((res) => {
            this.loadAllDepartments();
            this.toastService.sendMessage({
              title: 'Delete',
              message: 'Department Deleted Successfully!',
              type: NotificationType.error,
            });
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

  GetSelectedRow(data: any) {
    this.isUpdate = true;
    this.model = { ...data };
    let x = Object.values(this.options).find((y: any) => {
      return y.value === this.model.DepartmentType;
    });
    this.model.DepartmentType = x;
  }
}
