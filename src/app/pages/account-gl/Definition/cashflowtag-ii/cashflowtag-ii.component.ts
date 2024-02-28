import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cashflowtag-ii',
  templateUrl: './cashflowtag-ii.component.html',
  styleUrls: ['./cashflowtag-ii.component.scss'],
})
export class CashflowtagIIComponent implements OnInit {
  form!: FormGroup;
  CashFlowTagII: any = [];
  isUpdate!: boolean;
  CashFlowTag2response$: any = [];
  CashFlowTag2: any = [];
  CashFlowTag1Response$: any = [];
  selectedCashFlowTag: any;
  componentName: string = "Cash Flow Tag II";
  isLoadingData: boolean = false;

loadingerror = false;
ModulelistResp$: any = [];
UserId:any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      CashFlowTag1Code: this.fb.control('', Validators.required),
      CashFlowTag2Code: this.fb.control('', Validators.required),
      CashFlowTag2Name: this.fb.control('', Validators.required),
    });
        //=====================Get User Rights =================
        const UserId  = localStorage.getItem('UserId');

        if (UserId !== null) {
          this.UserId = +UserId;
        }
        const ModuleId = 1;
        const FormId = 18;
        this.apiService.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
          .subscribe((res: any) => {
            this.ModulelistResp$ = res;
          });
    this.loadAllCashFlowTag2();
    this.loadAllCashFlowTag1();
  }
  changeCashFlowTag1(e: any) {
    this.selectedCashFlowTag = +e.value;
    this.loadMaxCashFlowTag2Code(this.selectedCashFlowTag);
  }
  loadAllCashFlowTag1() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.getAllCashFlowTag1)
      .subscribe((res: any) => {
        this.CashFlowTag1Response$ = res;
        this.isLoadingData = false;
      });
  }
  loadAllCashFlowTag2() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.getAllCashFlowTag2)
      .subscribe((res: any) => {
        this.CashFlowTag2response$ = res;
    this.isLoadingData = false;

      });
  }

  loadMaxCashFlowTag2Code(CashFlowTag1Code: number) {
    this.apiService
      .get(
        ApiEndpoints.getMaxCashFlowTag2Code +
          '?CashFlowTag1Code=' +
          CashFlowTag1Code
      )
      .subscribe((res: any) => {
        this.CashFlowTagII.CashFlowTag2Code = res[0].CashFlowTag2Code;
      });
  }

  save() {
    let model = this.form.value;
    model.CashFlowTag1Code = this.selectedCashFlowTag;
    model.CashFlowTag2Code = this.CashFlowTagII.CashFlowTag2Code;
    model.CashFlowTag2Name = this.CashFlowTagII.CashFlowTag2Name;

    this.apiService.post(model, ApiEndpoints.postCasgFlowTag2).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Cashflow Tag II Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllCashFlowTag2();
      this.refresh();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.CashFlowTagII = { ...data };
    // this.tableLength = Object.keys(this.CFCategory).length;
  }

  update() {
    let model = this.form.value;
    model.CashFlowTag1Code = this.CashFlowTagII.CashFlowTag1Code;
    this.apiService
      .update(model, ApiEndpoints.putCashFlowTag2)
      .subscribe(() => {
        this.loadAllCashFlowTag2();
        this.toastService.sendMessage({
          message: 'Cashflow Tag II Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.refresh();
  }

  delete(CashFlowTag1Code: number, CashFlowTag2Code: number) {
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
          .delete(
            ApiEndpoints.deleteCasgFlowTag2 +
              '?CashFlowTag1Code=' +
              CashFlowTag1Code +
              '&CashFlowTag2Code=' +
              CashFlowTag2Code
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Cashflow Tag II Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCashFlowTag2();
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
  refresh() {
    this.isUpdate = false;
    this.CashFlowTagII.CashFlowTag1Code = null;
    this.form.reset();
  }
}
