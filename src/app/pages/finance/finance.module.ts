import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FinanceRoutingModule } from './finance-routing.module';
import { AssetsIdentificationComponent } from './assets-identification/assets-identification.component';




@NgModule({
  declarations: [AssetsIdentificationComponent],
  imports: [CommonModule, FinanceRoutingModule, TableModule],
})
export class FinanceModule {}
