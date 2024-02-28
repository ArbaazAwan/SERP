import { AssetsChartComponent } from './assets-chart/assets-chart.component';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/screen/change-password/change-password.component';
import { AssetsIdentificationComponent } from './assets-identification/assets-identification.component';
import { BudgetCycleComponent } from './budget-management/budget-cycle/budget-cycle.component';
import { BudgetEntryComponent } from './budget-management/budget-entry/budget-entry.component';
import { BudgetEntryDetailsComponent } from './budget-management/budget-entry/budget-entry-details/budget-entry-details.component';
import { BudgetVarianceComponent } from './budget-management/budget-varinace/budget-variance.component';
import { BudgetStatusComponent } from './budget-management/budget-status/budget-status.component';
import { ChequeBookDetailComponent } from './cheque-book/cheque-book-detail/cheque-book-detail.component';
import { ChequeBookComponent } from './cheque-book/cheque-book.component';
import { ChequePrintingConfigComponent } from './cheque-book/cheque-printing-config/cheque-printing-config.component';
import { HardlineBudgetComponent } from './budget-management/hardline-budget/hardline-budget.component';
import { HardlineBudgetDetailsComponent } from './budget-management/hardline-budget/hardline-budget-details/hardline-budget-details.component';
import { ChequeHistoryComponent } from './cheque-book/cheque-history/cheque-history.component';
import { ChequeBookReconciliationComponent } from './cheque-book/cheque-book-reconciliation/cheque-book-reconciliation.component';

const routes: Routes = [
  { path: '', component: AssetsChartComponent  },

  {
    path: 'assets-chart',
    component: AssetsChartComponent,
  },

  { path: '',
    component: FinanceDashboardComponent,
    children: [
      {
        path: 'assets-chart',
        component: AssetsChartComponent,
      },
      {
        path: 'assets-identification',
        component: AssetsIdentificationComponent,
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent,
      },
      {
        path: 'budget-cycle',
        component: BudgetCycleComponent,
      },
      {
        path: 'budget-status',
        component: BudgetStatusComponent,
      },
      {
        path: 'budget-entry',
        component: BudgetEntryComponent,
      },
      {
        path: 'budget-entry-details',
        component: BudgetEntryDetailsComponent,
      },
      {
        path: 'budget-variance',
        component: BudgetVarianceComponent,
      },
      {
        path: 'hard-line-budget',
        component: HardlineBudgetComponent,
      },
      {
        path: 'hard-line-budget-details',
        component: HardlineBudgetDetailsComponent,
      },
    ],
  },

  {
    path: 'cheque-book',
    component: ChequeBookComponent
  },
  {
    path: 'cheque-book-detail',
    component: ChequeBookDetailComponent
  },
  {
    path: 'cheque-config',
    component: ChequePrintingConfigComponent
  },
  {
    path: 'cheque-history',
    component: ChequeHistoryComponent
  },

  {
    path: 'cheque-book-reconciliation',
    component: ChequeBookReconciliationComponent
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
