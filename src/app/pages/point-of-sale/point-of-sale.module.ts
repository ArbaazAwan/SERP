import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointOfSaleRoutingModule } from './point-of-sale-routing.module';
import { ChartModule } from 'primeng/chart';
import { DashBoardVersion1Component } from './dash-board-version1/dash-board-version1.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [DashBoardVersion1Component],
  imports: [
    CommonModule,
    ChartModule,
    PointOfSaleRoutingModule,
    ConfirmDialogModule
    // CardModule,
    // AccordionModule,
    // DialogModule,
  ],
})
export class PointOfSaleModule {}
