import { BiReportingDashboardComponent } from './bi-reporting-dashboard/bi-reporting-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/screen/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    component: BiReportingDashboardComponent,
    children: [
      // {
      //   path: 'chart-item',
      //   component: ItemChartComponent,
      // },
    ],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiReportingRoutingModule {}
