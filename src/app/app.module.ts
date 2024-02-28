import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
//============================================================General Components============================================================
import { LoginComponent } from './screen/login/login.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TabMenuModule } from 'primeng/tabmenu';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BiReportingDashboardComponent } from './pages/bi-reporting/bi-reporting-dashboard/bi-reporting-dashboard.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputMaskModule } from 'primeng/inputmask';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonDisplayErrorComponent } from './_shared/component/common-display-error/common-display-error.component';
import { FormFieldInputComponent } from './_shared/component/form-field-input/form-field-input.component';
import { YesNoPipe } from './_shared/pipe/yes-no.pipe';
import { DashboardComponent } from './screen/dashboard/dashboard.component';
import { DecimalPlacesValidatorDirective } from './_shared/function/decimal-places-validator.directive';
import { CommaSeparatedNumberDirective } from './_shared/function/CommaSeparatedNumberDirective ';
import { SublevelMenuComponent } from './screen/sidenav/sublevel-menu.component';
import { ChangePasswordComponent } from './screen/change-password/change-password.component';
import { TimePipe } from './_shared/pipe/time.pipe';
import { DashboardStatsComponent } from './screen/dashboard-stats/dashboard-stats.component';
import { AccountStatsComponent } from './screen/dashboard-stats/account-stats/account-stats.component';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { DashBoard2Component } from './screen/dash-board2/dash-board2.component';
import { TreeTableModule } from 'primeng/treetable';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import {
  VgBufferingModule,
  VgControlsModule,
  VgCoreModule,
  VgOverlayPlayModule,
} from 'ngx-videogular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SocketIoModule } from 'ngx-socket-io';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DataViewModule } from 'primeng/dataview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';


//============================================================Setup & Configuration=========================================================
import { UserBranchesComponent } from './pages/setup-configuration/user-branches/user-branches.component';
import { CompanyConfigComponent } from './pages/setup-configuration/company-config/company-config.component';
import { ProjectComponent } from './pages/setup-configuration/project/project.component';
import { BranchComponent } from './pages/setup-configuration/branch/branch.component';
import { UserDefinationComponent } from './pages/setup-configuration/user-defination/user-defination.component';
import { UserProjectsComponent } from './pages/setup-configuration/user-projects/user-projects.component';
import { SetupDashboardComponent } from './pages/setup-configuration/setup-dashboard/setup-dashboard.component';
import { SublevelMenuSetupComponent } from './pages/setup-configuration/setup-dashboard/sublevel-menu-setup.component';
import { UserRoleComponent } from './pages/setup-configuration/user-role/user-role.component';
import { UservouchertypeComponent } from './pages/setup-configuration/uservouchertype/uservouchertype.component';
import { PartySetupComponent } from './pages/setup-configuration/party-setup/party-setup.component';
import { PartyTypeComponent } from './pages/setup-configuration/party-type/party-type.component';
import { UsermenurightsComponent } from './pages/setup-configuration/usermenurights/usermenurights.component';
import { DocumentTypesComponent } from './pages/setup-configuration/Approvals/document-types/document-types.component';
import { AttachmentTypesComponent } from './pages/setup-configuration/Approvals/attachment-types/attachment-types.component';
import { ApprovalHirarchyComponent } from './pages/setup-configuration/Approvals/approval-hirarchy/approval-hirarchy.component';
import { DocumentAttachmentsComponent } from './pages/setup-configuration/Approvals/document-attachments/document-attachments.component';
import { AddnewvariableComponent } from './pages/setup-configuration/addnewvariable/addnewvariable.component';
import { DocumentApprovalsComponent } from './pages/setup-configuration/Approvals/document-approvals/document-approvals.component';
import { StreamComponent } from './pages/setup-configuration/stream/stream.component';
import { UserRightsComponent } from './pages/setup-configuration/user-rights/user-rights.component';
import { UserDataEntryrightComponent } from './pages/setup-configuration/user-data-entryright/user-data-entryright.component';

