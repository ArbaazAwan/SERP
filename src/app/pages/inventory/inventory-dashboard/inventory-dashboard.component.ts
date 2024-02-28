import { BranchModel } from 'src/app/_shared/model/model';
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
import { fadeInOut } from 'src/app/pages/inventory/inventory-dashboard/helper-inventory';

// this is sidebar navbar
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss'],
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
export class InventoryDashboardComponent implements OnInit {
  inventoryitems!: MenuItem[];
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
    this.inventoryitems = [
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
            label: 'Department',
            routerLink: ['/inventory/department'],
          },
          {
            label: 'Department Location',
            routerLink: ['/inventory/department-location'],
          },

          {
            label: 'Chart of Item',
            routerLink: ['/inventory/item-chart'],
          },
          {
            label: 'Party Setup',
            routerLink: ['/inventory/party-setup'],
          },
          {
            label: 'New Chart of Item',
            routerLink: ['/inventory/new-chartofitem'],
          },
        ],
      },
      {
        label: 'Transaction',
        icon: 'fas fa-donate',
        items: [
          {
            label: 'Demand',
            routerLink: ['/inventory/demand'],
          },
          {
            label: 'Purchase Requisition',
            routerLink: ['/inventory/purchase-requsition'],
          },
          {
            label: 'Purchase Order',
            routerLink: ['/inventory/purchase-order'],
          },
          // {
          //   label: 'Purchase Order Detail',
          //   routerLink: ['/inventory/purchase-order-detail'],
          // },
          // {
          //   label: 'Inward Gate Pass',
          //   routerLink: ['/inventory/inward-gatepass'],
          // },
          // {
          //   label: 'Outward Gate Pass',
          //   //routerLink: ['/inventory/chart-item'],
          // },
          {
            label: 'Good Receipt Note',
            routerLink: ['/inventory/good-receipt-note'],
          },
          {
            label: 'Store Issuance',
            routerLink: ['/inventory/store-issuance'],
          },
          {
            label: 'Outward GatePass',
            routerLink: ['/inventory/outward-gatepass'],
          },
          {
            label: 'Inward Gate Pass',
            routerLink: ['/inventory/inward-gatepass'],
          },
          // {
          //   label: 'Issuance Return',
          //   //routerLink: ['/inventory/chart-item'],
          // },
        ],
      },
      {
        label: 'Report',
        icon: 'far fa-file-alt',
        items: [
          {
            label: 'Stock Reports',
            items: [
              {
                label: 'Only Stock',
                routerLink: ['/inventory/stock-reports'],
              },
              {
                label: 'Stock With Rate',
                routerLink: ['/inventory/stock-rate'],
              },
              // {
              //   label: 'Stock With Images',
              //   routerLink: ['/inventory/stock-img'],
              // },
              {
                label: 'Stock Movement Report',
                routerLink: ['/inventory/transaction-reports'],
              },
            ],
          },
          {
            label: 'Item Reports',
            items: [
              {
                label: 'All Items List',
                routerLink: ['/inventory/item-reports'],
              },
              {
                label: 'Item Ledger',
                routerLink: ['/inventory/item-ledger-reports'],
              },
            ],
          },

          {
            label: 'Transactional Reports',
            items: [
              {
                label: 'Demand',
                items: [
                  {
                    label: 'Demand List',
                    routerLink: ['/inventory/demand-list'],
                  },
                  {
                    label: 'Pending To PR Demands',
                    routerLink: ['/inventory/pending-demand'],
                  },
                ],
              },
              {
                label: 'Purchase Req',
                items: [
                  {
                    label: 'PR List',
                    routerLink: ['/inventory/prlist-report'],
                  },
                  {
                    label: 'Pending To PO PRs ',
                    routerLink: ['/inventory/pending-po-pr-report'],
                  },
                ],
              },
              {
                label: 'Purchase Order',
                items: [
                  {
                    label: 'PO List',
                    routerLink: ['/inventory/polist-report'],
                  },
                  {
                    label: 'Pending To Receive ',
                    routerLink: ['/inventory/pendingto-received'],
                  },
                ],
              },
              {
                label: 'Goods Receipt Note',
                items: [
                  {
                    label: 'GRN List',
                    routerLink: ['/inventory/grn-list'],
                  },
                ],
              },
              {
                label: 'Store Issuance',
                items: [
                  {
                    label: 'Issuance List Items',
                    routerLink: ['/inventory/issuance-list-item'],
                  },
                ],
              },
            ],
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
      for (let modelItem of this.inventoryitems) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  isInventoryDashboardRoute() {
    return this.router.url === '/inventory';
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
