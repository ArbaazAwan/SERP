export interface UserModel {
  BranchCode: number;
  EmployeeCode: number;
  UserId: number;
  Username: string;
  Password: string;
  IsActive: boolean;
}

export interface CompanyConfigModel {
  CompanyCode: number;
  CompanyName: string;
  ShortName: string;
  Address: string;
  PhoneNo: string;
  EmailAddress: string;
  STRegistrationNo: string;
  NTN: string;
  TitleOfTax: string;
  LanguageId: number;
  IsActive: boolean;
}

export interface FinancialMonthModel {
  FinancialYearCode: number;
  FinancialMonthCode: number;
  MonthTitle: string;
  StartDate: string;
  EndDate: string;
  IsOpenForEntry: boolean;
  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
}
export interface FinancialYearModel {
  FinancialYearCode: number;
  YearTitle: string;
  StartDate: string;
  EndDate: string;
  IsOpenForEntry: boolean;
  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
}
export interface ProjectModel {
  BranchCode: number;
  ProjectCode: number;
  ProjectName: string;
  ShortName: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
}

export interface BranchModel {
  BranchCode: number;
  BranchName: string;
  ShortName: string;
  Description: string;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: any;
  ModifiedBy: any;
}
export interface UserModel {
  BranchCode: number;
  EmployeeCode: number;
  UserId: number;
  Username: string;
  Password: string;
  IsActive: boolean;
}

export interface UserBranchModel {
  UserId: number;
  BranchCode: number;
  AssignedOn: string;
  AssignedBy: number;
}

export interface UserProjectsModel {
  UserId: number;
  ProjectCode: number;
  BranchCode: number;
  AssignedOn: string;
  AssignedBy: number;
}

export interface VoucherTypeModel {
  VoucherTypeCode: number;
  VoucherTypeName: string;
  ShortName: string;
  Description: string;
  IsOpenning: boolean;
  NumberingTypeCode: string;
  IsPrefix: boolean;
  IsDatePrefix: boolean;
  PrefixText?: string;
  ReportName: string;
  ApprovalLimitDays?: number;
  IsAutoApprove: boolean;
  IsActive: boolean;
}

export interface VoucherDetailModel {
  BranchCode: number;
  ProjectCode: number;
  VoucherTypeCode: number;
  VoucherNo: number;
  VoucherId: number;
  EntrySeq: number;
  AccountCode: string;
  AccountCodeWithSeperator: string;
  Narration: string;
  DebitAmount: number;
  CreditAmount: number;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: string;
  ModifiedBy: number;
  VoucherDetailId: number;
  AssetCode: number;
  EmployeeCode: number;
  PartyCode: number;
  wo_number: number;
  CodeLevel: number;
  CodeLevel2: number;
  CodeLevel3: number;
  FunctionCode: number;
}

export interface ChartOfAccountModel {
  AccountCode: string;
  AccountCodeWithSeperator: string;
  AccountName: string;
  ShortName: string;
  LevelCode: number;
  ParentAccountCode?: number;
  CategoryId: number;
  SubCategoryId: number;
  Remarks?: string;
  HasDetail: boolean;
  IsDetail: boolean;
  CreditPeriod: number;
  IsForTrial: boolean;
  IsAllowedEntry: boolean;
  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy?: number;
  ModifiedOn?: string;
  IsApproved: boolean;
  ApprovedBy?: number;
  ApprovedOn?: string;
  BalanceSheetCode: number;
  BalanceSheetSubCode: number;
}

export interface InstrumentModel {
  InstrumentTypeId: number;
  InstrumentTypeName: string;
  ShortName: string;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: string;
  ModifiedBy: number;
  IsActive: boolean;
}

export interface VoucherMasterModel {
  length: number;
  VoucherId: number;
  BranchCode: number;
  ProjectCode: number;
  VoucherTypeCode: number;
  VoucherNo: number;
  VoucherDate: string;
  Description: string;
  InstrumentTypeId: number;
  InstrumentNo: number;
  InstrumentDate: string;
  CurrencyCode: number;
  FCRate: number;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: string;
  ModifiedBy: number;
  IsPosted: boolean;
  PostedOn: string;
  PostedBy: number;
  IsDropped: boolean;
  DroppedOn: string;
  DroppedBy: number;
  FinancialYearCode: number;
  FinancialMonthCode: number;
  ChequeBookId: number;
  ChequeNo:number;
  AccountId:number;
}
export interface UserVoucherTypeModel {
  UserId: number;
  VoucherTypeCode: number;
}

