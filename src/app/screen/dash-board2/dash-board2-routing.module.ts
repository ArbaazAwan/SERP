import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/screen/dashboard/dashboard.component';
import { DashBoard2Component } from './dash-board2.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { FinancialYearsComponent } from 'src/app/pages/account-gl/financial-years/financial-years.component';
import { VoucherTypeComponent } from 'src/app/pages/account-gl/voucher-type/voucher-type.component';
import { InstrumentComponent } from 'src/app/pages/account-gl/instrument/instrument.component';
import { AccountChartComponent } from 'src/app/pages/account-gl/account-chart/account-chart.component';
import { CurrencyComponent } from 'src/app/pages/account-gl/currency/currency.component';
import { VoucherComponent } from 'src/app/pages/account-gl/voucher/voucher.component';
import { VoucherDetailComponent } from 'src/app/pages/account-gl/voucher/voucher-detail/voucher-detail.component';
import { VoucherListComponent } from 'src/app/pages/account-gl/Reports/voucher-list/voucher-list.component';
import { LedgerComponent } from 'src/app/pages/account-gl/Reports/ledger/ledger.component';
import { GeneralLedgerComponent } from 'src/app/pages/account-gl/Reports/ledger/general-ledger/general-ledger.component';
import { PartyLedgerComponent } from 'src/app/pages/account-gl/Reports/ledger/party-ledger/party-ledger.component';
import { EmployeeLedgerComponent } from 'src/app/pages/account-gl/Reports/ledger/employee-ledger/employee-ledger.component';
import { AssetsChartComponent } from 'src/app/pages/finance/assets-chart/assets-chart.component';
import { PersonalinfoComponent } from 'src/app/pages/hr-payroll/employee-registration/personalinfo/personalinfo.component';
import { QualificationsComponent } from 'src/app/pages/hr-payroll/employee-registration/qualifications/qualifications.component';
import { ProfessionalexperiencesComponent } from 'src/app/pages/hr-payroll/employee-registration/professionalexperiences/professionalexperiences.component';
import { TrainingsComponent } from 'src/app/pages/hr-payroll/employee-registration/trainings/trainings.component';
import { GenderComponent } from 'src/app/pages/hr-payroll/Employee-Definition/gender/gender.component';
import { NationalityComponent } from 'src/app/pages/hr-payroll/Employee-Definition/nationality/nationality.component';
import { ReligionComponent } from 'src/app/pages/hr-payroll/Employee-Definition/religion/religion.component';
import { MaritalStatusComponent } from 'src/app/pages/hr-payroll/Employee-Definition/marital-status/marital-status.component';
import { BloodGroupComponent } from 'src/app/pages/hr-payroll/Employee-Definition/blood-group/blood-group.component';
import { EmployeeTypeComponent } from 'src/app/pages/hr-payroll/Employee-Definition/employee-type/employee-type.component';
import { DesignationComponent } from 'src/app/pages/hr-payroll/Employee-Definition/designation/designation.component';
import { JobLevelComponent } from 'src/app/pages/hr-payroll/Employee-Definition/job-level/job-level.component';
import { ProvinceComponent } from 'src/app/pages/hr-payroll/Employee-Definition/state/state.component';
import { CityComponent } from 'src/app/pages/hr-payroll/Employee-Definition/city/city.component';
import { DistrictComponent } from 'src/app/pages/hr-payroll/Employee-Definition/district/district.component';
import { DepartmentDivisionComponent } from 'src/app/pages/hr-payroll/Employee-Definition/department-division/department-division.component';
import { DepartmentsComponent } from 'src/app/pages/hr-payroll/Employee-Definition/departments/departments.component';
import { EducationalQualificationComponent } from 'src/app/pages/hr-payroll/Employee-Definition/educational-qualification/educational-qualification.component';
import { ShiftComponent } from 'src/app/pages/hr-payroll/Employee-Definition/shift/shift.component';
import { PayHeadsComponent } from 'src/app/pages/hr-payroll/Employee-Definition/pay-heads/pay-heads.component';
import { EmployeeGlConfigurationComponent } from 'src/app/pages/hr-payroll/Employee-Setup/employee-gl-configuration/employee-gl-configuration.component';
import { EmployeeactionsComponent } from 'src/app/pages/hr-payroll/employee-registration/employeeactions/employeeactions.component';
import { AssetsLedgerComponent } from 'src/app/pages/account-gl/Reports/ledger/assets-ledger/assets-ledger.component';
import { TrialBalanceComponent } from 'src/app/pages/account-gl/Reports/trial-balance/trial-balance.component';
import { WorkorderLedgerComponent } from 'src/app/pages/account-gl/Reports/ledger/workorder-ledger/workorder-ledger.component';
import { ProfitLossComponent } from 'src/app/pages/account-gl/Reports/profit-loss/profit-loss.component';
import { ItemChartComponent } from 'src/app/pages/inventory/item-chart/item-chart.component';
import { PartySetupComponent } from 'src/app/pages/setup-configuration/party-setup/party-setup.component';
import { DepartmentComponent } from 'src/app/pages/inventory/department/department.component';
import { DepartmentLocationComponent } from 'src/app/pages/inventory/department-location/department-location.component';
import { DemandMasterComponent } from 'src/app/pages/inventory/departmental-demand/demand-master/demand-master.component';
import { DepartmentalDemandComponent } from 'src/app/pages/inventory/departmental-demand/departmental-demand.component';
import { PurchaseRequsitionMasterComponent } from 'src/app/pages/inventory/purchase-requsition-master/purchase-requsition-master.component';
import { PurchaseRequsitionDetailComponent } from 'src/app/pages/inventory/purchase-requsition-master/purchase-requsition-detail/purchase-requsition-detail.component';
import { InwardGatepassComponent } from 'src/app/pages/inventory/inward-gatepass/inward-gatepass.component';
import { InwardGatepassDetailComponent } from 'src/app/pages/inventory/inward-gatepass/inward-gatepass-detail/inward-gatepass-detail.component';
import { OutwardGatepassComponent } from 'src/app/pages/inventory/outward-gatepass/outward-gatepass.component';
import { OutwardGatepassDetailComponent } from 'src/app/pages/inventory/outward-gatepass/outward-gatepass-detail/outward-gatepass-detail.component';
import { PurchaseOrderMasterComponent } from 'src/app/pages/inventory/purchase-order-master/purchase-order-master.component';
import { PurchaseOrderDetailComponent } from 'src/app/pages/inventory/purchase-order-master/purchase-order-detail/purchase-order-detail.component';
import { GoodReceiptNoteComponent } from 'src/app/pages/inventory/good-receipt-note/good-receipt-note.component';
import { StockReportsComponent } from 'src/app/pages/inventory/Reports/stock-reports/stock-reports.component';
import { DemandListComponent } from 'src/app/pages/inventory/Reports/demand-list/demand-list.component';
import { PendingDemandComponent } from 'src/app/pages/inventory/Reports/pending-demand/pending-demand.component';
import { UnlockedDemandComponent } from 'src/app/pages/inventory/Reports/unlocked-demand/unlocked-demand.component';
import { PrlistReportComponent } from 'src/app/pages/inventory/Reports/prlist-report/prlist-report.component';
import { PendingPoPrReportComponent } from 'src/app/pages/inventory/Reports/pending-po-pr-report/pending-po-pr-report.component';
import { UnlockedPRComponent } from 'src/app/pages/inventory/Reports/unlocked-pr/unlocked-pr.component';
import { PendingtoReceivedComponent } from 'src/app/pages/inventory/Reports/pendingto-received/pendingto-received.component';
import { PolistReportComponent } from 'src/app/pages/inventory/Reports/polist-report/polist-report.component';
import { IssuanceListItemComponent } from 'src/app/pages/inventory/Reports/issuance-list-item/issuance-list-item.component';
import { GrnListComponent } from 'src/app/pages/inventory/Reports/grn-list/grn-list.component';
import { StoreIssuanceDetailComponent } from 'src/app/pages/inventory/store-issuance/store-issuance-detail/store-issuance-detail.component';
import { StoreIssuanceComponent } from 'src/app/pages/inventory/store-issuance/store-issuance.component';
import { StockRateComponent } from 'src/app/pages/inventory/Reports/stock-rate/stock-rate.component';
import { GoodReceiptNoteDetailComponent } from 'src/app/pages/inventory/good-receipt-note/good-receipt-note-detail/good-receipt-note-detail.component';
import { StockImgComponent } from 'src/app/pages/inventory/Reports/stock-img/stock-img.component';
import { ItemLedgerReportsComponent } from 'src/app/pages/inventory/Reports/item-ledger-reports/item-ledger-reports.component';
import { ItemReportsComponent } from 'src/app/pages/inventory/Reports/item-reports/item-reports.component';
import { TransactionReportsComponent } from 'src/app/pages/inventory/Reports/transaction-reports/transaction-reports.component';
import { ShiftTimingComponent } from 'src/app/pages/hr-payroll/Employee-Setup/shift-timing/shift-timing.component';
import { PayPackegeComponent } from 'src/app/pages/hr-payroll/Employee-Setup/pay-packege/pay-packege.component';
import { EmployeeShiftsComponent } from 'src/app/pages/hr-payroll/Employee-Transection/employee-shifts/employee-shifts.component';
import { EmployeeArrearsComponent } from 'src/app/pages/hr-payroll/Employee-Transection/employee-arrears/employee-arrears.component';
import { LeaveTypeComponent } from 'src/app/pages/hr-payroll/Employee-Setup/leave-type/leave-type.component';
import { LeaveApplicationComponent } from 'src/app/pages/hr-payroll/Employee-Setup/leave-application/leave-application.component';
import { CountryComponent } from 'src/app/pages/hr-payroll/Employee-Definition/country/country.component';
import { EmployeeRegistrationComponent } from 'src/app/pages/hr-payroll/employee-registration/employee-registration.component';
import { CustomersComponent } from 'src/app/pages/point-of-sale/customers/customers.component';
import { SalesmanComponent } from 'src/app/pages/point-of-sale/salesman/salesman.component';
import { SaleInvoiceComponent } from 'src/app/pages/point-of-sale/sale-invoice/sale-invoice.component';
import { SaleInvoiceDetailComponent } from 'src/app/pages/point-of-sale/sale-invoice/sale-invoice-detail/sale-invoice-detail.component';
import { SaleInvoiceListComponent } from 'src/app/pages/point-of-sale/Reports/sale-invoice-list/sale-invoice-list.component';
import { UservouchertypeComponent } from 'src/app/pages/setup-configuration/uservouchertype/uservouchertype.component';
import { UserProjectsComponent } from 'src/app/pages/setup-configuration/user-projects/user-projects.component';
import { UserBranchesComponent } from 'src/app/pages/setup-configuration/user-branches/user-branches.component';
import { UserDefinationComponent } from 'src/app/pages/setup-configuration/user-defination/user-defination.component';
import { PartyTypeComponent } from 'src/app/pages/setup-configuration/party-type/party-type.component';
import { ProjectComponent } from 'src/app/pages/setup-configuration/project/project.component';
import { BranchComponent } from 'src/app/pages/setup-configuration/branch/branch.component';
import { CompanyConfigComponent } from 'src/app/pages/setup-configuration/company-config/company-config.component';
import { PurchaseInvoiceDetailComponent } from 'src/app/pages/point-of-sale/purchase-invoice/purchase-invoice-detail/purchase-invoice-detail.component';
import { PurchaseInvoiceComponent } from 'src/app/pages/point-of-sale/purchase-invoice/purchase-invoice.component';
import { SalesmanWiseComponent } from 'src/app/pages/point-of-sale/Reports/salesman-wise/salesman-wise.component';
import { SalesSummaryComponent } from 'src/app/pages/point-of-sale/Reports/sales-summary/sales-summary.component';
import { FinancialMonthComponent } from 'src/app/pages/account-gl/financial-month/financial-month.component';
import { POSSaleComponent } from 'src/app/pages/point-of-sale/pos-sale/pos-sale.component';
import { BalanceSheetCategoryComponent } from 'src/app/pages/account-gl/Definition/balance-sheet-category/balance-sheet-category.component';
import { BalanceSheetSubcategoryComponent } from 'src/app/pages/account-gl/Definition/balance-sheet-subcategory/balance-sheet-subcategory.component';
import { ProfitlossCategoryComponent } from 'src/app/pages/account-gl/Definition/profitloss-category/profitloss-category.component';
import { ProfitlossSubcategoryComponent } from 'src/app/pages/account-gl/Definition/profitloss-subcategory/profitloss-subcategory.component';
import { CashflowCategoryComponent } from 'src/app/pages/account-gl/Definition/cashflow-category/cashflow-category.component';
import { CashflowSubcategoryComponent } from 'src/app/pages/account-gl/Definition/cashflow-subcategory/cashflow-subcategory.component';
import { CostCenterIComponent } from 'src/app/pages/account-gl/Definition/cost-center-i/cost-center-i.component';
import { CostCenterIIComponent } from 'src/app/pages/account-gl/Definition/cost-center-ii/cost-center-ii.component';
import { CostCenterIIIComponent } from 'src/app/pages/account-gl/Definition/cost-center-iii/cost-center-iii.component';
import { FunctionsComponent } from 'src/app/pages/account-gl/Definition/functions/functions.component';
import { CashflowtagIComponent } from 'src/app/pages/account-gl/Definition/cashflowtag-i/cashflowtag-i.component';
import { CashflowtagIIComponent } from 'src/app/pages/account-gl/Definition/cashflowtag-ii/cashflowtag-ii.component';
import { DocumentTypesComponent } from 'src/app/pages/setup-configuration/Approvals/document-types/document-types.component';
import { AttachmentTypesComponent } from 'src/app/pages/setup-configuration/Approvals/attachment-types/attachment-types.component';
import { ApprovalHirarchyComponent } from 'src/app/pages/setup-configuration/Approvals/approval-hirarchy/approval-hirarchy.component';
import { DocumentAttachmentsComponent } from 'src/app/pages/setup-configuration/Approvals/document-attachments/document-attachments.component';
import { VoucherEntryComponent } from 'src/app/pages/account-gl/voucher-entry/voucher-entry.component';
import { TaxConfigurationComponent } from 'src/app/pages/account-gl/tax-configuration/tax-configuration.component';
import { NewChartofitemComponent } from 'src/app/pages/inventory/new-chartofitem/new-chartofitem.component';
import { AddnewvariableComponent } from 'src/app/pages/setup-configuration/addnewvariable/addnewvariable.component';
import { EmployeeListComponent } from 'src/app/pages/hr-payroll/employee-list/employee-list.component';
import { DocumentApprovalsComponent } from 'src/app/pages/setup-configuration/Approvals/document-approvals/document-approvals.component';
import { DashboardPOSComponent } from 'src/app/pages/point-of-sale/dashboard-pos/dashboard-pos.component';
import { PossaledetailsComponent } from 'src/app/pages/point-of-sale/pos-sale/possaledetails/possaledetails.component';
import { StreamComponent } from 'src/app/pages/setup-configuration/stream/stream.component';
import { ImportAttendifyAttendanceComponent } from 'src/app/pages/hr-payroll/import-attendify-attendance/import-attendify-attendance.component';
import { BalancesheetComponent } from 'src/app/pages/account-gl/Reports/balancesheet/balancesheet.component';
import { BalanceSheetNoteComponent } from 'src/app/pages/account-gl/Definition/balance-sheet-note/balance-sheet-note.component';
import { LeadsInfoComponent } from 'src/app/pages/point-of-sale/pre-sales/leads-info/leads-info.component';
import { LeadStagesComponent } from 'src/app/pages/point-of-sale/pre-sales/definition/lead-stages/lead-stages.component';
import { LeadStatusComponent } from 'src/app/pages/point-of-sale/pre-sales/definition/lead-status/lead-status.component';
import { LeadsListComponent } from 'src/app/pages/point-of-sale/pre-sales/leads-list/leads-list.component';
import { LevelofInterestComponent } from 'src/app/pages/point-of-sale/pre-sales/definition/levelof-interest/levelof-interest.component';
import { UserRightsComponent } from 'src/app/pages/setup-configuration/user-rights/user-rights.component';
import { UserDataEntryrightComponent } from 'src/app/pages/setup-configuration/user-data-entryright/user-data-entryright.component';
import { DocumentsComponent } from 'src/app/pages/point-of-sale/pre-sales/documents/documents.component';
import { UserModulesComponent } from 'src/app/pages/setup-configuration/user-modules/user-modules.component';
import { IssuanceReturnComponent } from 'src/app/pages/inventory/issuance-return/issuance-return.component';
import { IssuanceReturnDetailComponent } from 'src/app/pages/inventory/issuance-return/issuance-return-detail/issuance-return-detail.component';
import { BuyerComponent } from 'src/app/pages/production/buyer/buyer.component';
import { BuyerBrandsComponent } from 'src/app/pages/production/buyer-brands/buyer-brands.component';
import { ProductsComponent } from 'src/app/pages/production/products/products.component';
import { SeasonsComponent } from 'src/app/pages/production/seasons/seasons.component';
import { WorkorderComponent } from 'src/app/pages/production/workorder/workorder.component';
import { ProductbomComponent } from 'src/app/pages/production/productbom/productbom.component';
import { DashBoardVersion1Component } from 'src/app/pages/point-of-sale/dash-board-version1/dash-board-version1.component';
import { DepartmentTypeComponent } from 'src/app/pages/inventory/department-type/department-type.component';
import { EmployeeDefinitionComponent } from 'src/app/pages/hr-payroll/Employee-Definition/employee-definition.component';
import { DepartmentDivisionRefComponent } from 'src/app/pages/inventory/Department-division/department-division-ref/department-division-ref.component';

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   children: [{ path: 'dash', component: DashBoard2Component }],
  // },

  {
    path: '',
    component: DashBoardVersion1Component,
    children: [
      // {
      //   path: 'dash-board-version1',
      //   component: DashBoardVersion1Component,
      // },
      {
        path: 'changepassword',
        component: ChangePasswordComponent,
      },
      {
        path: 'DepartmentDivisionRefComponent',
        component: DepartmentDivisionRefComponent,
      },
      {
        path: 'financial-month',
        component: FinancialMonthComponent,
      },
      {
        path: 'financial-years',
        component: FinancialYearsComponent,
      },
      {
        path: 'voucher-type',
        component: VoucherTypeComponent,
      },
      {
        path: 'instrument',
        component: InstrumentComponent,
      },
      {
        path: 'account-chart',
        component: AccountChartComponent,
      },
      {
        path: 'currency',
        component: CurrencyComponent,
      },
      {
        path: 'balance-sheet-category',
        component: BalanceSheetCategoryComponent,
      },
      {
        path: 'balance-sheet-subcategory',
        component: BalanceSheetSubcategoryComponent,
      },
      {
        path: 'balance-sheet-note',
        component: BalanceSheetNoteComponent,
      },
      {
        path: 'profitloss-category',
        component: ProfitlossCategoryComponent,
      },
      {
        path: 'profitloss-subcategory',
        component: ProfitlossSubcategoryComponent,
      },
      {
        path: 'cashflow-category',
        component: CashflowCategoryComponent,
      },
      {
        path: 'cashflow-subcategory',
        component: CashflowSubcategoryComponent,
      },
      {
        path: 'cost-enter-i',
        component: CostCenterIComponent,
      },
      {
        path: 'cost-enter-ii',
        component: CostCenterIIComponent,
      },
      {
        path: 'cost-enter-iii',
        component: CostCenterIIIComponent,
      },
      {
        path: 'functions',
        component: FunctionsComponent,
      },
      {
        path: 'cashflowtag-i',
        component: CashflowtagIComponent,
      },
      {
        path: 'cashflowtag-ii',
        component: CashflowtagIIComponent,
      },
      {
        path: 'voucher',
        component: VoucherComponent,
      },
      {
        path: 'voucher-entryConfiguration',
        component: VoucherEntryComponent,
      },
      { path: 'Tax-Configuration', component: TaxConfigurationComponent },

      {
        path: 'voucher-detail',
        component: VoucherDetailComponent,
      },
      {
        path: 'voucher-list',
        component: VoucherListComponent,
      },
      {
        path: 'ledger',
        component: LedgerComponent,
      },
      {
        path: 'general-ledger',
        component: GeneralLedgerComponent,
      },
      {
        path: 'party-ledger',
        component: PartyLedgerComponent,
      },
      {
        path: 'employee-ledger',
        component: EmployeeLedgerComponent,
      },
      {
        path: 'assets-ledger',
        component: AssetsLedgerComponent,
      },
      {
        path: 'workorder-ledger',
        component: WorkorderLedgerComponent,
      },
      {
        path: 'trial-balance',
        component: TrialBalanceComponent,
      },
      {
        path: 'profit-loss',
        component: ProfitLossComponent,
      },
      {
        path: 'balancesheet',
        component: BalancesheetComponent,
      },
     
      //Routing for Inventory
      {
        path: 'item-chart',
        component: ItemChartComponent,
      },
      {
        path: 'party-setup',
        component: PartySetupComponent,
      },
      {
        path: 'customer',
        component: PartySetupComponent,
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent,
      },
      {
        path: 'department-type',
        component: DepartmentTypeComponent,
      },
      {
        path: 'department',
        component: DepartmentComponent,
      },
      {
        path: 'department-location',
        component: DepartmentLocationComponent,
      },
      {
        path: 'demand',
        component: DemandMasterComponent,
      },
      {
        path: 'departmental-demand',
        component: DepartmentalDemandComponent,
      },
      {
        path: 'purchase-requsition',
        component: PurchaseRequsitionMasterComponent,
      },
      {
        path: 'purchase-requsition-detail',
        component: PurchaseRequsitionDetailComponent,
      },
      {
        path: 'inward-gatepass',
        component: InwardGatepassComponent,
      },
      {
        path: 'inward-gatepass-detail',
        component: InwardGatepassDetailComponent,
      },
      {
        path: 'outward-gatepass',
        component: OutwardGatepassComponent,
      },
      {
        path: 'outward-gatepass-detail',
        component: OutwardGatepassDetailComponent,
      },
      {
        path: 'purchase-order',
        component: PurchaseOrderMasterComponent,
      },
      {
        path: 'purchase-order-detail',
        component: PurchaseOrderDetailComponent,
      },
      {
        path: 'good-receipt-note',
        component: GoodReceiptNoteComponent,
      },
      {
        path: 'stock-reports',
        component: StockReportsComponent,
      },
      {
        path: 'transaction-reports',
        component: TransactionReportsComponent,
      },
      {
        path: 'item-reports',
        component: ItemReportsComponent,
      },
      {
        path: 'item-ledger-reports',
        component: ItemLedgerReportsComponent,
      },
      {
        path: 'good-receipt-note-detail',
        component: GoodReceiptNoteDetailComponent,
      },
      {
        path: 'stock-rate',
        component: StockRateComponent,
      },
      {
        path: 'stock-img',
        component: StockImgComponent,
      },
      {
        path: 'store-issuance',
        component: StoreIssuanceComponent,
      },
      {
        path: 'store-issuance-detail',
        component: StoreIssuanceDetailComponent,
      },
      {
        path: 'issuance-return',
        component: IssuanceReturnComponent,
      },
      {
        path: 'issuance-return-detail',
        component: IssuanceReturnDetailComponent,
      },

      {
        path: 'demand-list',
        component: DemandListComponent,
      },
      {
        path: 'pending-demand',
        component: PendingDemandComponent,
      },
      {
        path: 'unlocked-demand',
        component: UnlockedDemandComponent,
      },
      {
        path: 'prlist-report',
        component: PrlistReportComponent,
      },
      {
        path: 'pending-po-pr-report',
        component: PendingPoPrReportComponent,
      },
      {
        path: 'unlocked-pr',
        component: UnlockedPRComponent,
      },
      {
        path: 'polist-report',
        component: PolistReportComponent,
      },
      {
        path: 'pendingto-received',
        component: PendingtoReceivedComponent,
      },
      {
        path: 'issuance-list-item',
        component: IssuanceListItemComponent,
      },
      {
        path: 'grn-list',
        component: GrnListComponent,
      },

      //Routing path for Finance
      {
        path: 'assets-chart',
        component: AssetsChartComponent,
      },

      //Routing path for HR
      {
        path: 'personalinfo',
        component: PersonalinfoComponent,
      },
      {
        path: 'definition',
        component: EmployeeDefinitionComponent,
        children: [
          {
            path: 'gender',
            component: GenderComponent,
          },
          {
            path: 'blood-group',
            component: BloodGroupComponent,
          },
          {
            path: 'nationality',
            component: NationalityComponent,
          },
          {
            path: 'religion',
            component: ReligionComponent,
          },
          {
            path: 'marital-status',
            component: MaritalStatusComponent,
          },
          {
            path: 'employee-type',
            component: EmployeeTypeComponent,
          },
          {
            path: 'designation',
            component: DesignationComponent,
          },
          {
            path: 'department-division',
            component: DepartmentDivisionComponent,
          },
          {
            path: 'departments',
            component: DepartmentsComponent,
          },
          {
            path: 'job-level',
            component: JobLevelComponent,
          },
          {
            path: 'educational-qualification',
            component: EducationalQualificationComponent,
          },
          {
            path: 'shift',
            component: ShiftComponent,
          },
          {
            path: 'pay-heads',
            component: PayHeadsComponent,
          },
          {
            path: 'country',
            component: CountryComponent,
          },
          {
            path: 'province',
            component: ProvinceComponent,
          },
          {
            path: 'district',
            component: DistrictComponent,
          },
          {
            path: 'city',
            component: CityComponent,
          },
        ],
      },
      {
        path: 'qualifications',
        component: QualificationsComponent,
      },
      {
        path: 'professionalexperiences',
        component: ProfessionalexperiencesComponent,
      },
      {
        path: 'trainings',
        component: TrainingsComponent,
      },
      {
        path: 'new-chartofitem',
        component: NewChartofitemComponent,
      },
      {
        path: 'employee-gl-configuration',
        component: EmployeeGlConfigurationComponent,
      },
      {
        path: 'employee-actions',
        component: EmployeeactionsComponent,
      },
      {
        path: 'shift-timing',
        component: ShiftTimingComponent,
      },
      {
        path: 'pay-package',
        component: PayPackegeComponent,
      },
      {
        path: 'employee-shifts',
        component: EmployeeShiftsComponent,
      },
      {
        path: 'employee-arrears',
        component: EmployeeArrearsComponent,
      },
      {
        path: 'employee-deduction',
        component: EmployeeDeductionComponent,
      },
      {
        path: 'leave-type',
        component: LeaveTypeComponent,
      },
      {
        path: 'leave-application',
        component: LeaveApplicationComponent,
      },
      {
        path: 'import-attendify-attendance',
        component: ImportAttendifyAttendanceComponent,
      },
      {
        path: 'employee-list',
        component: EmployeeListComponent,
      },
      {
        path: 'employee-registration',
        component: EmployeeRegistrationComponent,
        children: [
          {
            path: 'personalinfo',
            component: PersonalinfoComponent,
          },
          {
            path: 'qualifications',
            component: QualificationsComponent,
          },
          {
            path: 'professionalexperiences',
            component: ProfessionalexperiencesComponent,
          },
          {
            path: 'trainings',
            component: TrainingsComponent,
          },
        ],
      },

      //Routing path for POS
      {
        path: 'dashboard-pos',
        component: DashboardPOSComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'party-setup',
        component: PartySetupComponent,
      },
      { path: 'AddnewVar', component: AddnewvariableComponent },

      {
        path: 'salesman',
        component: SalesmanComponent,
      },
      {
        path: 'sale-invoice/:id',
        // component: POSSaleComponent,
        component: SaleInvoiceComponent,
      },
      {
        path: 'quotation/:id',
        component: SaleInvoiceComponent,
      },
      {
        path: 'performa-invoice/:id',
        // component: POSSaleComponent,
        component: SaleInvoiceComponent,
      },
      {
        path: 'sale-order/:id',
        // component: POSSaleComponent,
        component: SaleInvoiceComponent,
      },
      {
        path: 'delivery-challan/:id',
        // component: POSSaleComponent,
        component: SaleInvoiceComponent,
      },
      {
        path: 'point-of-sale/:id',
        // component: POSSaleComponent,
        component: SaleInvoiceComponent,
      },
      {
        path: 'sale-invoice-detail',
        component: SaleInvoiceDetailComponent,
      },

      {
        path: 'sale-invoice-list',
        component: SaleInvoiceListComponent,
      },
      {
        path: 'sales-summary',
        component: SalesSummaryComponent,
      },
      {
        path: 'salesman-wise',
        component: SalesmanWiseComponent,
      },
      {
        path: 'purchase-invoice',
        component: PurchaseInvoiceComponent,
      },
      {
        path: 'purchase-invoice-detail',
        component: PurchaseInvoiceDetailComponent,
      },
      {
        path: 'pos-sale',
        component: POSSaleComponent,
      },

      {
        path: 'leads-info',
        component: LeadsInfoComponent,
      },
      {
        path: 'lead-stages',
        component: LeadStagesComponent,
      },
      {
        path: 'lead-status',
        component: LeadStatusComponent,
      },
      {
        path: 'levelof-interest',
        component: LevelofInterestComponent,
      },
      {
        path: 'leads-list',
        component: LeadsListComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'possaledetails',
        component: PossaledetailsComponent,
      },

      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },

      //Routing path for Setup
      {
        path: 'company-configuration',
        component: CompanyConfigComponent,
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent,
      },
      {
        path: 'branch',
        component: BranchComponent,
      },
      {
        path: 'project',
        component: ProjectComponent,
      },
      {
        path: 'party-setup',
        component: PartySetupComponent,
      },
      {
        path: 'party-type',
        component: PartyTypeComponent,
      },
      {
        path: 'user-defination',
        component: UserDefinationComponent,
      },
      {
        path: 'user-branches',
        component: UserBranchesComponent,
      },
      {
        path: 'user-projects',
        component: UserProjectsComponent,
      },
      {
        path: 'uservouchertype',
        component: UservouchertypeComponent,
      },
      {
        path: 'user-rights',
        component: UserRightsComponent,
      },
      {
        path: 'user-data-entry-rights',
        component: UserDataEntryrightComponent,
      },
      {
        path: 'document-types',
        component: DocumentTypesComponent,
      },
      {
        path: 'attachment-types',
        component: AttachmentTypesComponent,
      },
      {
        path: 'approval-hirarchy',
        component: ApprovalHirarchyComponent,
      },
      {
        path: 'document-attachments',
        component: DocumentAttachmentsComponent,
      },
      {
        path: 'document-approvals',
        component: DocumentApprovalsComponent,
      },
      {
        path: 'user-modules',
        component: UserModulesComponent,
      },

      //=========================Routing Paths for Production=========================
      {
        path: 'buyer',
        component: BuyerComponent,
      },
      {
        path: 'buyer-brands',
        component: BuyerBrandsComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'productbom',
        component: ProductbomComponent,
      },
      {
        path: 'seasons',
        component: SeasonsComponent,
      },
      {
        path: 'workorder',
        component: WorkorderComponent,
      },

      {
        path: 'stream',
        component: StreamComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Dashboard2RoutingModule {}
