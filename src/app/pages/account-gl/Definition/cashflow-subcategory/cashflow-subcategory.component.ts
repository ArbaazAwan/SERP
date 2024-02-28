import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cashflow-subcategory',
  templateUrl: './cashflow-subcategory.component.html',
  styleUrls: ['./cashflow-subcategory.component.scss'],
})
export class CashflowSubcategoryComponent implements OnInit {
  form!: FormGroup;
  SubCategory: any = [];
  SubCategoryresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  CategoryResponse$: any = [];
  selectedCategory: any = [];
  MaxCashFlowSubCategoryId: any;
  loadingerror = false;
ModulelistResp$: any = [];
UserId:any;
componentName: string = "Cash Flow Subcategory";
isLoadingData: boolean = false;
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
      SubCategoryCode: this.fb.control('', Validators.required),
      SubCategoryName: this.fb.control('', Validators.required),
    });
    //=====================Get User Rights =================
    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 12;
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
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllCashFlowCategory)
      .subscribe((res: any) => {
        this.CategoryResponse$ = res;
        this.isLoadingData = false;
      });
  }
  loadAllCashFlowSubCategory() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllCashFlowSubCategory)
      .subscribe((res: any) => {
        this.SubCategoryresponse$ = res;
        this.isLoadingData = false;
      });
  }

  // loadMaxSubCategoryId() {
  //   this.apiServices.getMaxCashFlowSubCategoryCode().subscribe((res: any) => {
  //     this.SubCategory.SubCategoryCode = res[0].SubCategoryCode;
  //   });
  // }
  loadMaxCashFlowSubCategoryId(CategoryCode: number) {
    this.apiServices
      .get(
        ApiEndpoints.getMaxCashFlowSubCategoryCode +
          '?CategoryCode=' +
          CategoryCode
      )
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.MaxCashFlowSubCategoryId = +x.SubCategoryCode;
      });
  }

  save() {
    let model = this.form.value;
    model.CategoryCode = +this.selectedCategory;
    model.SubCategoryCode = this.MaxCashFlowSubCategoryId;
    model.SubCategoryName = this.SubCategory.SubCategoryName;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices
      .post(model, ApiEndpoints.postCashFlowSubCategory)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Cashflow Sub Category Saved Successfully!',
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
    if (typeof data.CategoryCode === 'string') {
      this.SubCategory.CategoryCode = data.CategoryCode.trim();
    }
    this.tableLength = Object.keys(this.SubCategory).length;
  }

  update() {
    let model = this.form.value;
    model.CategoryCode = +this.SubCategory.CategoryCode;
    this.apiServices
      .update(model, ApiEndpoints.putCashFlowSubCategory)
      .subscribe(() => {
        this.loadAllCashFlowSubCategory();
        this.toastService.sendMessage({
          message: 'Cashflow Sub Category Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(CategoryCode: number, SubCategoryCode: number) {
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
            ApiEndpoints.deleteCashFlowSubCategory +
              '?CategoryCode=' +
              CategoryCode +
              '&SubCategoryCode=' +
              SubCategoryCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Cashflow Sub Category Deleted Sucessfully!',
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
    this.SubCategory.CategoryCode = null;
    this.form.reset();
    this.loadAllCashFlowSubCategory();
  }
}
