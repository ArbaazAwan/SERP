import { Component, Input, OnInit } from '@angular/core';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';

@Component({
  selector: 'app-print-slip',
  templateUrl: './print-slip.component.html',
  styleUrls: ['./print-slip.component.scss'],
})
export class PrintSlipComponent implements OnInit {
  saleMan: any;
  invoiceNumber: any;
  lastIndex: number = 0;
  currentDate: any;
  totalNetTotal: any;
  totalQty: any;
  today: number = Date.now();
  remarks: string = '';
  taxAmount: number = 0;
  companyInfo: any;
  cashTenderd: number = 0;
  amountCharged: number = 0;
  Discount: number = 0;
  @Input() invoiceData: any = '';
  saleInvoiceData: [] = [];
  constructor(private apiservice: ApiProviderService) {}

  ngOnInit(): void {
    this.invoiceNumber = localStorage.getItem('SaleInvoiceNo');
    this.saleMan = localStorage.getItem('Username');
    this.getCompanyInfo();
    // setTimeout(() => {
    this.saleInvoiceData = this.invoiceData[0];
    this.remarks = this.invoiceData[1];
    this.taxAmount = this.invoiceData[2];
    this.cashTenderd = this.invoiceData[3];
    this.Discount = this.invoiceData[5];
    this.totalNetTotal = this.saleInvoiceData.reduce(
      (total: any, item: any) => total + item.LineTotal,
      0
    );
    this.totalQty = this.saleInvoiceData.reduce(
      (total: any, item: any) => total + item.Qty,
      0
    );
    this.amountCharged = this.totalNetTotal+this.taxAmount-this.Discount
    // }, 5000);

    setInterval(() => {
      this.today = Date.now();
    }, 1);
  }
  getCompanyInfo(): void {
    this.apiservice
      .get(ApiEndpoints.GetCompanyById + `?CompanyCode=1`)
      .subscribe((res: any) => {
        this.companyInfo = res[0];
      });
  }
}
