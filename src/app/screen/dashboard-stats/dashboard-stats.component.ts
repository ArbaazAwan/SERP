import { Component, OnInit } from '@angular/core';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Output, EventEmitter, HostListener } from '@angular/core';
import { fadeInOut } from 'src/app/pages/account-gl/account-dashboard/helper-account-gl';
import { MenuItem } from 'primeng/api/public_api';
import { Router } from '@angular/router';
import { ExpandService } from 'src/app/_shared/function/expand.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss'],
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
export class DashboardStatsComponent implements OnInit {
  items!: MenuItem[];
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
    this.BranchLogoPath = localStorage.getItem('BranchLogoPath')!;
    this.BranchName = localStorage.getItem('BranchName')!;
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.expandService.expanded$.subscribe((expanded) => {
      this.expanded = expanded;
    });
    this.items = [
      {
        label: 'Home',
        icon: 'fa fa-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'General ERP',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Accounts & GL',
            routerLink: ['/dashboard-stats/account-stats'],
          },
          {
            label: 'Finance',
          },
          {
            label: 'Store Inventory',
          },
          {
            label: 'Sales',
          },
          {
            label: 'HR Payroll',
          },
        ],
      },
      {
        label: 'Textile ERP',
        icon: 'fas fa-donate',
        items: [
          {
            label: 'Basic',
          },
        ],
      },
    ];
  }

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
      for (let modelItem of this.items) {
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

  isAccountDashboardRoute() {
    return this.router.url === '/dashboard-stats';
  }
}
