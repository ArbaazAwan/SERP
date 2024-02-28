import { Component, Input, OnInit } from '@angular/core';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit {
  customerId: number = 0;
  customerDetail: any = '';
  selectedRow: any;
  mainDialog!: boolean;
  isUpdate: boolean = true;
  closeModal: boolean = false;
  @Input() id: any = '';
  constructor(private apiServices: ApiProviderService) {}

  ngOnInit(): void {
    this.customerId = this.id;
    this.getCustomerDetails();
  }
  getCustomerDetails() {
    this.apiServices
      .get(
        ApiEndpoints.LoadAllPartyTypesByPartyCode +
          `?PartyCode=${this.customerId}`
      )
      .subscribe((res: any) => {
        this.customerDetail = res.data[0];
      });
  }
}
