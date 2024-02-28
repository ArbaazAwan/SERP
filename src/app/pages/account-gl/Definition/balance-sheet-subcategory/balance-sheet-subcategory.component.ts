import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-balance-sheet-subcategory',
  templateUrl: './balance-sheet-subcategory.component.html',
  styleUrls: ['./balance-sheet-subcategory.component.scss'],
})
export class BalanceSheetSubcategoryComponent implements OnInit {
  form!: FormGroup;
  SubCategory: any = [];
  SubCategoryresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  CategoryResponse$: any = [];
  selectedCategory: any = [];
  MaxBalanceSheetSubCategoryId: any;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  isLoadingData: boolean = false;
  componentName: string = "Balance Sheet SubCategory";
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
      BalanceSheetCode: this.fb.control('', Validators.required),
      BalanceSheetSubCode: this.fb.control('', Validators.required),
      BalanceSheetSubCategoryName: this.fb.control('', Validators.required),
    });


    //=====================Get User Rights =================
    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 8;
    this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.loadAllCashFlowSubCategory();
    this.loadAllCategories();
  }
  changeCategory(e: any) {
    this.selectedCategory = +e.value;
    this.loadMaxCashFlowSubCategoryId(this.selectedCategory);
  }
  loadAllCategories() {
    this.apiServices
      .get(ApiEndpoints.getAllBalanceSheetCategory)
      .subscribe((res: any) => {
        this.CategoryResponse$ = res;
      });
  }
  // loadAllCashFlowSubCategory(BalanceSheetCode: number) {

  //   this.apiServices
  //     .get(ApiEndpoints.getAllBalanceSheetSubCategory+'?BalanceSheetCode='+
  //     BalanceSheetCode)
  //     .subscribe((res: any) => {
  //       this.SubCategoryresponse$ = res;
  //     });
  // }
  loadAllCashFlowSubCategory() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllBalanceSheetSubCategory)
      .subscribe((res: any) => {
        this.SubCategoryresponse$ = res;
      this.isLoadingData = false;

      });
  }
  loadMaxCashFlowSubCategoryId(BalanceSheetCode: number) {
    this.apiServices
      .get(
        ApiEndpoints.getMaxBalanceSheetSubCode +
          '?BalanceSheetCode=' +
          BalanceSheetCode
      )
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.MaxBalanceSheetSubCategoryId = +x.BalanceSheetSubCode;
      });
  }

  save() {
    let model = this.form.value;
    model.BalanceSheetCode = +this.selectedCategory;
    model.BalanceSheetSubCode = this.MaxBalanceSheetSubCategoryId;
    model.BalanceSheetSubCategoryName =
      this.SubCategory.BalanceSheetSubCategoryName;
    this.apiServices
      .post(model, ApiEndpoints.postBalanceSheetSubCategory)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Balance Sheet Sub Category Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllCashFlowSubCategory();
        this.form.reset();
        this.refresh();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.SubCategory = { ...data };
    if (typeof data.BalanceSheetCode === 'string') {
      this.SubCategory.BalanceSheetCode = data.BalanceSheetCode.trim();
    }
    this.tableLength = Object.keys(this.SubCategory).length;
  }

  update() {
    let model = this.form.value;
    model.BalanceSheetCode = +this.SubCategory.BalanceSheetCode;
    this.apiServices
      .update(model, ApiEndpoints.putBalanceSheetSubCategory)
      .subscribe(() => {
        this.loadAllCashFlowSubCategory();
        this.toastService.sendMessage({
          message: 'Balance Sheet Sub Category Updated Sucessfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(BalanceSheetCode: number, BalanceSheetSubCode: number) {
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
            ApiEndpoints.deleteBalanceSheetSubCategory +
              '?BalanceSheetCode=' +
              BalanceSheetCode +
              '&BalanceSheetSubCode=' +
              BalanceSheetSubCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Balance Sheet Sub Category Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCashFlowSubCategory();
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
    this.SubCategory.BalanceSheetCode = null;
    this.form.reset();
    this.loadAllCashFlowSubCategory();
  }
}
