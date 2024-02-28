import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/_shared/services/dashboard.service';
import { environment } from 'src/environments/environment';

const url = environment.realEstateURL;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  menuItems = [
    {
      name: 'Dashboards',
      icon: 'fa fa-chart-line f-left',
      route: '/dash-board2/dash-board-version1',
      locked: true,
    },
    {
      name: 'Accounts (General Ledger)',
      icon: '	fas fa-file-invoice-dollar f-left',
      route: '/account-dashboard',
      locked: false,
    },
    {
      name: 'Finance',
      icon: 'fa fa-institution f-left',
      route: '/finance',
      locked: true,
    },
    {
      name: 'Store & Inventory',
      icon: 'fa fa-cubes f-left',
      route: '/inventory',
      locked: false,
    },
    {
      name: 'HR & Payroll',
      icon: 'fa fa-drivers-license f-left',
      route: '/hr-payroll-dashboard',
      locked: false,
    },
    {
      name: 'Real Estate Management',
      icon: 'fas fa-building f-left',
      func: () => this.goToURL(),
      locked: false,
    },
    {
      name: 'Point Of Sale',
      icon: 'fa-solid fa-cart-shopping f-left',
      route: '/pos-dashboard',
      locked: false,
    },
    {
      name: 'Setup & Config.',
      icon: 'fa-solid fa-gears f-left',
      route: '/setup-config',
      locked: false,
    },
  ];

  constructor(private api: DashboardService) {}

  ngOnInit(): void {}

  goToURL(): void {
    let data: any = {};
    data.UserId = localStorage.getItem('UserId');
    data.BranchCode = localStorage.getItem('BranchCode');
    data.BranchName = localStorage.getItem('BranchName');
    data.Username = localStorage.getItem('Username');
    this.api.sendData(data).subscribe();
    window.open(url, '_blank');
  }
}
