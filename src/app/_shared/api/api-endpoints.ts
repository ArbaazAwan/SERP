// Add API endpoints here
export const ApiEndpoints = {
  //<<<<=== User Modules ===>>>
  GetAllModules: `api/UserFormRights/GetAllModules`,
  GetAllModulesforuser: `api/UserModules/GetAllModules`,
  GetAllUserModules: `api/UserModules/GetAllUserModules`,
  GetAllUserFormRights: `api/UserFormRights/GetAllUserFormRights`,
  GetUserFormRights: `api/UserFormRights/GetUserFormRights`,
  CreateNewUserFormRights: `api/UserFormRights/CreateNewUserFormRights`,
  CreateNewUserModules: `api/UserModules/CreateNewUserModules`,
  DeleteUserModule: `api/UserModules/DeleteUserModule`,

  //<<<===HR & Payroll ===>>>

  // ===Gender-EndPoints===
  GET_ALL_GENDERS: `api/Gender/GetAllGenders`,
  GET_MAX_GENDER_CODE: `api/Gender/GetMaxGenderCode`,
  ADD_GENDER: `api/Gender/AddGender`,
  UPDATE_GENDER: `api/Gender/UpdateGender`,
  DELETE_GENDER: `api/Gender/DeleteGender`,

  // ===Nationality-EndPoints===
  GET_ALL_NATIONALITIES: `api/Nationality/GetAllNationalities`,
  GET_MAX_NATIONALITY: `api/Nationality/GetMaxNationality`,
  ADD_NATIONALITY: `api/Nationality/AddNationality`,
  UPDATE_NATIONALITY: `api/Nationality/UpdateNationality`,
  DELETE_NATIONALITY: `api/Nationality/DeleteNationality`,

  // ===Religion-EndPoints===
  GET_ALL_RELIGIONS: `api/Religion/GetAllReligions`,
  GET_MAX_RELIGION: `api/Religion/GetMaxReligion`,
  ADD_RELIGION: `api/Religion/AddReligion`,
  UPDATE_RELIGION: `api/Religion/UpdateReligion`,
  DELETE_RELIGION: `api/Religion/DeleteReligion`,

  // === MaritalStatus Endpoints ===
  GET_ALL_MARITAL_STATUS: `api/MaritalStatus/GetAllMaritalStatus`,
  GET_MAX_MARITAL_STATUS: `api/MaritalStatus/GetMaxMaritalStatus`,
  ADD_MARITAL_STATUS: `api/MaritalStatus/AddMaritalStatus`,
  UPDATE_MARITAL_STATUS: `api/MaritalStatus/UpdateMaritalStatus`,
  DELETE_MARITAL_STATUS: `api/MaritalStatus/DeleteMaritalStatus`,

  // === EmployeeType Endpoints ===
  GET_MAX_EMPLOYEE_TYPE_CODE: `api/EmployeeType/GetMaxEmployeeTypeCode`,
  ADD_EMPLOYEE_TYPE: `api/EmployeeType/AddEmployeeType`,
  UPDATE_EMPLOYEE_TYPE: `api/EmployeeType/UpdateEmployeeType`,
  DELETE_EMPLOYEE_TYPE: `api/EmployeeType/DeleteEmployeeTypeCode`,

  // === Department Endpoints ===
  GetAllDepartmentsList: `api/Department/GetAllDepartments`,
  GetAllStoreTypeList: `api/Department/GetAllStoreTypes`,
  PostDepartment: `api/Department/CreateDepartment`,
  PutDepartment: `api/Department/UpdateDepartment`,
  DeleteDepartment: `api/Department/DeleteDepartment`,
  GetDepartmentByCode: `api/Department/GetDepartmentById?DepartmentTypeCode=2`,

  // === Job Level Endpoints ===
  getAllJobLevel: `api/JobLevel/GetAllJobLevel`,
  getMaxJobLevelCode: `api/JobLevel/GetMaxJobLevelCode`,
  postJobLevel: `api/JobLevel/AddJobLevel`,
  putJobLevel: `api/JobLevel/UpdateJobLevel`,
  deleteJobLevel: `api/JobLevel/DeleteJobLevel`,

  // === Shift Endpoints ===
  Shift: `api/Shift`,

  // === Pay Head Endpoints ===
  getAllPayHeads: `api/SalaryPayHeads/GetAllPayHead`,
  getMaxPayHeadsCode: `api/SalaryPayHeads/GetMaxPayHeadCode`,
  postPayHeads: `api/SalaryPayHeads/AddPayHead`,
  putPayHeads: `api/SalaryPayHeads/UpdatePayHead`,
  deletePayHeads: `api/SalaryPayHeads/DeletePayHead`,

  // === Privince Endpoints ===
  getAllProvinces: `api/Province/GetAllProvinces`,
  getMaxProvinceCode: `api/Province/GetMaxProvinceCode`,
  postProvince: `api/Province/AddProvince`,
  putProvince: `api/Province/UpdateProvince`,
  deleteProvince: `api/Province/DeleteProvince`,

  // === Shift Timing Endpoints ===
  ShiftTimings: `api/ShiftTimings`,
  getAllShiftTimings: `api/ShiftTimings/GetAllShiftTimings`,
  GetShiftTimingsCode: `api/ShiftTimings/GetShiftTimings`,
  getShiftTimings: `api/ShiftTimings/GetAllShifts`,
  postShiftTiming: `api/ShiftTimings/AddShiftTimings`,
  putShiftTiming: `api/ShiftTimings/UpdateShiftTimings`,
  deleteShiftTimings: `api/ShiftTimings/DeleteShiftTimings`,

  // === Pay Package Endpoints ===
  getSelectBTAccountType: `api/EmployeeBankAccountType/SelectBTAccountType`,
  getAllBanks: `api/Bank/GetAllBanks`,
  getAllPayPackageMaster: `api/EmployeePayPackage/GetAllEmployeePayPackageMaster`,
  getMaxPayPackageCode: `api/EmployeePayPackage/GetEmployeeMaxPayPackageCode`,
  postPayPackageMaster: `api/EmployeePayPackage/AddEmployeePayPackageMaster`,
  putPayPackageMaster: `api/EmployeePayPackage/UpdateEmployeePayPackageMaster`,
  getEmployeeSalaryPayHeads: `api/SalaryPayHeads/EmployeeSalaryPayHeads`,
  postPayPackageDetail: `api/EmployeePayPackage/AddEmployeePayPackageDetail`,
  putPayPackageDetail: `api/EmployeePayPackage/UpdateEmployeePayPackageDetail`,
  deletePayPackage: `api/EmployeePayPackage/DeleteEmployeePayPackageDetail`,

  // === Leave Type Endpoints ===
  getAllLeaveType: `api/LeaveTypes/GetAllLeaveTypes`,
  getMaxLeaveTypeCode: `api/LeaveTypes/GetMaxLeaveType`,
  postLeaveType: `api/LeaveTypes/AddLeaveTypes`,
  putLeaveType: `api/LeaveTypes/UpdateLeaveTypes`,
  deleteLeaveType: `api/LeaveTypes/DeleteLeaveTypes`,

  // === Leave Application Endpoints ===
  LeaveApplication: `api/LeaveApplication`,
  getEmployeeLeaves: `api/LeaveApplication/GetEmployeeLeaves`,
  getAllLeaveApplication: `api/LeaveApplication/GetAllLeaveApplication`,

  // === Emplpoyee List Endpoints ===
  EmployeeSetup: `api/EmployeeSetup`,
  EmployeePicture: `api/EmployeeSetup/EmployeePicture`,
  GetAllTimeZones: `api/EmployeeSetup/GetAllTimeZones`,
  EmployeeDefinitions: `api/EmployeeSetup/EmployeeDefinitions`,

  // === Employee Training Endpoints ===
  Trainings: `api/Trainings`,

  // === Employee Professional Experience Endpoints ===
  ProfessionalExperiences: `api/ProfessionalExperiences`,

  // === Employee Actions Endpoints ===
  getAllEmployeeActions: `api/EmployeeActions/GetAllEmployeeActions`,
  getAllEmployeeActionType: `api/EmployeeActionType/GetAllEmployeeActionType`,
  getEmployeeActionsMaxId: `api/EmployeeActions/GetMaxEmployeeActionId`,
  postEmployeeActions: `api/EmployeeActions/AddEmployeeActions`,
  putEmployeeActions: `api/EmployeeActions/UpdateEmployeeActions`,
  deleteEmployeeActions: `api/EmployeeActions/DeleteEmployeeActions`,

  //======Allowance And Deduction Endpoints

  getData: `api/AllowanceandDeduction/GetAllowanceDeduction`,
  saveData: `api/AllowanceandDeduction/AddAllowanceDeduction`,
  updateData: `api/AllowanceandDeduction/UpdateAllowanceDeduction`,
  deleteData: `api/AllowanceandDeduction/DeleteAllowanceDeduction`,

  // <<<===Setup & Config ===>>>

  // ===Company Config EndPoints===
  getAllCompanyConfig: `api/CompanyConfiguration/GetAllCompanyConfigurationsList`,
  getAllLanguages: `api/Language/GetAllLanguages`,
  saveCompanyConfig: `api/CompanyConfiguration/AddNewCompanyConfiguration`,
  updateCompanyConfig: `api/CompanyConfiguration/UpdateCompanyConfiguration`,
  deleteCompanyConfig: `api/CompanyConfiguration/DeleteCompanyConfiguration`,

  // ===Branch EndPoints===
  getAllBranchesList: `api/Branch/GetAllBranchList`,
  saveBranch: `api/Branch/CreateNewBranch`,
  updateBranch: `api/Branch/UpdateBranch`,
  deleteBranch: `api/Branch/DeleteBranch`,

  // ===Project EndPoints===
  getAllBranches: `api/Branch/GetAllBranchNames`,
  getAllProject: `api/Projects/GetAllProjects`,
  GetProjectsByBranchCode: `api/Projects/GetProjectsByBranchCode`,
  getAllProjectMaxId: `api/Projects/GetProjectsMaxId`,
  postProjects: `api/Projects/CreateNewProjects`,
  CreateNewUserProjects: `api/UserProjects/CreateNewUserProjects`,

  putProjects: `api/Projects/UpdateProjects`,
  deleteProjects: `api/Projects/DeleteProjects`,

  // ===User Project EndPoints===
  getAllUsers: `api/UserLogin/GetAllUserList`,
  GetBranchUsers: `api/UserLogin/GetBranchUsers`,
  getAllUserBranches: `api/Branch/GetAllBranchList`,
  getAllUserProjects: `api/UserProjects/GetUserProjectByUserId`,
  GetUserProjects: `api/UserProjects/GetUserProjects`,
  GetBranchProjects: `api/UserProjects/GetBranchProjects`,
  getUserBranchesByUserId: `api/UserBranches/GetUserBranchByUserId`,
  getUserProjectByUserId: `api/UserProjects/GetUserProjectByUserId`,
  postUserProjects: `api/UserProjects/CreateNewUserProjects`,
  DeleteUserProjects: `api/UserProjects/DeleteUserProjects`,

  // ===User Branches EndPoints===
  postUserBranches: `api/UserBranches/CreateNewUserBranches`,
  DeleteUserBranches: `api/UserBranches/DeleteUserBranches`,
  DeleteUserProjectByBranchId: `api/UserProjects/DeleteUserProjectByBranchId`,
  getUserBranchByUserId: `api/UserBranches/GetUserBranchByUserId`,
  GetAllUsersBranches: `api/UserBranches/GetAllUsersBranches`,

  // ===== Employee Branch Divisions ==============
  employeeBranchDivision: `api/EmployeeBranchDivision`,

  // ===User Defination EndPoints=============
  getAllUserList: `api/UserLogin/GetAllUsers`,
  postUser: `api/UserLogin/AddUser`,
  putUser: `api/UserLogin/UpdateUser`,
  DeleteUser: `api/UserLogin/DeleteUser`,

  // ===User Voucher Type EndPoints===
  getAllUserVoucherTypes: `api/UserVoucherType/GetAllUserVoucherTypes`,
  getAllVoucherType: `api/VoucherType/GetAllVoucherTypes`,
  getUserVoucherTypeById: `api/UserVoucherType/GetUserVoucherTypeById`,
  getUserVouchersTypeByUserId: `api/UserVoucherType/GetUserVouchersTypeByUserId`,
  GetAllUsersVouchersTypes: `api/UserVoucherType/GetAllUsersVoucherTypes`,
  postUserVoucherType: `api/UserVoucherType/CreateNewUserVoucherType`,
  DeleteUserVoucherType: `api/UserVoucherType/DeleteUserVoucherType`,

  // ===Party Type EndPoints===
  PartyType: `api/PartyType`,

  // ===Party Type EndPoints===
  CreateDocumentsPath: `api/DocumentsPath/Post`,
  UpdateDocumentsPath: `api/DocumentsPath/Update`,
  GetAllPaths: `api/DocumentsPath/Get`,
  // <<<===Accounts & GL===>>>

  // ===Financial Year EndPoints===
  getAllFinancialyear: `api/FinancialYears/GetAllFinancialYears`,
  getFinancialYearsMaxId: `api/FinancialYears/GetFinancialYearsMaxId`,
  postFinancialYears: `api/FinancialYears/CreateNewFinancialYears`,
  putFinancialYears: `api/FinancialYears/UpdateFinancialYears`,
  deleteFinancialYears: `api/FinancialYears/DeleteFinancialYears`,
  getFinancialYearById: `api/FinancialYears/GetFinancialYearsById`,
  FinancialYearDuplicateCHK: `api/FinancialYears/FinancialYearDuplicateCHK`,

  // ===Bank Account EndPoints===
  GetAllChartOfAccounts: `api/ChartOfAccounts/GetAllChartOfAccounts`,
  SaveBankAccount: `api/BankAccount/SaveBankAccount`,
  GetAllAccounts: `api/BankAccount/GetAllAccounts`,
  UpdateBankAccount: `api/BankAccount/UpdateBankAccount`,
  DeleteBankAccount: `api/BankAccount/DeleteBankAccount`,

  // ===Financial Month EndPoints===
  getAllFinancialMonth: `api/FinacialMonths/GetAllFinacialMonths`,
  getFinancialMonthMaxId: `api/FinacialMonths/GetFinacialMonthsMaxId`,
  GetCompanyById: `api/CompanyConfiguration/GetCompanyById`,
  postFinancialMonth: `api/FinacialMonths/CreateNewFinacialMonths`,
  putFinancialMonth: `api/FinacialMonths/UpdateFinacialMonths`,
  deleteFinancialMonth: `api/FinacialMonths/DeleteFinacialMonths`,
  GetFinacialMonthsById: `api/FinacialMonths/GetFinacialMonthsById`,

  // ===Instrument Type EndPoints===
  getAllInstrumentType: `api/InstrumentTypes/GetAllInstrumentType`,
  getInstrumentTypeById: `api/InstrumentTypes/GetInstrumentTypeById`,
  getInstrumentTypeMaxId: `api/InstrumentTypes/GetInstrumentTypeMaxId`,
  postInstrumentType: `api/InstrumentTypes/AddInstrumentType`,
  putInstrumentType: `api/InstrumentTypes/UpdateInstrumentType`,
  deleteInstrumentType: `api/InstrumentTypes/DeleteInstrumentType`,

  // ===Voucher Type EndPoints===
  getAllVoucherTypes: `api/VoucherType/GetAllVoucherTypes`,
  getAllVoucherNumberingTypes: `api/VoucherNumberingTypes/GetAllVoucherNumberingTypes`,
  getVoucherTypeMaxId: `api/VoucherType/GetVoucherTypeMaxId`,
  postNewVoucherType: `api/VoucherType/CreateNewVoucherType`,
  putVoucherType: `api/VoucherType/UpdateVoucherType`,
  DeletevoucherType: `api/VoucherType/DeletevoucherType`,

  // ===Currency EndPoints===
  getAllCurrency: `api/Currency/GetAllCurrency`,
  changeCurrency: `api/Currency/GetPrimaryCurrencyCode`,
  getCurrencyMaxId: `api/Currency/GetMaxCurrencyCode`,
  postCurrency: `api/Currency/AddCurrency`,
  putCurrency: `api/Currency/UpdateCurrency`,
  deleteCurrency: `api/Currency/DeleteCurrency`,
  GetPrimaryCurrencyTitle: `api/Currency/GetPrimaryCurrencyTitle`,
  // ===Balance Sheet Category  EndPoints===
  getAllBalanceSheetCategory: `api/BalanceSheet/GetAllBalanceSheetCategory`,
  getMaxBalanceSheetCode: `api/BalanceSheet/GetMaxBalanceSheetCode`,
  postBalanceSheetCategory: `api/BalanceSheet/CreateBalanceSheetCategory`,
  putBalanceSheetCategory: `api/BalanceSheet/UpdateBalanceSheetCategory`,
  deleteBalanceSheetCategory: `api/BalanceSheet/DeleteBalanceSheetCategory`,

  // ===Balance Sheet Sub-Category  EndPoints===
  getAllBalanceSheetSubCategory: `api/BalanceSheet/GetAllBalanceSheetSubCategory`,
  getMaxBalanceSheetSubCode: `api/BalanceSheet/GetMaxBalanceSheetSubCode`,
  postBalanceSheetSubCategory: `api/BalanceSheet/CreateBalanceSheetSubCategory`,
  putBalanceSheetSubCategory: `api/BalanceSheet/UpdateBalanceSheetSubCategory`,
  deleteBalanceSheetSubCategory: `api/BalanceSheet/DeleteBalanceSheetSubCategory`,
  GetBalanceSheetSubCategorybyCode:
    'api/BalanceSheet/GetBalanceSheetSubCategorybyCode',
  GetCodeBalanceSheetNote: `api/BalanceSheet/GetCodeBalanceSheetNote`,

  // ===Balance Sheet Note  EndPoints===
  GetAllBalanceSheetNote: `api/BalanceSheet/GetAllBalanceSheetNote`,
  GetMaxBalanceSheetNote: `api/BalanceSheet/GetMaxBalanceSheetNote`,
  postBalanceSheetNote: `api/BalanceSheet/CreateBalanceSheetNote`,
  putBalanceSheetNote: `api/BalanceSheet/UpdateBalanceSheetNote`,
  DeleteBalanceSheetNote: `api/BalanceSheet/DeleteBalanceSheetNote`,

  // ===Profit & Loss Category  EndPoints===
  getAllCategory: `api/ProfitAndLoss/GetAllChartOfAccount_Categories`,
  getMaxCategoryCode: `api/ProfitAndLoss/GetMaxCategoryId`,
  postCategory: `api/ProfitAndLoss/CreateChartOfAccount_Categories`,
  putCategory: `api/ProfitAndLoss/UpdateChartOfAccount_Categories`,
  deleteCategory: `api/ProfitAndLoss/DeleteChartOfAccount_Categories`,

  // ===Profit & Loss Sub-Category  EndPoints===
  getAllSubCategory: `api/ProfitAndLoss/GetAllChartOfAccount_SubCategories`,
  getMaxSubCategoryCode: `api/ProfitAndLoss/GetMaxSubCategoryId`,
  postSubCategory: `api/ProfitAndLoss/CreateChartOfAccount_SubCategories`,
  putSubCategory: `api/ProfitAndLoss/UpdateChartOfAccount_SubCategories`,
  deleteSubCategory: `api/ProfitAndLoss/DeleteChartOfAccount_SubCategories`,

  // ===Cashflow Category  EndPoints===
  getAllCashFlowCategory: `api/CashFlow/GetAllCashFlowCategories`,
  getMaxCashFlowCategoryCode: `api/CashFlow/GetMaxCategoryCode`,
  postCashFlowCategory: `api/CashFlow/CreateCashFlowCategories`,
  putCashFlowCategory: `api/CashFlow/UpdateCashFlowCategories`,
  deleteCashFlowCategory: `api/CashFlow/DeleteCashFlowCategories`,

  // ===Cashflow Sub-Category  EndPoints===
  getAllCashFlowSubCategory: `api/CashFlow/GetAllCashFlowSubCategories`,
  getMaxCashFlowSubCategoryCode: `api/CashFlow/GetMaxSubCategoryCode`,
  postCashFlowSubCategory: `api/CashFlow/CreateCashFlowSubCategories`,
  putCashFlowSubCategory: `api/CashFlow/UpdateCashFlowSubCategories`,
  deleteCashFlowSubCategory: `api/CashFlow/DeleteCashFlowSubCategories`,

  // ===Cost Center 1  EndPoints===
  getAllCostCentersLevel1: `api/CostCenters/GetAllCostCentersLevel1`,
  getMaxCostCentersLevel1Code: `api/CostCenters/GetMaxCodeLevel`,
  postCostCentersLevel1: `api/CostCenters/CreateCostCentersLevel1`,
  putCostCentersLevel1: `api/CostCenters/UpdateCostCentersLevel1`,
  deleteCostCentersLevel1: `api/CostCenters/DeleteCostCentersLevel1`,

  // ===Cost Center 2  EndPoints===
  getAllCostCentersLevel2: `api/CostCenters/GetAllCostCentersLevel2`,
  getMaxCostCentersLevel2Code: `api/CostCenters/GetMaxCodeLevel2`,
  postCostCentersLevel2: `api/CostCenters/CreateCostCentersLevel2`,
  putCostCentersLevel2: `api/CostCenters/UpdateCostCentersLevel2`,
  deleteCostCentersLevel2: `api/CostCenters/DeleteCostCentersLevel2`,
  GetCostCentersLevel2: `api/CostCenters/GetCostCentersLevel2`,

  // ===Cost Center 3  EndPoints===
  getAllCostCentersLevel3: `api/CostCenters/GetAllCostCentersLevel3`,
  getMaxCostCentersLevel3: `api/CostCenters/GetMaxCodeLevel3`,
  postCostCentersLevel3: `api/CostCenters/CreateCostCentersLevel3`,
  putCostCentersLevel3: `api/CostCenters/UpdateCostCentersLevel3`,
  deleteCostCentersLevel3: `api/CostCenters/DeleteCostCentersLevel3`,
  GetCostCentersLevel3: `api/CostCenters/GetCostCentersLevel3`,

  // ===Function  EndPoints===
  getAllFunctions: `api/Functions/GetAllFunctions`,
  getMaxFunctionsCode: `api/Functions/GetMaxFunctionCode`,
  postFunctions: `api/Functions/CreateFunctions`,
  putFunctions: `api/Functions/UpdateFunctions`,
  deleteFunctions: `api/Functions/DeleteFunctions`,

  // ===CashFow Tag 1  EndPoints===
  getAllCashFlowTag1: `api/CashFlowTag/GetCashFlowTag1`,
  getMaxCashFlowTag1Code: `api/CashFlowTag/GetMaxCashFlowTag1Code`,
  postCasgFlowTag1: `api/CashFlowTag/CreateCashFlowTag1`,
  putCasgFlowTag1: `api/CashFlowTag/UpdateCashFlowTag1`,
  deleteCasgFlowTag1: `api/CashFlowTag/DeleteCashFlowTag1`,

  // ===CashFow Tag 2  EndPoints===
  getAllCashFlowTag2: `api/CashFlowTag/GetAllCashFlowTag2`,
  getMaxCashFlowTag2Code: `api/CashFlowTag/GetMaxCashFlowTag2Code`,
  postCasgFlowTag2: `api/CashFlowTag/CreateCashFlowTag2`,
  putCashFlowTag2: `api/CashFlowTag/UpdateCashFlowTag2`,
  deleteCasgFlowTag2: `api/CashFlowTag/DeleteCashFlowTag2`,

  // ===Text Configuration  EndPoints===
  GetMaxTaxId: `api/Tax/GetMaxTaxId`,
  GetAllTaxes: `api/Tax/GetAllTaxes`,
  AddTax: `api/Tax/AddTax`,
  DeleteTax: `api/Tax/DeleteTax`,
  GetTaxId: `api/Tax/GetTaxId`,
  UpdateTax: `api/Tax/UpdateTax`,

  // ===Voucher Master  EndPoints===
  getUserProjects: `api/UserProjects/GetUserProjects`,
  getUserVoucherTypes: `api/UserVoucherType/GetUserVoucherTypes`,
  putPostVoucher: `api/VoucherMaster/PostVoucher`,
  getFinancialMonth: `api/FinancialYears/LoadFinantialMonths`,
  getVouchers: `api/VoucherMaster/GetAllVouchers`,
  getVouchersList: `api/GLReports/GetVoucherListData`,
  getVoucherMasterById: `api/VoucherMaster/GetVoucherMasterById`,
  postVoucherMaster: `api/VoucherMaster/AddVoucherMaster`,
  putVoucherMaster: `api/VoucherMaster/UpdateVoucherMaster`,
  GetNextVoucher: `api/VoucherMaster/GetNextVoucher`,
  GetPreviousVoucher: `api/VoucherMaster/GetPreviousVoucher`,
  GetVoucherEntryConfig: `api/VoucherEntryConfig/GetVoucherEntryConfig`,
  PutVoucherEntryConfig: `api/VoucherEntryConfig/UpdateVoucherEntryConfig`,
  deleteVoucherMaster: `api/VoucherMaster/DeleteVoucherMaster`,
  GetVoucherMastersList_ForEditListForm: `api/VoucherMaster/GetVoucherMastersList_ForEditListForm`,
  //<<<=== Inventry & Store ===>>>

  // ===Department Location  EndPoints===
  getLocationById: `api/DepartmentLocations/GetLocationById`,
  postDepartmentLocation: `api/DepartmentLocations/CreateDepartmentLocation`,
  putDepartmentLocation: `api/DepartmentLocations/UpdateDepartmentLocation`,

  // ===Item Brand  EndPoints===
  getAllItemBrand: `api/ItemBrand/LoadAllBrands`,
  saveItemBrand: `api/ItemBrand/CreateNewItemBrand`,
  updateItemBrand: `api/ItemBrand/UpdateNewItemBrand`,
  deleteItemBrand: `api/ItemBrand/DeleteItemBrand`,

  // ===Item Category  EndPoints===
  getAllItemCategory: `api/ItemCategory/LoadAllCategories`,
  saveItemCategory: `api/ItemCategory/CreateNewItemCategory`,
  updateItemCategory: `api/ItemCategory/UpdateNewItemCategory`,
  deleteItemCategory: `api/ItemCategory/DeleteNewItemCategory`,

  // ===Item Color  EndPoints===
  getAllItemColour: `api/ItemColour/LoadAllColours`,
  saveItemColour: `api/ItemColour/CreateNewItemColour`,
  updateItemColour: `api/ItemColour/UpdateNewItemColour`,
  deleteItemColour: `api/ItemColour/DeleteNewItemColour`,

  // ===Item Grade  EndPoints===
  getAllItemGrade: `api/ItemGrade/LoadAllGrades`,
  saveItemGrade: `api/ItemGrade/CreateNewItemGrade`,
  updateItemGrade: `api/ItemGrade/UpdateNewItemGrade`,
  deleteItemGrade: `api/ItemGrade/DeleteItemGrade`,

  // ===Item Grade  EndPoints===
  getAllItemManufacturer: `api/ItemManufacturer/LoadAllManufacturers`,
  saveItemManufacturer: `api/ItemManufacturer/CreateNewItemManufacturer`,
  updateItemManufacturer: `api/ItemManufacturer/UpdateNewItemManufacturer`,
  deleteItemManufacturer: `api/ItemManufacturer/DeleteItemManufacturer`,

  // ===Item MOdel  EndPoints===
  getAllItemModel: `api/ItemModel/LoadAllModels`,
  saveItemModel: `api/ItemModel/CreateNewItemModel`,
  updateItemModel: `api/ItemModel/UpdateNewItemModel`,
  deleteItemModel: `api/ItemModel/DeleteItemModel`,

  // ===Item Size  EndPoints===
  getAllItemSize: `api/ItemSize/LoadAllSizes`,
  saveItemSize: `api/ItemSize/CreateNewItemSize`,
  updateItemSize: `api/ItemSize/UpdateNewItemSize`,
  deleteItemSize: `api/ItemSize/DeleteNewItemSize`,
  getDropDownChartOfItem: `api/ChartOfItems/GetDropDownChartOfItem`,

  // ===Item Type  EndPoints===
  getAllItemType: `api/ItemType/LoadAllItemsTypes`,
  saveItemType: `api/ItemType/CreateNewItemType`,
  updateItemType: `api/ItemType/UpdateNewItemType`,
  deleteItemType: `api/ItemType/DeleteNewItemType`,

  // ===Item Unit  EndPoints===
  getAllItemUnit: `api/ItemUnit/LoadAllUnits`,
  saveItemUnit: `api/ItemUnit/CreateNewItemUnit`,
  updateItemUnit: `api/ItemUnit/UpdateNewItemUnit`,
  deleteItemUnit: `api/ItemUnit/DeleteItemUnit`,

  // ===Chart Of Item  EndPoints===
  getAllChartofItem: `api/ChartOfItems/LoadChartOfItemsTree`,
  getAllStores: `api/ChartOfItems/LoadStores`,
  getItemStores: `api/ChartOfItems/GetItemStores`,
  getItemTax: `api/Tax/GetItemTaxes`,
  GetAllItemsforAssetTypes: `api/ChartOfItems/GetAllItemsforAssetTypes`,
  getAllParentCode: `api/ChartOfItems/LoadParentCode`,
  saveStoreItem: `api/ChartOfItems/SaveItemStores`,
  saveChartofItem: `api/ChartOfItems/CreateNewItem`,
  updateChartofItem: `api/ChartOfItems/UpdateNewItem`,
  deleteChartofItem: `api/ChartOfItems/DeleteNewItem`,
  GetChartOfItemsTree: `api/ChartOfItems/GetChartOfItemsTree`,
  GetMaxItemCode: `api/ChartOfItems/GetMaxItemCode`,
  LoadCOAHeads: `api/ChartOfItems/LoadCOAHeads`,
  GetChartOfItemsTreeByItemCode: `api/ChartOfItems/GetChartOfItemsTreeByItemCode`,
  addCategory: `api/ChartOfItems/addCategory`,

  // ===Recipe  EndPoints===
  GetMaxRecipeCode: `api/Recipe/GetMaxRecipeCode`,
  GetItemRecipeMasterDetails: `api/Recipe/GetItemRecipeMasterDetails`,
  DeleteItemRecipeDetail: `api/Recipe/DeleteItemRecipeDetail`,
  CreateNewItemRecipeMaster: `api/Recipe/CreateNewItemRecipeMaster`,
  UpdateItemRecipeMaster: `api/Recipe/UpdateItemRecipeMaster`,
  CreateNewItemRecipeDetails: `api/Recipe/CreateNewItemRecipeDetails`,
  UpdateItemRecipeDetail: `api/Recipe/UpdateItemRecipeDetail`,

  // ===Chart Of Assets EndPoints===
  GetAllAssetParentCode: `api/ChartOfAssets/LoadParentCode`,
  GetMaxAssetCode: `api/ChartOfAssets/GetMaxAssetCode`,
  AddChartOfAssets: `api/ChartOfAssets/AddChartOfAssets`,
  UpdateChartOfAssets: `api/ChartOfAssets/UpdateChartOfAssets`,
  DeleteChartOfAssets: `api/ChartOfAssets/DeleteChartOfAssets`,
  GetChartOfAssetTree: `api/ChartOfAssets/GetChartOfAssetTree`,
  UpdateNewAssets: `api/ChartOfAssets/UpdateNewAssets`,
  LoadChartOfAssetsTree: `api/ChartOfAssets/LoadChartOfAssetsTree`,

  // ===Chart Of Accounts  EndPoints===
  GetMaxAccountCode: `api/ChartOfAccounts/GetMaxAccountCode`,
  LoadChartOfAccountCategories: `api/ChartOfAccounts/LoadChartOfAccountCategories`,
  GetCashFlowCategories: `api/ChartOfAccounts/GetCashFlowCategories`,
  GetCashFlowSubCategories: `api/ChartOfAccounts/GetCashFlowSubCategories`,
  LoadChartOfAccountSubCategories: `api/ChartOfAccounts/LoadChartOfAccountSubCategories`,
  GetChartOfAccountsTree: `api/ChartOfAccounts/GetChartOfAccountsTree`,
  GetParentAccountCode: `api/ChartOfAccounts/GetParentAccountCode`,
  GetNewAccountLevelCode: `api/ChartOfAccounts/GetNewAccountLevelCode`,
  UpdateChartOfAccount: `api/ChartOfAccounts/UpdateChartOfAccount`,
  DeleteChartOfAccount: `api/ChartOfAccounts/DeleteChartOfAccount`,
  AddChartOfAccount: `api/ChartOfAccounts/AddChartOfAccount`,
  GetAccountTitle: `api/ChartOfAccounts/GetAccountTitle`,

  // ===LeadStages-EndPoints===
  GET_ALL_LeadStages: `api/LeadStages/GetAllLeadStages`,
  GET_MAX_LeadStages_CODE: `api/LeadStages/GetMaxStageCode`,
  ADD_LeadStages: `api/LeadStages/AddLeadStages`,
  UPDATE_LeadStages: `api/LeadStages/UpdateLeadStages`,
  DELETE_LeadStages: `api/LeadStages/DeleteLeadStages`,

  // ===LeadStatus-EndPoints===
  GetAllLeadsStatus: `api/LeadStatus/GetAllLeadStatus`,
  GetMaxLeadsStatusCode: `api/LeadStatus/GetMaxStatusCode`,
  AddLeadsStatus: `api/LeadStatus/AddLeadStatus`,
  UpdateLeadsStatus: `api/LeadStatus/UpdateLeadStatus`,
  DeleteLeadsStatus: `api/LeadStatus/DeleteLeadStatus`,

  // ===LevelOfInterest-EndPoints===
  GetAllLevelOfInterest: `api/LevelofInterest/GetAllLevelofInterest`,
  GetMaxLevelOfInterestCode: `api/LevelofInterest/GetMaxLevelOfInterestCode`,
  AddLevelOfInterest: `api/LevelofInterest/AddLevelofInterest`,
  UpdateLevelOfInterest: `api/LevelofInterest/UpdateLevelofInterest`,
  DeleteLevelOfInterest: `api/LevelofInterest/DeleteLevelofInterest`,

  // ===LeadStages-EndPoints===
  GetLeadStagePercentage: `api/LeadInfo/GetLeadStagePercentage`,
  GetAllLeadDocument: `api/LeadInfo/GetAllLeadDocument`,
  GetMasterInfo: `api/LeadInfo/GetMasterInfo`,
  GetAllLeadDetail: `api/LeadInfo/GetAllLeadDetail`,
  UpdateLeadMaster: `api/LeadInfo/UpdateLeadMaster`,
  CreateLeadDetail: `api/LeadInfo/CreateLeadDetail`,
  UpdateLeadDetail: `api/LeadInfo/UpdateLeadDetail`,
  DeleteLeadDetail: `api/LeadInfo/DeleteLeadDetail`,
  DeleteLead: `api/LeadInfo/DeleteLead`,
  GetAllLeadMaster: `api/LeadInfo/GetAllLeadMaster`,
  CreateLeadMaster: `api/LeadInfo/CreateLeadMaster`,
  GetAllDocument: `api/LeadInfo/GetAllDocument`,

  // ===Lead-Opportunity-Endpoints===
  GetMaxOpportunityCode: `api/LeadOpportunityCreation/GetMaxOpportunityCode`,
  CreateLeadOpportunity: `api/LeadOpportunityCreation/CreateLeadOpportunity`,
  GetLeadOpportunityList: `api/LeadOpportunityCreation/GetLeadOpportunityList`,
  DeleteLeadOpportunity: `api/LeadOpportunityCreation/DeleteLeadOpportunity`,
  UpdateLeadOpportunity: `api/LeadOpportunityCreation/UpdateLeadOpportunity`,
  // ================== Account Manager EndPoints ==========================

  AddAccountManager: `api/AccountManager/AddAccountManager`,
  DeleteAccountManager: `api/AccountManager/DeleteAccountManager`,
  GetAccountManagerTree: `api/AccountManager/GetAccountManagerTree`,
  GetMaxParentManagerCode: `api/AccountManager/GetMaxAccountManagerCode`,
  UpdateAccountManager: `api/AccountManager/UpdateAccountManager`,
  GetFilteredManagers: `api/AccountManager/GetFilteredManagers`,

  //=====Store ================================
  PurchaseRequsitionReport: `api/Store/PurchaseRequsitionReport`,

  //=====Account-Manager-Endpoints====
  GetAllAccountManagers: `api/AccountManager/GetAllAccountManagers`,
  GetPendingToAssignCustomers: `api/AccountManagerCustomers/GetPendingToAssignCustomers`,
  AddAccountManagerCustomer: `api/AccountManagerCustomers/AddAccountManagerCustomers`,
  GetAllAccountManagerCustomer: `api/AccountManagerCustomers/GetAccountManagerCustomers`,
  UpdateAccountManagerCustomers: `api/AccountManagerCustomers/UpdateAccountManagerCustomers`,
  DeleteAccountManagerCustomers: `api/AccountManagerCustomers/DeleteAccountManagerCustomers`,

  //========================================Production========================================

  // ===DepartmentType-EndPoints===
  GetAllDepartmentType: `api/DepartmentType/GetAllDepartmentType`,
  GetMaxDepartmentTypeCode: `api/DepartmentType/GetMaxDepartmentTypeCode`,
  CreateDepartmentType: `api/DepartmentType/CreateDepartmentType`,
  UpdateDepartmentType: `api/DepartmentType/UpdateDepartmentType`,
  DeleteDepartmentType: `api/DepartmentType/DeleteDepartmentType`,

  //===Buyers====
  GetBuyersList: `api/Buyer/GetBuyersList`,
  GetMaxBuyerId: `api/Buyer/GetMaxBuyerId`,
  PostBuyer: `api/Buyer/PostBuyer`,
  PutBuyer: `api/Buyer/PutBuyer`,
  DeleteBuyer: `api/Buyer/DeleteBuyer`,

  //======Sales Inoice======
  GetStoreItems: `api/ChartOfItems/GetItemCode`,

  //======ApprovalHirarchyUsers======
  AddApprovalHirarchyUsers: `api/ApprovalHirarchyUsers/AddApprovalHirarchyUsers`,
  GetUserByDocumentTypeId: `api/ApprovalHirarchyUsers/GetUserByDocumentTypeId`,
  DeleteApprovalHirarchyUsers: `api/ApprovalHirarchyUsers/DeleteApprovalHirarchyUsers`,

  GetApprovalHirarchyByDocTypeId: `api/DocumentApprovalHirarchy/GetApprovalHirarchyByDocTypeId`,
  GetMaxApprovalPriorityLevel: `api/DocumentApprovalHirarchy/GetMaxApprovalPriorityLevel`,
  AddDocumentApprovalHirarchy: `api/DocumentApprovalHirarchy/AddDocumentApprovalHirarchy`,
  UpdateDocumentApprovalHirarchy: `api/DocumentApprovalHirarchy/UpdateDocumentApprovalHirarchy`,
  DeleteDocumentApprovalHirarchy: `api/DocumentApprovalHirarchy/DeleteDocumentApprovalHirarchy`,
  ChangeUserApprovalPriorityLevel: `api/DocumentApprovalHirarchy/ChangeUserApprovalPriorityLevel`,

  //======DocumentTypes======
  GetAllDocumentTypes: `api/DocumentTypes/GetAllDocumentTypes`,
  GetMaxDocumentTypeId: `api/DocumentTypes/GetMaxDocumentTypeId`,
  AddDocumentTypes: `api/DocumentTypes/AddDocumentTypes`,
  UpdateDocumentTypes: `api/DocumentTypes/UpdateDocumentTypes`,
  DeleteDocumentType: `api/DocumentTypes/DeleteDocumentTypes`,

  //======Demand======
  LoadStores: `api/Demand/LoadStores`,
  GetDemandMasterInfo: `api/Demand/GetDemandMasterInfo`,
  LoadStoreItems: `api/Demand/LoadStoreItems`,
  UpdateDepartmentDemandMaster: `api/Demand/UpdateDepartmentDemandMaster`,
  DeleteDepartmentDemandMaster: `api/Demand/DeleteDepartmentDemandMaster`,
  LoadDemandDetails: `api/Demand/LoadDemandDetails`,
  CreateDepartmentDemandDetail: `api/Demand/CreateDepartmentDemandDetail`,
  UpdateDepartmentDemandDetail: `api/Demand/UpdateDepartmentDemandDetail`,
  DeleteDepartmentDemandDetail: `api/Demand/DeleteDepartmentDemandDetail`,
  GetPreviousDemandNo: `api/Demand/GetPreviousDemandNo`,
  GetNextDemandNo: `api/Demand/GetNextDemandNo`,

  //======Attachment Type======
  GetAttachmentTypeByDocTypeId: `api/DocumentAttachmentTypes/GetAttachmentTypeByDocTypeId`,
  GetMaxAttachmentTypeId: `api/DocumentAttachmentTypes/GetMaxAttachmentTypeId`,
  AddDocumentAttachmentTypes: `api/DocumentAttachmentTypes/AddDocumentAttachmentTypes`,
  UpdateDocumentAttachmentTypes: `api/DocumentAttachmentTypes/UpdateDocumentAttachmentTypes`,
  DeleteDocumentTypes: `api/DocumentAttachmentTypes/DeleteDocumentTypes`,
  GetDocumentAttachments: `api/DocumentAttachments/GetDocumentAttachments`,
  GetDocumentAttachmentsByDocTypeId: `api/DocumentAttachments/GetDocumentAttachmentsByDocTypeId`,
  UpdateDocumentAttachments: `api/DocumentAttachments/UpdateDocumentAttachments`,
  DeleteDocumentAttachments: `api/DocumentAttachments/DeleteDocumentAttachments`,

  //======Customers======
  GetAllCustomers: `api/Customer/GetAllCustomers`,
  CreateNewCustomer: `api/Customer/CreateNewCustomer`,
  UpdateCustomer: `api/Customer/UpdateCustomer`,
  DeleteCustomer: `api/Customer/DeleteCustomer`,

  //======EmployeeGLConfiguration======
  GetAllEmployeeGLConfiguration: `api/EmployeeGLConfiguration/GetAllEmployeeGLConfiguration`,
  GetMaxEmployeeGLConfigurationCode: `api/EmployeeGLConfiguration/GetMaxEmployeeGLConfigurationCode`,
  AddEmployeeGLConfiguration: `api/EmployeeGLConfiguration/AddEmployeeGLConfiguration`,
  UpdateEmployeeGLConfiguration: `api/EmployeeGLConfiguration/UpdateEmployeeGLConfiguration`,
  DeleteEmployeeGLConfiguration: `api/EmployeeGLConfiguration/DeleteEmployeeGLConfiguration`,

  //========Employee Shift================================
  GetDeptEmployees: `api/EmployeeShift/GetDeptEmployees`,
  AssignEmployeeShift: `api/EmployeeShift/AssignEmployeeShift`,

  //========GRN================================================
  LoadAllGRN: `api/GRN/LoadAllGRN`,
  CreateNewGRN: `api/GRN/CreateNewGRN`,
  PendingToReceivePOs: `api/GRN/PendingToReceivePOs`,
  GetGRNMasterByGRNNo: `api/GRN/GetGRNMasterByGRNNo`,
  LoadGRNDetails: `api/GRN/LoadGRNDetails`,
  UpdateGRNMaster: `api/GRN/UpdateGRNMaster`,
  GRNDetailEntry: `api/GRN/GRNDetailEntry`,
  CreateGRNDetail: `api/GRN/CreateGRNDetail`,
  UpdateGRNDetail: `api/GRN/UpdateGRNDetail`,
  DeleteGRNDetail: `api/GRN/DeleteGRNDetail`,
  GetPreviousGRNNo: `api/GRN/GetPreviousGRNNo`,
  GetNextGRNNo: `api/GRN/GetNextGRNNo`,

    //========IRN================================================
    LoadAllIRN: `api/IRN/LoadAllIRN`,
    CreateNewIRN: `api/IRN/CreateNewIRN`,
    PendingToReceiveIRNPOs: `api/IRN/PendingToReceivePOs`,
    CopyfromIGP: `api/IRN/CopyfromIGP`,
    GetIRNMasterByIRNNo: `api/IRN/GetIRNMasterByIRNNo`,
    LoadIRNDetails: `api/IRN/LoadIRNDetails`,
    UpdateIRNMaster: `api/IRN/UpdateIRNMaster`,
    IRNDetailEntry: `api/IRN/IRNDetailEntry`,
    CreateIRNDetail: `api/IRN/CreateIRNDetail`,
    UpdateIRNDetail: `api/IRN/UpdateIRNDetail`,
    DeleteIRNDetail: `api/IRN/DeleteIRNDetail`,
    GetPreviousIRNNo: `api/IRN/GetPreviousIRNNo`,
    GetNextIRNNo: `api/IRN/GetNextIRNNo`,
    IRNDetailIGPEntry: `api/IRN/IRNDetailIGPEntry`,
  //===Buyers Brands====

  //===Products====

  //===Product BOM====

  //===Seasons====

  //===WorkOrders====
  LoadWorkOrders: `api/WorkOrderMaster/LoadWorkOrders`,

  //====Store================================
  StoreIssuanceNoteReport: `api/store/StoreIssuanceNoteReport`,

  //====Store Issuance============
  LoadIssueToDept: `api/StoreIssuance/LoadIssueToDept`,
  GetIssuanceMasterList: `api/StoreIssuance/GetIssuanceMasterList`,
  SaveIssMaster: `api/StoreIssuance/SaveIssMaster`,
  LoadIssuanceMasterInfo: `api/StoreIssuance/LoadIssuanceMasterInfo`,
  LoadItemRates: `api/StoreIssuance/LoadItemRates`,
  LoadItemStockDetails: `api/StoreIssuance/LoadItemStockDetails`,
  LoadIssuanceDetails: `api/StoreIssuance/LoadIssuanceDetails`,
  UpdateIssuanceNoteMaster: `api/StoreIssuance/UpdateIssuanceNoteMaster`,
  SaveIssDetail: `api/StoreIssuance/SaveIssDetail`,
  UpdateIssuanceNoteDetail: `api/StoreIssuance/UpdateIssuanceNoteDetail`,
  DeleteIssuanceNoteDetail: `api/StoreIssuance/DeleteIssuanceNoteDetail`,
  GetPreviousIssuanceNo: `api/StoreIssuance/GetPreviousIssuanceNo`,
  GetNextIssuanceNo: `api/StoreIssuance/GetNextIssuanceNo`,

  //====Issuance Return============
  SaveIssuanceReturnMaster: 'api/StoreIssuanceReturn/SaveIssuanceReturnMaster',
  GetIssuanceReturnMasterList: `api/StoreIssuanceReturn/GetIssuanceReturnMasterList`,
  LoadIssuanceReturnMasterInfo: `api/StoreIssuanceReturn/LoadIssuanceReturnMasterInfo`,
  UpdateIssReturnMaster: `api/StoreIssuanceReturn/UpdateIssReturnMaster`,
  LoadItemIssuancesDetails: `api/StoreIssuanceReturn/LoadItemIssuancesDetails`,
  SaveIssReturnDetail: `api/StoreIssuanceReturn/SaveIssReturnDetail`,
  LoadIssuanceReturnDetails: `api/StoreIssuanceReturn/LoadIssuanceReturnDetails`,
  DeleteIssReturnDetail: `api/StoreIssuanceReturn/DeleteIssReturnDetail`,
  GetPreviousIssuanceReturnNo: `api/StoreIssuanceReturn/GetPreviousIssuanceReturnNo`,
  GetNextIssuanceReturnNo: `api/StoreIssuanceReturn/GetNextIssuanceReturnNo`,

  //====IGP (Inward Gate Pass)================================
  GetIGPMasterByIGPNo: `api/IGP/GetIGPMasterByIGPNo`,
  UpdateIGPMaster: `api/IGP/UpdateIGPMaster`,
  LoadParties: `api/IGP/LoadParties`,
  LoadPurpose: `api/OGP/LoadPurpose`,
  LoadAllIGP: `api/IGP/LoadAllIGP`,
  CreateNewIGP: `api/IGP/CreateNewIGP`,
  ImportDataFromPOInIGP: `api/IGP/ImportDataFromPOInIGP`,
  LoadIGPDetails: `api/IGP/LoadIGPDetails`,
  ImportDataFromOGPInIGP: `api/IGP/ImportDataFromOGPInIGP`,
  DeleteIGPDetail: `api/IGP/DeleteIGPDetail`,

  //====OGP (Outward Gate Pass) =================
  GetOGPMasterByOGPNo: `api/OGP/GetOGPMasterByOGPNo`,
  UpdateOGPMaster: `api/OGP/UpdateOGPMaster`,
  CreateOGPDetail: `api/OGP/CreateOGPDetail`,
  GetOGPDetailById: `api/OGP/GetOGPDetailById`,
  DeleteOGP_PK: `api/OGP/DeleteOGP_PK`,
  GetOGPMasterDataList: `api/OGP/GetOGPMasterDataList`,
  CreateNewOGP: `api/OGP/CreateNewOGP`,
  LoadAllDptLocations: `api/OGP/LoadAllDptLocations`,
  GetOGPMasterData: `api/OGP/GetOGPMasterData`,
  DeleteOGPMaster: `api/OGP/DeleteOGPMaster`,
  LoadItemStockDetailsOGP: `api/OGP/LoadItemStockDetails`,
  LoadOGPDetail: `api/OGP/LoadOGPDetail`,
  DeleteOGPDetail: `api/OGP/DeleteOGPDetail`,
  OutwardGatePassReport: `api/OGP/OutwardGatePassReport`,
  UpdateOGPDetail: `api/OGP/UpdateOGPDetail`,
  OGPMasterFilters: `api/OGP/OGPMasterFilters`,

  //=====Party Setup ==============================
  LoadAllParties: `api/PartySetup/LoadAllParties`,
  LoadAllPartyTypes: `api/PartySetup/LoadAllPartyTypes`,
  CreatePartySetup: `api/PartySetup/CreatePartySetup`,
  UpdatePartySetup: `api/PartySetup/UpdatePartySetup`,
  DeletePartySetup: `api/PartySetup/DeletePartySetup`,
  LoadAllPartyTypesByPartyCode: `api/PartySetup/LoadAllPartyTypesByPartyCode`,

  //=====Party Item================================
  GetPartyItemRates: `api/PartyItemRates/GetPartyItemRates`,
  DeletePartyItemRates: `api/PartyItemRates/DeletePartyItemRates`,
  PutPartyItemRates: `api/PartyItemRates/PutPartyItemRates`,

  //=====SalesMan===================================
  GetAllSalesMan: `api/SalesMan/GetAllSalesMan`,
  GetSalesManMaxId: `api/SalesMan/GetSalesManMaxId`,
  CreateSalesMan: `api/SalesMan/CreateSalesMan`,
  UpdateSalesMan: `api/SalesMan/UpdateSalesMan`,
  DeleteSalesMan: `api/SalesMan/DeleteSalesMan`,

  //=====Purchase Invoice================================
  GetInvoiceTypeId: `api/InvoiceTypes/Get`,
  PostInvoice: `api/PurchaseInvoice/PostInvoice`,
  VerifyInvoice: `api/PurchaseInvoice/VerifyInvoice`,
  GetAllParties: `api/PurchaseInvoice/GetAllParties`,
  GetPurchaseInvoicesList: `api/PurchaseInvoice/GetPurchaseInvoicesList`,
  GetPurchaseInvoiceDetail: `api/PurchaseInvoice/GetPurchaseInvoiceDetail`,
  LoadPurchaseInvoiceMasterInfo: `api/PurchaseInvoice/GetPurchaseInvoiceMaster`,
  GetPendingToInvoiceGRNMasters: `api/PurchaseInvoice/GetPendingToInvoiceGRNMasters`,
  GetPendingToInvoiceGRNDetails: `api/PurchaseInvoice/GetPendingToInvoiceGRNDetails`,
  ImportGRNDetailsToInvoiceDetails: `api/PurchaseInvoice/ImportGRNDetailsToInvoiceDetails`,
  CreatePurchaseInvoiceMaster: `api/PurchaseInvoice/CreatePurchaseInvoiceMaster`,
  UpdatePurchaseInvoiceMaster: `api/PurchaseInvoice/UpdatePurchaseInvoiceMaster`,
  PurchaseInvoice_PendingToInvoiceData: `api/PurchaseInvoice/PurchaseInvoice_PendingToInvoiceData`,

  //====Demand Documnets=====================================================
  GetAllDemandDocuments: `api/DemandDocumets/GetAllDemandDocuments`,
  ViewDemandDocuments: `api/DemandDocumets/ViewDemandDocuments`,
  DeleteDemandDocuments: `api/DemandDocumets/Delete`,

  //=====Purchase Payment================================
  CreatePurchasePaymentMaster: `api/PurchasePaymentTerms/CreatePurchasePaymentMaster`,
  GetPurchasePaymentList: `api/PurchasePaymentTerms/GetPurchasePaymentList`,
  GetPurchasePaymentMaster: `api/PurchasePaymentTerms/GetPurchasePaymentMaster`,
  UpdatePurchasePaymentMaster: `api/PurchasePaymentTerms/UpdatePurchasePaymentMaster`,
  GetPendingToPaymentInvoiceMasters: `api/PurchasePaymentTerms/GetPendingToPaymentInvoiceMasters`,
  GetPendingToPaymentInvoiceDetail: `api/PurchasePaymentTerms/GetPendingToPaymentInvoiceDetails`,
  GetPurchasePaymentDetails: `api/PurchasePaymentTerms/GetPurchasePaymentDetails`,
  ImportPurchasePaymentDetails: `api/PurchasePaymentTerms/ImportPurchasePaymentDetails`,
  GetPurchasePaymentsInfo: `api/PurchasePaymentTerms/GetPurchasePaymentsInfo`,

  //====Purchase Order================================
  GetAllPurchaseOrderMasters: `api/PurchaseOrder/GetAllPurchaseOrderMasters`,
  CreatePurchaseOrder: `api/PurchaseOrder/CreatePurchaseOrder`,
  PendingPRDetailsToBeAddedInPO: `api/PurchaseOrder/PendingPRDetailsToBeAddedInPO`,

  GetAllPurchaseOrderMaster: `api/PurchaseOrder/GetAllPurchaseOrderMaster`,
  GetAllPurchaseOrderDetail: `api/PurchaseOrder/GetAllPurchaseOrderDetail`,
  UpdatePurchaseOrder: `api/PurchaseOrder/UpdatePurchaseOrder`,
  InsertNewPODetail: `api/PurchaseOrder/InsertNewPODetail`,
  UpdatePurchaseOrderDetail: `api/PurchaseOrder/UpdatePurchaseOrderDetail`,
  DeletePurchaseOrderDetail: `api/PurchaseOrder/DeletePurchaseOrderDetail`,
  GetPreviousPONo: `api/PurchaseOrder/GetPreviousPONo`,
  GetNextPONo: `api/PurchaseOrder/GetNextPONo`,

  //====Purchase Requisition================================
  CreateNewPurchaseRequsition: `api/PurchaseRequsition/CreateNewPurchaseRequsition`,
  GetPurchaseRequisitionMaster: `api/PurchaseRequsition/GetPurchaseRequisitionMaster`,
  DeletePurchaseRequsition: `api/PurchaseRequsition/DeletePurchaseRequsition`,
  LoadPendingDemandDetailsForPR: `api/PurchaseRequsition/LoadPendingDemandDetailsForPR`,
  GetPurchaseRequsitionMasterInfo: `api/PurchaseRequsition/GetPurchaseRequsitionMasterInfo`,
  GetPurchaseRequsitionDetailInfo: `api/PurchaseRequsition/GetPurchaseRequsitionDetailInfo`,
  UpdatePurchaseRequistionNoteMaster: `api/PurchaseRequsition/UpdatePurchaseRequistionNoteMaster`,
  CreatePurchaseRequsitionDetail: `api/PurchaseRequsition/CreatePurchaseRequsitionDetail`,
  UpdatePurchaseRequsitionDetail: `api/PurchaseRequsition/UpdatePurchaseRequsitionDetail`,
  DeletePurchaseRequistionNoteDetail: `api/PurchaseRequsition/DeletePurchaseRequistionNoteDetail`,
  GetPreviousPRNo: `api/PurchaseRequsition/GetPreviousPRNo`,
  GetNextPRNo: `api/PurchaseRequsition/GetNextPRNo`,


    //====Comparative Statement================================
    ComparativeStatement: `api/ComaprativeStatement`,
    GetCSMasterByCSNo: `api/ComaprativeStatement/GetCSByCSNo`,
    GetAllDeliveryTerm: `api/ComaprativeStatement/GetAllDeliveryTerm`,
    GetAllCSMasterList: `api/ComaprativeStatement/GetAllCS`,

    //====Purchase Requisition Type================================
    PurchaseRequistionType :`api/PurchaseRequistionType`,

     //====Purchase Order Type================================
    PurchaseOrderType :`api/PurchaseOrderType`,

    //====Sale Invoice===================
  GetAllSaleTypes: `api/SaleInvoice/GetAllSaleTypes`,
  LoadAllSaleInvoices: `api/SaleInvoice/LoadAllSaleInvoices`,
  CreateSaleInvoiceMaster: `api/SaleInvoice/CreateSaleInvoiceMaster`,
  LoadSaleInvoiceMasterInfo: `api/SaleInvoice/LoadSaleInvoiceMasterInfo`,
  GetSaleInvoiceDetail: `api/SaleInvoice/GetSaleInvoiceDetail`,
  UpdateSaleInvoiceMaster: `api/SaleInvoice/UpdateSaleInvoiceMaster`,
  UpdateSaleInvoiceDetail: `api/SaleInvoice/UpdateSaleInvoiceDetail`,
  CreateSaleInvoiceDetail: `api/SaleInvoice/CreateSaleInvoiceDetail`,
  DeleteSaleInvoiceDetail: `api/SaleInvoice/DeleteSaleInvoiceDetail`,
  GetAllStatus: `api/SaleInvoice/GetAllStatus`,
  UpdateStatus: `api/SaleInvoice/UpdateStatus`,
  GetSaleTypesForCopyInvoices: `api/SaleInvoice/GetSaleTypesForCopyInvoices`,
  CopySaleInvoiceDetails: `api/SaleInvoice/CopySaleInvoiceDetails`,
  GetToBeCopiedSaleInvoicesDetail: `api/SaleInvoice/GetToBeCopiedSaleInvoicesDetail`,
  GetSaleInvoiceDetailBySrNo: `api/SaleInvoice/GetSaleInvoiceDetailBySrNo`,
  LastVisitDate: `api/SaleInvoice/LastVisitDate`,

  //====SaleInvoiceDocuments================================================
  CreateSaleDocuments: `api/SaleInvoiceDocuments/CreateSaleDocuments`,
  GetMaxDocumentId: `api/SaleInvoiceDocuments/GetMaxDocumentId`,
  GetAllnvoiceDocuments: `api/SaleInvoiceDocuments/GetAllnvoiceDocuments`,
  ViewSaleInvoiceDocuments: `api/SaleInvoiceDocuments/ViewSaleInvoiceDocuments`,
  DeleteSaleInvoiceDocument: `api/SaleInvoiceDocuments/DeleteSaleInvoiceDocument`,

  //====Purchase Invoice Documnets=====================================================
  GetPurchaseInvoiceDocuments: `api/PurchaseInvoiceDocument/GetPurchaseInvoiceDocuments`,
  ViewPurchaseInvoiceDocuments: `api/PurchaseInvoiceDocument/ViewPurchaseInvoiceDocuments`,
  DeletePurchaseInvoiceDocuments: `api/PurchaseInvoiceDocument/Delete`,

  //====Purchase Payment Documnets=====================================================
  GetAllPurchasePaymentDocuments: `api/PurchasePayment/GetAllPurchasePaymentDocuments`,
  ViewPurchasePaymentDocuments: `api/PurchasePayment/ViewPurchasePaymentDocuments`,
  DeletePurchasePaymentDocuments: `api/PurchasePayment/Delete`,

  //====Voucher Documnets=====================================================
  GetAllVoucherDocuments: `api/VoucherDocuments/GetAllVoucherDocuments`,
  ViewVoucherDocuments: `api/VoucherDocuments/ViewVoucherDocuments`,
  DeleteVoucherDocuments: `api/VoucherDocuments/Delete`,

  //====PR Documnets=====================================================
  GetAllPRDocuments: `api/PurchaseRequisitionDocuments/GetAllPRDocuments`,
  DeletePRDocuments: `api/PurchaseRequisitionDocuments/Delete`,

  //====PO Documnets=====================================================
  GetAllPODocuments: `api/PurchaseOrderDocuments/GetAllPurchaseOrderDocuments`,
  DeletePODocuments: `api/PurchaseOrderDocuments/Delete`,

  //====GRN Documnets=====================================================
  GetAllGRNDocuments: `api/GRNDocuments/GetAllGRNDocuments`,
  DeleteGRNDocuments: `api/GRNDocuments/Delete`,

    //====IRN Documnets=====================================================
    GetAllIRNDocuments: `api/IRNDocuments/GetAllIRNDocuments`,
    DeleteIRNDocuments: `api/IRNDocuments/Delete`,

       //====CS Documnets=====================================================
       GetAllCSDocuments: `api/CSDocuments/GetAllCSDocuments`,
       DeleteCSDocument: `api/CSDocuments`,

  //====SaleInvoice Documnets=====================================================
  GetAllSaleInvoiceDocuments: `api/SaleInvoiceDocuments/GetAllnvoiceDocuments`,
  DeleteSaleInvoiceDocuments: `api/SaleInvoiceDocuments/Delete`,

  //====Lead Documnets=====================================================
  GetAllLeadDocuments: `api/LeadDocuments/GetAllLeadDocuments`,
  DeleteLeadDocuments: `api/LeadDocuments/Delete`,

  //====POS Preferences =================================
  GetPosPreferencesItems: `api/PosPreferences/GetPosPreferencesItems`,

  //====Point of Sale =================================================
  GetSaleInvoiceReport: `api/PointOfSale/GetSaleInvoiceReport`,
  getAllSales: `api/POSDashboard/GetTotalSalesDashBoard`,
  getDashboardInfo: `api/InventoryDashBoard/DashboardInfo`,

  //====Menu Options================================
  GetMenuOptions: `api/MenuOptions/GetMenuOptions`,
  GetUserMenuRights: `api/MenuOptions/GetUserMenuRights`,
  SaveMenuRights: `api/MenuOptions/SaveMenuRights`,

  //====Voucher Details====================================
  GetVoucherDetails: `api/VoucherDetails/GetVoucherDetails`,
  GetVoucherDetailsById: `api/VoucherDetails/GetVoucherDetailsById`,
  AddVoucherDetail: `api/VoucherDetails/AddVoucherDetail`,
  UpdateVoucherDetail: `api/VoucherDetails/UpdateVoucherDetail`,
  DeleteVoucherDetail: `api/VoucherDetails/DeleteVoucherDetail`,

  //====GL===================================================
  GetVoucherReport: `api/GL/GetVoucherReport`,
  BalanceSheetReport: `api/GL/BalanceSheetReport`,
  ChartOfAccountListReport: `api/GL/ChartOfAccountListReport`,

  //====Finance===================================================
  ChartOfAssetsWithBarCode: `api/Finance/ChartOfAssetsWithBarCode`,

  //====BudgetManagement===========================
  //============Budget Cycle========================
  GetAllBudgetCycle: `api/BudgetCycle/GetAllBudgetCycleCode`,
  AddBudgetCycle: `api/BudgetCycle/CreateBudgetCycleCode`,
  UpdateBudgetCycle: `api/BudgetCycle/UpdateBudgetCycleCode`,
  DeleteBudgetCycle: `api/BudgetCycle/DeleteBudgetCycleCode`,
  FilterBudgetCycle: `api/BudgetCycle/FilterBudgetCycle`,

  //===========Budget Status=========================
  GetAllBudgetStatus: `api/BudgetStatus/GetAllBudgetStatus`,
  CreateBudgetStatus: `api/BudgetStatus/CreateBudgetStatus`,
  UpdateBudgetStatus: `api/BudgetStatus/UpdateBudgetStatus`,
  DeleteBudgetStatus: `api/BudgetStatus/DeleteBudgetStatus`,
  //=================Budget Entry ===========================
  AddBudgetEntry: `api/BudgetEntry/AddBudgetEntry`,
  GetAllBudgetEntry: `api/BudgetEntry/GetAllBudgetEntry`,
  DeleteBudgetEntry: `api/BudgetEntry/DeleteBudgetEntry`,
  GetAllBudgetCycleDetail: `api/BudgetEntry/GetAllBudgetCycleDetail`,
  UpdateBudgetEntry: `api/BudgetEntry/UpdateBudgetEntry`,
  FilterBudgetEntry: `api/BudgetEntry/FilterBudgetEntry`,

  //=================HardLine Budget ===========================
  GetAllAccountName: `api/BudgetTransfer/GetAllAccountName`,
  GetAllBudgetEntryLocked: `api/BudgetTransfer/GetAllBudgetEntry`,
  GetAllBudgetTransfer: `api/BudgetTransfer/GetAllBudgetTransfer`,
  CreateBudgetTransfer: `api/BudgetTransfer`,
  GetAllHardBudgetTransfer: `api/BudgetTransfer/GetAllHardBudgetTransfer`,
  CreateBudgetEntryDetails: `api/BudgetTransfer/CreateBudgetEntryDetails`,
  GetAllBudgetTransferDetail: `api/BudgetTransfer/GetAllBudgetTransferDetail`,
  UpdateBudgetEntryDetails: `api/BudgetTransfer/UpdateBudgetEntryDetails`,
  DeleteBudgetTransfer: `api/BudgetTransfer/DeleteBudgetTransfer`,
  DeleteBudgetTransferMaster: `api/BudgetTransfer/DeleteBudgetTransferMaster`,

  //=================Budget Variance ===========================
  GetAllBudgetVariance: `api/BudgetVariance/GetAllBudgetVariance`,

  //===================Inventory/Store====================
  GetAllStores: `api/Stores/GetAllStores`,
  GetMaxStoreCode: `api/Stores/GetMaxStoreCode`,
  AddStore: `api/Stores/AddStore`,
  UpdateStore: `api/Stores/UpdateStore`,
  DeleteStore: `api/Stores/DeleteStore`,

  //===================Inventory/Store (Purchase Order->Shipment Mode)====================
  LoadShipmentMode: `api/ShipmentMode/LoadShipmentMode`,
  GetMaxShipmentModeCode: `api/ShipmentMode/GetMaxShipmentModeCode`,
  AddShipmentMode: `api/ShipmentMode/AddShipmentMode`,
  UpdateShipmentMode: `api/ShipmentMode/UpdateShipmentMode`,
  DeleteShipmentMode: `api/ShipmentMode/DeleteShipmentMode`,

  //===================Inventory/Store (Purchase Order->Payment Terms)====================
  GetPaymentTerms: `api/PaymentTerms/GetPaymentTerms`,
  GetMaxPaymentTermId: `api/PaymentTerms/GetMaxPaymentTermId`,
  AddPaymentTerms: `api/PaymentTerms/AddPaymentTerms`,
  UpdatePaymentTerms: `api/PaymentTerms/UpdatePaymentTerms`,
  DeletePaymentTerms: `api/PaymentTerms/DeletePaymentTerms`,

  //===================Inventory/Store (Purchase Order->Freight Terms)====================
  LoadFreightTerms: `api/FreightTerms/LoadFreightTerms`,
  GetMaxFreightTermId: `api/FreightTerms/GetMaxFreightTermId`,
  AddFreightTerm: `api/FreightTerms/AddFreightTerm`,
  UpdateFreightTerm: `api/FreightTerms/UpdateFreightTerm`,
  DeleteFreightTerm: `api/FreightTerms/DeleteFreightTerm`,

  //===================(HR-and-Payroll/holidays)=============================
  Holiday: `api/Holiday`,

  //===================(HR-and-Payroll/BloodGroups)==========================
  BloodGroups: `api/BloodGroups`,

  //===================(HR-and-Payroll/Division)=============================
  Division: `api/Division`,

  //===================(HR-and-Payroll/Designation)==========================
  Designation: `api/Designation`,

  //===================(HR-and-Payroll/Country)==============================
  Country: `api/Country`,

  //===================(HR-and-Payroll/City)=================================
  City: `api/City`,

  //===================(HR-and-Payroll/Qualification)========================

  Qualification: `api/Qualification`,

  //===================(HR-and-Payroll/Qualification)========================
  QualificationLevel: `api/QualificationLevel`,

  //===================(HR-and-Payroll/EmployeeActionType)===================
  EmployeeActionType: `api/EmployeeActionType`,

  //===================(HR-and-Payroll/EmployeeRecruitmentRequiremet)========

  EmployeeRecruitmentRequirement: `api/EmployeeRecruitmentRequirement`,

  //===================(HR-and-Payroll/InterviewStatus)======================

  InterviewStatus: `api/InterviewStatus`,
  //===================(HR-and-Payroll/ApplicantGatePassType)================

  ApplicantGatePassType: `api/ApplicantGatePassType`,

  //====================Finance/ChequeBook===================================
  ChequeBook: `api/ChequeBook`,

  //====================Finance/ChequeConfig=============

  ChequeBookConfig: `api/ChequeConfig`,

  // === HR-and-Payroll / FamilyRelations Endpoints ===

  FamilyRelations: 'api/FamilyRelations',

  // === HR-and-Payroll / Distric Endpoints =================================
  District: `api/District`,

  //=======HR-and-Payroll/InterviewSchedule =================================
  InterviewSchedule: `api/InterviewSchedule`,
  InterviewScheduleViewCV: `api/InterviewSchedule/InterviewScheduleViewCV`,

  // === HR-and-Payroll / States Endpoints ===

  States: `api/States`,

  // === HR-and-Payroll / Designation Levels ===

  DesignationLevels: `api/DesignationLevels`,

  // === HR-and-Payroll / EmployeeType ===

  EmployeeType: `api/EmployeeType`,

  // === HR-and-Payroll / EmployeeType ===

  Gender: `api/Gender`,

  // === HR-and-Payroll / EmployeeType ===

  JobLevel: `api/JobLevel`,

  // === HR-and-Payroll / EmployeeType ===

  MaritalStatus: `api/MaritalStatus`,

  // === HR-and-Payroll / EmployeeType ===

  Religion: `api/Religion`,

  // === HR-and-Payroll / EmployeeType ===

  DisabilityNature: `api/DisabilityNature`,

  // === HR-and-Payroll / EmployeeType ===

  DocumentTypes: `api/DocumentTypes`,

// === HR-and-Payroll / EmployeeQualification ===

  EmployeeQualification: `api/EmployeeQualification`,
  GetMaxQualificationCode: `api/EmployeeQualification/GetMaxQualificationCode`,

  // === HR-and-Payroll / EmployeeApplicant ===

  EmployeeApplicant: `api/EmployeeApplicant`,

  // === HR-and-Payroll / EmployeeApplicantStatus ===

  EmployeeApplicantStatus: `api/EmployeeApplicantStatus`,

  // === HR-and-Payroll / PayHeadType ===

  PayHeadType: `api/PayHeadType`,

  // === HR-and-Payroll / PayHeadType ===

  SalaryPayHead: `api/SalaryPayHead`,

  // === HR-and-Payroll / PayHeadType ===

  PeriodType: `api/PeriodType`,


};
