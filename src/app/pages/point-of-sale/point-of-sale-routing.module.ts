import { PurchaseInvoiceDetailComponent } from './purchase-invoice/purchase-invoice-detail/purchase-invoice-detail.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { SaleInvoiceDetailComponent } from './sale-invoice/sale-invoice-detail/sale-invoice-detail.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { PosDashboardComponent } from './pos-dashboard/pos-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/screen/dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { SalesmanComponent } from './salesman/salesman.component';
import { SaleInvoiceListComponent } from './Reports/sale-invoice-list/sale-invoice-list.component';
import { SalesmanWiseComponent } from './Reports/salesman-wise/salesman-wise.component';
import { SalesSummaryComponent } from './Reports/sales-summary/sales-summary.component';
import { ChangePasswordComponent } from 'src/app/screen/change-password/change-password.component';
import { PartySetupComponent } from '../setup-configuration/party-setup/party-setup.component';
import { POSSaleComponent } from './pos-sale/pos-sale.component';
import { DashboardPOSComponent } from './dashboard-pos/dashboard-pos.component';
import { PossaledetailsComponent } from './pos-sale/possaledetails/possaledetails.component';
import { LeadsInfoComponent } from './pre-sales/leads-info/leads-info.component';
import { DocumentsComponent } from './pre-sales/documents/documents.component';
import { DashBoardVersion1Component } from './dash-board-version1/dash-board-version1.component';
import { LeadStatusComponent } from './pre-sales/definition/lead-status/lead-status.component';
import { LeadStagesComponent } from './pre-sales/definition/lead-stages/lead-stages.component';
import { LevelofInterestComponent } from './pre-sales/definition/levelof-interest/levelof-interest.component';
import { LeadsListComponent } from './pre-sales/leads-list/leads-list.component';
import { PreSalesComponent } from './pre-sales/Reports/pre-sales/pre-sales.component';
import { LeadOwnerCustomersComponent } from './pre-sales/definition/lead-owner-customers/lead-owner-customers.component';
import { OppertunityCreationComponent } from './pre-sales/definition/oppertunity-creation/oppertunity-creation.component';
import { AccountManagerComponent } from './pre-sales/pages/point-of-sale/pre-sales/account-manager/account-manager.component';
import { PurchasePaymentDetailComponent } from '../inventory/purchase-payment/purchase-payment-detail/purchase-payment-detail.component';
const routes: Routes = [
  {
    path: '',
    component: PosDashboardComponent,
    children: [
      // pre-sales child routes
      { path: 'lead-stages', component: LeadStagesComponent },
      { path: 'lead-status', component: LeadStatusComponent },
      { path: 'levelof-interest', component: LevelofInterestComponent },
      { path: 'leads-list', component: LeadsListComponent },
      {
        path: 'account-manager-customers',
        component: LeadOwnerCustomersComponent,
      },
      { path: 'opportunities', component: OppertunityCreationComponent },
      { path: 'lead-owner-customers', component: LeadOwnerCustomersComponent },
      { path: 'account-manager', component: AccountManagerComponent },

      // POS Child routes
      { path: 'dashboard-pos', component: DashboardPOSComponent },
      { path: 'dash-board-version1', component: DashBoardVersion1Component },
      { path: 'customers', component: CustomersComponent },
      { path: 'customer', component: PartySetupComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'sales-person', component: SalesmanComponent },
      { path: 'quotation', component: SaleInvoiceComponent },
      { path: 'performa-invoice', component: SaleInvoiceComponent },
      { path: 'sales-invoice', component: SaleInvoiceComponent },
      { path: 'sales-order', component: SaleInvoiceComponent },
      { path: 'delivery-challan', component: SaleInvoiceComponent },
      { path: 'point-of-sale', component: SaleInvoiceComponent },
      { path: 'sale-invoice-detail', component: SaleInvoiceDetailComponent },
      { path: 'quotation-detail', component: SaleInvoiceDetailComponent },
      {
        path: 'performa-invoice-detail',
        component: SaleInvoiceDetailComponent,
      },
      { path: 'sale-order-detail', component: SaleInvoiceDetailComponent },
      {
        path: 'delivery-challan-detail',
        component: SaleInvoiceDetailComponent,
      },
      { path: 'sale-invoice-list', component: SaleInvoiceListComponent },
      { path: 'sales-summary', component: SalesSummaryComponent },
      { path: 'sales-person-wise', component: SalesmanWiseComponent },
      {
        path: 'purchase-payment-detail',
        component: PurchasePaymentDetailComponent,
      },
      { path: 'pos-sale', component: POSSaleComponent },
      { path: 'possaledetails', component: PossaledetailsComponent },
      { path: 'leads-info', component: LeadsInfoComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'pre-sales-reports', component: PreSalesComponent },
    ],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PointOfSaleRoutingModule {}