export interface CurrencyModel {
  BranchCode: number;
  CurrencyCode: number;
  CurrencySerial: number;
  CurrencyTitle: string;
  Symbol: string;
  IsPrimaryCurrency: boolean;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
}

export interface DepartmentModel {
  DepartmentCode: number;
  DivisionCode: number;
  DepartmentType: string;
  DepartmentName: string;
  ShortName: string;
  IsActive: boolean;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: string;
  ModifiedBy: number;
  StoreName: string;
  IsStore: boolean;
  ConsiderForStock: boolean;
}
export interface PartySetupModel {
  BranchCode: number;
  PartyCode: number;
  PartyName: string;
  ShortName: string;
  PartyTypeId: number;
  HeadOfficeAddress: string;
  MillAddress: string;
  HeadOfficePhone: string;
  MillPhone: string;
  URL: string;
  Email: string;
  STRNo: string;
  NTN: string;
  CNICNo: string;
  Remarks: string;
  IsActive: boolean;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: string;
  ModifiedBy: number;
  AccountReceivable: number;
  AccountPayable: number;
  Amount: number;
  DebitCreditLimit: number;
  CompanyIndividual: string;
  IsTrackAsCompany: boolean;
  IsAllowedEmail: boolean;
  IsTaxExempt: boolean;
  IsAcceptChecks: boolean;
  IsShippingAddress: boolean;
  Street: string;
  Street2: string;
  City: string;
  State: string;
  Zip: string;
  SaleLicense: string;
  SalesLicenseExpiry: string;
  EndsExpiry: string;
  EndsLicense: string;
  RefrenceName: string;
  IsMailAllowed: boolean;
}
export interface GetPartyItemRates {
  PartyCode: number;
  ItemCode: string;
  Rate: number;
}

export interface DepartmentLocationModel {
  BranchCode: number;
  DepartmentCode: number;
  LocationCode: number;
  LocationName: string;
  LocationNumber: string;
  ConsiderForStock: boolean;
  IsActive: boolean;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: string;
  ModifiedBy: number;
}
export interface ChartofItemModel {
  BranchCode: number;
  ItemCode: string;
  ItemCodeWithSeperator: string;
  ItemName: string;
  ShortName: string;
  stores: any[];
  items: any[];
  TaxId: any;
  ParentItemCode: string;
  MinLevel: number;
  MaxLevel: number;
  CreatedOn: string;
  ApprovedOn: string;
  HasDetail: boolean;
  IsDetail: boolean;
  Hirarchy: string;
  Remarks: string;
  ItemSizeCode: number;
  ItemColourCode: number;
  ItemTypeCode: number;
  ItemCategoryCode: number;
  ItemGradeCode: number;
  ItemManufacturerCode: number;
  ItemBrandCode: number;
  ItemModelCode: number;
  ItemUnitCode: number;
  RegistrationNo: string;
  ItemImagePath: string;
  SalePrice: number;
  AccountCode: string;
  AccountName: any;
  TaxCode: string;
  PrintTags: boolean;
  Unorderable: boolean;
  UseSerial: boolean;
  EarnCommission: boolean;
  EarnRewards: boolean;
  ShippingWeight: string;
  ShippingHeight: string;
  ShippingLength: string;
  ShippingWidth: string;
  StoreCode: number;
  Income: string;
  Asset: string;
  UPC: string;
  IsCapex: boolean;
  IsOpex: boolean;
  Children: any[];
}

export interface QualificationModel {
  BranchCode: number;
  EmployeeCode: string;
  QualificationCode?: string;
  DegreeTitle: string;
  InstitutionName: string;
  BoardOrUniversityName?: string;
  Subject?: number;
  PassingYear?: number;
  DivisionOrGrade?: string;
}
export interface DemandMasterModel {
  BranchCode: number;
  DemandNo: number;
  DemandDate: string;
  StoreCode: number;
  DemandRaisedByDeptCode: number;
  DemandRaisedByUserId: number;
  DemandRaisedByUserEmail: string;
  DemandReceivedDT: string;
  RequiredOnDate: string;
  wo_number: number;
  Remarks: string;
  CreatedOn: string;
  CreatedBy: number;
  IsLocked: boolean;
  LockedBy: number;
  LockedOn: string;
  IsRejected: boolean;
  RejectedBy: number;
  RejectedOn: string;
}