//============================================================Account & GL==================================================================
import { AccountChartComponent } from './pages/account-gl/account-chart/account-chart.component';
import { VoucherComponent } from './pages/account-gl/voucher/voucher.component';
import { VoucherTypeComponent } from './pages/account-gl/voucher-type/voucher-type.component';
import { AccountDashboardComponent } from './pages/account-gl/account-dashboard/account-dashboard.component';
import { VoucherDetailComponent } from './pages/account-gl/voucher/voucher-detail/voucher-detail.component';
import { InstrumentComponent } from './pages/account-gl/instrument/instrument.component';
import { FinancialMonthComponent } from './pages/account-gl/financial-month/financial-month.component';
import { FinancialYearsComponent } from './pages/account-gl/financial-years/financial-years.component';
import { CurrencyComponent } from './pages/account-gl/currency/currency.component';
import { SublevelMenuAccountglComponent } from './pages/account-gl/account-dashboard/sublevel-menu-accountgl.component';
import { ProfitlossCategoryComponent } from './pages/account-gl/Definition/profitloss-category/profitloss-category.component';
import { ProfitlossSubcategoryComponent } from './pages/account-gl/Definition/profitloss-subcategory/profitloss-subcategory.component';
import { CashflowCategoryComponent } from './pages/account-gl/Definition/cashflow-category/cashflow-category.component';
import { CashflowSubcategoryComponent } from './pages/account-gl/Definition/cashflow-subcategory/cashflow-subcategory.component';
import { CostCenterIComponent } from './pages/account-gl/Definition/cost-center-i/cost-center-i.component';
import { CostCenterIIComponent } from './pages/account-gl/Definition/cost-center-ii/cost-center-ii.component';
import { CostCenterIIIComponent } from './pages/account-gl/Definition/cost-center-iii/cost-center-iii.component';
import { FunctionsComponent } from './pages/account-gl/Definition/functions/functions.component';
import { CashflowtagIComponent } from './pages/account-gl/Definition/cashflowtag-i/cashflowtag-i.component';
import { CashflowtagIIComponent } from './pages/account-gl/Definition/cashflowtag-ii/cashflowtag-ii.component';
import { BalanceSheetCategoryComponent } from './pages/account-gl/Definition/balance-sheet-category/balance-sheet-category.component';
import { BalanceSheetSubcategoryComponent } from './pages/account-gl/Definition/balance-sheet-subcategory/balance-sheet-subcategory.component';

//============================================================Account & GL Reports==================================================================
import { VoucherListComponent } from './pages/account-gl/Reports/voucher-list/voucher-list.component';
import { TrialBalanceComponent } from './pages/account-gl/Reports/trial-balance/trial-balance.component';
import { ProfitLossComponent } from './pages/account-gl/Reports/profit-loss/profit-loss.component';
import { LedgerComponent } from './pages/account-gl/Reports/ledger/ledger.component';
import { BalancesheetComponent } from './pages/account-gl/Reports/balancesheet/balancesheet.component';

//============================================================Finance=======================================================================
import { AssetsChartComponent } from './pages/finance/assets-chart/assets-chart.component';
import { FinanceDashboardComponent } from './pages/finance/finance-dashboard/finance-dashboard.component';
import { SublevelMenuFinancedashComponent } from './pages/finance/finance-dashboard/sublevel-menu-financedash.component';
import { BudgetCycleComponent } from './pages/finance/budget-management/budget-cycle/budget-cycle.component';
import { BudgetStatusComponent } from './pages/finance/budget-management/budget-status/budget-status.component';

//============================================================Store / Inventory=============================================================
import { StoreIssuanceDetailComponent } from './pages/inventory/store-issuance/store-issuance-detail/store-issuance-detail.component';
import { GoodReceiptNoteDetailComponent } from './pages/inventory/good-receipt-note/good-receipt-note-detail/good-receipt-note-detail.component';
import { GoodReceiptNoteComponent } from './pages/inventory/good-receipt-note/good-receipt-note.component';
import { PurchaseOrderDetailComponent } from './pages/inventory/purchase-order-master/purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderMasterComponent } from './pages/inventory/purchase-order-master/purchase-order-master.component';
import { DepartmentComponent } from './pages/inventory/department/department.component';
import { DepartmentLocationComponent } from './pages/inventory/department-location/department-location.component';
import { DepartmentalDemandComponent } from './pages/inventory/departmental-demand/departmental-demand.component';
import { DemandMasterComponent } from './pages/inventory/departmental-demand/demand-master/demand-master.component';
import { PurchaseRequsitionMasterComponent } from './pages/inventory/purchase-requsition-master/purchase-requsition-master.component';
import { InwardGatepassComponent } from './pages/inventory/inward-gatepass/inward-gatepass.component';
import { ItemChartComponent } from './pages/inventory/item-chart/item-chart.component';
import { InventoryDashboardComponent } from './pages/inventory/inventory-dashboard/inventory-dashboard.component';
import { PurchaseRequsitionDetailComponent } from './pages/inventory/purchase-requsition-master/purchase-requsition-detail/purchase-requsition-detail.component';
import { InwardGatepassDetailComponent } from './pages/inventory/inward-gatepass/inward-gatepass-detail/inward-gatepass-detail.component';
import { StoreIssuanceComponent } from './pages/inventory/store-issuance/store-issuance.component';
import { SublevelMenuInventorydashComponent } from './pages/inventory/inventory-dashboard/sublevel-menu-inventorydash.component';
import { OutwardGatepassComponent } from './pages/inventory/outward-gatepass/outward-gatepass.component';
import { OutwardGatepassDetailComponent } from './pages/inventory/outward-gatepass/outward-gatepass-detail/outward-gatepass-detail.component';
import { NewChartofitemComponent } from './pages/inventory/new-chartofitem/new-chartofitem.component';
import { PurchasePaymentComponent } from './pages/inventory/purchase-payment/purchase-payment.component';

