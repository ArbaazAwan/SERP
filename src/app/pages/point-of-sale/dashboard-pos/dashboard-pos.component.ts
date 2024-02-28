import { Component, OnInit } from '@angular/core';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
    selector: 'app-dashboard-pos',
    templateUrl: './dashboard-pos.component.html',
    styleUrls: ['./dashboard-pos.component.scss']
})
export class DashboardPOSComponent implements OnInit {
    data: any;
    options: any;
    branchCode: any;
    selectedStore: number = 0;
    selectedProject: number = 0;

    constructor( private storeProjectService: StoreProjectService,) { }

    ngOnInit(): void {
        this.storeProjectService.getSelectedOption().subscribe((option: any) => {
            if (option) {
                this.selectedStore = option.DepartmentCode;
                this.selectedProject = option.ProjectCode;
            }
        });
        this.branchCode = localStorage.getItem('BranchCode')
        //chart-1light colors

        //chart-2 dark colors

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
                    data: [28, 40, 40, 19, 86, 27, 90]
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
    }




}