export interface DemandDetailModel {
  BranchCode: number;
  DemandNo: number;
  DemandSrNo: number;
  StoreCode: number;
  ItemCode: string;
  DemandQty: number;
  UnitCode: number;
  Note: string;
  IsClosed: boolean;
  ClosingRemarks: string;
  ClosedBy: number;
  ClosedOn: string;
  ApprovedQty: number;
  IsApproved: boolean;
  ApprovedOn: string;
  ApprovedBy: number;
  IsRejected: boolean;
  RejectedOn: string;
  RejectedBy: number;
  IsHold: boolean;
  HoldOn: string;
  HoldBy: number;
  CreatedBy : number;
}

export interface IGPMasterModel {
  BranchCode: number;
  StoreCode: number;
  IGPNo: number;
  IGPDate: string;
  PartyCode: number;
  IGPPurposeId: number;
  Driver: string;
  VehicleNo: string;
  Remarks: string;
  IsLocked: boolean;
  LockedBy: number;
  LockedOn: string;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
}

export interface CustomersModel {
  BranchCode: number;
  CNIC: number;
  Name: string;
  Address: string;
  PhoneNo: number;
  CreaditDays: number;
  CreditLimit: number;
  IsActive: boolean;
}

export interface SalesManModel {
  BranchCode: number;
  CNIC: string;
  SalesManId: number;
  Name: string;
  Address: string;
  PhoneNo: string;
  IsActive: boolean;
}
export interface GenderModel {
  GenderCode: number;
  GenderName: string;
  IsActive: boolean;
}
export interface NationalityModel {
  BranchCode: number;
  NationalityCode: number;
  NationalityName: string;
  Status: string;
  UserId: string;
  AddDateTime: string;
}
export interface ReligionModel {
  BranchCode: number;
  ReligionCode: number;
  ReligionName: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface MaritalStatusModel {
  BranchCode: number;
  MaritalStatusCode: number;
  MaritalStatusName: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface BloodGroupModel {
  BranchCode: number;
  BloodGroupCode: number;
  BloodGroupName: string;
  Status: boolean;
  UserId: number;
  AddDateTime: string;
}
export interface ProvinceModel {
  ProvinceCode: number;
  ProvinceName: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface CityModel {
  ProvinceCode: number;
  CityCode: number;
  CityName: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
  ProvinceName: string;
}
export interface DistrictModel {
  ProvinceName: string;
  CityName: string;
  DistrictName: string;
  ProvinceCode: number;
  CityCode: number;
  DistrictCode: number;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface EmployeeTypeModel {
  BranchCode: number;
  EmployeeTypeCode: number;
  EmployeeTypeName: string;
  Status: boolean;
  UserId: number;
  AddDateTime: string;
}
export interface JobLevelModel {
  BranchCode: number;
  JobLevelCode: number;
  JobLevelName: string;
  Status: boolean;
  UserId: number;
  AddDateTime: string;
}
export interface DesignationModel {
  BranchCode: number;
  DesignationCode: number;
  DesignationName: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}

export interface DepartmentDivisionModel {
  BranchCode: number;
  DivisionCode: number;
  DivisionName: string;
  ShortName: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface EducationalQualificationModel {
  BranchCode: number;
  QualificationCode: number;
  QualificationName: string;
  QualificationLevel: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface ShiftModel {
  BranchCode: number;
  ShiftCode: number;
  ShiftName: string;
  ShortName: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}

export interface PersonalInfoModel {
  BranchCode: number;
  EmployeeCode: number;
  EmpCode: string;
  EmployeeName: string;
  GenderCode: number;
  FatherName: string;
  DepartmentCode: number;
  DeptSectionCode: number;
  DesignationCode: number;
  CNIC: string;
  CNICValidityDate: string;
  Email: string;
  Mobile: string;
  PresentAddress: string;
  PresentAddressPoliceStation: string;
  PresentAddressPhoneNo: string;
  PresentCityCode: number;
  PresentCountryCode: number;
  PresentProvinceCode: number;
  PermanentAddress: string;
  PermanentAddressPoliceStation: string;
  PermanentAddressPhoneNo: string;
  PermanentCityCode: number;
  PermanentCountryCode: number;
  PermanentProvinceCode: number;
  EmergencyContactNos: string;
  DateOfBirth: number;
  BloodGroupCode: number;
  NationalityCode: number;
  ReligionCode: number;
  MaritalStatusCode: number;
  NoOfChildren: number;
  Disability: boolean;
  DisabilityNature: string;
  DateOfJoining: string;
  EOBINo: any;
  SSNo: any;
  Remarks: any;
  JDDelivered: any;
  KPIDelivered: any;
  EmployeeType: number;
  JobLevel: number;
  DivisionName: string;
  DepartmentName: string;
  DesignationName: string;
}

export interface PayHeadsModel {
  BranchCode: number;
  PayHeadCode: number;
  PayHeadName: string;
  ShortName: string;
  Nature: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface ShiftCycleModel {
  BranchCode: number;
  ShiftCycleCode: number;
  ShiftCycleName: string;
  ShortName: string;
  Particulars: string;
  Status: boolean;
  UserId: string;
  AddDateTime: string;
}
export interface EmployeeGLConfigurationModel {
  BranchCode: number;
  UserId: string;
}
export interface EmployeeArrearsModel {
  BranchCode: number;
  UserId: string;
}
export interface EmployeeDeductionModel {
  BranchCode: number;
  UserId: string;
}

export interface EmployeeQualificationModel {
  BranchCode: number;
  EmployeeCode: number;
  EmpQualificationCode: number;
  QualificationCode: string;
  InstitutionName: string;
  BoardOrUniversityName: string;
  Subject: string;
  PassingYear: string;
}

export interface ProfessionalExperiencesModel {
  BranchCode: number;
  ExperiencesCode: number;
  JobTilte: string;
  CompanyName: string;
  StartDate: string;
  EndDate: string;
  Address: string;
  Salary: number;
  ReasonForLeaving: string;
  ContactWithPreviousCompany: boolean;
  Remarks: string;
}

export interface TrainingsModel {
  BranchCode: number;
  TrainingCode: number;
  TrainingTitle: string;
  Duration: string;
  Institute: string;
  Completion: boolean;
}
export interface LeaveTypeModel {
  BranchCode: number;
  LeaveTypeCode: number;
  LeaveType: string;
  ShortName: string;
  IsActive: boolean;
  Period: string;
  Quota: number;
  CarryForward: boolean;
  AllowedGender: string;
  EncashmentAllowed: boolean;
  EmployeeType: string;
  PayFactor: number;
  PayType: string;
}
export interface LeaveApplicationModel {
  BranchCode: number;
  LeaveTypeCode: number;
  EmployeeCode: number;
  LeaveDate: string;
  LeaveDays: number;
  IsApproved: boolean;
  AvailableLeaves: number;
  Remarks: string;
  IsRejected: boolean;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
}
export interface PartyTypeModel {
  BranchCode: number;
  PartyTypeCode: number;
  PartyType: string;
  Description: string;
  IsActive: boolean;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn: string;
  ModifiedBy: number;
}
export interface OGPMasterModel {
  StoreName: string;
  PartyName: string;
  BranchCode: number;
  StoreCode: number;
  OGPNo: number;
  OGPDate: string;
  PartyCode: number;
  OGPPurposeId: number;
  IsReturnable: boolean;
  Driver: string;
  VehicleNo: string;
  Remarks: string;
  IsLocked: boolean;
  LockedBy: number;
  LockedOn: string;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
  IsOpen: boolean;
}
export interface OGPDetailModel {
  BranchCode: number;
  StoreCode: number;
  OGPNo: number;
  OGP_PK: number;
  ItemCode: string;
  ContractType: string;
  ContractNo: number;
  IssuedQty: number;
  PONo: number;
  POSrNo: number;
  GRNNo: number;
  GRNSrNo: number;
  CreatedBy: number;
  CreatedOn: string;
  ModifiedBy: number;
  ModifiedOn: string;
  ItemName: string;
  ItemUnit: number;
  UnitCode: number;
}
export interface CountryModel {
  CountryCode: number;
  CountryName: string;
  Status: boolean;
}

export interface ProfitLossCategoryModel {
  CategoryId: number;
  Category: string;
}
export interface ProfitLossSubCategoryModel {
  CategoryId: number;
  SubCategoryId: number;
  SubCategory: string;
}
export interface CashFlowCategoryModel {
  CategoryCode: number;
  CategoryName: string;
}
export interface CashFlowSubCategoryModel {
  CategoryCode: number;
  SubCategoryCode: number;
  SubCategoryName: string;
}
export interface CostCenteriModel {
  CodeLevel: number;
  Name: string;
}
export interface CostCenteriiModel {
  CodeLevel: number;
  CodeLevel2: number;
  Name: string;
}
export interface CostCenteriiiModel {
  CodeLevel: number;
  CodeLevel2: number;
  CodeLevel3: number;
  Name: string;
}
export interface FunctionsModel {
  FunctionCode: number;
  Name: string;
}

export interface UserMenuRightsModel {
  MenuAutoId: number;
  MenuName: string;
  ManuOptionName: string;
  CanView: boolean;
  CanAdd: boolean;
  CanUpdate: boolean;
  CanDelete: boolean;
  SpecialRight1: boolean;
  SpecialRight2: boolean;
  SpecialRight3: boolean;
}

export interface CashFlowTagIModel {
  CashFlowTag1Code: number;
  CashFlowTagIName: string;
}

export interface CashFlowTagIIModel {
  CashFlowTagIICode: number;
  CashFlowTagIIName: string;
}
export interface BalanceSheetCategoryModel {
  BalanceSheetCode: number;
  BalanceSheetName: string;
}
export interface BalanceSheetSubCategoryModel {
  Code: number;
  Name: string;
}
export interface DocumentTypesModel {
  BranchCode: number;
  DocumentTypeId: number;
  DocumentTypeName: string;
  IsActive: boolean;
}
export interface VoucherEntryConfig {
  BranchCode?: number;
  IncludeAssets?: boolean;
  IncludeParty?: boolean;
  IncludeEmployee?: boolean;
  IncludeWorkOrder?: boolean;
  IncludeCostCentersLevel1?: boolean;
  IncludeCostCentersLevel2?: boolean;
  IncludeCostCentersLevel3?: boolean;
  IncludeFunctions?: boolean;
  IncludeCashFlowTag1?: boolean;
  IncludeCashFlowTag2?: boolean;
}

export interface AttachmentTypesModel {
  BranchCode: number;
  DocumentTypeId: number;
  AttachmentTypeId: number;
  AttachmentTypeTitle: string;
  IsCompulsory: boolean;
}
export interface ApprovalHirarchyModel {
  BranchCode: number;
  DocumentTypeId: number;
  UserId: number;
  ApprovalPriorityLevel: number;
  IsFinalApproval: boolean;
}
export interface DocumentAttachmentsModel {
  BranchCode: number;
  AttachmentAutoId: number;
  DocumentTypeId: number;
  AttachmentTypeId: number;
  DocumentNo: number;
  AttachmentPath: string;
  Remarks: string;
}
export interface TaxConfig {
  TaxId: number;
  TaxCode: number;
  TaxTitle: string;
  TaxChartOfAccount: string;
  TaxPercentage: string;
  IsActive: boolean;
}
export interface FormData {
  FormId: number;
  Add: boolean;
  Edit: boolean;
  Delete: boolean;
  SpecialRight1: boolean;
  SpecialRight2: boolean;
  SpecialRight3: boolean;
}
export interface LeadMasterModel {
  BranchCode: number;
  LeadCode: number;
  LeadName: string;
  PartyCode: number;
  ContactPerson: string;
  Period: string;
  Duration: number;
  StartDate: string;
  ClosingDate: string;
  PotentialAmount: number;
  WeightedAmount: number;
  LevelOfInterestCode: number;
  StatusCode: number;
  Remarks: string;
  GrossProfitPercentage: number;
  TotalAmount: number;
}
export interface LeadDetailModel {
  BranchCode: number;
  LeadCode: number;
  StepCode: number;
  StageCode: number;
  StepDate: string;
  EmployeeName: string;
  LeadPercentage: number;
  DocumentType: string;
  Remarks: string;
}


export interface BankAccountModel {
  BranchCode: number;
  AccountId: number;
  AccountName1: string;
  AccountName2: string;
  AccountNumber: string;
  GLAccount: string;
  CurrencyCode: number;
  Swift: string;
  Address: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: Date;
  ModifiedBy: number;
  ModifiedOn: Date;
}

export interface Column {
  field: string;
  header: string;
}

export interface Project {
  ProjectName: string;
  ProjectCode: number;
}

export interface Store {
  DepartmentCode: number;
  DepartmentName: string;
}

export interface Brand {
  BrandId: number;
  BrandLogo?: string;
  BrandLogoSideNav?: string;
  BrandLogoFavIcon?: string;
  BrandName?: string;
  BrandWebsiteLink?: string;
  IsActive?: boolean;
  PowerdBy?: string;
}
