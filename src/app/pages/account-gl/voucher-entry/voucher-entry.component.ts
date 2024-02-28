import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VoucherEntryConfig } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-voucher-entry',
  templateUrl: './voucher-entry.component.html',
  styleUrls: ['./voucher-entry.component.scss'],
})
export class VoucherEntryComponent implements OnInit {
  form!: FormGroup;
  voucherEntryConfig: Array<VoucherEntryConfig> = [];
  loadingerror = false;
ModulelistResp$: any = [];
componentName: string = "Voucher Configuration";
UserId:any;
  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      IncludeAssets: [true],
      IncludeParty: [false],
      IncludeEmployee: [false],
      IncludeWorkOrder: [false],
      IncludeCostCentersLevel1: [false],
      IncludeCostCentersLevel2: [false],
      IncludeCostCentersLevel3: [false],
      IncludeFunctions: [false],
      IncludeCashFlowTag1: [true],
      IncludeCashFlowTag2: [false],
    });
        //=====================Get User Rights =================
        const UserId  = localStorage.getItem('UserId');

        if (UserId !== null) {
          this.UserId = +UserId;
        }
        const ModuleId = 1;
        const FormId = 20;
        this.apiService.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
          .subscribe((res: any) => {
            this.ModulelistResp$ = res;
          });


    this.fetchVoucherEntryConfig();
    this.form
      .get('IncludeCostCentersLevel1')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('IncludeCostCentersLevel2')?.enable();
        } else {
          this.form.get('IncludeCostCentersLevel2')?.disable();
          this.form.get('IncludeCostCentersLevel2')?.setValue(false);
        }
      });
    this.form
      .get('IncludeCostCentersLevel2')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.form.get('IncludeCostCentersLevel3')?.enable();
        } else {
          this.form.get('IncludeCostCentersLevel3')?.disable();
          this.form.get('IncludeCostCentersLevel3')?.setValue(false);
        }
      });
    this.form.get('IncludeCashFlowTag1')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('IncludeCashFlowTag2')?.enable();

      } else {
        this.form.get('IncludeCashFlowTag2')?.disable();
        this.form.get('IncludeCashFlowTag2')?.setValue(false);
      }
    });
  }
  IncludeAssets(){
    const IncludeAssets = this.form.get('IncludeAssets');
    if (IncludeAssets) {
      IncludeAssets.setValue(!IncludeAssets.value);
    }
  }
  IncludeParty(){
    const IncludeParty = this.form.get('IncludeParty');
    if (IncludeParty) {
      IncludeParty.setValue(!IncludeParty.value);
    }
  }
  IncludeEmployee(){
    const IncludeEmployee = this.form.get('IncludeEmployee');
    if (IncludeEmployee) {
      IncludeEmployee.setValue(!IncludeEmployee.value);
    }
  }
  IncludeWorkOrder(){
    const IncludeWorkOrder = this.form.get('IncludeWorkOrder');
    if (IncludeWorkOrder) {
      IncludeWorkOrder.setValue(!IncludeWorkOrder.value);
    }
  }
  IncludeCostCentersLevel1(){
    const IncludeCostCentersLevel1 = this.form.get('IncludeCostCentersLevel1');
    if (IncludeCostCentersLevel1) {
      IncludeCostCentersLevel1.setValue(!IncludeCostCentersLevel1.value);
    }
  }
  IncludeCostCentersLevel2(){
    const IncludeCostCentersLevel2 = this.form.get('IncludeCostCentersLevel2');

    if (IncludeCostCentersLevel2) {
      if (!IncludeCostCentersLevel2.disabled) {
        IncludeCostCentersLevel2.setValue(!IncludeCostCentersLevel2.value);
      }
    }

  }
  IncludeCostCentersLevel3(){
    const includeCostCentersLevel3 = this.form.get('IncludeCostCentersLevel3');

    if (includeCostCentersLevel3) {
      if (!includeCostCentersLevel3.disabled) {
        includeCostCentersLevel3.setValue(!includeCostCentersLevel3.value);
      }
    }
  }
  IncludeFunctions(){
    const IncludeFunctions = this.form.get('IncludeFunctions');
    if (IncludeFunctions) {
      IncludeFunctions.setValue(!IncludeFunctions.value);
    }
  }
  IncludeCashFlowTag1(){
    const IncludeCashFlowTag1 = this.form.get('IncludeCashFlowTag1');
    if (IncludeCashFlowTag1) {
      IncludeCashFlowTag1.setValue(!IncludeCashFlowTag1.value);
    }
  }
  IncludeCashFlowTag2(){
    const IncludeCashFlowTag2 = this.form.get('IncludeCashFlowTag2');

    if (IncludeCashFlowTag2) {
      if (!IncludeCashFlowTag2.disabled) {
        IncludeCashFlowTag2.setValue(!IncludeCashFlowTag2.value);
      }
    }

  }
  fetchVoucherEntryConfig() {
    const branchCode = +localStorage.getItem('BranchCode')!;
    this.apiService.get(ApiEndpoints.GetVoucherEntryConfig + `?BranchCode=${branchCode}`)
    .subscribe((res:any) => {
      this.voucherEntryConfig = res;
      this.updateFormWithConfig();
    });
  }


  updateFormWithConfig() {
    let data = this.voucherEntryConfig[0];
    this.form.patchValue({
      IncludeAssets: data.IncludeAssets,
      IncludeParty: data.IncludeParty,
      IncludeEmployee: data.IncludeEmployee,
      IncludeWorkOrder: data.IncludeWorkOrder,
      IncludeCostCentersLevel1: data.IncludeCostCentersLevel1,
      IncludeCostCentersLevel2: data.IncludeCostCentersLevel2,
      IncludeCostCentersLevel3: data.IncludeCostCentersLevel3,
      IncludeFunctions: data.IncludeFunctions,
      IncludeCashFlowTag1: data.IncludeCashFlowTag1,
      IncludeCashFlowTag2: data.IncludeCashFlowTag2,
    });
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

  update() {
    let model = this.form.value;
    model.BranchCode = +localStorage.getItem('BranchCode')!;
    model.IncludeAssets =
      this.form.get('IncludeAssets')?.value === undefined
        ? false
        : this.form.get('IncludeAssets')?.value;
    model.IncludeParty =
      this.form.get('IncludeParty')?.value === undefined
        ? false
        : this.form.get('IncludeParty')?.value;
    model.IncludeEmployee =
      this.form.get('IncludeEmployee')?.value === undefined
        ? false
        : this.form.get('IncludeEmployee')?.value;
    model.IncludeWorkOrder =
      this.form.get('IncludeWorkOrder')?.value === undefined
        ? false
        : this.form.get('IncludeWorkOrder')?.value;
    model.IncludeCostCentersLevel1 =
      this.form.get('IncludeCostCentersLevel1')?.value === undefined
        ? false
        : this.form.get('IncludeCostCentersLevel1')?.value;
    model.IncludeCostCentersLevel2 =
      this.form.get('IncludeCostCentersLevel2')?.value === undefined
        ? false
        : this.form.get('IncludeCostCentersLevel2')?.value;
    model.IncludeCostCentersLevel3 =
      this.form.get('IncludeCostCentersLevel3')?.value === undefined
        ? false
        : this.form.get('IncludeCostCentersLevel3')?.value;
    model.IncludeFunctions =
      this.form.get('IncludeFunctions')?.value === undefined
        ? false
        : this.form.get('IncludeFunctions')?.value;
    model.IncludeCashFlowTag1 =
      this.form.get('IncludeCashFlowTag1')?.value === undefined
        ? false
        : this.form.get('IncludeCashFlowTag1')?.value;
    model.IncludeCashFlowTag2 =
      this.form.get('IncludeCashFlowTag2')?.value === undefined
        ? false
        : this.form.get('IncludeCashFlowTag2')?.value;

    this.apiService.update(model, ApiEndpoints.PutVoucherEntryConfig + `?`)
    .subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Voucher Entry Updated Successfully!',
        type: NotificationType.success,
      });
    });
  }
  onSubmit() {
    const formValue = this.form.value;
  }
}
