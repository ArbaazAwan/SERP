import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-profitloss-subcategory',
  templateUrl: './profitloss-subcategory.component.html',
  styleUrls: ['./profitloss-subcategory.component.scss'],
})
export class ProfitlossSubcategoryComponent implements OnInit {
  form!: FormGroup;
  SubCategory: any = [];
  SubCategoryresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  CategoryResponse$: any = [];
  selectedCategory: any = [];
  MaxSubCategoryId: any = [];
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  componentName: string = "Profit and Loss Subcategory";
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
      CategoryId: this.fb.control('', Validators.required),
      SubCategoryId: this.fb.control('', Validators.required),
      SubCategory: this.fb.control('', Validators.required),
    });

      //=====================Get User Rights =================
      const UserId  = localStorage.getItem('UserId');

      if (UserId !== null) {
        this.UserId = +UserId;
      }
      const ModuleId = 1;
      const FormId = 10;
      this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
        .subscribe((res: any) => {
          this.ModulelistResp$ = res;
        });


    this.loadAllSubCategory();
    this.loadAllCategories();
  }
  changeCategory(e: any) {
    this.selectedCategory = +e.value;
    this.loadMaxSubCategoryId(this.selectedCategory);
  }
  loadAllCategories() {
    this.apiServices.get(ApiEndpoints.getAllCategory).subscribe((res: any) => {
      this.CategoryResponse$ = res;
    });
  }
  loadAllSubCategory() {
    this.isLoadingData = true;

    this.apiServices
      .get(ApiEndpoints.getAllSubCategory)
      .subscribe((res: any) => {
        this.SubCategoryresponse$ = res;
    this.isLoadingData = false;


      });
  }

  loadMaxSubCategoryId(CategoryId: number) {
    this.apiServices
      .get(ApiEndpoints.getMaxSubCategoryCode + '?CategoryId=' + CategoryId)
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.MaxSubCategoryId = +x.SubCategoryId;
      });
  }

  save() {
    let model = this.form.value;
    model.CategoryId = +this.selectedCategory;
    model.SubCategoryId = this.MaxSubCategoryId;
    model.SubCategory = this.SubCategory.SubCategory;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices.post(model, ApiEndpoints.postSubCategory).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Profit/Lose Sub Category Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllSubCategory();
      this.form.reset();
      this.refresh();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.SubCategory = { ...data };
    if (typeof data.CategoryId === 'string') {
      this.SubCategory.CategoryId = data.CategoryId.trim();
    }
    this.tableLength = Object.keys(this.SubCategory).length;
  }

  update() {
    let model = this.form.value;
    model.CategoryId = +this.SubCategory.CategoryId;
    this.apiServices
      .update(model, ApiEndpoints.putSubCategory)
      .subscribe(() => {
        this.loadAllSubCategory();
        this.toastService.sendMessage({
          message: 'Profit/Lose Sub Category Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(CategoryId: number, SubCategoryId: number) {
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
            ApiEndpoints.deleteSubCategory +
              '?CategoryId=' +
              CategoryId +
              '&SubCategoryId=' +
              SubCategoryId
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Profit/Lose Sub Category Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllSubCategory();
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
    this.SubCategory.CategoryId = null;
    this.form.reset();
    this.loadAllSubCategory();
  }
}
