import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { Shift } from 'src/app/_shared/model/HR-Payroll';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-employee-shifts',
  templateUrl: './employee-shifts.component.html',
  styleUrls: ['./employee-shifts.component.scss'],
})
export class EmployeeShiftsComponent implements OnInit {
  form!: FormGroup;
  deptResponse: any = [];
  shifts: Shift[] = [];
  tableResponse: any = [];
  selectedData: any = [];
  selectDept: number = 0;
  optionalShift: any = [];
  hasData: boolean = false;
  componentName: string = "Employee Shifts";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      DepartmentCode: this.fb.control('', Validators.required),
      ShiftCode: this.fb.control('', Validators.required),
    });
    this.loadAllDept();
    this.loadShifts();
  }

  loadAllDept() {
    this.apiService.get(ApiEndpoints.GetAllDepartmentsList)
    .subscribe((res:any) => {
      this.deptResponse = res.data;
    });
  }

  loadShifts() {
    this.apiService.get(ApiEndpoints.Shift)
    .subscribe((res: any) => {
      this.shifts = res;
    });
  }

  loadEmployeeDept(DepartmentCode: number) {
    this.apiService.get(ApiEndpoints.GetDeptEmployees + `?DepartmentCode=${DepartmentCode}`)
    .subscribe((res) => {
      this.tableResponse = res;
    });
  }

  changeDept(event: any) {
    this.selectDept = +event.target.value;
    this.loadEmployeeDept(this.selectDept);
  }

  changeShift(event: any) {
    const shiftcode: number = +event.target.value;
    this.optionalShift = this.shifts.find((x: any) => {
      return x.ShiftCode === shiftcode;
    });
    if (this.optionalShift) {
      this.hasData = true;
    }
  }

  onHeaderCheckboxToggle(event: any) {
    if (event.checked) {
      this.selectedData = [...this.tableResponse];
    } else {
      this.selectedData = [];
    }
  }

  onRowSelect(event: any) {
    this.selectedData.push(event.data);
  }

  onRowUnselect(event: any) {
    const index = this.selectedData.indexOf(event.data);
    if (index !== -1) {
      this.selectedData.splice(index, 1);
    }
  }

  save() {
    let model: any = this.form.getRawValue();
    model.CreatedBy = +localStorage.getItem('UserId')!;

    for (let index = 0; index < this.selectedData.length; index++) {
      const element = this.selectedData[index];
      model.EmployeeCode = element.EmployeeCode;
      this.apiService.post(model, ApiEndpoints.AssignEmployeeShift)
      .subscribe(() => {});
    }
    this.form.reset();
    this.form.markAsUntouched();
    this.toastService.sendMessage({
      message: 'Employee Shifts Saved Successfully!',
      type: NotificationType.success,
    });
    this.tableResponse = [];
  }

  refresh() {
    this.form.reset();
    this.tableResponse = [];
    this.optionalShift = [];
  }
}
