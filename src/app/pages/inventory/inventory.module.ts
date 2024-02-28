import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { CharofItemsComponent } from './charof-items/charof-items.component';
import { TreeTableModule } from 'primeng/treetable';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [CharofItemsComponent   ],
  imports: [
    CommonModule,
    ToastModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    ToolbarModule,
    InventoryRoutingModule,
    TreeTableModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
  ],
})
export class InventoryModule {}
