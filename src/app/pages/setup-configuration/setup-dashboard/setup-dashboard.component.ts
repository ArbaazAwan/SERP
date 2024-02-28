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
  selector: 'app-setup-dashboard',
  templateUrl: './setup-dashboard.component.html',
  styleUrls: ['./setup-dashboard.component.scss'],
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
export class SetupDashboardComponent implements OnInit {
  setupitems!: MenuItem[];
  menuBar!: MenuItem[];
  display: boolean = true;
  BranchLogoPath: string = 'No Image Path Found';
  expanded = false;
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
  // this is side bar output

  ngOnInit() {
    //this is navbar side
    this.screenWidth = window.innerWidth;
    this.expandService.expanded$.subscribe((expanded) => {
      this.expanded = expanded;
    });
    this.setupitems = [
      {
        label: 'Home',
        icon: 'fal fa-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'General',
        icon: 'fal fa-pencil',
        items: [
          {
            label: 'Company',
            icon: 'fa-star-o',
            routerLink: ['/setup-config/company-configuration'],
          },
          {
            label: 'Branch',
            routerLink: ['/setup-config/branch'],
          },
          {
            label: 'Project',
            routerLink: ['/setup-config/project'],
          },
          {
            label: 'Party Setup',
            routerLink: ['/setup-config/party-setup'],
          },
          {
            label: 'Party Type',
            routerLink: ['/setup-config/party-type'],
          },
        ],
      },
      {
        label: 'User',
        icon: 'fal fa-user',
        items: [
          {
            label: 'Users Definition',
            routerLink: ['/setup-config/user-defination'],
          },
          {
            label: 'User Branches',
            routerLink: ['/setup-config/user-branches'],
          },
          {
            label: 'User Project',
            routerLink: ['/setup-config/user-projects'],
          },
          {
            label: 'User Voucher Type',
            routerLink: ['/setup-config/uservouchertype'],
          },
          {
            label: 'User Menu Rights',
            routerLink: ['/setup-config/usermenurights'],
          },
        ],
      },
      {
        label: 'User Settings',
        icon: 'fa fa-cog',
        items: [
          {
            label: 'Change Password',
            icon: 'fa-star-o ',
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
      // ==Approvals-start===
      {
        label: 'Approvals',
        items: [
          {
            label: 'Document Type',
            routerLink: ['/dash-board2/document-types'],
          },
          {
            label: 'Attachment Types',
            routerLink: ['/dash-board2/attachment-types'],
          },
          {
            label: 'Approval Hierarchy',
            routerLink: ['/dash-board2/approval-hirarchy'],
          },
          {
            label: 'Document Attachments',
            routerLink: ['/dash-board2/document-attachments'],
          },
          {
            label: 'Document Approvals',
            routerLink: ['/dash-board2/document-approvals'],
          },
        ],
      },
      // ==Approvals-end===
    ];
    this.BranchLogoPath = localStorage.getItem('BranchLogoPath')!;
  }

  isSetupDashboardRoute() {
    return this.router.url === '/setup-config';
  }

  toggleSidebar() {
    this.display = !this.display;
  }
  toggleSidebar1() {
    this.display = !this.display;
  }

  loggedOut() {
    localStorage.removeItem('UserId');
  }

  isHomeRoute() {
    return this.router.url === '/' || this.router.url === '/dashboard';
  }
  toggleExpanded() {
    this.expandService.toggleExpanded(!this.expanded);
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
      for (let modelItem of this.setupitems) {
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
