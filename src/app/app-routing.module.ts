import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './screen/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './screen/change-password/change-password.component';
import { CompanyCodeComponent } from './screen/company-code/company-code.component';
import { MainDashboardComponent } from './screen/main-dashboard/main-dashboard.component';
const routes: Routes = [
  {path: '' , component: CompanyCodeComponent},
  { path: 'Login', component: LoginComponent },
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'changepassword', component: ChangePasswordComponent},
  {
    path: 'Accounts',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/account-gl/account-gl.module').then(m => m.AccountGlModule),
  },
  {
    path: 'Finance',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/finance/finance.module').then(m => m.FinanceModule),
  },
  {
    path: 'Inventory',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/inventory/inventory.module').then(m => m.InventoryModule),
  },
  {
    path: 'HR-and-Payroll',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/hr-payroll/hr-payroll.module').then(m => m.HrPayrollModule),
  },
  {
    path: 'Pre-sales',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/point-of-sale/point-of-sale.module').then(m => m.PointOfSaleModule),
  },
  {
    path: 'POS',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/point-of-sale/point-of-sale.module').then(m => m.PointOfSaleModule),
  },
  {
    path: 'POS-Reports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/point-of-sale/point-of-sale.module').then(m => m.PointOfSaleModule),
  },
  {
    path: 'inventory-Reports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/inventory/inventory.module').then(m => m.InventoryModule),
  },
  {
    path: 'Reports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/account-gl/account-gl.module').then(m => m.AccountGlModule),
  },
  {
    path: 'Setup-and-configuration',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/setup-configuration/setup-configuration.module').then(m => m.SetupConfigurationModule),
  },
  { path: 'dashboard-stats',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(`./screen/dashboard-stats/dashboard-stats.module`).then(
        (m) => m.DashboardStatsModule
      ),
  },
  { path: 'Dashboard', component: MainDashboardComponent, canActivate: [AuthGuard] },
  { path: 'setup-config',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(`./pages/setup-configuration/setup-configuration.module`).then(
        (m) => m.SetupConfigurationModule
      ),
  },
  { path: 'account-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(`./pages/account-gl/account-gl.module`).then(
        (m) => m.AccountGlModule
      ),
  },
  { path: 'hr-payroll-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(`./pages/hr-payroll/hr-payroll.module`).then(
        (m) => m.HrPayrollModule
      ),
  },
  {
    path: 'bi-reporting-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(`./pages/bi-reporting/bi-reporting.module`).then(
        (m) => m.BiReportingModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:false})],
  exports: [RouterModule],
  // providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}
