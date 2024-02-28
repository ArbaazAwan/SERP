import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ChartOfAccountModel } from '../../../_shared/model/model';
import { ChartaccountSetupService } from 'src/app/_shared/services/chartaccount-setup.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { chdir } from 'process';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';

@Component({
  selector: 'app-account-chart',
  templateUrl: './account-chart.component.html',
  styleUrls: ['./account-chart.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AccountChartComponent implements OnInit {
  productDialog!: boolean;
  submitted!: boolean;
  globalUser: number = 0;
  parentCode: any = [];
  selectedParentCode!: string;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Chart Of Account';

  categories$: Array<any> = [];
  subCategories$: Array<any> = [];
  cashCategories$: Array<any> = [];
  cashSubCategories$: Array<any> = [];

  selectedCategoryId: number = 0;
  selectedSubCategoryId: number = 0;
  selectedCashCategoryId: number = 0;
  selectedCashSubCategoryId: number = 0;
  selectedBalanceSheetNoteId: number = 0;
  form!: FormGroup;
  isUpdate!: boolean;
  header!: string;
  saveorUpdate!: string;
  selectedLevelCode: number = 0;
  showLoader = false;
  chartResponse2!: TreeNode[];
  chartResponse$!: ChartOfAccountModel[];
  chart$: any = [];
  @ViewChild('dt') dt!: any;

  BalanceSheetCategory$: any = [];
  BalanceSheetSubCategory$: any = [];

  selectBalanceSheetCategory: number = 0;
  selectBalanceSheetSubCategory: number = 0;
  BalanceSheetNote$: any = [];
  selectBalanceSheetNote: any;

  AcountCodeMaxId!: number;
  // HasDetail and is details
  HasDetail = true;
  IsDetail = false;
  constructor(
    private productService: ChartaccountSetupService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      ParentAccountCode: this.fb.control(''),
      AccountCode: this.fb.control(''),
      AccountName: this.fb.control(''),
      CategoryId: this.fb.control(0),
      SubCategoryId: this.fb.control(0),
      CashCategoryCode: this.fb.control(0),
      CashSubCategoryCode: this.fb.control(0),
      // CashFlowCategory: this.fb.control(0),
      // CashFlowSubCategory: this.fb.control(0),
      BalanceSheetCode: this.fb.control(0),
      BalanceSheetSubCode: this.fb.control(0),
      BalanceSheetNoteCode: this.fb.control(0),
      IsDetail: this.fb.control(''),
      HasDetail: this.fb.control(''),
      IsActive: this.fb.control(''),
    });

    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 5;
    this.apiService
      .get(
        ApiEndpoints.GetUserFormRights +
          '?UserId=' +
          UserId +
          '&ModuleId=' +
          ModuleId +
          '&FormId=' +
          FormId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });

    this.globalUser = +localStorage.getItem('UserId')!;
    this.loadAllChartofAccount();
    this.loadAllParentCode();
    this.loadAllCategories();
    this.loadAllCashCategories();
    this.loadAllBalanceSheetCategory();
  }

  // checkbox clicked event
  hasDetail() {
    // this.form.get('HasDetail')?.setValue(true);
    const hasDetailControl = this.form.get('HasDetail');
    if (hasDetailControl) {
      hasDetailControl.setValue(!hasDetailControl.value);
    }
  }
  isActive() {
    const hasDetailControl = this.form.get('IsActive');
    if (hasDetailControl) {
      hasDetailControl.setValue(!hasDetailControl.value);
    }
  }
  isDetail() {
    const hasDetailControl = this.form.get('IsDetail');
    if (hasDetailControl) {
      hasDetailControl.setValue(!hasDetailControl.value);
    }
  }
  ngAfterContentChecked() {
    this.ref.detectChanges(); 
  }
  // ===Balance Sheet===
  changeBalanceSheetCategory(e: any) {
    this.selectBalanceSheetCategory = +e.value;
    this.loadAllBalanceSheetSubCategory(this.selectBalanceSheetCategory);
  }
  loadAllBalanceSheetCategory() {
    this.apiService
      .get(ApiEndpoints.getAllBalanceSheetCategory)
      .subscribe((res: any) => {
        this.BalanceSheetCategory$ = res;
      });
  }

  changeBalanceSheetSubCategory(e: any) {
    this.selectBalanceSheetSubCategory = +e.value;
    this.loadAllBalanceSheetNote(this.selectBalanceSheetSubCategory);
  }
  loadAllBalanceSheetSubCategory(BalanceSheetCode: number) {
    this.apiService
      .get(
        ApiEndpoints.GetBalanceSheetSubCategorybyCode +
          `?BalanceSheetCode=${BalanceSheetCode}`
      )
      .subscribe((res: any) => {
        this.BalanceSheetSubCategory$ = res;
      });
  }
  changeBalanceSheetNoteId(e: any) {
    this.selectBalanceSheetNote = +e.value;
  }

  loadAllBalanceSheetNote(BalanceSheetCode: number) {
    this.apiService
      .get(
        ApiEndpoints.GetCodeBalanceSheetNote +
          `?BalanceSheetNoteCode=${BalanceSheetCode}`
      )
      .subscribe((res: any) => {
        this.BalanceSheetNote$ = res;
      });
  }
  // ====balance sheet===
  loadAllCategories() {
    this.apiService
      .get(ApiEndpoints.LoadChartOfAccountCategories)
      .subscribe((res: any) => {
        this.categories$ = res;
      });
  }

  changeCategoryId(event: any) {
    this.selectedCategoryId = +event.value;
    this.loadSubCategoryId(this.selectedCategoryId);
  }

  loadAllCashCategories() {
    this.apiService
      .get(ApiEndpoints.GetCashFlowCategories)
      .subscribe((res: any) => {
        this.cashCategories$ = res;
      });
  }

  changeCashCategoryId(event: any) {
    this.selectedCashCategoryId = +event.value;
    this.loadCashSubCategoryId(this.selectedCashCategoryId);
  }

  loadCashSubCategoryId(id: number) {
    this.apiService
      .get(ApiEndpoints.GetCashFlowSubCategories + `?CategoryCode=${id}`)
      .subscribe((res: any) => {
        this.cashSubCategories$ = res;
      });
  }

  changeCashSubCategoryId(event: any) {
    this.selectedCashSubCategoryId = +event.value;
  }

  loadSubCategoryId(id: number) {
    this.apiService
      .get(ApiEndpoints.LoadChartOfAccountSubCategories + `?CategoryId=${id}`)
      .subscribe((res: any) => {
        this.subCategories$ = res;
      });
  }

  changeSubCategoryId(event: any) {
    this.selectedSubCategoryId = +event.value;
  }

  loadAllChartofAccount() {
    // this.productService.getAllChartofAccount().subscribe((res: any) => {
    //   this.chartResponse$ = res;
    // });
    this.apiService
      .get(ApiEndpoints.GetChartOfAccountsTree)
      .subscribe((res: any) => {
        this.chartResponse2 = res;
        this.chartResponse2 = this.transformDatatree(res);
      });
  }

  loadAllParentCode() {
    this.apiService.get(ApiEndpoints.GetParentAccountCode).subscribe((res) => {
      this.parentCode = res;
    });
  }

  loadLevelCode(ParentAccountCode: string) {
    this.apiService
      .get(
        ApiEndpoints.GetNewAccountLevelCode +
          `?ParentAccountCode=${ParentAccountCode}`
      )
      .subscribe((res) => {
        this.selectedLevelCode = +JSON.stringify(res);
      });
  }
  changeParentCode(event: any) {
    this.selectedParentCode = event?.value;
    this.loadLevelCode(this.selectedParentCode);
    this.loadGetMaxAccountCode(this.selectedParentCode);
  }

  loadGetMaxAccountCode(ParentAccountCode: string) {
    ParentAccountCode = ParentAccountCode.replace(/-/g, '');
    this.apiService
      .get(
        ApiEndpoints.GetMaxAccountCode +
          '?ParentAccountCode=' +
          ParentAccountCode
      )
      .subscribe((res: any) => {
        this.chart$.AccountCode = res.AccountCode;
      });
  }

  openNew() {
    this.form.reset();
    this.header = 'Add Chart of Account';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialog = true;
    this.isUpdate = false;
    this.subCategories$.length = 0;
    this.loadAllParentCode();
    this.selectedParentCode = '0';
  }

  PrintReport() {
    this.showLoader = true;
    ///TBD--------------------------------------------
    this.productService.printChartOfAccountsReport().subscribe((pdf: any) => {
      const file = new Blob([pdf], {
        type: 'application/pdf',
      });
      this.showLoader = false;
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }

  editProduct(data: any) {
    this.header = 'Update Chart of Account';
    this.saveorUpdate = 'Update';
    this.chart$ = { ...data };
    this.loadCashSubCategoryId(data.CashSubCategoryCode);
    this.loadSubCategoryId(data.CategoryId);
    this.loadAllBalanceSheetSubCategory(data.BalanceSheetCode);
    this.loadAllBalanceSheetNote(data.BalanceSheetSubCode);
    this.productDialog = true;
    this.isUpdate = true;
  }

  deleteProduct(id: string) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DeleteChartOfAccount + '?', { AccountCode: id })
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Account Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllChartofAccount();
          });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.form.reset();
    this.isUpdate = false;
  }

  // addorUpdate() {
  //   if (!this.isUpdate) {
  //     this.saveProduct();
  //   } else {
  //     this.updateChartOfAccount();
  //   }
  // }

  addorUpdate() {
    if (this.saveorUpdate == 'Save') {
      this.add();
    } else {
      this.updateAllow();
    }
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.saveProduct();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.updateChartOfAccount();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  updateChartOfAccount() {
    this.chart$.ModifiedBy = this.globalUser;
    this.apiService
      .update(this.chart$, ApiEndpoints.UpdateChartOfAccount + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Chart of Account Updated Successfully!',
          type: NotificationType.success,
        });
        this.hideDialog();
        this.loadAllChartofAccount();
      });
  }

  saveProduct() {
    const model = this.form.value;
    let accCode;
    model.ParentAccountCode = this.selectedParentCode || '0';
    const parentCode = model.ParentAccountCode.replace(/-/g, '');
    if (model.ParentAccountCode !== '0') {
      model.AccountCodeWithSeperator = model.ParentAccountCode.concat(
        '-',
        model.AccountCode
      );
    } else {
      model.AccountCodeWithSeperator = model.AccountCode;
    }
    if (model.ParentAccountCode === '0') {
      accCode = model.AccountCode;
    } else {
      accCode = parentCode.concat(model.AccountCode);
    }
    model.IsDetail = this.chart$.IsDetail || false;
    // model.HasDetail = this.chart$.IsDetail || false;
    model.HasDetail = this.form.get('HasDetail')?.value || false;
    model.IsActive = this.form.get('IsActive')?.value || false;
    model.AccountCode = accCode;
    model.LevelCode = this.selectedLevelCode;
    model.CashCategoryCode = this.selectedCashCategoryId;
    model.CashSubCategoryCode = this.selectedCashSubCategoryId;

    // model.CashFlowCategory =this.selectedCashCategoryId;
    model.CreatedBy = this.globalUser;
    model.ApprovedBy = this.globalUser;
    this.submitted = true;

    // if (!model.CategoryId || !model.SubCategoryId) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Please select Category',
    //     life: 3000,
    //   });
    // } else {}
    // const categoryid = model.CategoryId.CategoryId;
    // model.CategoryId = categoryid;

    model.CategoryId = this.selectedCategoryId || 0;
    model.SubCategoryId = this.selectedSubCategoryId || 0;
    model.BalanceSheetCode = this.selectBalanceSheetCategory || 0;
    model.BalanceSheetSubCode = this.selectBalanceSheetSubCategory || 0;
    model.BalanceSheetNoteCode = this.selectBalanceSheetNote || 0;
    this.apiService.post(model, ApiEndpoints.AddChartOfAccount + `?`).subscribe(
      () => {
        this.toastService.sendMessage({
          message: 'Product Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllParentCode();
        this.loadAllChartofAccount();
      },
      (error) => {
        console.log(error.errors);
      }
    );
    this.form.reset();
    this.productDialog = false;
  }

  filterGlobal(event: any) {
    if (event?.target?.value) {
      this.dt.filterGlobal(event?.target?.value, 'contains');
    }
  }

  clearFilter(event: any) {
    if (!event?.target?.value) {
      this.dt.filterGlobal(event?.target?.value, '');
    }
  }

  transformDatatree(apiData: any): TreeNode[] {
    return this.generateTreeNodes(apiData['Children'], 1);
  }
  toggleCheckbox() {
    // this.HasDetail = !this.isActiveCheckbox;
    // this.chart$.IsActive = this.isActiveCheckbox;
  }
  generateTreeNodes(items: any[], level: number): TreeNode[] {
    if (level > 15) {
      return [];
    }

    const treeNodes: TreeNode[] = [];

    for (const item of items) {
      const childNodes: TreeNode[] = this.generateTreeNodes(
        item.Children || [],
        level + 1
      );

      const treeNode: TreeNode = {
        data: { ...item },
        children: childNodes,
      };

      treeNodes.push(treeNode);
    }

    return treeNodes;
  }
}
