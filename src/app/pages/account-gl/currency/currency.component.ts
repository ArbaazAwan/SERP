import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { CurrencyModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {
  form!: FormGroup;
  currency: any = [];
  isUpdate!: boolean;
  model!: CurrencyModel[];
  tableLength!: number;
  CurrencyMaxId!: number;
  checkIsPrimary!: boolean;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  isLoadingData: boolean = false;
  componentName: string = "Currency";
  isSticky: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apisevice: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
     if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      CurrencyCode: this.fb.control('', Validators.required),
      CurrencyTitle: this.fb.control('', Validators.required),
      CurrencySerial: this.fb.control('', Validators.required),
      Symbol: this.fb.control('', Validators.required),
      IsPrimaryCurrency: this.fb.control('', Validators.required),
      CreatedBy: this.fb.control('', Validators.required),
      CreatedOn: this.fb.control('', Validators.required),
      ModifiedBy: this.fb.control('', Validators.required),
      ModifiedOn: this.fb.control('', Validators.required),
    });
     //=====================Get User Rights =================
     const UserId  = localStorage.getItem('UserId');

     if (UserId !== null) {
       this.UserId = +UserId;
     }
     const ModuleId = 1;
     const FormId = 6;
     this.apisevice.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
       .subscribe((res: any) => {
         this.ModulelistResp$ = res;
       });

    this.loadAllCurrency();
    this.LoadCurrencyMaxId();
  }
  IsPrimaryCurrency(){
    const IsPrimaryCurrency = this.form.get('IsPrimaryCurrency');
    if (IsPrimaryCurrency) {
      IsPrimaryCurrency.setValue(!IsPrimaryCurrency.value);
    }
  }
  loadAllCurrency() {
    this.isLoadingData = true;
    this.apisevice.get(ApiEndpoints.getAllCurrency).subscribe((res: any) => {
      this.currency = res;
      this.isLoadingData = false;
      this.checkIsPrimary = this.currency.find((x: any) => {
        return x.IsPrimaryCurrency === true;
      });
    });

  }

  LoadCurrencyMaxId() {

    this.apisevice.get(ApiEndpoints.getCurrencyMaxId).subscribe((res) => {

      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
       // this.currency.CurrencyCode = +x.CurrencyCode;
      this.CurrencyMaxId = +x.CurrencyCode;
    });
  }

  save() {

    let user = localStorage.getItem('UserId');
    let branchcode = localStorage.getItem('BranchCode');
    let currentdate = new Date();
    this.form.patchValue({
      CreatedBy: +user!,
      CreatedOn: +currentdate!,
      BranchCode: +branchcode!,
      IsPrimaryCurrency:
        this.form.get('IsPrimaryCurrency')?.value === undefined ? false : true,
      // CurrencyCode: +this.CurrencyMaxId,
    });
    let val = this.form.value;
    this.model = val;
    this.apisevice.post(val, ApiEndpoints.postCurrency).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Currency Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllCurrency();
      this.LoadCurrencyMaxId();
    });
    this.form.markAsUntouched();

  }
  getSelectedRow(data: any) {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.isUpdate = true;
    this.currency = data;
    this.CurrencyMaxId = data.CurrencyCode;
    this.tableLength = Object.keys(this.currency).length;
    this.form.patchValue({
      ModifiedBy: +user!,
      ModifiedOn: currentDate.toLocaleString(),
    });
    this.currency.ModifiedBy = this.form.get('ModifiedBy')?.value;
    this.currency.ModifiedOn = this.form.get('ModifiedOn')?.value;
    this.tableLength = Object.keys(this.currency).length;
  }
  update() {

    this.apisevice
      .update(this.currency, ApiEndpoints.putCurrency)
      .subscribe((res) => {
        this.form.patchValue({
          CurrencyModel: this.currency,
        });
        this.toastService.sendMessage({
          message: 'Currency Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllCurrency();
        this.LoadCurrencyMaxId();
      });
    this.isUpdate = false;
    this.form.markAsUntouched();

  }

  delete(CurrencyCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apisevice
          .delete(ApiEndpoints.deleteCurrency + '?CurrencyCode=' + CurrencyCode)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Currency Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCurrency();
            this.LoadCurrencyMaxId();
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
    this.LoadCurrencyMaxId();
    //this.update();
  }

  ngAfterViewInit() {}
}
