import { Component, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-dash-board-version1',
  templateUrl: './dash-board-version1.component.html',
  styleUrls: ['./dash-board-version1.component.scss']
})
export class DashBoardVersion1Component implements OnInit {
  data: any;
  options: any;
  message: string = '';

  douData: any;
  douOptions: any;

  assetData: any;
  assetOptions: any;


  constructor() { }

    ngOnInit(): void {

      this.PieChart();
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
        borderWidth: 1
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

        borderWidth: 1
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

        borderWidth: 1
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

          borderWidth: 1
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
            borderWidth: 1
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
}
