import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';


@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit {
  form!: FormGroup;
  Buyer: any = [];
  BuyerResponse$: any = [];
  BuyerMaxCode: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  globalBranchCode!: number;
  globalUserId!: number;

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      BuyerId: this.fb.control('', Validators.required),
      BuyerName: this.fb.control('', Validators.required),
      Description: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required)
    })
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;

    this.LoadAllBuyers();
  }

  loadBuyerMaxCode() {
    this.apiServices.get(ApiEndpoints.GetMaxBuyerId + '?BranchCode=' + this.globalBranchCode).subscribe((res) => {
      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
      this.BuyerMaxCode = +x.BuyerId;
      this.form.get('BuyerId')?.setValue(this.BuyerMaxCode);
    });
  }

  LoadAllBuyers() {
    this.apiServices.get(ApiEndpoints.GetBuyersList + '?BranchCode=' + this.globalBranchCode).subscribe((res: any) => {
      this.BuyerResponse$ = res.data;
    });
    this.loadBuyerMaxCode();
  }

  IsActive() {
    const IsActive = this.form.get('IsActive');
    if (IsActive) {
      IsActive.setValue(!IsActive.value);
    }
  }


  save() {
    this.form.patchValue({
      BranchCode: this.globalBranchCode,
      BuyerId: this.BuyerMaxCode,
      IsActive: this.form.get('IsActive')?.value === undefined ? false : true,
      CreatedBy: this.globalUserId
    });

    let model = this.form.value;
    model.BuyerName = this.Buyer.BuyerName;
    model.Description = this.Buyer.Description;

    this.apiServices.post(model, ApiEndpoints.PostBuyer).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Buyer Saved Successfully!',
        type: NotificationType.success,
      });
      this.LoadAllBuyers();
      this.form.reset();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.Buyer = { ...data };
    this.tableLength = Object.keys(this.Buyer).length;
  }

  update() {
    this.form.patchValue({
      BranchCode: this.globalBranchCode,
      IsActive: this.form.get('IsActive')?.value === undefined ? false : true,
    });

    let model = this.form.value;
    model.ModifiedBy = this.globalUserId;
    this.apiServices
      .update(model, ApiEndpoints.PutBuyer)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Buyer Updated Successfully!',
          type: NotificationType.success,
        });
        this.LoadAllBuyers();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(BuyerId: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(ApiEndpoints.DeleteBuyer + '?BranchCode=' + this.globalBranchCode + '&BuyerId=' + BuyerId)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Buyer Deleted Successfully!',
              type: NotificationType.error,
            });
            this.LoadAllBuyers();
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
    this.LoadAllBuyers();
  }
}
