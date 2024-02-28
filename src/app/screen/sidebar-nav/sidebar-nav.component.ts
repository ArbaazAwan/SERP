import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/public_api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ExpandService } from 'src/app/_shared/function/expand.service';
import { Brand } from 'src/app/_shared/model/model';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent implements OnInit {
  search: boolean = true;
  accountitems!: MenuItem[];
  BranchLogoPath: string = 'No Image Path Found';
  expanded = false;
  searchQuery: string = '';
  // navbar side
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  UserModulelist$: any = [];
  activeBrand!: Brand;
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

  updateFilteredAccountItems(): void {
    this.accountitems = this.filterAccountItems();
  }

  filterAccountItems(): any[] {
    if (!this.UserModulelist$ || !this.accountitems) {
      return [];
    }

    return this.accountitems.filter((item) => {
      return (
        item.id === '8' ||
        item.id === 'dash' ||
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
        this.updateFilteredAccountItems();
      });
    this.accountitems = [
      {
        label: 'Dashboard',
        icon: '../../../assets/SidebarMenuIcons/dashboard-icon.svg',
        id: 'dash',
        routerLink: ['/Dashboard'],
      },

      //Gl
      {
        label: 'Accounts & GL',
        icon: '../../../assets/SidebarMenuIcons/accounts-gl.svg',
        id: '1',
        items: [
          {
            label: 'Financial Year',
            icon: 'fa fa-home',
            routerLink: ['/Accounts/financial-years'],
          },
          {
            label: 'Financial Month',
            routerLink: ['/Accounts/financial-month'],
          },
          {
            label: 'Instrument Type',
            routerLink: ['/Accounts/instrument'],
          },
          {
            label: 'Voucher Type',
            routerLink: ['/Accounts/voucher-type'],
          },
          {
            label: 'Bank Cash Account',
            routerLink: ['/Accounts/bank-account'],
          },
          {
            label: 'Chart of Accounts',
            routerLink: ['/Accounts/account-chart'],
          },

          {
            label: 'Currency',
            routerLink: ['/Accounts/currency'],
          },
          {
            label: 'Balance Sheet Category',
            routerLink: ['/Accounts/balance-sheet-category'],
          },
          {
            label: 'Balance Sheet SubCategory',
            routerLink: ['/Accounts/balance-sheet-subcategory'],
          },
          {
            label: 'Balance Sheet Note',
            routerLink: ['/Accounts/balance-sheet-note'],
          },

          {
            label: 'P&L Category',
            routerLink: ['/Accounts/profitloss-category'],
          },
          {
            label: 'P&L Subcategory',
            routerLink: ['/Accounts/profitloss-subcategory'],
          },
          {
            label: 'Cash Flow Category',
            routerLink: ['/Accounts/cashflow-category'],
          },
          {
            label: 'Cash Flow Subcategory',
            routerLink: ['/Accounts/cashflow-subcategory'],
          },
          {
            label: 'Cost Center I',
            routerLink: ['/Accounts/cost-enter-i'],
          },
          {
            label: 'Cost Center II',
            routerLink: ['/Accounts/cost-enter-ii'],
          },
          {
            label: 'Cost Center III',
            routerLink: ['/Accounts/cost-enter-iii'],
          },
          {
            label: 'Functions',
            routerLink: ['/Accounts/functions'],
          },
          {
            label: 'Cash Flow Tag I',
            routerLink: ['/Accounts/cashflowtag-i'],
          },
          {
            label: 'Cash Flow Tag II',
            routerLink: ['/Accounts/cashflowtag-ii'],
          },
          {
            label: 'Voucher',
            routerLink: ['/Accounts/voucher'],
          },
          {
            label: 'Voucher Configuration',
            routerLink: ['/Accounts/voucher-entryConfiguration'],
          },
          {
            label: 'Tax Configuration',
            routerLink: ['/Accounts/Tax-Configuration'],
          },
        ],
      },

      //Finance
      {
        label: 'Finance',
        icon: '../../../assets/SidebarMenuIcons/finance-icon.svg',
        routerLink: ['/Finance'],
        id: '2',
        items: [
          //Finance Def
          {
            label: 'Chart of Assets',
            routerLink: ['/Finance/assets-chart'],
          },
          {
            label: 'Cheque Book',
            routerLink: ['/Finance/cheque-book'],
          },
          {
            label: 'Cheque Configuration',
            routerLink: ['/Finance/cheque-config'],
          },
          {
            label: 'Cheque Book Reconciliation',
            routerLink: ['/Finance/cheque-book-reconciliation'],
          },
          {
            label: 'Budget Management',
            icon: 'fa fa-drivers-license f-left',
            items: [
              {
                label: 'Budget Cycle',
                routerLink: ['/Finance/budget-cycle'],
              },
              {
                label: 'Budget Status',
                routerLink: ['/Finance/budget-status'],
              },
              {
                label: 'Budget Entry',
                routerLink: ['/Finance/budget-entry'],
              },
              {
                label: 'Budget Variance',
                routerLink: ['/Finance/budget-variance'],
              },
              {
                label: 'Hard line Budget',
                routerLink: ['/Finance/hard-line-budget'],
              },
            ],
          },
        ],
      },

      //Inventory
      {
        label: 'Inventory & Store',
        icon: '../../../assets/SidebarMenuIcons/inventory-icon.svg',
        id: '3',
        items: [
          {
            label: 'Department Type',
            routerLink: ['/Inventory/department-type'],
          },
          {
            label: 'Department',
            routerLink: ['/Inventory/department'],
          },
          {
            label: 'Store',
            routerLink: ['/Inventory/store'],
          },
          {
            label: 'Department Location',
            routerLink: ['/Inventory/department-location'],
          },

          {
            label: 'Chart of Item',
            routerLink: ['/Inventory/item-chart'],
          },
          {
            label: 'Party Setup',
            routerLink: ['/Inventory/party-setup'],
          },
          {
            label: 'Demand',
            routerLink: ['/Inventory/demand'],
          },
          {
            label: 'Purchase Requisition Type',
            routerLink: ['/Inventory/pr-type'],
          },
          {
            label: 'Purchase Requisition',
            routerLink: ['/Inventory/purchase-requsition'],
          },
          {
            label: 'Comparative Statement',
            routerLink: ['/Inventory/comparative-statement'],
          },
          {
            label: 'Purchase Order Type',
            routerLink: ['/Inventory/po-type'],
          },
          {
            label: 'Purchase Order',
            routerLink: ['/Inventory/purchase-order'],
          },
          {
            label: 'Good Receipt Note',
            routerLink: ['/Inventory/good-receipt-note'],
          },
          {
            label: 'Store Issuance',
            routerLink: ['/Inventory/store-issuance'],
          },
          {
            label: 'Issuance Return',
            routerLink: ['/Inventory/issuance-return'],
          },
          {
            label: 'Outward Gate Pass',
            routerLink: ['/Inventory/outward-gatepass'],
          },
          {
            label: 'Inward Gate Pass',
            routerLink: ['/Inventory/inward-gatepass'],
          },
          
          {
            label: 'Inspection Receipt Note',
            routerLink: ['/Inventory/inspection-reciept-note'],
          },
          {
            label: 'Purchase Invoice',
            routerLink: ['/Inventory/purchase-invoice'],
          },
          {
            label: 'Purchase Payment',
            routerLink: ['/Inventory/purchase-payment'],
          },
        ],
      },

      //HR/ Payroll
      {
        label: 'HR & PayRoll',
        icon: '../../../assets/SidebarMenuIcons/hr-icon.svg',
        routerLink: ['/HR-and-Payroll'],
        id: '4',
        items: [
          {
            label: 'Definition',
            icon: 'fa fa-drivers-license f-left',
            // routerLink: ['/HR-and-Payroll/definition']
            items: [
              {
                label: 'Blood Group',
                routerLink: ['/HR-and-Payroll/blood-group'],
              },
              {
                label: 'City',
                routerLink: ['/HR-and-Payroll/city'],
              },
              {
                label: 'Country',
                routerLink: ['/HR-and-Payroll/country'],
              },
              {
                label: 'Division',
                routerLink: ['/HR-and-Payroll/division'],
              },
              {
                label: 'Departments',
                routerLink: ['/HR-and-Payroll/departments'],
              },
              {
                label: 'Designation Levels',
                routerLink: ['/HR-and-Payroll/designation-levels'],
              },
              {
                label: 'Designation',
                routerLink: ['/HR-and-Payroll/designation'],
              },
              {
                label: 'District',
                routerLink: ['/HR-and-Payroll/district'],
              },
              {
                label: 'Disability Nature',
                routerLink: ['/HR-and-Payroll/disability-nature'],
              },
              {
                label: 'Document Type',
                routerLink: ['/HR-and-Payroll/document-type'],
              },
              {
                label: 'Qualification Level',
                routerLink: ['/HR-and-Payroll/educational-qualification'],
              },
              {
                label: 'Employee Type',
                routerLink: ['/HR-and-Payroll/employee-type'],
              },
              {
                label: 'Gender',
                routerLink: ['/HR-and-Payroll/gender'],
              },
              {
                label: 'Interview Status',
                routerLink: ['HR-and-Payroll/interview-status'],
              },
              {
                label: 'Job Level',
                routerLink: ['/HR-and-Payroll/job-level'],
              },
              {
                label: 'Marital Status',
                routerLink: ['/HR-and-Payroll/marital-status'],
              },
              {
                label: 'State',
                routerLink: ['/HR-and-Payroll/state'],
              },
              {
                label: 'Religion',
                routerLink: ['/HR-and-Payroll/religion'],
              },
              {
                label: 'Pay Heads',
                routerLink: ['/HR-and-Payroll/pay-heads'],
              },
            ],
          },
          {
            label: 'Shift',
            icon: 'fa fa-drivers-license f-left',
            items: [
              {
                label: 'Shift',
                routerLink: ['/HR-and-Payroll/shift'],
              },
              {
                label: 'Shift Timing',
                routerLink: ['/HR-and-Payroll/shift-timing'],
              },
              {
                label: 'Employee Shifts',
                routerLink: ['/HR-and-Payroll/employee-shifts'],
              },
            ],
          },
          {
            label: 'Employee List',
            routerLink: ['/HR-and-Payroll/employee-list'],
          },
          {
            label: 'Family Info',
            routerLink: ['/HR-and-Payroll/family-info'],
          },
          // {
          //   label: 'Employee Bank',
          //   routerLink: ['/HR-and-Payroll/employee-bank'],
          // },
          {
            label: 'Pay Package',
            routerLink: ['/HR-and-Payroll/pay-package'],
          },
          {
            label: 'Leave Type',
            routerLink: ['/HR-and-Payroll/leave-type'],
          },
          {
            label: 'Leave Application',
            routerLink: ['/HR-and-Payroll/leave-application'],
          },
          {
            label: 'Holiday Type',
            routerLink: ['/HR-and-Payroll/holiday-type'],
          },
          {
            label: 'Employee GL Configuration',
            routerLink: ['/HR-and-Payroll/employee-gl-configuration'],
          },
          {
            label: 'Employee Action Type',
            routerLink: ['/HR-and-Payroll/employee-action-type'],
          },
          {
            label: 'Employee Arrears',
            routerLink: ['/HR-and-Payroll/employee-arrears'],
          },
          {
            label: 'Allowance/Deduction',
            routerLink: ['/HR-and-Payroll/allowance-deduction'],
          },
          {
            label: 'Attendify Attendance',
            routerLink: ['/HR-and-Payroll/import-attendify-attendance'],
          },
          {
            label: 'Recruitment Requirement',
            routerLink: ['/HR-and-Payroll/recruitment-requirement'],
          },
          {
            label: 'Applicant Gate Pass Type',
            routerLink: ['/HR-and-Payroll/applicant-gatepass-type'],
          },
          {
            label: 'Interview Schedule',
            routerLink: ['/HR-and-Payroll/interview-schedule'],
          },
          {
            label: 'Employee Applicant',
            routerLink: ['/HR-and-Payroll/employee-applicant'],
          },
        ],
      },

      //Pre-Sales
      {
        label: 'Pre Sales',
        icon: '../../../assets/SidebarMenuIcons/pre-sales-icon.svg',
        id: '5',
        items: [
          {
            label: 'Lead Stages',
            routerLink: ['/Pre-sales/lead-stages'],
          },
          {
            label: 'Lead Status',
            routerLink: ['/Pre-sales/lead-status'],
          },
          {
            label: 'Level Of Interest',
            routerLink: ['/Pre-sales/levelof-interest'],
          },
          {
            label: 'Account Manager',
            routerLink: ['/Pre-sales/account-manager'],
          },
          {
            label: 'Account Manager Customers',
            routerLink: ['/Pre-sales/account-manager-customers'],
          },
          {
            label: 'Opportunities',
            routerLink: ['/Pre-sales/opportunities'],
          },
          {
            label: 'Lead Sales List',
            routerLink: ['/Pre-sales/leads-list'],
          },
        ],
      },
      //POS

      {
        label: 'Accounts Receivable',
        icon: '../../../assets/SidebarMenuIcons/point-of-sale-icon.svg',
        id: '6',
        items: [
          {
            label: 'Customers',
            routerLink: ['/POS/customer'],
          },
          {
            label: 'Sales Person',
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
            label: 'Sales Invoice',
            routerLink: ['/POS/sales-invoice'],
          },
          {
            label: 'Sales Order',
            routerLink: ['/POS/sales-order'],
          },
          {
            label: 'Delivery Challan',
            routerLink: ['/POS/delivery-challan'],
          },
          {
            label: 'Point of Sale',
            routerLink: ['/POS/possaledetails'],
          },
        ],
      },

      //All Reports
      {
        label: 'Reports',
        icon: '../../../assets/SidebarMenuIcons/reports-icon.svg',
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
                    routerLink: ['/Reports/general-ledger'],
                  },
                  {
                    label: 'Party Ledger',
                    routerLink: ['/Reports/party-ledger'],
                  },
                  {
                    label: 'Employee Ledger',
                    routerLink: ['/Reports/employee-ledger'],
                  },
                  {
                    label: 'Assets Ledger',
                    routerLink: ['/Reports/assets-ledger'],
                  },
                  {
                    label: 'Work Order Ledger',
                    routerLink: ['/Reports/workorder-ledger'],
                  },
                ],
              },
              {
                label: 'Trial Balance',
                routerLink: ['/Reports/trial-balance'],
              },
              {
                label: 'Profit & Loss',
                routerLink: ['/Reports/profit-loss'],
              },
              {
                label: 'Balance Sheet',
                routerLink: ['/Reports/balancesheet'],
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
                    routerLink: ['/inventory-Reports/stock-reports'],
                  },
                  {
                    label: 'Stock With Rate',
                    routerLink: ['/inventory-Reports/stock-rate'],
                  },
                  {
                    label: 'Stock Movement Report',
                    routerLink: ['/inventory-Reports/transaction-reports'],
                  },
                ],
              },
              {
                label: 'Item Reports',
                items: [
                  {
                    label: 'All Items List',
                    routerLink: ['/inventory-Reports/item-reports'],
                  },
                  {
                    label: 'Item Ledger',
                    routerLink: ['/inventory-Reports/item-ledger-reports'],
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
                        routerLink: ['/inventory-Reports/demand-list'],
                      },
                      {
                        label: 'Pending to PR Demands',
                        routerLink: ['/inventory-Reports/pending-demand'],
                      },
                    ],
                  },
                  {
                    label: 'Purchase Req',
                    items: [
                      {
                        label: 'PR List',
                        routerLink: ['/inventory-Reports/prlist-report'],
                      },
                      {
                        label: 'Pending To PO PRs ',
                        routerLink: ['/inventory-Reports/pending-po-pr-report'],
                      },
                    ],
                  },
                  {
                    label: 'Purchase Order',
                    items: [
                      {
                        label: 'PO List',
                        routerLink: ['/inventory-Reports/polist-report'],
                      },
                      {
                        label: 'Pending To Receive ',
                        routerLink: ['/inventory-Reports/pendingto-received'],
                      },
                    ],
                  },
                  {
                    label: 'Goods Receipt Note',
                    items: [
                      {
                        label: 'GRN List',
                        routerLink: ['/inventory-Reports/grn-list'],
                      },
                    ],
                  },
                  {
                    label: 'Store Issuance',
                    items: [
                      {
                        label: 'Issuance List Items',
                        routerLink: ['/inventory-Reports/issuance-list-item'],
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
          },

          // POS rpt
          {
            label: 'Point Of Sales',
            icon: 'far fa-file-alt',
            items: [
              {
                label: 'Sales Summary',
                routerLink: ['/POS-Reports/sales-summary'],
              },
              {
                label: 'Sale Invoice List',
                routerLink: ['/POS-Reports/sale-invoice-list'],
              },
            ],
          },
          // Pre Sales Reports
          {
            label: 'Pre Sales',
            icon: 'far fa-file-alt',
            items: [
              {
                label: 'Lead List',
                routerLink: ['/POS-Reports/pre-sales-reports'],
              },
            ],
          },
        ],
      },

      //Setup
      {
        label: 'Setup & Config',
        icon: '../../../assets/SidebarMenuIcons/setup-icon.svg',
        id: '8',
        items: [
          {
            label: 'Approvals',
            items: [
              {
                label: 'Document Types',
                routerLink: ['/Setup-and-configuration/document-types'],
              },
              {
                label: 'Attachment Types',
                routerLink: ['/Setup-and-configuration/attachment-types'],
              },
              {
                label: 'Approval Hierarchy',
                routerLink: ['/Setup-and-configuration/approval-hirarchy'],
              },
              {
                label: 'Document Attachments',
                routerLink: ['/Setup-and-configuration/document-attachments'],
              },
              {
                label: 'Document Approvals',
                routerLink: ['/Setup-and-configuration/document-approvals'],
              },
            ],
          },
          // ==Approvals-end===
          {
            label: 'Company Config',
            icon: 'fa-star-o',
            routerLink: ['/Setup-and-configuration/company-configuration'],
          },
          {
            label: 'Branch',
            routerLink: ['/Setup-and-configuration/branch'],
          },
          {
            label: 'Project',
            routerLink: ['/Setup-and-configuration/project'],
          },
          {
            label: 'Party Type',
            routerLink: ['/Setup-and-configuration/party-type'],
          },
          {
            label: 'Users Definition',
            routerLink: ['/Setup-and-configuration/user-defination'],
          },
          {
            label: 'User Modules',
            routerLink: ['/Setup-and-configuration/user-modules'],
          },
          {
            label: 'User Rights',
            routerLink: ['/Setup-and-configuration/user-rights'],
          },
          {
            label: 'User Data Entry Rights',
            routerLink: ['/Setup-and-configuration/user-data-entry-rights'],
          },
          {
            label: 'Documents Path',
            routerLink: ['/Setup-and-configuration/documents-path'],
          },
        ],
      },

      // User Settings
      // {
      //   label: 'User Settings',
      //   icon: 'fa fa-cog',
      //   id: '8',
      //   items: [
      //     {
      //       label: 'Change Password',
      //       icon: 'fa-key',
      //       routerLink: 'changepassword',
      //     },
      //     {
      //       label: 'Logout',
      //       icon: 'fa-sign-out',
      //       routerLink: '/',

      //       command: () => this.loggedOut(),
      //     },
      //   ],
      // },
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

    this.activeBrand = JSON.parse(localStorage.getItem('activeBrand')!);
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
