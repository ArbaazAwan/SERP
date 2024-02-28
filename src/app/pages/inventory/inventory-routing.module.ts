import { StoreIssuanceDetailComponent } from './store-issuance/store-issuance-detail/store-issuance-detail.component';
import { StoreIssuanceComponent } from './store-issuance/store-issuance.component';
import { GoodReceiptNoteDetailComponent } from './good-receipt-note/good-receipt-note-detail/good-receipt-note-detail.component';
import { GoodReceiptNoteComponent } from './good-receipt-note/good-receipt-note.component';
import { PurchaseOrderDetailComponent } from './purchase-order-master/purchase-order-detail/purchase-order-detail.component';
import { PurchaseOrderMasterComponent } from './purchase-order-master/purchase-order-master.component';
import { DepartmentLocationComponent } from '../inventory/department-location/department-location.component';
import { DepartmentComponent } from './department/department.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/screen/dashboard/dashboard.component';
import { ItemChartComponent } from './item-chart/item-chart.component';
import { DepartmentalDemandComponent } from '../inventory/departmental-demand/departmental-demand.component';
import { DemandMasterComponent } from '../inventory/departmental-demand/demand-master/demand-master.component';
import { PurchaseRequsitionMasterComponent } from '../inventory/purchase-requsition-master/purchase-requsition-master.component';
import { PurchaseRequsitionDetailComponent } from '../inventory/purchase-requsition-master/purchase-requsition-detail/purchase-requsition-detail.component';
import { InwardGatepassComponent } from './inward-gatepass/inward-gatepass.component';
import { InwardGatepassDetailComponent } from './inward-gatepass/inward-gatepass-detail/inward-gatepass-detail.component';
import { StockReportsComponent } from './Reports/stock-reports/stock-reports.component';
import { TransactionReportsComponent } from './Reports/transaction-reports/transaction-reports.component';
import { ItemReportsComponent } from './Reports/item-reports/item-reports.component';
import { ItemLedgerReportsComponent } from './Reports/item-ledger-reports/item-ledger-reports.component';
import { StockRateComponent } from './Reports/stock-rate/stock-rate.component';
import { StockImgComponent } from './Reports/stock-img/stock-img.component';
import { PendingDemandComponent } from './Reports/pending-demand/pending-demand.component';
import { PrlistReportComponent } from './Reports/prlist-report/prlist-report.component';
import { PendingPoPrReportComponent } from './Reports/pending-po-pr-report/pending-po-pr-report.component';
import { DemandListComponent } from './Reports/demand-list/demand-list.component';
import { UnlockedDemandComponent } from './Reports/unlocked-demand/unlocked-demand.component';
import { UnlockedPRComponent } from './Reports/unlocked-pr/unlocked-pr.component';
import { PolistReportComponent } from './Reports/polist-report/polist-report.component';
import { PendingtoReceivedComponent } from './Reports/pendingto-received/pendingto-received.component';
import { IssuanceListItemComponent } from './Reports/issuance-list-item/issuance-list-item.component';
import { GrnListComponent } from './Reports/grn-list/grn-list.component';
import { ChangePasswordComponent } from 'src/app/screen/change-password/change-password.component';
import { PartySetupComponent } from '../setup-configuration/party-setup/party-setup.component';
import { OutwardGatepassComponent } from './outward-gatepass/outward-gatepass.component';
import { OutwardGatepassDetailComponent } from './outward-gatepass/outward-gatepass-detail/outward-gatepass-detail.component';
import { CharofItemsComponent } from './charof-items/charof-items.component';
import { NewChartofitemComponent } from './new-chartofitem/new-chartofitem.component';
import { DepartmentTypeComponent } from './department-type/department-type.component';
import { IssuanceReturnComponent } from './issuance-return/issuance-return.component';
import { IssuanceReturnDetailComponent } from './issuance-return/issuance-return-detail/issuance-return-detail.component';
import { StoreComponent } from './store/store.component';
import { PurchasePaymentComponent } from './purchase-payment/purchase-payment.component';
import { PurchasePaymentDetailComponent } from './purchase-payment/purchase-payment-detail/purchase-payment-detail.component';
import { PurchaseInvoiceComponent } from '../point-of-sale/purchase-invoice/purchase-invoice.component';
import { PurchaseInvoiceDetailComponent } from '../point-of-sale/purchase-invoice/purchase-invoice-detail/purchase-invoice-detail.component';
import { ComparativeStatementComponent } from './comparative-statement/comparative-statement.component';
import { ComparativeStatementDetailsComponent } from './comparative-statement-details/comparative-statement-details.component';
import { PurchaseRequsitionTypeComponent } from './purchase-requsition-type/purchase-requsition-type.component';
import { PurchaseOrderTypeComponent } from './purchase-order-type/purchase-order-type.component';
import { InspectionReceiptNoteComponent } from './inspection-receipt-note/inspection-receipt-note.component';
import { InspectionReceiptNoteDetailsComponent } from './inspection-receipt-note/inspection-receipt-note-details/inspection-receipt-note-details.component';


