import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
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
import { fadeInOut } from 'src/app/pages/setup-configuration/setup-dashboard/helper-setup';

// this is sidebar navbar
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-pos-dashboard',
  templateUrl: './pos-dashboard.component.html',
  styleUrls: ['./pos-dashboard.component.scss'],
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
export class PosDashboardComponent implements OnInit {
  posItems!: MenuItem[];
  expanded = false;
  BranchLogoPath: string = 'No Logo Found';
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
    this.posItems = [
      {
        label: 'Home',
        icon: 'fa fa-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Definition',
        icon: 'pi pi-fw pi-pencil',
        items: [
          // {
          //   label: 'Customers',
          //   routerLink: ['/pos-dashboard/customers'],
          // },
          {
            label: 'Customers',
            routerLink: ['/pos-dashboard/party-setup'],
          },
          {
            label: 'Salesperson',
            routerLink: ['/pos-dashboard/salesman'],
          },
        ],
      },

      {
        label: 'Transaction',
        icon: 'fas fa-donate',
        items: [
          {
            label: 'Sale Invoice',
            routerLink: ['/pos-dashboard/sale-invoice'],
          },
          {
            label: 'Purchase Invoice',
            routerLink: ['/pos-dashboard/purchase-invoice'],
          },
        ],
      },
      {
        label: 'Report',
        icon: 'far fa-file-alt',
        items: [
          {
            label: 'Sales Summary',
            routerLink: ['/pos-dashboard/sales-summary'],
          },
          {
            label: 'Sales Details',
            // routerLink: ['/pos-dashboard/salesman'],
          },
          {
            label: 'Item Wise Sale',
            // routerLink: ['/pos-dashboard/salesman'],
          },
          {
            label: 'Customers Wise Sale',
            //routerLink: ['/pos-dashboard/salesman'],
          },
          {
            label: 'Sale Men Wise',
            routerLink: ['/pos-dashboard/salesman-wise'],
          },
          {
            label: 'Sale Invoice List',
            routerLink: ['/pos-dashboard/sale-invoice-list'],
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

  isPOSDashboardRoute() {
    return this.router.url === '/pos-dashboard';
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
      for (let modelItem of this.posItems) {
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
