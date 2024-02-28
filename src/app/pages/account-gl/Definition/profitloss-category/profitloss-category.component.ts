import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-profitloss-category',
  templateUrl: './profitloss-category.component.html',
  styleUrls: ['./profitloss-category.component.scss'],
})
export class ProfitlossCategoryComponent implements OnInit {
  form!: FormGroup;
  plCategory: any = [];
  Plcategorysresponse$: any = [];
  globalBranchCode: number = 0;
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  componentName: string = "Profit and Loss Category";

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
      Category: this.fb.control('', Validators.required),
    });
    this.loadAllCategories();
       //=====================Get User Rights =================
       const UserId  = localStorage.getItem('UserId');

       if (UserId !== null) {
         this.UserId = +UserId;
       }
       const ModuleId = 1;
       const FormId = 9;
       this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
         .subscribe((res: any) => {
           this.ModulelistResp$ = res;
         });

  }

  loadAllCategories() {

    this.isLoadingData = true;

    this.apiServices.get(ApiEndpoints.getAllCategory).subscribe((res: any) => {
      this.Plcategorysresponse$ = res;

    this.isLoadingData = false;

    });
    this.loadMaxCategoryCode();
  }

  loadMaxCategoryCode() {
    this.apiServices
      .get(ApiEndpoints.getMaxCategoryCode)
      .subscribe((res: any) => {
        this.plCategory.CategoryId = res[0].CategoryId;
      });
  }

  save() {
    let model = this.form.value;
    model.CategoryId = this.plCategory.CategoryId;
    model.Category = this.plCategory.Category;
    model.BranchCode = this.globalBranchCode!;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices.post(model, ApiEndpoints.postCategory).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Profit/Loss Category Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllCategories();
      this.form.reset();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.plCategory = { ...data };
    this.tableLength = Object.keys(this.plCategory).length;
  }

  update() {
    let model = this.form.value;
    this.apiServices.update(model, ApiEndpoints.putCategory).subscribe(() => {
      this.loadAllCategories();
      this.toastService.sendMessage({
        message: 'Profit/Loss Category Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(CategoryId: number) {
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
          .delete(ApiEndpoints.deleteCategory + '?CategoryId=' + CategoryId)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Profit/Loss Category Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCategories();
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
    this.loadAllCategories();
  }
}
