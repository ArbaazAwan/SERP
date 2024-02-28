import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountGlRoutingModule } from './account-gl-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';

// import { BalancesheetComponent } from './Reports/balancesheet/balancesheet.component';

@NgModule({
  declarations: [
    // BalancesheetComponent
  ],
  imports: [
    CommonModule,
    AccountGlRoutingModule,
    FormsModule,
    TreeTableModule,
    TableModule,
    TreeModule,
    TreeSelectModule,
    ReactiveFormsModule,
    DropdownModule,
    ConfirmDialogModule,
  ],
})
export class AccountGlModule {}
