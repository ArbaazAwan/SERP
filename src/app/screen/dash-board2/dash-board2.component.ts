import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';

// this is sidebar navbar
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-dash-board2',
  templateUrl: './dash-board2.component.html',
  styleUrls: ['./dash-board2.component.scss'],

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
export class DashBoard2Component implements OnInit {
  search: boolean = true;
  accountitems!: MenuItem[];
  BranchLogoPath: string = 'No Image Path Found';
  expanded = false;
  searchQuery: string = '';
  // navbar side
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  UserModulelist$: any = [];
  collapsed = true;
  screenWidth = 0;
  multiple: boolean = false;
  BranchName: string = '';
  saleTypeResponse$: any = [];
  data: any;
  options: any;
  menuItems: MenuItem[] = [];
  message: string = '';

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

  constructor(
    private router: Router,
    private expandService: ExpandService,
    private apiService: ApiProviderService
  ) {
    this.BranchName = localStorage.getItem('BranchName')!;
  }

  userId: number | undefined;
  dataShown: any;
  filteredAccountItems: any[] = [];

  filterAccountItems(): any[] {
    if (!this.UserModulelist$) {
      return [];
    }

    return this.accountitems.filter((item) => {
      return (
        item.id === '8' ||
        (item.id &&
          this.UserModulelist$.some(
            (module: { ModuleId: number }) =>
              module.ModuleId.toString() === item.id
          ))
      );
    });
  }

