import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-lead-owner-customers',
  templateUrl: './lead-owner-customers.component.html',
  styleUrls: ['./lead-owner-customers.component.scss']
})
export class LeadOwnerCustomersComponent implements OnInit {
  componentName: string = "Account Manager Customers";
  @Input() displayHeader: any;
  leadOwnerForm!: FormGroup;
  customerResponse$: any = [];
  selectedCustomers: number = 0;
  selectedAccountManager: number = 0
  employeeTableResponse: any = [];
  AccountManagerCode: number = 0;
  PartyCode: number = 0;
  allAccountManagerCustomer$: any = [];
  isLoadingData: boolean = false;
  isUpdate: boolean = false;
  updateModel: any = [];
  customerName: string = '';
  allAccountManagers : any = []
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.leadOwnerForm = this.fb.group({
      CustomerId: this.fb.control('', Validators.required),
      AccountManagerCode: this.fb.control('', Validators.required),
      discountLimit: this.fb.control('', Validators.required),
      visitFrequency: this.fb.control('', Validators.required),
      CustomerName: this.fb.control('', Validators.required),
    });
    this.loadPendingToAssignCustomer();
    this.getAllAccountManagers();
    this.getAllAccountManagerCustomers();
  }
  loadPendingToAssignCustomer() {
    this.apiService.get(ApiEndpoints.GetPendingToAssignCustomers).subscribe((res: any) => {
      this.customerResponse$ = res.data;
    });
  }

  changeCustomers(e: any) {
    this.selectedCustomers = +e.value;
  }

  loadAllEmployee() {
    this.apiService.get(ApiEndpoints.EmployeeSetup)
      .subscribe((res: any) => {
        this.employeeTableResponse = res;
      });
  }

  changeAccountManager(e: any) {
    this.selectedAccountManager = +e.value;
    this.AccountManagerCode = this.selectedAccountManager
    this.getAllAccountManagerCustomers();
  }


  addAccountManagerCustomer(): void {
    this.isLoadingData = true;
    let model = {
      BranchCode: localStorage.getItem('BranchCode'),
      AccountManagerCode: this.leadOwnerForm.controls['AccountManagerCode'].value,
      PartyCode: this.leadOwnerForm.controls['CustomerId'].value,
      Discount: this.leadOwnerForm.controls['discountLimit'].value,
      VisitFrequency: this.leadOwnerForm.controls['visitFrequency'].value,
      CreatedBy: localStorage.getItem('UserId'),
    }
    this.apiService.post(model, ApiEndpoints.AddAccountManagerCustomer).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Account Manager Customers Saved Successfully!',
        type: NotificationType.success,
      });
      this.isLoadingData = false
      this.AccountManagerCode = 0
      this.onRefresh();
    });
  }

  getAllAccountManagerCustomers() {
    this.apiService.get(ApiEndpoints.GetAllAccountManagerCustomer +
      `?AccountManagerCode=${this.AccountManagerCode}&BranchCode=${localStorage.getItem('BranchCode')}`).subscribe((res: any) => {
        this.allAccountManagerCustomer$ = res.data;
      });
  }

  getAllAccountManagers() {
    this.apiService.get(ApiEndpoints.GetAllAccountManagers +
      `?BranchCode=${localStorage.getItem('BranchCode')}`).subscribe((res: any) => {
        this.allAccountManagers = res;
      });
  }

  onRefresh() {
    this.isUpdate = false;
    this.leadOwnerForm.reset();
    this.loadPendingToAssignCustomer();
    this.loadAllEmployee();
    this.getAllAccountManagerCustomers()

  }

  refresh(){
    this.isUpdate = false;
    this.leadOwnerForm.reset();
    this.AccountManagerCode = 0
    this.getAllAccountManagerCustomers()
  }

  updateLeadOwnerCustomer() {
    this.isUpdate = true
    this.updateModel = {
      AccountManagerCode: this.leadOwnerForm.controls['AccountManagerCode'].value,
      PartyCode: this.leadOwnerForm.controls['CustomerId'].value,
      ModifiedBy: localStorage.getItem('UserId'),
      BranchCode: localStorage.getItem('BranchCode'),
      Discount: this.leadOwnerForm.controls['discountLimit'].value,
      VisitFrequency: this.leadOwnerForm.controls['visitFrequency'].value,
    }
    this.apiService
      .update(this.updateModel, ApiEndpoints.UpdateAccountManagerCustomers)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Account Manager Customers Updated Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false
        this.onRefresh();
      });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.leadOwnerForm.controls['AccountManagerCode'].setValue(data.AccountManagerCode);
    this.leadOwnerForm.controls['CustomerId'].setValue(data.PartyCode);
    this.leadOwnerForm.controls['discountLimit'].setValue(data.Discount);
    this.leadOwnerForm.controls['visitFrequency'].setValue(data.VisitFrequency);
    this.leadOwnerForm.controls['CustomerName'].setValue(data.PartyName);
  }

  delete(lead: any) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteAccountManagerCustomers +
            `?BranchCode=${localStorage.getItem('BranchCode')}&AccountManagerCode=${lead.AccountManagerCode}&PartyCode=${lead.PartyCode}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Account Manager Customer Record Deleted Successfully!',
              type: NotificationType.error,
            });
            this.onRefresh();
          });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            console.log('Cancel');
            break;
        }
      },
    });
  }
}
