import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ImportAttendifyAttendanceService } from 'src/app/_shared/services/import-attendify-attendance.service';

@Component({
  selector: 'app-import-attendify-attendance',
  templateUrl: './import-attendify-attendance.component.html',
  styleUrls: ['./import-attendify-attendance.component.scss'],
})
export class ImportAttendifyAttendanceComponent implements OnInit {
  form!: FormGroup;
  AttendifyAttendance: any = [];
  AttendifyAttendanceResponse$: any = [];
  componentName: string = "Attendify Attendance";
  constructor(
    private fb: FormBuilder,
    private apiService: ImportAttendifyAttendanceService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      employer_id: this.fb.control('', Validators.required),
      employee_id: this.fb.control('', Validators.required),
      start_date: this.fb.control('', Validators.required),
      end_date: this.fb.control('', Validators.required),
    });
  }

  LoadAllAttendifyAttendance() {
    // const employerId = this.form.get('employer_id')?.value;
    const employerId = localStorage.getItem('AttendifyCompanyId')!;
    const startDate = this.form.get('start_date')?.value;
    const endDate = this.form.get('end_date')?.value;
    this.apiService
      .getAllAttendifyAttendance(employerId, startDate, endDate)
      .subscribe((res) => {
        this.AttendifyAttendanceResponse$ = res;
      });
  }
}