//============================================================Store / Inventory Reports=============================================================
import { StockReportsComponent } from './pages/inventory/Reports/stock-reports/stock-reports.component';
import { TransactionReportsComponent } from './pages/inventory/Reports/transaction-reports/transaction-reports.component';
import { ItemReportsComponent } from './pages/inventory/Reports/item-reports/item-reports.component';
import { ItemLedgerReportsComponent } from './pages/inventory/Reports/item-ledger-reports/item-ledger-reports.component';
import { StockRateComponent } from './pages/inventory/Reports/stock-rate/stock-rate.component';
import { StockImgComponent } from './pages/inventory/Reports/stock-img/stock-img.component';
import { PendingDemandComponent } from './pages/inventory/Reports/pending-demand/pending-demand.component';
import { PrlistReportComponent } from './pages/inventory/Reports/prlist-report/prlist-report.component';
import { PendingPoPrReportComponent } from './pages/inventory/Reports/pending-po-pr-report/pending-po-pr-report.component';
import { DemandListComponent } from './pages/inventory/Reports/demand-list/demand-list.component';
import { UnlockedDemandComponent } from './pages/inventory/Reports/unlocked-demand/unlocked-demand.component';
import { UnlockedPRComponent } from './pages/inventory/Reports/unlocked-pr/unlocked-pr.component';
import { PolistReportComponent } from './pages/inventory/Reports/polist-report/polist-report.component';
import { PendingtoReceivedComponent } from './pages/inventory/Reports/pendingto-received/pendingto-received.component';
import { IssuanceListItemComponent } from './pages/inventory/Reports/issuance-list-item/issuance-list-item.component';
import { GrnListComponent } from './pages/inventory/Reports/grn-list/grn-list.component';

//============================================================Pre Sales=====================================================================
import { LeadsInfoComponent } from './pages/point-of-sale/pre-sales/leads-info/leads-info.component';
import { LeadStagesComponent } from './pages/point-of-sale/pre-sales/definition/lead-stages/lead-stages.component';
import { LeadStatusComponent } from './pages/point-of-sale/pre-sales/definition/lead-status/lead-status.component';
import { LevelofInterestComponent } from './pages/point-of-sale/pre-sales/definition/levelof-interest/levelof-interest.component';
import { LeadsListComponent } from './pages/point-of-sale/pre-sales/leads-list/leads-list.component';
import { DocumentsComponent } from './pages/point-of-sale/pre-sales/documents/documents.component';

//============================================================Sales / Point of Sales=========================================================
import { SaleInvoiceDetailComponent } from './pages/point-of-sale/sale-invoice/sale-invoice-detail/sale-invoice-detail.component';
import { SaleInvoiceComponent } from './pages/point-of-sale/sale-invoice/sale-invoice.component';
import { PosDashboardComponent } from './pages/point-of-sale/pos-dashboard/pos-dashboard.component';
import { PurchaseInvoiceDetailComponent } from './pages/point-of-sale/purchase-invoice/purchase-invoice-detail/purchase-invoice-detail.component';
import { PurchaseInvoiceComponent } from './pages/point-of-sale/purchase-invoice/purchase-invoice.component';
import { CustomersComponent } from './pages/point-of-sale/customers/customers.component';
import { SalesmanComponent } from './pages/point-of-sale/salesman/salesman.component';
import { POSSaleComponent } from './pages/point-of-sale/pos-sale/pos-sale.component';
import { PossaledetailsComponent } from './pages/point-of-sale/pos-sale/possaledetails/possaledetails.component';
import { DashboardPOSComponent } from './pages/point-of-sale/dashboard-pos/dashboard-pos.component';

//============================================================Sales / Point of Sales Reports=========================================================
import { SaleInvoiceListComponent } from './pages/point-of-sale/Reports/sale-invoice-list/sale-invoice-list.component';
import { SalesmanWiseComponent } from './pages/point-of-sale/Reports/salesman-wise/salesman-wise.component';
import { SalesSummaryComponent } from './pages/point-of-sale/Reports/sales-summary/sales-summary.component';
import { SublevelMenuPosDashboardComponent } from './pages/point-of-sale/pos-dashboard/sublevel-menu-pos-dashboard.component';
import { PrintSlipComponent } from './pages/point-of-sale/pos-sale/possaledetails/print-slip/print-slip.component';

