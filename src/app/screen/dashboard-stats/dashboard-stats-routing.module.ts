import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardStatsComponent } from './dashboard-stats.component';
import { AccountStatsComponent } from './account-stats/account-stats.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardStatsComponent,
    children: [
      {
        path: 'account-stats',
        component: AccountStatsComponent,
      },
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardStatsRoutingModule {}