const routes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },

  {
    path: '',
    component: InventoryDashboardComponent,
    children: [
      {
        path: 'department-type',
        component: DepartmentTypeComponent,
      },
      {
        path: 'item-chart',
        component: ItemChartComponent,
      },
      {
        path: 'chartof-item',
        component: CharofItemsComponent
      },
      {
        path: 'party-setup',
        component: PartySetupComponent,
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      },
      {
        path: 'department',
        component: DepartmentComponent,
      },
      {
        path: 'store',
        component: StoreComponent
      },
      {
        path: 'new-chartofitem',
        component: NewChartofitemComponent,
      },
      {
        path: 'department-location',
        component: DepartmentLocationComponent,
      },
      {
        path: 'demand',
        component: DemandMasterComponent,
      },
      {
        path: 'departmental-demand',
        component: DepartmentalDemandComponent,
      },
      {
        path: 'purchase-requsition',
        component: PurchaseRequsitionMasterComponent,
      },
      {
        path: 'purchase-requsition-detail',
        component: PurchaseRequsitionDetailComponent,
      },
      {
        path: 'inward-gatepass',
        component: InwardGatepassComponent,
      },
      {
        path: 'inward-gatepass-detail',
        component: InwardGatepassDetailComponent,
      },
      {
        path: 'issuance-return',
        component: IssuanceReturnComponent,
      },
      {
        path: 'issuance-return-detail',
        component: IssuanceReturnDetailComponent,
      },
      {
        path: 'outward-gatepass',
        component: OutwardGatepassComponent,
      },
      {
        path: 'outward-gatepass-detail',
        component: OutwardGatepassDetailComponent,
      },
      {
        path: 'purchase-order',
        component: PurchaseOrderMasterComponent,
      },
      {
        path: 'purchase-order-detail',
        component: PurchaseOrderDetailComponent,
      },
      {
        path: 'good-receipt-note',
        component: GoodReceiptNoteComponent,
      },
      {
        path: 'stock-reports',
        component: StockReportsComponent,
      },
      {
        path: 'transaction-reports',
        component: TransactionReportsComponent,
      },
      {
        path: 'item-reports',
        component: ItemReportsComponent,
      },
      {
        path: 'item-ledger-reports',
        component: ItemLedgerReportsComponent,
      },
      {
        path: 'good-receipt-note-detail',
        component: GoodReceiptNoteDetailComponent,
      },
      {
        path: 'stock-rate',
        component: StockRateComponent,
      },
      {
        path: 'stock-img',
        component: StockImgComponent,
      },
      {
        path: 'store-issuance',
        component: StoreIssuanceComponent,
      },
      {
        path: 'store-issuance-detail',
        component: StoreIssuanceDetailComponent,
      },

      { path: 'demand-list', component: DemandListComponent },
      {
        path: 'pending-demand',
        component: PendingDemandComponent,
      },
      {
        path: 'unlocked-demand',
        component: UnlockedDemandComponent,
      },
      {
        path: 'prlist-report',
        component: PrlistReportComponent,
      },
      {
        path: 'pending-po-pr-report',
        component: PendingPoPrReportComponent,
      },
      {
        path: 'unlocked-pr',
        component: UnlockedPRComponent,
      },
      {
        path: 'polist-report',
        component: PolistReportComponent,
      },
      {
        path: 'pendingto-received',
        component: PendingtoReceivedComponent,
      },
      {
        path: 'issuance-list-item',
        component: IssuanceListItemComponent,
      },
      {
        path: 'grn-list',
        component: GrnListComponent,
      },
      { 
        path: 'purchase-invoice', 
        component: PurchaseInvoiceComponent 
      },
      { 
        path: 'purchase-invoice-detail', 
        component: PurchaseInvoiceDetailComponent 
      },
      {
        path: 'purchase-payment',
        component: PurchasePaymentComponent
      },
      {
        path: 'purchase-payment-detail',
        component: PurchasePaymentDetailComponent
      },
      {
        path: 'comparative-statement',
        component: ComparativeStatementComponent
      },
      {
        path: 'comparative-statement-details',
        component: ComparativeStatementDetailsComponent
      },
      {
        path: 'pr-type',
        component: PurchaseRequsitionTypeComponent
      },
      {
        path: 'po-type',
        component: PurchaseOrderTypeComponent
      },
      {
        path: 'inspection-reciept-note',
        component: InspectionReceiptNoteComponent
      },
      {
        path: 'inspection-reciept-note-details',
        component: InspectionReceiptNoteDetailsComponent
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule { }
