import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { TaxConfig, VoucherDetailModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-tax-configuration',
  templateUrl: './tax-configuration.component.html',
  styleUrls: ['./tax-configuration.component.scss'],
})
export class TaxConfigurationComponent implements OnInit {
  isUpdate!: boolean;
  form!: FormGroup;
  taxresponse: Array<TaxConfig> = [];
  isLoadingData: boolean = false;
  accountDescriptionResponse$: any = [];
  selectedAccountCode: any = [];
  detailModel: any = [];
  TaxMAxId: number = 0;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  componentName: string = "Tax Configuration";
  // taxresponse:any=[];
  taxdata: any = [];
  tableLength!: number;
  constructor(
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private fb: FormBuilder,
    private confirmService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      TaxId: this.fb.control('', Validators.required),
      TaxCode: this.fb.control('', Validators.required),
      TaxTitle: this.fb.control('', Validators.required),
      TaxChartOfAccount: this.fb.control('', Validators.required),
      TaxPercentage: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required),
    });


    //=====================Get User Rights =================
    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 21;
    this.apiService.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.loadAllTax();
    this.loadAccountTitle();
    this.LoadTaxMaxID();
  }

  isActive(){
    const isActive = this.form.get('IsActive');
    if (isActive) {
      isActive.setValue(!isActive.value);
    }
  }
  loadAllTax() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetAllTaxes).subscribe((res: any) => {
      this.taxresponse = res;
      this.isLoadingData = false;
    });
  }
  LoadTaxMaxID() {
    this.apiService.get(ApiEndpoints.GetMaxTaxId).subscribe((res) => {
      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
      this.TaxMAxId = +x.TaxId;
    });
  }
  changeACDescription(e: any) {
    this.selectedAccountCode = e.value;
    let x = this.accountDescriptionResponse$.find((x: VoucherDetailModel) => {
      return this.selectedAccountCode == x.AccountCode;
    });
    Object.assign(this.detailModel, x);
  }
  loadAccountTitle() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.accountDescriptionResponse$ = res.data;
    });
  }
  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.taxdata = { ...data };
    this.tableLength = Object.keys(this.taxdata).length;
  }

  delete(TaxId: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DeleteTax + '?TaxId=' + TaxId)
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Tax Configuration Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllTax();
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

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.save();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

 hideErrorPopup() {
    this.loadingerror = false;
  }
  save() {
    let model = this.form.value;
    model.TaxId = this.TaxMAxId;
    this.apiService.post(model, ApiEndpoints.AddTax).subscribe(() => {
      this.loadAllTax();

      this.toastService.sendMessage({
        message: 'Tax Configuration Saved Successfully!',
        type: NotificationType.success,
      });
      this.form.reset();
    });
    this.loadAllTax();
    this.LoadTaxMaxID();
  }
  update() {
    let model = this.form.value;
    this.apiService.update(model, ApiEndpoints.UpdateTax).subscribe(() => {
      this.loadAllTax();
      this.toastService.sendMessage({
        message: 'Tax Configuration Updated Successfully!',
        type: NotificationType.success,
      });

      this.form.reset();
      this.LoadTaxMaxID();
    });
    this.LoadTaxMaxID();
  }
  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllTax();
    // this.loadFinancialYearMaxId();
  }
}
