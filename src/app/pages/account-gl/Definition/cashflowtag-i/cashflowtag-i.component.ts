import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cashflowtag-i',
  templateUrl: './cashflowtag-i.component.html',
  styleUrls: ['./cashflowtag-i.component.scss'],
})
export class CashflowtagIComponent implements OnInit {
  form!: FormGroup;
  CashFlowTag1: any = [];
  CashFlowTag1response$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
ModulelistResp$: any = [];
UserId:any;
componentName: string = "Cash Flow Tag I";
isLoadingData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      CashFlowTag1Code: this.fb.control('', Validators.required),
      CashFlowTag1Name: this.fb.control('', Validators.required),
    });
       //=====================Get User Rights =================
       const UserId  = localStorage.getItem('UserId');

       if (UserId !== null) {
         this.UserId = +UserId;
       }
       const ModuleId = 1;
       const FormId = 17;
       this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
         .subscribe((res: any) => {
           this.ModulelistResp$ = res;
         });

    this.loadAllCashFlowTag1();
  }

  loadAllCashFlowTag1() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllCashFlowTag1)
      .subscribe((res: any) => {
        this.CashFlowTag1response$ = res;
        this.isLoadingData = false;
      });
    this.loadMaxCashFlowTag1Code();
  }

  loadMaxCashFlowTag1Code() {
    this.apiServices
      .get(ApiEndpoints.getMaxCashFlowTag1Code)
      .subscribe((res: any) => {
        this.CashFlowTag1.CashFlowTag1Code = res[0].CashFlowTag1Code;
      });
  }

  save() {
    let model = this.form.value;
    model.CashFlowTag1Code = this.CashFlowTag1.CashFlowTag1Code;
    model.CashFlowTag1Name = this.CashFlowTag1.CashFlowTag1Name;
    this.apiServices
      .post(model, ApiEndpoints.postCasgFlowTag1)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Cashflow Tag I Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllCashFlowTag1();
        this.form.reset();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.CashFlowTag1 = { ...data };
    this.tableLength = Object.keys(this.CashFlowTag1).length;
  }

  update() {
    let model = this.form.value;
    this.apiServices
      .update(model, ApiEndpoints.putCasgFlowTag1)
      .subscribe(() => {
        this.loadAllCashFlowTag1();
        this.toastService.sendMessage({
          message: 'Cash Flow Tag I Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(CashFlowTag1Code: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(
            ApiEndpoints.deleteCasgFlowTag1 +
              '?CashFlowTag1Code=' +
              CashFlowTag1Code
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Cashflow Tag I Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCashFlowTag1();
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
    this.form.reset();
    this.loadAllCashFlowTag1();
  }
}
