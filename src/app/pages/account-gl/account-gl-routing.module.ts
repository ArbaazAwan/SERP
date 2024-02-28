import { AccountChartComponent } from './account-chart/account-chart.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/screen/dashboard/dashboard.component';
import { InstrumentComponent } from '../account-gl/instrument/instrument.component';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { FinancialMonthComponent } from './financial-month/financial-month.component';
import { FinancialYearsComponent } from './financial-years/financial-years.component';
import { VoucherTypeComponent } from './voucher-type/voucher-type.component';
import { CurrencyComponent } from './currency/currency.component';
import { VoucherComponent } from './voucher/voucher.component';
import { VoucherDetailComponent } from './voucher/voucher-detail/voucher-detail.component';
import { VoucherListComponent } from './Reports/voucher-list/voucher-list.component';
import { TrialBalanceComponent } from './Reports/trial-balance/trial-balance.component';
import { ProfitLossComponent } from './Reports/profit-loss/profit-loss.component';
import { LedgerComponent } from './Reports/ledger/ledger.component';
import { ChangePasswordComponent } from 'src/app/screen/change-password/change-password.component';
import { GeneralLedgerComponent } from './Reports/ledger/general-ledger/general-ledger.component';
import { PartyLedgerComponent } from './Reports/ledger/party-ledger/party-ledger.component';
import { EmployeeLedgerComponent } from './Reports/ledger/employee-ledger/employee-ledger.component';
import { AssetsLedgerComponent } from './Reports/ledger/assets-ledger/assets-ledger.component';
import { WorkorderLedgerComponent } from './Reports/ledger/workorder-ledger/workorder-ledger.component';
import { FunctionsComponent } from './Definition/functions/functions.component';
import { CostCenterIIIComponent } from './Definition/cost-center-iii/cost-center-iii.component';
import { CostCenterIIComponent } from './Definition/cost-center-ii/cost-center-ii.component';
import { CostCenterIComponent } from './Definition/cost-center-i/cost-center-i.component';
import { CashflowSubcategoryComponent } from './Definition/cashflow-subcategory/cashflow-subcategory.component';
import { CashflowCategoryComponent } from './Definition/cashflow-category/cashflow-category.component';
import { ProfitlossCategoryComponent } from './Definition/profitloss-category/profitloss-category.component';
import { ProfitlossSubcategoryComponent } from './Definition/profitloss-subcategory/profitloss-subcategory.component';
import { CashflowtagIComponent } from './Definition/cashflowtag-i/cashflowtag-i.component';
import { CashflowtagIIComponent } from './Definition/cashflowtag-ii/cashflowtag-ii.component';
import { BalanceSheetCategoryComponent } from './Definition/balance-sheet-category/balance-sheet-category.component';
import { BalanceSheetSubcategoryComponent } from './Definition/balance-sheet-subcategory/balance-sheet-subcategory.component';
import { BalancesheetComponent } from './Reports/balancesheet/balancesheet.component';
import { BalanceSheetNoteComponent } from './Definition/balance-sheet-note/balance-sheet-note.component';
import { VoucherEntryComponent } from './voucher-entry/voucher-entry.component';
import { TaxConfigurationComponent } from './tax-configuration/tax-configuration.component';
import { BankCashAccountComponent } from './bank-cash-account/bank-cash-account.component';

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  // },
  {
    path: '',
    component: AccountDashboardComponent,
    children: [
      {
        path: 'changepassword',
        component: ChangePasswordComponent,
      },
      //definitions
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
        path: 'bank-account',
        component: BankCashAccountComponent,
      },
      {
        path: 'currency',
        component: CurrencyComponent,
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
      //defi-end
      {
        path: 'voucher',
        component: VoucherComponent,
      },
      {
        path: 'voucher-entryConfiguration',
        component: VoucherEntryComponent,
      },
      {
        path: 'Tax-Configuration',
        component: TaxConfigurationComponent,
      },
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
      // Reports child routes
      {
        path: 'balancesheet',
        component: BalancesheetComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountGlRoutingModule {}