//============================================================HR & Payroll==================================================================
import { EmployeeShiftsComponent } from './pages/hr-payroll/Employee-Transection/employee-shifts/employee-shifts.component';
import { HrPayrollDashboardComponent } from './pages/hr-payroll/hr-payroll-dashboard/hr-payroll-dashboard.component';
import { EmployeeRegistrationComponent } from './pages/hr-payroll/employee-registration/employee-registration.component';
import { PersonalinfoComponent } from './pages/hr-payroll/employee-registration/personalinfo/personalinfo.component';
import { EmployeeDefinitionComponent } from './pages/hr-payroll/Employee-Definition/employee-definition.component';
import { InterviewStatusComponent } from './pages/hr-payroll/Employee-Definition/interview-status/interview-status.component';

import { AddressComponent } from './pages/hr-payroll/employee-registration/address/address.component';
import { GenderComponent } from './pages/hr-payroll/Employee-Definition/gender/gender.component';
import { NationalityComponent } from './pages/hr-payroll/Employee-Definition/nationality/nationality.component';
import { ReligionComponent } from './pages/hr-payroll/Employee-Definition/religion/religion.component';
import { MaritalStatusComponent } from './pages/hr-payroll/Employee-Definition/marital-status/marital-status.component';
import { BloodGroupComponent } from './pages/hr-payroll/Employee-Definition/blood-group/blood-group.component';
import { StateComponent } from './pages/hr-payroll/Employee-Definition/state/state.component';
import { CityComponent } from './pages/hr-payroll/Employee-Definition/city/city.component';
import { DistrictComponent } from './pages/hr-payroll/Employee-Definition/district/district.component';
import { DesignationComponent } from './pages/hr-payroll/Employee-Definition/designation/designation.component';
import { EmployeeTypeComponent } from './pages/hr-payroll/Employee-Definition/employee-type/employee-type.component';
import { JobLevelComponent } from './pages/hr-payroll/Employee-Definition/job-level/job-level.component';
import { DivisionComponent } from './pages/hr-payroll/Employee-Definition/division/division.component';
import { DepartmentsComponent } from './pages/hr-payroll/Employee-Definition/departments/departments.component';
import { EducationalQualificationComponent } from './pages/hr-payroll/Employee-Definition/educational-qualification/educational-qualification.component';
import { ShiftComponent } from './pages/hr-payroll/Employee-Definition/shift/shift.component';
import { PayHeadsComponent } from './pages/hr-payroll/Employee-Definition/pay-heads/pay-heads.component';
import { EmployeeGlConfigurationComponent } from './pages/hr-payroll/Employee-Setup/employee-gl-configuration/employee-gl-configuration.component';
import { EmployeeArrearsComponent } from './pages/hr-payroll/Employee-Transection/employee-arrears/employee-arrears.component';
import { SublevelMenuHrpayrollDashComponent } from './pages/hr-payroll/hr-payroll-dashboard/sublevel-menu-hrpayroll-dash.component';
import { PayPackegeComponent } from './pages/hr-payroll/Employee-Setup/pay-packege/pay-packege.component';
import { ShiftTimingComponent } from './pages/hr-payroll/Employee-Setup/shift-timing/shift-timing.component';
import { QualificationsComponent } from './pages/hr-payroll/employee-registration/qualifications/qualifications.component';
import { ProfessionalexperiencesComponent } from './pages/hr-payroll/employee-registration/professionalexperiences/professionalexperiences.component';
import { TrainingsComponent } from './pages/hr-payroll/employee-registration/trainings/trainings.component';
import { LeaveTypeComponent } from './pages/hr-payroll/Employee-Setup/leave-type/leave-type.component';
import { LeaveApplicationComponent } from './pages/hr-payroll/Employee-Setup/leave-application/leave-application.component';
import { CountryComponent } from './pages/hr-payroll/Employee-Definition/country/country.component';
import { EmployeeListComponent } from './pages/hr-payroll/employee-list/employee-list.component';
import { ImportAttendifyAttendanceComponent } from './pages/hr-payroll/import-attendify-attendance/import-attendify-attendance.component';
import { UserModulesComponent } from './pages/setup-configuration/user-modules/user-modules.component';
import { IssuanceReturnComponent } from './pages/inventory/issuance-return/issuance-return.component';
import { IssuanceReturnDetailComponent } from './pages/inventory/issuance-return/issuance-return-detail/issuance-return-detail.component';
import { DisabilityNatureComponent } from './pages/hr-payroll/Employee-Definition/disability-nature/disability-nature.component';
import { ApplicantGatepassTypeComponent } from './pages/hr-payroll/applicant-gatepass-type/applicant-gatepass-type.component';
import { DesignationLevelsComponent } from './pages/hr-payroll/Employee-Definition/designation-levels/designation-levels.component';
import { DocumentTypeComponent } from './pages/hr-payroll/Employee-Definition/document-type/document-type.component';

