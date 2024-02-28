import { DateTime } from 'luxon';

export interface IRecruitmentRequirement {
  RequirementId: number;
  RequirementDate?: DateTime;
  DepartmentCode?: string;
  DesignationCode?: string;
  EmployeeCode?: string;
  RecruitmentTypeCode?: string;
  ReplacementOfEmployeeCode?: string;

  RequiredTillDate?: Date;
  ApprovedOn?: Date;
  HiringDateTime?: Date;
  CreatedOn?: Date;
  ModifiedOn?: Date;
  LockedOn?: Date;

  SalaryFrom?: number;
  SalaryTo?: number;
  ApprovedBy?: string;
  IsHired?: boolean;
  CreatedBy?: string;
  ModifiedBy?: string;
  IsLocked?: boolean;
  LockedBy?: string;
  IsApproved?: boolean;
}
export interface IGatepassType {
  GatepassTypeCode: number;
  GatepassType: string;
  IsForEmployement: boolean;
  IsActive: boolean;
  CreatedBy: number;
  ModifiedBy: number;
}


export interface IInterviewSchedule {
  RequirementId?: number;
  InterviewId?: number;
  CandidateName?: string;
  CandidateEmail?: string;
  ContactNo?: string;
  CVPath?: string;
  Remarks?: string;
  InterviewOn?: Date;
  InterviewBy?: number;
  InterviewStatusCode?: number;
  CreatedBy?: number;
  CreatedOn?: Date;
  ModifiedBy?: number;
  ModifiedOn?: Date;
}

export interface IInterviewStatus {
  InterviewStatusCode?: number;
  InterviewStatusText?: string;
  IsActive?: boolean;
  CreatedBy?: number;
  CreatedOn?: Date;
  ModifiedBy?: number;
  ModifiedOn?: Date;
}

export interface IEmployeeApplicant {
  ApplicantCode?: number;
  GatepassTypeCode?: number;
  GatepassDateFrom?: Date;
  GatepassDateTo?: Date;
  EmployeeName?: string;
  FatherName?: string;
  CNIC?: string;
  GenderCode?: number;
  DateOfJoining?: Date;
  DateOfBirth?: Date;
  Mobile?: string;
  BloodGroupCode?: number;
  ReligionCode?: number;
  MaritalStatusCode?: number;
  ApplicantStatusCode?: number;
  DepartmentCode?: number;
  DesignationCode?: number;
  EmployeeTypeCode?: number;
  PositionCode?: number;
  PresentAddress?: string;
  PresentAddressPhoneNo?: string;
  PermanentAddress?: string;
  PermanentAddressPhoneNo?: string;
  EmergencyContactNos?: string;
  Remarks?: string;
  IsActive?: boolean;
  CreatedBy?: number;
  CreatedOn?: Date;
  ModifiedBy?: number;
  ModifiedOn?: Date;
}

export interface IEmployeeApplicantView {
  ApplicantCode: number;
  GatepassTypeCode: number;
  GatepassDateFrom: string;
  GatepassDateTo: string;
  EmployeeName: string;
  FatherName: string;
  DepartmentCode: number;
  DesignationCode: number;
  GenderCode: number;
  EmployeeTypeCode: number;
  CNIC: string;
  Mobile: string;
  PresentAddress: string;
  PresentAddressPhoneNo: string;
  PermanentAddress: string;
  PermanentAddressPhoneNo: string;
  EmergencyContactNos: string;
  DateOfBirth: string;
  DateOfJoining: string;
  BloodGroupCode: number;
  ReligionCode: number;
  MaritalStatusCode: number;
  ApplicantStatusCode: number;
  Remarks: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
  DepartmentName: string;
  BloodGroupName: string;
  ApplicantStatus: string;
  EmployeeTypeName: string;
  GatepassType: string;
  GenderName: string;
  ReligionName: string;
  DesignationName: string;
  MaritalStatusName: string;
}

export interface IEmployeeSetup {
  EmployeeCode?: number;
  ApplicantCode?: number;
  EmployeeName: string;
  FatherName?: string;
  GenderCode: number;
  DepartmentCode?: number;
  DesignationCode?: number;
  EmployeeTypeCode?: number;
  JobLevelCode?: number;
  CNIC?: string;
  CNICValidityDate?: Date;
  PassportNo?: string;
  PassportValidityDate?: Date;
  NTN?: string;
  HealthInsuranceCardNo?: string;
  Email?: string;
  Mobile?: string;
  PresentCountryCode?: number;
  PresentStateCode?: number;
  PresentCityCode?: number;
  PresentAddress?: string;
  PresentAddressPhoneNo?: string;
  PermanentCountryCode?: number;
  PermanentStateCode?: number;
  PermanentCityCode?: number;
  PermanentAddress?: string;
  PermanentAddressPhoneNo?: string;
  EmergencyContactNos?: string;
  DateOfBirth?: Date;
  DateOfJoining?: Date;
  PlaceOfBirth?: string;
  BloodGroupCode?: number;
  NationalityCode?: number;
  ReligionCode?: number;
  MaritalStatusCode?: number;
  Disability: boolean;
  DisabilityNatureCode?: number;
  EvidencesAttached: boolean;
  ComputerSkills: boolean;
  LanguageSkills: boolean;
  OtherSkills?: string;
  EmployeePhotoPath?: string;
  EmployeeSignaturePath?: string;
  EOBINo?: string;
  SSNo?: string;
  Remarks?: string;
  OrientationDelivered: boolean;
  JDDelivered: boolean;
  KPIDelivered: boolean;
  IsMobileAllowed: boolean;
  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: Date;
  RFIDCardNo?: string;
  AttendifyEmployeeId?: string;
  TimeZone?: string;
}

export interface Shift {
  ShiftCode: number;
  ShiftName: string;
  ShortName: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: Date;
  ModifiedBy?: number | null;
  ModifiedOn?: Date | null;
}
export interface ShiftTiming {
  ShiftCode?: number;
  RevisedCode?: number;
  StartTime: Date;
  EndTime: Date;
  BreakStartTime: Date;
  BreakEndTime: Date;
  FlexiTime: number;
  Monday?: boolean | null;
  Tuesday?: boolean | null;
  Wednesday?: boolean | null;
  Thursday?: boolean | null;
  Friday?: boolean | null;
  Saturday?: boolean | null;
  Sunday?: boolean | null;
  RevisedBy?: number | null;
  RevisedOn?: Date | null;
  IsActive?: boolean | null;
  CreatedBy?: number | null;
  CreatedOn?: Date | null;
  ModifiedBy?: number | null;
  ModifiedOn?: Date | null;
}

export interface EmployeeBranch {
  EmployeeCode: number;
  EmployeeName: string;
  BranchCode: number;
  BranchName: string;
  Percentage: number;
  Checked: boolean;
}

export interface LeaveApplication {
  LeaveApplicationCode?: number;
  LeaveTypeCode: number;
  EmployeeCode: number;
  LeaveDate?: Date;
  LeaveDays?: number;
  AvailableLeaves?: number;
  ApprovalStatus?: boolean;
  Remarks?: string;
  CreatedBy?: number;
  CreatedOn?: Date;
  ModifiedBy?: number;
  ModifiedOn?: Date;
}
