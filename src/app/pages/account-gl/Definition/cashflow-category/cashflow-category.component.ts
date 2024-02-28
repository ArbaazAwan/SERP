import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cashflow-category',
  templateUrl: './cashflow-category.component.html',
  styleUrls: ['./cashflow-category.component.scss'],
})
export class CashflowCategoryComponent implements OnInit {
  form!: FormGroup;
  CFCategory: any = [];
  CFcategorysresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  isLoadingData: boolean = false;

loadingerror = false;
ModulelistResp$: any = [];
UserId:any;
componentName: string = "Cash Flow Category";
  isSticky: boolean = false;


  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
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
      CategoryCode: this.fb.control('', Validators.required),
      CategoryName: this.fb.control('', Validators.required),
    });
       //=====================Get User Rights =================
       const UserId  = localStorage.getItem('UserId');

       if (UserId !== null) {
         this.UserId = +UserId;
       }
       const ModuleId = 1;
       const FormId = 11;
       this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
         .subscribe((res: any) => {
           this.ModulelistResp$ = res;
         });
    this.loadAllCashFlowCategories();
  }

  loadAllCashFlowCategories() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllCashFlowCategory)
      .subscribe((res: any) => {
        this.CFcategorysresponse$ = res;
        this.isLoadingData = false;
      });
    this.loadMaxCashFlowCategoryCode();
  }

  loadMaxCashFlowCategoryCode() {
    this.apiServices
      .get(ApiEndpoints.getMaxCashFlowCategoryCode)
      .subscribe((res: any) => {
        this.CFCategory.CategoryCode = res[0].CategoryCode;
      });
  }

  save() {
    let model = this.form.value;
    model.CategoryCode = this.CFCategory.CategoryCode;
    model.CategoryName = this.CFCategory.CategoryName;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices
      .post(model, ApiEndpoints.postCashFlowCategory)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Cashflow Category Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllCashFlowCategories();
        this.form.reset();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.CFCategory = { ...data };
    this.tableLength = Object.keys(this.CFCategory).length;
  }

  update() {
    let model = this.form.value;
    this.apiServices
      .update(model, ApiEndpoints.putCashFlowCategory)
      .subscribe(() => {
        this.loadAllCashFlowCategories();
        this.toastService.sendMessage({
          message: 'Cashflow Category Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(CategoryCode: number) {
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
            ApiEndpoints.deleteCashFlowCategory +
              '?CategoryCode=' +
              CategoryCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Cashflow Category Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCashFlowCategories();
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
    this.loadAllCashFlowCategories();
  }
}
