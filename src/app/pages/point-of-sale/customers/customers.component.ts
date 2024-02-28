import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  form!: FormGroup;
  customers: any = [];
  customersresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  COAResponse$: any = [];
  selectedCOA!: number;
  globalBranchCode!: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      CNIC: this.fb.control('', Validators.required),
      Name: this.fb.control('', Validators.required),
      Address: this.fb.control('', Validators.required),
      PhoneNo: this.fb.control('', Validators.required),
      CreaditDays: this.fb.control('', Validators.required),
      CreditLimit: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required),
      ItemCode: this.fb.control('', Validators.required),

    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllCustomers();
    this.loadCOAHead();
  }

  loadAllCustomers() {
    this.apiService.get(ApiEndpoints.GetAllCustomers).subscribe((res: any) => {
      this.customersresponse$ = res.data;
    });
  }
  loadCOAHead() {
    this.apiService.get(ApiEndpoints.LoadCOAHeads + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.COAResponse$ = res;
      });
  }

  changeCOA(e: any) {
    this.selectedCOA = e.target.value;
  }
  save() {
    let model = this.form.value;
    this.form.patchValue({
      IsActive: this.form.get('IsActive')?.value === undefined ? false : true,
    });
    model.BranchCode = +localStorage.getItem('BranchCode')!;
    model.CNIC = this.customers.CNIC;
    model.Name = this.customers.Name;
    model.Address = this.customers.Address;
    model.PhoneNo = this.customers.PhoneNo;
    model.CreaditDays = this.customers.CreaditDays;
    model.CreditLimit = this.customers.CreditLimit;
    model.IsActive = this.customers.IsActive;

    if (model.CreditLimit.includes(',')) {
      const CreditLimit = model.CreditLimit.replace(/,/g, '');
      model.CreditLimit = CreditLimit;
    }
    this.apiService.post(model, ApiEndpoints.CreateNewCustomer + `?`)
    .subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Customer Saved Successfully',
        type: NotificationType.success,
      });
      this.loadAllCustomers();
      this.form.reset();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.customers = { ...data };
    this.tableLength = Object.keys(this.customers).length;

    for (const prop in this.customers) {
      if (typeof this.customers[prop] === 'number') {
        this.customers[prop] = this.customers[prop].toLocaleString();
      }
    }
  }
  update() {
    let model = this.form.value;
    model.BranchCode = +localStorage.getItem('BranchCode')!;
    model.CustomerId = this.customers.CustomerId;
    model.CNIC = this.customers.CNIC;
    model.Name = this.customers.Name;
    model.Address = this.customers.Address;
    model.PhoneNo = this.customers.PhoneNo;
    model.CreaditDays = this.customers.CreaditDays;
    model.CreditLimit = this.customers.CreditLimit;
    model.IsActive = this.customers.IsActive;

    if (model.CreditLimit.includes(',')) {
      const CreditLimit = model.CreditLimit.replace(/,/g, '');
      model.CreditLimit = CreditLimit;
    }

    this.apiService.update(model, ApiEndpoints.UpdateCustomer)
    .subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Customer Updated Successfully!',
        type: NotificationType.success,
      });
      this.loadAllCustomers();
    });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(CustomerId: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteCustomer + `?CustomerId=${CustomerId}`)
        .subscribe((res: any) => {
          this.toastService.sendMessage({
            message: 'Customer Delete Successfully!',
            type: NotificationType.deleted,
          });
          this.loadAllCustomers();
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

    this.form.markAsUntouched();
  }

  addorUpdate() {
    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }
  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllCustomers();
  }
}
