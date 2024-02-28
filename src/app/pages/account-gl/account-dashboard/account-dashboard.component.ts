import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/public_api';
import { ExpandService } from 'src/app/_shared/function/expand.service';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Output, EventEmitter, HostListener } from '@angular/core';
import { fadeInOut } from 'src/app/pages/account-gl/account-dashboard/helper-account-gl';

// this is sidebar navbar
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss'],
  //this is sidebar animations
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AccountDashboardComponent implements OnInit {
  accountitems!: MenuItem[];
  BranchLogoPath: string = 'No Image Path Found';
  expanded = false;
  // navbar side
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true;
  screenWidth = 0;
  multiple: boolean = false;
  BranchName: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  constructor(private router: Router, private expandService: ExpandService) {
    this.BranchName = localStorage.getItem('BranchName')!;
  }

  ngOnInit(): void {
    //this is navbar side
    this.screenWidth = window.innerWidth;
    this.expandService.expanded$.subscribe((expanded) => {
      this.expanded = expanded;
    });
    this.accountitems = [
      {
        label: 'Home',
        icon: 'fa fa-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Definition',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Financial Year',
            routerLink: ['/account-dashboard/financial-years'],
          },
          {
            label: 'Financial Month',
            routerLink: ['/account-dashboard/financial-month'],
          },
          {
            label: 'Instrument Type',
            routerLink: ['/account-dashboard/instrument'],
          },
          {
            label: 'Voucher Type',
            routerLink: ['/account-dashboard/voucher-type'],
          },
          {
            label: 'Chart of Accounts',
            routerLink: ['/account-dashboard/account-chart'],
          },

          {
            label: 'Currency',
            routerLink: ['/account-dashboard/currency'],
          },
          {
            label: 'P&L Category',
            routerLink: ['/account-dashboard/profitloss-category'],
          },
          {
            label: 'P&L SubCategory',
            routerLink: ['/account-dashboard/profitloss-subcategory'],
          },
          {
            label: 'CashFlow Category',
            routerLink: ['/account-dashboard/cashflow-category'],
          },
          {
            label: 'CashFlow SubCategory',
            routerLink: ['/account-dashboard/cashflow-subcategory'],
          },
          {
            label: 'Cost Center I',
            routerLink: ['/account-dashboard/cost-enter-i'],
          },
          {
            label: 'Cost Center II',
            routerLink: ['/account-dashboard/cost-enter-ii'],
          },
          {
            label: 'Cost Center III',
            routerLink: ['/account-dashboard/cost-enter-iii'],
          },
          {
            label: 'Functions',
            routerLink: ['/account-dashboard/functions'],
          },
          {
            label: 'CashFlow Tag I',
            routerLink: ['/account-dashboard/cashflowtag-i'],
          },
          {
            label: 'CashFlow Tag II',
            routerLink: ['/account-dashboard/cashflowtag-ii'],
          },
        ],
      },

      {
        label: 'Transaction',
        icon: 'fas fa-donate',
        items: [
          {
            label: 'Voucher',
            routerLink: ['/account-dashboard/voucher'],
          },
        ],
      },
      {
        label: 'Report',
        icon: 'far fa-file-alt',
        items: [
          {
            label: 'Voucher List',
            routerLink: ['/account-dashboard/voucher-list'],
          },
          {
            label: 'Ledger',
            routerLink: ['/account-dashboard/ledger'],
            icon: 'far fa-file-alt',
            items: [
              {
                label: 'General Ledger',
                routerLink: 'general-ledger',
              },
              {
                label: 'Party Ledger',
                routerLink: 'party-ledger',
              },
              {
                label: 'Employee Ledger',
                routerLink: 'employee-ledger',
              },
              {
                label: 'Assets Ledger',
                routerLink: 'assets-ledger',
              },
              {
                label: 'Work Order  Ledger',
                routerLink: 'workorder-ledger',
              },
            ],
          },
          {
            label: 'Trial Balance',
            routerLink: ['/account-dashboard/trial-balance'],
          },
          {
            label: 'Profit & Loss',
            routerLink: ['/account-dashboard/profit-loss'],
          },
        ],
      },
      {
        label: 'User Settings',
        icon: 'fa fa-cog',
        items: [
          {
            label: 'Change Password',
            icon: 'fa-key',
            routerLink: 'changepassword',
          },
          {
            label: 'Logout',
            icon: 'fa-sign-out',
            routerLink: '/',

            command: () => this.loggedOut(),
          },
        ],
      },
    ];

    this.BranchLogoPath = localStorage.getItem('BranchLogoPath')!;
  }

  isAccountDashboardRoute() {
    return this.router.url === '/account-dashboard';
  }
  loggedOut() {
    localStorage.removeItem('UserId');
  }

  //this is sidenavbar

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  handleClick(item: MenuItem): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: MenuItem): string {
    return this.router.url.includes(data.routerLink) ? 'active' : '';
  }

  shrinkItems(item: MenuItem): void {
    if (!this.multiple) {
      for (let modelItem of this.accountitems) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (
      this.collapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
