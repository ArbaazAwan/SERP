import { Component, OnInit } from '@angular/core';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';

@Component({
  selector: 'app-budget-variance',
  templateUrl: './budget-variance.component.html',
  styleUrls: ['./budget-variance.component.scss'],
})
export class BudgetVarianceComponent implements OnInit {
  componentName: string = 'Budget Variance';
  isSticky!: boolean;
  data1: any;
  data: any;
  options: any;
  lineChart: any;
  barChart: any;
  doughnutChart: any;
  radarChart: any;
  polarChart: any;
  budgetVarianceList: any;
  loading: boolean= false;
  chartData: any;

  constructor(private _apiService: ApiProviderService,
    private _reportService: GlReportsService,) {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.loadBudjetVarianceData();
    //Line Chart
    this.lineChart = {
      title: {
        display: true,
        text: 'Budget and Expense Chart',
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Budget Cycle Title',
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Amount',
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        enabled: true,
        mode: 'x',
      },
    };
    //Bar Chart
    this.barChart = {
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
    //Doughnut Chart
    this.doughnutChart = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
    //Radar Chart
    this.radarChart = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary,
          },
          pointLabels: {
            color: textColorSecondary,
          },
        },
      },
    };
    //PolarChart
    this.polarChart = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
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

  loadBudjetVarianceData() {
    //GetAllBudgetVariance
    this._apiService
      .get(ApiEndpoints.GetAllBudgetVariance)
      .subscribe((res: any) => {
        this.budgetVarianceList = res;
        this.chartData = {
          labels: this.budgetVarianceList.map(
            (item: any) => item.BudgetCycleTitle
          ),
          datasets: [
            {
              label: 'Budget Amount',
              data: this.budgetVarianceList.map(
                (item: any) => item.BudgetAmount
              ),
            },
            {
              label: 'Expense Amount',
              data: this.budgetVarianceList.map(
                (item: any) => item.ExpenseAmount
              ),
            },
            {
              label: 'Variance Amount',
              data: this.budgetVarianceList.map(
                (item: any) => item.VarianceAmount
              ),
            },
          ],
        };
      });
  }

  //--------------------------------------------------Print Information------------------------------------------------
  printVoucherReport() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let BranchName = localStorage.getItem('BranchName')!;
    this.loading = true;
    this._reportService
      .GetBudgetVarianceReportData(BranchName , BranchCode)
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
}