//============================================================Production=====================================================================
import { BuyerComponent } from './pages/production/buyer/buyer.component';
import { BuyerBrandsComponent } from './pages/production/buyer-brands/buyer-brands.component';
import { ProductsComponent } from './pages/production/products/products.component';
import { ProductbomComponent } from './pages/production/productbom/productbom.component';
import { SeasonsComponent } from './pages/production/seasons/seasons.component';
import { WorkorderComponent } from './pages/production/workorder/workorder.component';
import { DepartmentTypeComponent } from './pages/inventory/department-type/department-type.component';
import { MenuModule } from 'primeng/menu';
import { StoreProjectComponent } from './screen/store-project/store-project.component';
import { BalanceSheetNoteComponent } from './pages/account-gl/Definition/balance-sheet-note/balance-sheet-note.component';
import { VoucherEntryComponent } from './pages/account-gl/voucher-entry/voucher-entry.component';
import { TaxConfigurationComponent } from './pages/account-gl/tax-configuration/tax-configuration.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CompanyCodeComponent } from './screen/company-code/company-code.component';
import { NgxPrintModule } from 'ngx-print';
import { DialogService } from 'primeng/dynamicdialog';
import { SidebarNavComponent } from './screen/sidebar-nav/sidebar-nav.component';
import { DepartmentDivisionRefComponent } from './pages/inventory/Department-division/department-division-ref/department-division-ref.component';
import { CustomerDetailComponent } from './pages/point-of-sale/customers/customer-detail/customer-detail.component';
import { BasicinfoComponent } from './pages/hr-payroll/employee-registration/basicinfo/basicinfo.component';
import { PresentAddressComponent } from './pages/hr-payroll/employee-registration/address/present-address/present-address.component';
import { PermanentAddressComponent } from './pages/hr-payroll/employee-registration/address/permanent-address/permanent-address.component';
import { AuthCheckService } from './_shared/services/auth-check.service';
import { TableLoaderComponent } from './screen/table-loader/table-loader.component';
import { MainDashboardComponent } from './screen/main-dashboard/main-dashboard.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CurrencyFormatPipe } from './_shared/pipe/currency-format.pipe';
import { NumberWithCommaPipe } from './_shared/pipe/number-with-comma.pipe';
import { PreSalesComponent } from './pages/point-of-sale/pre-sales/Reports/pre-sales/pre-sales.component';
import { LeadOwnerCustomersComponent } from './pages/point-of-sale/pre-sales/definition/lead-owner-customers/lead-owner-customers.component';
import { OppertunityCreationComponent } from './pages/point-of-sale/pre-sales/definition/oppertunity-creation/oppertunity-creation.component';
import { AccountManagerComponent } from './pages/point-of-sale/pre-sales/pages/point-of-sale/pre-sales/account-manager/account-manager.component';
import { NotAuthorizedComponent } from './screen/not-authorized/not-authorized.component';
import { DocumentsPathComponent } from './pages/setup-configuration/documents-path/documents-path.component';
//state managment
import { StoreModule } from '@ngrx/store';
import { RootReducer } from './state-mangment/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//==========================================================
import { DateFormatPipe } from './_shared/pipe/date-format.pipe';
import { StoreComponent } from './pages/inventory/store/store.component';
import { BranchDivComponent } from './pages/hr-payroll/employee-registration/branch-div/branch-div.component';
import { BankCashAccountComponent } from './pages/account-gl/bank-cash-account/bank-cash-account.component';
import { AbbreviationPipe } from './_shared/pipe/abbreviation.pipe';
import { EllipsisPipe } from './_shared/pipe/ellipsis.pipe';
import { ConfirmDialogComponent } from './_shared/component/confirm-dialog/confirm-dialog.component';
import { HolidayTypeComponent } from './pages/hr-payroll/holiday-type/holiday-type.component';
import { FamilyInfoComponent } from './pages/hr-payroll/family-info/family-info.component';
import { EmployeeActionTypeComponent } from './pages/hr-payroll/Employee-Definition/employee-action-type/employee-action-type.component';
import { AllowanceDeductionComponent } from './pages/hr-payroll/Employee-Transection/allowance-deduction/allowance-deduction.component';
import { PurchasePaymentDetailComponent } from './pages/inventory/purchase-payment/purchase-payment-detail/purchase-payment-detail.component';
import { GeneralLedgerComponent } from './pages/account-gl/Reports/ledger/general-ledger/general-ledger.component';
import { PartyLedgerComponent } from './pages/account-gl/Reports/ledger/party-ledger/party-ledger.component';
import { EmployeeLedgerComponent } from './pages/account-gl/Reports/ledger/employee-ledger/employee-ledger.component';
import { AssetsLedgerComponent } from './pages/account-gl/Reports/ledger/assets-ledger/assets-ledger.component';
import { WorkorderLedgerComponent } from './pages/account-gl/Reports/ledger/workorder-ledger/workorder-ledger.component';
import { ChequeBookComponent } from './pages/finance/cheque-book/cheque-book.component';
import { BudgetEntryComponent } from './pages/finance/budget-management/budget-entry/budget-entry.component';
import { BudgetEntryDetailsComponent } from './pages/finance/budget-management/budget-entry/budget-entry-details/budget-entry-details.component';

