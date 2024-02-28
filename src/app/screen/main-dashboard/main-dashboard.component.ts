import { Component, HostListener, OnInit } from '@angular/core';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {

  data: any;
  options: any;
  message: string = '';

  douData: any;
  douOptions: any;

  assetData: any;
  assetOptions: any;
  isSticky: boolean = false;
  postedVoucher: number = 0;
  unPostedVoucher: number = 0;
  branchCode: any;
  totalSalesAmount: number = 0;
  selectedStore: number = 0;
  selectedProject: number = 0;
  totalSalesCount: number = 0
  totalStockCount: number = 0
  allSalesAmount :number =0
  allQuotations : number =0
  allDeliveryChallans : number =0
  allSalesLeads : number = 0
  pendingDemandCount: number = 0
  sales: any = []
  quotations: any = []
  deliveryChallans: any = []
  currentCurrency: string = ''
  SalesLeads : any = []
  constructor(private apiService: ApiProviderService) {
    this.branchCode = localStorage.getItem('BranchCode')
  }

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  ngOnInit(): void {

    this.PieChart();
    this.getDashboardData();
    this.AssetsLibilityChart();

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--cyan-200'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-200'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }

      }
    };

    const usernameFromLocalStorage = localStorage.getItem('Username');

    if (usernameFromLocalStorage !== null) {
      this.message = usernameFromLocalStorage;
    } else {
      this.message = 'Default Value';
    }

  }

  PieChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.douData = {
      labels: ['Fully Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'],
      datasets: [
        {
          data: [300, 50, 100, 250, 190],
          backgroundColor: [
            'rgba(50, 160, 239, 1)',
            'rgba(53, 191, 41, 1)',
            'rgba(255, 152, 152, 1)',
            'rgba(255, 198, 86, 1)',
            'rgba(238, 138, 20, 1)',
          ],

          hoverBackgroundColor: [
            'rgba(50, 160, 239, 0.8)',
            'rgba(53, 191, 41, 0.8)',
            'rgba(255, 152, 152, 0.8)',
            'rgba(255, 198, 86, 0.8)',
            'rgba(238, 138, 20, 0.8)',
          ]
        }
      ]
    };

    this.douOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        }
      }
    };
  }

  AssetsLibilityChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.assetData = {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Total Assets',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(50, 160, 239, 1)',
            'rgba(53, 191, 41, 1)',
            'rgba(255, 152, 152, 1)',
            'rgba(255, 198, 86, 1)',
            'rgba(238, 138, 20, 1)',
          ],
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
        },
        {
          label: 'Liabilities',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(53, 191, 41, 1)',
            'rgba(255, 152, 152, 1)',
            'rgba(255, 198, 86, 1)',
            'rgba(50, 160, 239, 1)',
            'rgba(238, 138, 20, 1)',
          ],
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
        },
        {
          label: 'Share Holder’s Equity',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(53, 191, 41, 1)',
            'rgba(255, 152, 152, 1)',
            'rgba(50, 160, 239, 1)',
            'rgba(255, 198, 86, 1)',
            'rgba(238, 138, 20, 1)',
          ],

          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
        },
        {
          label: 'Net Income',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 198, 86, 1)',
            'rgba(50, 160, 239, 1)',
            'rgba(53, 191, 41, 1)',
            'rgba(255, 152, 152, 1)',
            'rgba(238, 138, 20, 1)',
          ],
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
        },
        {
          label: 'Cash',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(50, 160, 239, 1)',
            'rgba(53, 191, 41, 1)',
            'rgba(255, 152, 152, 1)',
            'rgba(255, 198, 86, 1)',
            'rgba(238, 138, 20, 1)',
          ],
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false,
        },
      ]
    };

    this.assetOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: {
              weight: 500
            }
          },
        },
        y: {
          ticks: {
          },
          grid: {
            drawBorder: false
          }
        }

      }
    };
  }

  getDashboardData() {
    this.apiService.get(ApiEndpoints.getDashboardInfo + `?BranchCode=${this.branchCode}&StoreCode=${this.selectedStore}&ProjectCode=${this.selectedProject}&DateFrom=2023-01-01&DateTo=2023-10-03`).subscribe((res: any) => {
      const dashboardInfo = res.data;
      this.postedVoucher = dashboardInfo.Table[0].PostedVouchers;
      this.unPostedVoucher = dashboardInfo.Table1[0].UnPostedVouchers;
      this.totalSalesCount = dashboardInfo.Table2.length;
      this.totalStockCount = dashboardInfo.Table3.length;
      this.pendingDemandCount = dashboardInfo.Table4.length;
      this.totalSalesAmount = dashboardInfo.Table2.reduce(
        (total: any, sales: any) => total + sales.TotalAmount,
        0
      );
      // for (let i = 0; i < dashboardInfo.Table2.length; i++) {
      //   if (dashboardInfo.Table2[i].SaleTypeCode == 0) {
      //     this.sales.push(dashboardInfo.Table2[i])
      //   }
      //   else if (dashboardInfo.Table2[i].SaleTypeCode == 1) {
      //     this.quotations.push(dashboardInfo.Table2[i])
      //   }
      //   else if (dashboardInfo.Table2[i].SaleTypeCode == 5) {
      //     this.deliveryChallans.push(dashboardInfo.Table2[i])
      //   }
      // }
      this.sales = dashboardInfo.Table2.filter((sale:any) => sale.SaleTypeCode === 0);
      this.quotations = dashboardInfo.Table2.filter((sale:any) => sale.SaleTypeCode === 1);
      this.deliveryChallans = dashboardInfo.Table2.filter((sale:any) => sale.SaleTypeCode === 5);

      this.allSalesAmount =this.sales.reduce( (total: any, sales: any) => total + sales.TotalAmount,0);
      this.allQuotations =this.quotations.reduce((total: any, quotations: any) => total + quotations.TotalAmount,0);
      this.allDeliveryChallans =this.deliveryChallans.reduce((total: any, deliveryChallans: any) => total + deliveryChallans.TotalAmount,0);
      this.currentCurrency = dashboardInfo.Table6[0].Currency
      this.SalesLeads = dashboardInfo.Table7
    })
  }
}