  ngOnInit(): void {
    //this is navbar side
    this.screenWidth = window.innerWidth;
    this.expandService.expanded$.subscribe((expanded) => {
      this.expanded = expanded;
    });

    const userIdStr = localStorage.getItem('UserId');
    const userName = localStorage.getItem('Username');
    if (userName) {
      this.menuItems.push({
        items: [
          { label: userName },
          { label: 'Logout', icon: 'pi pi-sign-out' },
          { label: 'View profile', icon: 'pi pi-user' },
        ],
      });
    }

    if (userIdStr !== null) {
      this.userId = +userIdStr;
    }
    this.apiService.get(ApiEndpoints.GetAllSaleTypes).subscribe((res: any) => {
      this.saleTypeResponse$ = res.data;
    });
    this.apiService
      .get(ApiEndpoints.GetAllUserModules + '?UserId=' + this.userId)
      .subscribe((res: any) => {
        this.UserModulelist$ = res;
        this.filteredAccountItems = this.filterAccountItems();
      });

    this.accountitems = [
      {
        label: 'Home',
        icon: 'fa fa-home',
        routerLink: ['/dash-board2/dash-board-version1'],
      },

      //Gl
      {
        label: 'Accounts & GL',
        icon: 'fas fa-file-invoice-dollar f-left',
        id: '1',
        items: [
          //Gl Def START
          {
            label: 'Financial Year',
            icon: 'fa fa-home',
            routerLink: ['/dash-board2/financial-years'],
          },
          {
            label: 'Financial Month',
            routerLink: ['/dash-board2/financial-month'],
          },
          {
            label: 'Instrument Type',
            routerLink: ['/dash-board2/instrument'],
          },
          {
            label: 'Voucher Type',
            routerLink: ['/dash-board2/voucher-type'],
          },
          {
            label: 'Chart of Accounts',
            routerLink: ['/dash-board2/account-chart'],
          },

          {
            label: 'Currency',
            routerLink: ['/dash-board2/currency'],
          },
          {
            label: 'Balance Sheet Cat',
            routerLink: ['/dash-board2/balance-sheet-category'],
          },
          {
            label: 'Balance Sheet SubCat',
            routerLink: ['/dash-board2/balance-sheet-subcategory'],
          },
          {
            label: 'Balance Sheet Note',
            routerLink: ['/dash-board2/balance-sheet-note'],
          },

          {
            label: 'P&L Category',
            routerLink: ['/dash-board2/profitloss-category'],
          },
          {
            label: 'P&L SubCategory',
            routerLink: ['/dash-board2/profitloss-subcategory'],
          },
          {
            label: 'CashFlow Category',
            routerLink: ['/dash-board2/cashflow-category'],
          },
          {
            label: 'CashFlow SubCategory',
            routerLink: ['/dash-board2/cashflow-subcategory'],
          },
          {
            label: 'Cost Center I',
            routerLink: ['/dash-board2/cost-enter-i'],
          },
          {
            label: 'Cost Center II',
            routerLink: ['/dash-board2/cost-enter-ii'],
          },
          {
            label: 'Cost Center III',
            routerLink: ['/dash-board2/cost-enter-iii'],
          },
          {
            label: 'Functions',
            routerLink: ['/dash-board2/functions'],
          },
          {
            label: 'CashFlow Tag I',
            routerLink: ['/dash-board2/cashflowtag-i'],
          },
          {
            label: 'CashFlow Tag II',
            routerLink: ['/dash-board2/cashflowtag-ii'],
          },
          //Gl Def END

          //Gl Trans START
          {
            label: 'Voucher',
            routerLink: ['/dash-board2/voucher'],
          },
          {
            label: 'Voucher Configuration',
            routerLink: ['/dash-board2/voucher-entryConfiguration'],
          },
          {
            label: 'Tax Configuration',
            routerLink: ['/dash-board2/Tax-Configuration'],
          },
        ],
      },
      //Finance
      {
        label: 'Finance',
        icon: 'fa fa-institution f-left',
        id: '2',
        items: [
          //Finance Def
          {
            label: 'Chart of Assets',
            routerLink: ['/dash-board2/assets-chart'],
          },
        ],
      },

      //Inventory
      {
        label: 'Inventory & Store',
        icon: 'fa fa-cubes f-left',
        id: '3',
        items: [
          //Inventory Def

          {
            label: 'Department Division',
            routerLink: ['/dash-board2/DepartmentDivisionRefComponent'],
          },
          {
            label: 'Department Type',
            routerLink: ['/dash-board2/department-type'],
          },
          {
            label: 'Department',
            routerLink: ['/dash-board2/department'],
          },
          {
            label: 'Department Location',
            routerLink: ['/dash-board2/department-location'],
          },

          {
            label: 'Chart of Item',
            routerLink: ['/dash-board2/item-chart'],
          },
          {
            label: 'Party Setup',
            routerLink: ['/dash-board2/party-setup'],
          },
          //Inventory Trans

          {
            label: 'Demand',
            routerLink: ['/dash-board2/demand'],
          },
          {
            label: 'Purchase Requisition',
            routerLink: ['/dash-board2/purchase-requsition'],
          },
          {
            label: 'Purchase Order',
            routerLink: ['/dash-board2/purchase-order'],
          },
          {
            label: 'Good Receipt Note',
            routerLink: ['/dash-board2/good-receipt-note'],
          },
          {
            label: 'Store Issuance',
            routerLink: ['/dash-board2/store-issuance'],
          },
          {
            label: 'Issuance Return',
            routerLink: ['/dash-board2/issuance-return'],
          },
          {
            label: 'Outward GatePass',
            routerLink: ['/dash-board2/outward-gatepass'],
          },
          {
            label: 'Inward Gate Pass',
            routerLink: ['/dash-board2/inward-gatepass'],
          },
        ],
      },
      //HR/ Payroll
      {
        label: 'HR & PayRoll',
        icon: 'fa fa-drivers-license f-left',
        id: '4',
        items: [
          {
            label: 'Definition',
            icon: 'fa fa-drivers-license f-left',
            routerLink: ['/dash-board2/definition'],
            items: [
              //HR Def
              {
                label: 'Gender',
                routerLink: ['/dash-board2/definition/gender'],
              },
              {
                label: 'Blood Group',
                routerLink: ['/dash-board2/definition/blood-group'],
              },
              {
                label: 'Nationality',
                routerLink: ['/dash-board2/definition/nationality'],
              },
              {
                label: 'Religion',
                routerLink: ['/dash-board2/definition/religion'],
              },
              {
                label: 'Marital Status',
                routerLink: ['/dash-board2/definition/marital-status'],
              },
              {
                label: 'Employee Type',
                routerLink: ['/dash-board2/definition/employee-type'],
              },
              {
                label: 'Designation',
                routerLink: ['/dash-board2/definition/designation'],
              },
              {
                label: 'Department Division',
                routerLink: ['/dash-board2/definition/department-division'],
              },
              {
                label: 'Department',
                routerLink: ['/dash-board2/definition/departments'],
              },
              {
                label: 'Job Type',
                routerLink: ['/dash-board2/definition/job-level'],
              },
              {
                label: 'Edu Qualification',
                routerLink: [
                  '/dash-board2/definition/educational-qualification',
                ],
              },
              {
                label: 'Shift',
                routerLink: ['/dash-board2/definition/shift'],
              },

              {
                label: 'Pay Heads',
                routerLink: ['/dash-board2/definition/pay-heads'],
              },
              {
                label: 'Country',
                routerLink: ['/dash-board2/definition/country'],
              },
              {
                label: 'Province',
                routerLink: ['/dash-board2/definition/province'],
              },
              {
                label: 'District',
                routerLink: ['/dash-board2/definition/district'],
              },
              {
                label: 'City',
                routerLink: ['/dash-board2/definition/city'],
              },
            ],
          },
          {
            label: 'Employee List',
            routerLink: ['/dash-board2/employee-list'],
          },
          {
            label: 'Employee Action',
            routerLink: ['/dash-board2/employee-actions'],
          },
          {
            label: 'Shift Timing',
            routerLink: ['/dash-board2/shift-timing'],
          },
          {
            label: 'Pay Package',
            routerLink: ['/dash-board2/pay-package'],
          },
          {
            label: 'Leave Type',
            routerLink: ['/dash-board2/leave-type'],
          },
          {
            label: 'Leave Application',
            routerLink: ['/dash-board2/leave-application'],
          },
          {
            label: 'Emp Configuration',
            routerLink: ['/dash-board2/employee-gl-configuration'],
          },
          //HR Trans
          {
            label: 'Employee Shifts',
            routerLink: ['/dash-board2/employee-shifts'],
          },
          {
            label: 'Employee Arrears',
            routerLink: ['/dash-board2/employee-arrears'],
          },
          {
            label: 'Employee Deduction',
            routerLink: ['/dash-board2/employee-deduction'],
          },
          {
            label: 'Attendify Attendance',
            routerLink: ['/dash-board2/import-attendify-attendance'],
          },
        ],
      },
      //Pre-Sales
      {
        label: 'Pre Sales',
        icon: 'fas fa-envelope-open-text',
        id: '9',
        items: [
          {
            label: 'Lead Stages',
            routerLink: ['/dash-board2/lead-stages'],
          },
          {
            label: 'Lead Status',
            routerLink: ['/dash-board2/lead-status'],
          },
          {
            label: 'Level Of Interest',
            routerLink: ['/dash-board2/levelof-interest'],
          },
          {
            label: 'Lead Sales List',
            routerLink: ['/dash-board2/leads-list'],
          },
        ],
      },
      //POS

      {
        label: 'Point Of Sale',
        icon: 'fa-solid fa-cart-shopping f-left',
        id: '5',
        items: [
          //POS DEFI
          {
            label: 'Dashboard',
            routerLink: ['/POS/dashboard-pos'],
          },
          {
            label: 'DashboardV1',
            routerLink: ['/POS/dash-board-version1'],
          },
          {
            label: 'Customers',
            routerLink: ['/POS/customer'],
          },
          {
            label: 'Salesperson',
            routerLink: ['/POS/sales-person'],
          },

          // POS Trans
          {
            label: 'Quotation',
            routerLink: ['/POS/quotation'],
          },
          {
            label: 'Performa Invoice',
            routerLink: ['/POS/performa-invoice'],
          },
          {
            label: 'Sale Invoice',
            routerLink: ['/POS/sale-invoice'],
          },
          {
            label: 'Sale Order',
            routerLink: ['/POS/sale-order'],
          },
          {
            label: 'Delivery Challan',
            routerLink: ['/POS/delivery-challan'],
          },
          {
            label: 'Point of Sale',
            routerLink: ['/POS/point-of-sale'],
          },

          {
            label: 'Purchase Invoice',
            routerLink: ['/POS/purchase-invoice'],
          },
          // {
          //   label: 'POS Sale',
          //   routerLink: ['/dash-board2/pos-sale'],
          // },
        ],
      },

      //Production
      {
        label: 'Production',
        icon: 'fa fa-industry f-left',
        items: [
          {
            label: 'Buyers',
            icon: 'fas fa-user-alt f-left',
            routerLink: ['/dash-board2/buyer'],
          },
          {
            label: 'Buyer Brands',
            routerLink: ['/dash-board2/buyer-brands'],
          },
          {
            label: 'Products',
            routerLink: ['/dash-board2/products'],
          },
          {
            label: 'Product BOM',
            routerLink: ['/dash-board2/productbom'],
          },
          {
            label: 'Seasons',
            routerLink: ['/dash-board2/seasons'],
          },
          {
            label: 'WorkOrder',
            routerLink: ['/dash-board2/workorder'],
          },
        ],
      },

      //Setup
      {
        label: 'Setup & Config',
        icon: 'fa-solid fa-gears f-left',
        id: '6',
        items: [
          // ==stream==
          // ==Approvals-start===
          {
            label: 'Approvals',
            items: [
              {
                label: 'Document Types',
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
          {
            label: 'Company',
            icon: 'fa-star-o',
            routerLink: ['/dash-board2/company-configuration'],
          },
          {
            label: 'Branch',
            routerLink: ['/dash-board2/branch'],
          },
          {
            label: 'Project',
            routerLink: ['/dash-board2/project'],
          },
          {
            label: 'Party Setup',
            routerLink: ['/dash-board2/party-setup'],
          },
          {
            label: 'Party Type',
            routerLink: ['/dash-board2/party-type'],
          },
          {
            label: 'Users Definition',
            routerLink: ['/dash-board2/user-defination'],
          },
          {
            label: 'User Modules',
            routerLink: ['/dash-board2/user-modules'],
          },
          {
            label: 'User Rights',
            routerLink: ['/dash-board2/user-rights'],
          },
          {
            label: 'User Data Entry Rights',
            routerLink: ['/dash-board2/user-data-entry-rights'],
          },
        ],
      },

      //All Reports
      {
        label: 'Reports',
        icon: 'far fa-file-alt',
        id: '7',
        items: [
          //Accounts rpt
          {
            label: 'Account/GL',
            icon: 'far fa-file-alt',
            items: [
              {
                label: 'Voucher List',
                routerLink: ['/Reports/voucher-list'],
              },
              {
                label: 'Ledger',
                routerLink: ['/Reports/ledger'],
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
                routerLink: ['/dash-board2/trial-balance'],
              },
              {
                label: 'Profit & Loss',
                routerLink: ['/dash-board2/profit-loss'],
              },
              {
                label: 'Balance Sheet',
                routerLink: ['/dash-board2/balancesheet'],
              },
            ],
          },
          //Finance rpt
          {
            label: 'Finance',
            icon: 'fas fa-donate',
            items: [
              {
                label: 'Voucher',
                icon: 'far fa-file-alt',
              },
            ],
          },
          //Inventory rpt

          {
            label: 'Inventory',
            icon: 'far fa-file-alt',
            items: [
              {
                label: 'Stock Reports',
                items: [
                  {
                    label: 'Only Stock',
                    routerLink: ['/dash-board2/stock-reports'],
                  },
                  {
                    label: 'Stock With Rate',
                    routerLink: ['/dash-board2/stock-rate'],
                  },
                  {
                    label: 'Stock Movement Report',
                    routerLink: ['/dash-board2/transaction-reports'],
                  },
                ],
              },
              {
                label: 'Item Reports',
                items: [
                  {
                    label: 'All Items List',
                    routerLink: ['/dash-board2/item-reports'],
                  },
                  {
                    label: 'Item Ledger',
                    routerLink: ['/dash-board2/item-ledger-reports'],
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
                        routerLink: ['/dash-board2/demand-list'],
                      },
                      {
                        label: 'Pending To PR Demands',
                        routerLink: ['/dash-board2/pending-demand'],
                      },
                    ],
                  },
                  {
                    label: 'Purchase Req',
                    items: [
                      {
                        label: 'PR List',
                        routerLink: ['/dash-board2/prlist-report'],
                      },
                      {
                        label: 'Pending To PO PRs ',
                        routerLink: ['/dash-board2/pending-po-pr-report'],
                      },
                    ],
                  },
                  {
                    label: 'Purchase Order',
                    items: [
                      {
                        label: 'PO List',
                        routerLink: ['/dash-board2/polist-report'],
                      },
                      {
                        label: 'Pending To Receive ',
                        routerLink: ['/dash-board2/pendingto-received'],
                      },
                    ],
                  },
                  {
                    label: 'Goods Receipt Note',
                    items: [
                      {
                        label: 'GRN List',
                        routerLink: ['/dash-board2/grn-list'],
                      },
                    ],
                  },
                  {
                    label: 'Store Issuance',
                    items: [
                      {
                        label: 'Issuance List Items',
                        routerLink: ['/dash-board2/issuance-list-item'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          //HR rpt
          {
            label: 'HR/Payroll',
            icon: 'fas fa-donate',
            items: [
              {
                label: 'Report Name',
                // routerLink: ['/dash-board2/report'],
              },
            ],
          },

          // POS rpt
          {
            label: 'Point Of Sale',
            icon: 'far fa-file-alt',
            items: [
              {
                label: 'Sales Summary',
                routerLink: ['/dash-board2/sales-summary'],
              },
              {
                label: 'Sales Details',
                // routerLink: ['/dash-board2/salesman'],
              },
              {
                label: 'Item Wise Sale',
                // routerLink: ['/dash-board2/salesman'],
              },
              {
                label: 'Customers Wise Sale',
                //routerLink: ['/dash-board2/salesman'],
              },
              {
                label: 'Sale Men Wise',
                routerLink: ['/dash-board2/salesman-wise'],
              },
              {
                label: 'Sale Invoice List',
                routerLink: ['/dash-board2/sale-invoice-list'],
              },
            ],
          },
        ],
      },

      //User Settings
      {
        label: 'User Settings',
        icon: 'fa fa-cog',
        id: '8',
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

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--cyan-200'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-200'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    const usernameFromLocalStorage = localStorage.getItem('Username');

    if (usernameFromLocalStorage !== null) {
      this.message = usernameFromLocalStorage;
    } else {
      this.message = 'Default Value';
    }
  }

  isAccountDashboardRoute() {
    return this.router.url === '/dash-board2';
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
    this.search = !this.search;
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
    this.search = false;
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

  onSearch() {
    // Perform the search operation based on the searchQuery value
    console.log('Searching for:', this.searchQuery);
    // Add your search logic here
  }

  isDropdownOpen = false;
  // Define the `toggleDropdown` method in your component
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