import { ChequeBookDetailComponent } from './pages/finance/cheque-book/cheque-book-detail/cheque-book-detail.component';
import { ChequePrintingConfigComponent } from './pages/finance/cheque-book/cheque-printing-config/cheque-printing-config.component';
import { BudgetVarianceComponent } from './pages/finance/budget-management/budget-varinace/budget-variance.component';
import { RecruitmentRequirementComponent } from './pages/hr-payroll/recruitment-requirement/recruitment-requirement.component';
import { RecruitmentRequirementDetailComponent } from './pages/hr-payroll/recruitment-requirement/recruitment-requirement-detail/recruitment-requirement-detail.component';
import { NotAuthorizedErrorComponent } from './_shared/component/not-authorized-error/not-authorized-error.component';
import { HardlineBudgetComponent } from './pages/finance/budget-management/hardline-budget/hardline-budget.component';
import { HardlineBudgetDetailsComponent } from './pages/finance/budget-management/hardline-budget/hardline-budget-details/hardline-budget-details.component';
import { InterviewScheduleComponent } from './pages/hr-payroll/interview-schedule/interview-schedule.component';
import { EmployeeApplicantComponent } from './pages/hr-payroll/employee-applicant/employee-applicant.component';
import { EmployeeApplicantDetailComponent } from './pages/hr-payroll/employee-applicant/employee-applicant-detail/employee-applicant-detail.component'; import { ChequeHistoryComponent } from './pages/finance/cheque-book/cheque-history/cheque-history.component';
import { ChequeBookReconciliationComponent } from './pages/finance/cheque-book/cheque-book-reconciliation/cheque-book-reconciliation.component';
import { CategoryService } from './_shared/services/shared-service';
import { InterViewScheduleDetailComponent } from './pages/hr-payroll/interview-schedule/interview-schedule-detail/interview-schedule-detail.component';
import { InterviewResultComponent } from './pages/hr-payroll/interview-result/interview-result.component';
import { ExtractFileNamePipe } from './_shared/pipe/extract-file-name.pipe';
import { RoundoffPipe } from './_shared/pipe/roundoff.pipe';
import { YarnRegistrationComponent } from './pages/production/yarn/yarn-registration/yarn-registration.component';
import { YarnTypeComponent } from './pages/production/yarn/yarn-type/yarn-type.component';
import { ComparativeStatementComponent } from './pages/inventory/comparative-statement/comparative-statement.component';
import { ComparativeStatementDetailsComponent } from './pages/inventory/comparative-statement-details/comparative-statement-details.component';
import { PurchaseRequsitionTypeComponent } from './pages/inventory/purchase-requsition-type/purchase-requsition-type.component';
import { PurchaseOrderTypeComponent } from './pages/inventory/purchase-order-type/purchase-order-type.component';
import { InspectionReceiptNoteComponent } from './pages/inventory/inspection-receipt-note/inspection-receipt-note.component';
import { InspectionReceiptNoteDetailsComponent } from './pages/inventory/inspection-receipt-note/inspection-receipt-note-details/inspection-receipt-note-details.component';
import { ApprovedRejectedPipe } from './_shared/pipe/approved-rejected.pipe';

