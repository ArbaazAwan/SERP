import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-balance-sheet-category',
  templateUrl: './balance-sheet-category.component.html',
  styleUrls: ['./balance-sheet-category.component.scss'],
})
export class BalanceSheetCategoryComponent implements OnInit {
  form!: FormGroup;
  BalanceSheetCategory: any = [];
  BalanceSheetCategorysresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  componentName: string = "Balance Sheet Category";
  isLoadingData: boolean = false;


  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BalanceSheetCode: this.fb.control('', Validators.required),
      BalanceSheetName: this.fb.control('', Validators.required),
    });
     //=====================Get User Rights =================
     const UserId  = localStorage.getItem('UserId');

     if (UserId !== null) {
       this.UserId = +UserId;
     }
     const ModuleId = 1;
     const FormId = 7;
     this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
       .subscribe((res: any) => {
         this.ModulelistResp$ = res;
       });
    this.loadAllBalanceSheetCategories();
  }

  loadAllBalanceSheetCategories() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllBalanceSheetCategory)
      .subscribe((res: any) => {
        this.BalanceSheetCategorysresponse$ = res;
        this.isLoadingData = false;
      });
    this.loadMaxBalanceSheetCategoryCode();
  }

  loadMaxBalanceSheetCategoryCode() {
    this.apiServices
      .get(ApiEndpoints.getMaxBalanceSheetCode)
      .subscribe((res: any) => {
        this.BalanceSheetCategory.BalanceSheetCode = res[0].BalanceSheetCode;
      });
  }

  save() {
    let model = this.form.value;
    model.BalanceSheetCode = this.BalanceSheetCategory.BalanceSheetCode;
    model.BalanceSheetName = this.BalanceSheetCategory.BalanceSheetName;
    this.apiServices
      .post(model, ApiEndpoints.postBalanceSheetCategory)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Balance Sheet Category Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllBalanceSheetCategories();
        this.form.reset();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.BalanceSheetCategory = { ...data };
    this.tableLength = Object.keys(this.BalanceSheetCategory).length;
  }

  update() {
    let model = this.form.value;
    this.apiServices
      .update(model, ApiEndpoints.putBalanceSheetCategory)
      .subscribe(() => {
        this.loadAllBalanceSheetCategories();
        this.toastService.sendMessage({
          message: 'Balance Sheet Category Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(BalanceSheetCode: number) {
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
            ApiEndpoints.deleteBalanceSheetCategory +
              '?BalanceSheetCode=' +
              BalanceSheetCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Balance Sheet Category Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllBalanceSheetCategories();
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

  // addorUpdate() {
  //   if (!this.isUpdate) {
  //     this.save();
  //   } else {
  //     this.update();
  //   }
  // }
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
    this.loadAllBalanceSheetCategories();
  }
}
