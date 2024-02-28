import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/public_api';

@Component({
  selector: 'app-bi-reporting-dashboard',
  templateUrl: './bi-reporting-dashboard.component.html',
  styleUrls: ['./bi-reporting-dashboard.component.scss'],
})
export class BiReportingDashboardComponent implements OnInit {
  bireportingItems!: MenuItem[];

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.bireportingItems = [
      {
        label: 'Home',
        icon: 'pi pi-pw pi-file',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Definition',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Financial Year',
            routerLink: ['/bi-reporting-dashboard/financial-years'],
          },
          {
            label: 'Financial Month',
            routerLink: ['/finance-dashboard/financial-month'],
          },
          {
            label: 'Instrument Type',
            routerLink: ['/finance-dashboard/instrument'],
          },
          {
            label: 'Voucher Type',
            routerLink: ['/finance-dashboard/voucher-type'],
          },
          {
            label: 'Chart of Accounts',
            routerLink: ['/account-chart'],
          },

          {
            label: 'Currency',
            routerLink: ['/currency'],
          },
          {
            label: 'Purchase Requsition',
            routerLink: ['/purchase-requsition'],
          },
        ],
      },

      {
        label: 'Transaction',
        icon: 'fas fa-donate',
        items: [
          {
            label: 'Voucher',
            routerLink: ['/voucher'],
          },
        ],
      },
      {
        label: 'Report',
        icon: 'far fa-file-alt',
      },
    ];
  }

  isBiReportingDashboardRoute() {
    return this.route.url === '/bi-reporting-dashboard';
  }
}