import { EmployeeBankComponent } from './pages/hr-payroll/employee-bank/employee-bank.component';
@NgModule({
  imports: [
    BrowserModule,
    TabMenuModule,
    TabViewModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AccordionModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true
    }),
    ButtonModule,
    SidebarModule,
    MenubarModule,
    PanelMenuModule,
    TableModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    ContextMenuModule,
    DropdownModule,
    MultiSelectModule,
    InputMaskModule,
    PdfViewerModule,
    ChartModule,
    FileUploadModule,
    NgxMaterialTimepickerModule,
    MenuModule,
    CardModule,
    TreeTableModule,
    FormsModule,
    BrowserAnimationsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    SocketIoModule.forRoot({ url: 'http://192.168.0.89:8765' }),
    InfiniteScrollModule,
    AutoCompleteModule,
    InputTextareaModule,
    DataViewModule,
    NgxPrintModule,
    LoadingBarHttpClientModule,
    LoadingBarModule,
    StoreModule.forRoot(RootReducer),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    CalendarModule,
    CheckboxModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SetupDashboardComponent,
    CompanyConfigComponent,
    UserRoleComponent,
    CommonDisplayErrorComponent,
    FormFieldInputComponent,
    YesNoPipe,
    FinancialMonthComponent,
    FinancialYearsComponent,
    ProjectComponent,
    BranchComponent,
    AccountDashboardComponent,
    UserDefinationComponent,
    UserProjectsComponent,
    UserBranchesComponent,
    VoucherTypeComponent,
    AccountChartComponent,
    VoucherComponent,
    VoucherDetailComponent,
    InstrumentComponent,
    UservouchertypeComponent,
    CurrencyComponent,
    DepartmentComponent,
    DepartmentLocationComponent,
    DepartmentalDemandComponent,
    PartySetupComponent,
    ItemChartComponent,
    DemandMasterComponent,
    PurchaseRequsitionMasterComponent,
    InwardGatepassComponent,
    InventoryDashboardComponent,
    FinanceDashboardComponent,
    HrPayrollDashboardComponent,
    BiReportingDashboardComponent,
    PosDashboardComponent,
    PurchaseRequsitionDetailComponent,
    InwardGatepassDetailComponent,
    PurchaseOrderMasterComponent,
    PurchaseOrderDetailComponent,
    DecimalPlacesValidatorDirective,
    GoodReceiptNoteComponent,
    StockReportsComponent,
    TransactionReportsComponent,
    ItemReportsComponent,
    ItemLedgerReportsComponent,
    GoodReceiptNoteDetailComponent,
    StockRateComponent,
    StockImgComponent,
    VoucherListComponent,
    TrialBalanceComponent,
    ProfitLossComponent,
    LedgerComponent,
    StoreIssuanceComponent,
    StoreIssuanceDetailComponent,
    CustomersComponent,
    SalesmanComponent,
    PendingDemandComponent,
    PrlistReportComponent,
    PendingPoPrReportComponent,
    DemandListComponent,
    UnlockedDemandComponent,
    UnlockedPRComponent,
    PolistReportComponent,
    PendingtoReceivedComponent,
    IssuanceListItemComponent,
    GrnListComponent,
    CommaSeparatedNumberDirective,
    SaleInvoiceComponent,
    SaleInvoiceDetailComponent,
    SaleInvoiceListComponent,
    SalesmanWiseComponent,
    SalesSummaryComponent,
    PurchaseInvoiceComponent,
    PurchaseInvoiceDetailComponent,
    EmployeeRegistrationComponent,
    PersonalinfoComponent,
    AddressComponent,
    GenderComponent,
    AssetsChartComponent,
    NationalityComponent,
    ReligionComponent,
    MaritalStatusComponent,
    BloodGroupComponent,
    StateComponent,
    CityComponent,
    DistrictComponent,
    EmployeeTypeComponent,
    DesignationComponent,
    JobLevelComponent,
    DivisionComponent,
    DepartmentsComponent,
    EducationalQualificationComponent,
    ShiftComponent,
    PayHeadsComponent,
    EmployeeGlConfigurationComponent,
    EmployeeArrearsComponent,
    SublevelMenuComponent,
    SublevelMenuSetupComponent,
    SublevelMenuAccountglComponent,
    SublevelMenuFinancedashComponent,
    SublevelMenuInventorydashComponent,
    SublevelMenuHrpayrollDashComponent,
    SublevelMenuPosDashboardComponent,
    ChangePasswordComponent,
    EmployeeBankComponent,
    PayPackegeComponent,
    EmployeeShiftsComponent,
    TimePipe,
    ShiftComponent,
    ShiftTimingComponent,
    DashboardStatsComponent,
    AccountStatsComponent,
    QualificationsComponent,
    ProfessionalexperiencesComponent,
    TrainingsComponent,
    LeaveTypeComponent,
    LeaveApplicationComponent,
    PartyTypeComponent,
    OutwardGatepassComponent,
    OutwardGatepassDetailComponent,
    CountryComponent,
    ProfitlossCategoryComponent,
    ProfitlossSubcategoryComponent,
    CashflowCategoryComponent,
    CashflowSubcategoryComponent,
    CostCenterIComponent,
    CostCenterIIComponent,
    CostCenterIIIComponent,
    FunctionsComponent,
    DashBoard2Component,
    AddnewvariableComponent,
    UsermenurightsComponent,
    POSSaleComponent,
    CashflowtagIComponent,
    CashflowtagIIComponent,
    BalanceSheetCategoryComponent,
    BalanceSheetSubcategoryComponent,
    DocumentTypesComponent,
    AttachmentTypesComponent,
    ApprovalHirarchyComponent,
    DocumentAttachmentsComponent,
    NewChartofitemComponent,
    PurchasePaymentComponent,
    PurchasePaymentDetailComponent,
    EmployeeListComponent,
    DocumentApprovalsComponent,
    PossaledetailsComponent,
    StreamComponent,
    ImportAttendifyAttendanceComponent,
    BalancesheetComponent,
    DashboardPOSComponent,
    LeadsInfoComponent,
    LeadStagesComponent,
    LeadStatusComponent,
    LevelofInterestComponent,
    LeadsListComponent,
    UserRightsComponent,
    UserDataEntryrightComponent,
    DocumentsComponent,
    UserModulesComponent,
    IssuanceReturnComponent,
    IssuanceReturnDetailComponent,
    BuyerComponent,
    BuyerBrandsComponent,
    ProductsComponent,
    ProductbomComponent,
    SeasonsComponent,
    WorkorderComponent,
    DepartmentTypeComponent,
    StoreComponent,
    StoreProjectComponent,
    BalanceSheetNoteComponent,
    VoucherEntryComponent,
    TaxConfigurationComponent,
    PrintSlipComponent,
    CustomerDetailComponent,
    EmployeeDefinitionComponent,
    CompanyCodeComponent,
    //TODO: move to hr module
    RecruitmentRequirementComponent,
    SidebarNavComponent,
    DepartmentDivisionRefComponent,
    BasicinfoComponent,
    PresentAddressComponent,
    PermanentAddressComponent,
    TableLoaderComponent,
    MainDashboardComponent,
    CurrencyFormatPipe,
    NumberWithCommaPipe,
    PreSalesComponent,
    LeadOwnerCustomersComponent,
    OppertunityCreationComponent,
    AccountManagerComponent,
    NotAuthorizedComponent,
    DocumentsPathComponent,
    BankCashAccountComponent,
    HolidayTypeComponent,
    FamilyInfoComponent,
    EmployeeActionTypeComponent,
    DateFormatPipe,
    BranchDivComponent,
    AbbreviationPipe,
    EllipsisPipe,
    AllowanceDeductionComponent,
    ConfirmDialogComponent,
    GeneralLedgerComponent,
    PartyLedgerComponent,
    EmployeeLedgerComponent,
    AssetsLedgerComponent,
    WorkorderLedgerComponent,
    ChequeBookComponent,
    ChequeBookDetailComponent,
    BudgetCycleComponent,
    BudgetEntryComponent,
    BudgetEntryDetailsComponent,
    BudgetVarianceComponent,
    BudgetStatusComponent,
    ChequePrintingConfigComponent,
    RecruitmentRequirementDetailComponent,
    NotAuthorizedErrorComponent,
    BudgetVarianceComponent,
    InterviewStatusComponent,
    ApplicantGatepassTypeComponent,
    InterviewScheduleComponent,
    InterViewScheduleDetailComponent,
    DesignationLevelsComponent,
    DisabilityNatureComponent,
    DocumentTypeComponent,
    InterviewResultComponent,
    HardlineBudgetComponent,
    HardlineBudgetDetailsComponent,
    EmployeeApplicantComponent,
    EmployeeApplicantDetailComponent,
    ChequeHistoryComponent,
    ChequeBookReconciliationComponent,
    ExtractFileNamePipe,
    RoundoffPipe,
    ComparativeStatementComponent,
    ComparativeStatementDetailsComponent,
    PurchaseRequsitionTypeComponent,
    PurchaseOrderTypeComponent,
    InspectionReceiptNoteComponent,
    InspectionReceiptNoteDetailsComponent,
    ApprovedRejectedPipe,
    YarnRegistrationComponent,
    YarnTypeComponent,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    CategoryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthCheckService,
    {
      provide: APP_INITIALIZER,
      useFactory: (initializer: AuthCheckService) => () => initializer.initialize(),
      deps: [AuthCheckService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
