import { EmployeeShiftsComponent } from './Employee-Transection/employee-shifts/employee-shifts.component';
import { HrPayrollDashboardComponent } from './hr-payroll-dashboard/hr-payroll-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenderComponent } from './Employee-Definition/gender/gender.component';
import { NationalityComponent } from './Employee-Definition/nationality/nationality.component';
import { ReligionComponent } from './Employee-Definition/religion/religion.component';
import { MaritalStatusComponent } from './Employee-Definition/marital-status/marital-status.component';
import { BloodGroupComponent } from './Employee-Definition/blood-group/blood-group.component';
import { StateComponent } from './Employee-Definition/state/state.component';
import { CityComponent } from './Employee-Definition/city/city.component';
import { DistrictComponent } from './Employee-Definition/district/district.component';
import { EmployeeTypeComponent } from './Employee-Definition/employee-type/employee-type.component';
import { DesignationComponent } from './Employee-Definition/designation/designation.component';
import { DesignationLevelsComponent } from './Employee-Definition/designation-levels/designation-levels.component';
import { JobLevelComponent } from './Employee-Definition/job-level/job-level.component';
import { DivisionComponent } from './Employee-Definition/division/division.component';
import { EducationalQualificationComponent } from './Employee-Definition/educational-qualification/educational-qualification.component';
import { ShiftComponent } from './Employee-Definition/shift/shift.component';
import { PayHeadsComponent } from './Employee-Definition/pay-heads/pay-heads.component';
import { EmployeeGlConfigurationComponent } from './Employee-Setup/employee-gl-configuration/employee-gl-configuration.component';
import { EmployeeArrearsComponent } from './Employee-Transection/employee-arrears/employee-arrears.component';
import { ShiftTimingComponent } from './Employee-Setup/shift-timing/shift-timing.component';
import { PayPackegeComponent } from './Employee-Setup/pay-packege/pay-packege.component';
import { ChangePasswordComponent } from 'src/app/screen/change-password/change-password.component';
import { LeaveTypeComponent } from './Employee-Setup/leave-type/leave-type.component';
import { LeaveApplicationComponent } from './Employee-Setup/leave-application/leave-application.component';
import { CountryComponent } from './Employee-Definition/country/country.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { ImportAttendifyAttendanceComponent } from './import-attendify-attendance/import-attendify-attendance.component';
import { HolidayTypeComponent } from './holiday-type/holiday-type.component';
import { FamilyInfoComponent } from './family-info/family-info.component';
import { EmployeeActionTypeComponent } from './Employee-Definition/employee-action-type/employee-action-type.component';
import { AllowanceDeductionComponent } from './Employee-Transection/allowance-deduction/allowance-deduction.component';
import { DepartmentComponent } from '../inventory/department/department.component';
import { EmployeeRegistrationComponent } from './employee-registration/employee-registration.component';
import { RecruitmentRequirementComponent } from './recruitment-requirement/recruitment-requirement.component';
import { RecruitmentRequirementDetailComponent } from './recruitment-requirement/recruitment-requirement-detail/recruitment-requirement-detail.component';
import { InterviewStatusComponent } from './Employee-Definition/interview-status/interview-status.component';
import { ApplicantGatepassTypeComponent } from './applicant-gatepass-type/applicant-gatepass-type.component';
import { InterviewScheduleComponent } from './interview-schedule/interview-schedule.component';
import { DisabilityNatureComponent } from './Employee-Definition/disability-nature/disability-nature.component';
import { DocumentTypeComponent } from './Employee-Definition/document-type/document-type.component';
import { EmployeeApplicantComponent } from './employee-applicant/employee-applicant.component';
import { EmployeeApplicantDetailComponent } from './employee-applicant/employee-applicant-detail/employee-applicant-detail.component';
import { EmployeeBankComponent } from './employee-bank/employee-bank.component';

const routes: Routes = [
  {
    path: '',
    component: HrPayrollDashboardComponent,
    children: [
      { path: 'employee-list', component: EmployeeListComponent },
      { path: 'employee-detail', component: EmployeeRegistrationComponent },
      { path: 'shift-timing', component: ShiftTimingComponent },
      { path: 'pay-package', component: PayPackegeComponent },
      { path: 'leave-type', component: LeaveTypeComponent },
      { path: 'leave-application', component: LeaveApplicationComponent },
      {
        path: 'employee-gl-configuration',
        component: EmployeeGlConfigurationComponent,
      },
      { path: 'employee-shifts', component: EmployeeShiftsComponent },
      { path: 'employee-arrears', component: EmployeeArrearsComponent },
      { path: 'allowance-deduction', component: AllowanceDeductionComponent },
      {
        path: 'import-attendify-attendance',
        component: ImportAttendifyAttendanceComponent,
      },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'gender', component: GenderComponent },
      { path: 'nationality', component: NationalityComponent },
      { path: 'religion', component: ReligionComponent },
      { path: 'marital-status', component: MaritalStatusComponent },
      { path: 'blood-group', component: BloodGroupComponent },
      { path: 'employee-type', component: EmployeeTypeComponent },
      { path: 'designation', component: DesignationComponent },
      { path: 'designation-levels', component: DesignationLevelsComponent },
      { path: 'interview-status', component: InterviewStatusComponent },
      { path: 'job-level', component: JobLevelComponent },
      { path: 'state', component: StateComponent },
      { path: 'city', component: CityComponent },
      { path: 'district', component: DistrictComponent },
      { path: 'division', component: DivisionComponent },
      { path: 'disability-nature', component: DisabilityNatureComponent },
      { path: 'document-type', component: DocumentTypeComponent },
      { path: 'departments', component: DepartmentComponent },
      {
        path: 'educational-qualification',
        component: EducationalQualificationComponent,
      },
      { path: 'shift', component: ShiftComponent },
      { path: 'pay-heads', component: PayHeadsComponent },
      { path: 'holiday-type', component: HolidayTypeComponent },
      { path: 'employee-action-type', component: EmployeeActionTypeComponent },
      { path: 'family-info', component: FamilyInfoComponent },
      { path: 'country', component: CountryComponent },
      {
        path: 'recruitment-requirement',
        component: RecruitmentRequirementComponent,
      },
      {
        path: 'recruitment-requirement-detail',
        component: RecruitmentRequirementDetailComponent,
      },
      {
        path: 'applicant-gatepass-type',
        component: ApplicantGatepassTypeComponent,
      },
      { path: 'interview-schedule', component: InterviewScheduleComponent },
      { path: 'employee-applicant', component: EmployeeApplicantComponent },
      { path: 'employee-applicant-detail', component: EmployeeApplicantDetailComponent },
      { path: 'employee-bank', component: EmployeeBankComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrPayrollRoutingModule {}
