import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ChartItemService } from 'src/app/_shared/services/chart-item-service.service';
import { NewChartofitemComponent } from '../new-chartofitem/new-chartofitem.component';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { CategoryService } from 'src/app/_shared/services/shared-service';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-item-chart',
  templateUrl: './item-chart.component.html',
  styleUrls: ['./item-chart.component.scss'],
})
export class ItemChartComponent implements OnInit {
  IsCapex = true;
  IsOpex = false;
  updateCheckboxCap() {
    this.IsOpex = false;
    this.IsCapex = true;
  }
  updateCheckboxOp() {
    this.IsCapex = false;
    this.IsOpex = true;
  }
  isupdateformCapexOpex = false;
  //Main
  @ViewChild(NewChartofitemComponent)
  newChartofitemComponent!: NewChartofitemComponent;
  form!: FormGroup;
  printCategory!: FormGroup;
  loading = false;
  mainHeader!: string;
  mainHeaderCategory: string = 'Add Category';
  mainDialog: boolean = false;
  mainBtn!: string;
  model: any = [];
  isUpdate: boolean = false;
  chartResponse$: any = [];
  parentCodeResponse$: any;
  @ViewChild('dt') dt!: any;
  //Form Control
  radioButton = new FormControl(false);
  selectedRadio: string = '';
  filterFields: string[] = [];
  //Global Variables
  globalBranchCode!: number;
  globalUserId!: number;
  isInnerUpdate!: boolean;
  innerHeader!: string;
  innerBtn!: string;
  parentwithName!: string;
  chartResponse!: TreeNode[];
  selectedRow: any;

  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  categoryDialog: boolean = false;
  printCategoryDialog: boolean = false;
  componentName: string = 'Item Chart';
  addNewCategory!: FormGroup;
  visible: boolean = false;
  selectedParentCode!: string;
  subCat: boolean = false;
  selectedStore!: number;
  isUpdateCategory: boolean = false;
  isToastShown: boolean = false;
  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private apiService: ApiProviderService,
    private api: ChartItemService,
    private utilityService: UtilityService,
    private categoryService: CategoryService,
    private apiservice: InventoryReportsService,
    private storeProjectService: StoreProjectService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // ItemCode: this.fb.control(''),
    });
    this.addNewCategory = this.fb.group({
      ParentItemCode: this.fb.control(null),
      ItemCode: this.fb.control(null),
      ItemName: this.fb.control(null),
      ItemCodeWithSeperator: this.fb.control(null),
      HasDetail: this.fb.control(false),
    });
    this.printCategory = this.fb.group({
      ParentItemCode: this.fb.control(0),
    });
    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        // this.selectedProject = option.ProjectCode;
      }
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 3;
    const FormId = 3;
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
    this.loadAllChartItem();
    this.loadAllParentCodeItem();
    // this.api.selectedRow$.subscribe((itemData) => {
    //   this.loadAllChartItem()
    // })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  changeStore(e: any) {
    if (e.value != null) {
      this.selectedStore = e.value.DepartmentCode;
    } else {
      this.selectedStore = 0;
    }
  }
  hideDialog() {
    this.loadAllChartItem();
    this.mainDialog = false;
    this.newChartofitemComponent.resetForm();
  }
  loadAllChartItem() {
    this.apiService
      .get(ApiEndpoints.GetChartOfItemsTree)
      .subscribe((res: any) => {
        this.chartResponse = res;
        this.chartResponse = this.transformDatatree(res);
        console.log('chart reponse=>', this.chartResponse);
      });
  }
  // selectedRow: any;
  openNew(event?: any, action?: string, HasDetail?: boolean) {
    if (action === 'add') {
      this.newChartofitemComponent.resetForm();
      this.mainHeader = 'Add Item Information';
      this.mainDialog = true;
      this.isUpdate = false;
      // this.form.reset();
    } else if (action === 'edit') {
      this.isUpdate = true;
      this.selectedRow = event;
      if (HasDetail == true) {
        this.mainHeaderCategory = 'Edit Category';
        this.categoryDialog = true;
        this.isUpdateCategory = true;
        this.addNewCategory.patchValue({ ...this.selectedRow[0] });
        this.addNewCategory.controls['ItemCodeWithSeperator'].setValue(
          this.selectedRow[0].ParentItemCode
        );
      } else {
        this.mainHeader = 'Edit Item Information';
        this.mainDialog = true;
        this.api.setSelectedRow(this.selectedRow);
      }
    }
  }

  GetDataByItemCode(ItemCode: any, HasDetail: boolean) {
    this.categoryService.isUpdate$.subscribe(res=>{
      this.isUpdate = res
    })
    if (HasDetail == true) {
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Category/Parent Item cannot be Edited',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
    } else {
      this.api.getItemDetailByItemCode(ItemCode).subscribe({
        next: (res: any) => {
          this.selectedRow = res;
          this.openNew(this.selectedRow, 'edit', HasDetail);
        },
        error: (res: any) => {},
      });
    }
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }
  getRow(data: any) {
    this.mainHeader = 'Update Item Information';
    this.mainBtn = 'Update';
    this.mainDialog = true;
    this.isUpdate = true;
    this.IsCapex = this.model.IsCapex;
    this.IsOpex = this.model.IsOpex;
    this.model.Income = data.Income.trim();
    this.model.Asset = data.Asset.trim();
    this.model.TaxCode = data.TaxCode.trim();
    // this.isupdateformCapexOpex = true;
    this.model = { ...data };
    this.model.AccountCode = data.AccountCode.trim();
    let x = this.parentCodeResponse$.find((x: any) => {
      let rem = x.ItemCode.replace(/-/g, '');
      return rem == this.model.ParentItemCode;
    });
    this.parentwithName = `${x?.ItemCode} - ${x?.ItemName}`;
    if (this.parentwithName.includes('undefined')) {
      this.parentwithName = '0';
    }
  }
  addorUpdate() {
    if (!this.isUpdate) {
      // this.save();
    } else {
      // this.update();
    }
  }

  transformItemDatatree(apiData: any): TreeNode[] {
    const treeNodes: TreeNode[] = [];
    const children = apiData['Children'];

    for (let index = 0; index < children.length; index++) {
      const item = children[index];
      const childNodes: TreeNode[] = [];

      if (item.Children && item.Children.length > 0) {
        for (let j = 0; j < item.Children.length; j++) {
          const childItem = item.Children[j];
          const grandChildNodes: TreeNode[] = [];

          if (childItem.Children && childItem.Children.length > 0) {
            for (let k = 0; k < childItem.Children.length; k++) {
              const grandChildItem = childItem.Children[k];
              const grandChildChildNodes: TreeNode[] = [];

              if (
                grandChildItem.Children &&
                grandChildItem.Children.length > 0
              ) {
                for (let l = 0; l < grandChildItem.Children.length; l++) {
                  const grandChildChildItem = grandChildItem.Children[l];
                  const grandChildChildNode: TreeNode = {
                    data: {
                      ParentItemCode: grandChildChildItem.ParentItemCode,
                      ItemCode: grandChildChildItem.ItemCode,
                      ItemCodeWithSeperator:
                        grandChildChildItem.ItemCodeWithSeperator,
                      ItemName: grandChildChildItem.ItemName,
                      IsActive: grandChildChildItem.IsActive,
                      HasDetail: grandChildChildItem.HasDetail,
                      IsDetail: grandChildChildItem.IsDetail,
                      ShortName: grandChildChildItem.ShortName,
                      MinLevel: grandChildChildItem.MinLevel,
                      MaxLevel: grandChildChildItem.MaxLevel,
                      CreatedOn: grandChildChildItem.CreatedOn,
                      ApprovedOn: grandChildChildItem.ApprovedOn,

                      Hirarchy: grandChildChildItem.Hirarchy,
                      Remarks: grandChildChildItem.Remarks,
                      ItemSizeCode: grandChildChildItem.ItemSizeCode,
                      ItemColourCode: grandChildChildItem.ItemColourCode,
                      ItemTypeCode: grandChildChildItem.ItemTypeCode,
                      ItemCategoryCode: grandChildChildItem.ItemCategoryCode,
                      ItemGradeCode: grandChildChildItem.ItemGradeCode,
                      ItemManufacturerCode:
                        grandChildChildItem.ItemManufacturerCode,
                      ItemBrandCode: grandChildChildItem.ItemBrandCode,
                      ItemModelCode: grandChildChildItem.ItemModelCode,
                      ItemUnitCode: grandChildChildItem.ItemUnitCode,
                      RegistrationNo: grandChildChildItem.RegistrationNo,
                      ItemSrNo: grandChildChildItem.ItemSrNo,
                      ItemImagePath: grandChildChildItem.ItemImagePath,
                      AccountCode: grandChildChildItem.AccountCode,
                      AccountName: grandChildChildItem.AccountName,
                      SalePrice: grandChildChildItem.SalePrice,
                      IsCapex: grandChildChildItem.IsCapex,
                      IsOpex: grandChildChildItem.IsOpex,
                      PrintTags: grandChildChildItem.PrintTags,
                      Unorderable: grandChildChildItem.Unorderable,
                      UseSerial: grandChildChildItem.UseSerial,
                      EarnCommission: grandChildChildItem.EarnCommission,
                      EarnRewards: grandChildChildItem.EarnRewards,
                      ShippingWeight: grandChildChildItem.ShippingWeight,
                      ShippingHeight: grandChildChildItem.ShippingHeight,
                      ShippingLength: grandChildChildItem.ShippingLength,
                      ShippingWidth: grandChildChildItem.ShippingWidth,
                      Income: grandChildChildItem.Income,
                      Asset: grandChildChildItem.Asset,
                      TaxCode: grandChildChildItem.TaxCode,
                    },
                    children: [], // No further nested children for now, can be modified if needed
                  };

                  grandChildChildNodes.push(grandChildChildNode);
                }
              }

              const grandChildNode: TreeNode = {
                data: {
                  ParentItemCode: grandChildItem.ParentItemCode,
                  ItemCode: grandChildItem.ItemCode,
                  ItemCodeWithSeperator: grandChildItem.ItemCodeWithSeperator,
                  ItemName: grandChildItem.ItemName,
                  IsActive: grandChildItem.IsActive,
                  HasDetail: grandChildItem.HasDetail,
                  IsDetail: grandChildItem.IsDetail,
                  ShortName: grandChildItem.ShortName,
                  MinLevel: grandChildItem.MinLevel,
                  MaxLevel: grandChildItem.MaxLevel,
                  CreatedOn: grandChildItem.CreatedOn,
                  ApprovedOn: grandChildItem.ApprovedOn,

                  Hirarchy: grandChildItem.Hirarchy,
                  Remarks: grandChildItem.Remarks,
                  ItemSizeCode: grandChildItem.ItemSizeCode,
                  ItemColourCode: grandChildItem.ItemColourCode,
                  ItemTypeCode: grandChildItem.ItemTypeCode,
                  ItemCategoryCode: grandChildItem.ItemCategoryCode,
                  ItemGradeCode: grandChildItem.ItemGradeCode,
                  ItemManufacturerCode: grandChildItem.ItemManufacturerCode,
                  ItemBrandCode: grandChildItem.ItemBrandCode,
                  ItemModelCode: grandChildItem.ItemModelCode,
                  ItemUnitCode: grandChildItem.ItemUnitCode,
                  RegistrationNo: grandChildItem.RegistrationNo,
                  ItemSrNo: grandChildItem.ItemSrNo,
                  ItemImagePath: grandChildItem.ItemImagePath,
                  AccountCode: grandChildItem.AccountCode,
                  AccountName: grandChildItem.AccountName,
                  SalePrice: grandChildItem.SalePrice,
                  IsCapex: grandChildItem.IsCapex,
                  IsOpex: grandChildItem.IsOpex,
                  PrintTags: grandChildItem.PrintTags,
                  Unorderable: grandChildItem.Unorderable,
                  UseSerial: grandChildItem.UseSerial,
                  EarnCommission: grandChildItem.EarnCommission,
                  EarnRewards: grandChildItem.EarnRewards,
                  ShippingWeight: grandChildItem.ShippingWeight,
                  ShippingHeight: grandChildItem.ShippingHeight,
                  ShippingLength: grandChildItem.ShippingLength,
                  ShippingWidth: grandChildItem.ShippingWidth,
                  Income: grandChildItem.Income,
                  Asset: grandChildItem.Asset,
                  TaxCode: grandChildItem.TaxCode,
                },
                children: grandChildChildNodes,
              };

              grandChildNodes.push(grandChildNode);
            }
          }

          const childNode: TreeNode = {
            data: {
              ParentItemCode: childItem.ParentItemCode,
              ItemCode: childItem.ItemCode,
              ItemCodeWithSeperator: childItem.ItemCodeWithSeperator,
              ItemName: childItem.ItemName,
              IsActive: childItem.IsActive,
              HasDetail: childItem.HasDetail,
              IsDetail: childItem.IsDetail,
              ShortName: childItem.ShortName,
              MinLevel: childItem.MinLevel,
              MaxLevel: childItem.MaxLevel,
              CreatedOn: childItem.CreatedOn,
              ApprovedOn: childItem.ApprovedOn,

              Hirarchy: childItem.Hirarchy,
              Remarks: childItem.Remarks,
              ItemSizeCode: childItem.ItemSizeCode,
              ItemColourCode: childItem.ItemColourCode,
              ItemTypeCode: childItem.ItemTypeCode,
              ItemCategoryCode: childItem.ItemCategoryCode,
              ItemGradeCode: childItem.ItemGradeCode,
              ItemManufacturerCode: childItem.ItemManufacturerCode,
              ItemBrandCode: childItem.ItemBrandCode,
              ItemModelCode: childItem.ItemModelCode,
              ItemUnitCode: childItem.ItemUnitCode,
              RegistrationNo: childItem.RegistrationNo,
              ItemSrNo: childItem.ItemSrNo,
              ItemImagePath: childItem.ItemImagePath,
              AccountCode: childItem.AccountCode,
              AccountName: childItem.AccountName,
              SalePrice: childItem.SalePrice,
              IsCapex: childItem.IsCapex,
              IsOpex: childItem.IsOpex,
              PrintTags: childItem.PrintTags,
              Unorderable: childItem.Unorderable,
              UseSerial: childItem.UseSerial,
              EarnCommission: childItem.EarnCommission,
              EarnRewards: childItem.EarnRewards,
              ShippingWeight: childItem.ShippingWeight,
              ShippingHeight: childItem.ShippingHeight,
              ShippingLength: childItem.ShippingLength,
              ShippingWidth: childItem.ShippingWidth,
              Income: childItem.Income,
              Asset: childItem.Asset,
              TaxCode: childItem.TaxCode,
            },
            children: grandChildNodes,
          };

          childNodes.push(childNode);
        }
      }

      const treeNode: TreeNode = {
        data: {
          ParentItemCode: item.ParentItemCode,
          ItemCode: item.ItemCode,
          ItemCodeWithSeperator: item.ItemCodeWithSeperator,
          ItemName: item.ItemName,
          IsActive: item.IsActive,
          HasDetail: item.HasDetail,
          IsDetail: item.IsDetail,
          ShortName: item.ShortName,
          MinLevel: item.MinLevel,
          MaxLevel: item.MaxLevel,
          CreatedOn: item.CreatedOn,
          ApprovedOn: item.ApprovedOn,

          Hirarchy: item.Hirarchy,
          Remarks: item.Remarks,
          ItemSizeCode: item.ItemSizeCode,
          ItemColourCode: item.ItemColourCode,
          ItemTypeCode: item.ItemTypeCode,
          ItemCategoryCode: item.ItemCategoryCode,
          ItemGradeCode: item.ItemGradeCode,
          ItemManufacturerCode: item.ItemManufacturerCode,
          ItemBrandCode: item.ItemBrandCode,
          ItemModelCode: item.ItemModelCode,
          ItemUnitCode: item.ItemUnitCode,
          RegistrationNo: item.RegistrationNo,
          ItemSrNo: item.ItemSrNo,
          ItemImagePath: item.ItemImagePath,
          AccountCode: item.AccountCode,
          AccountName: item.AccountName,
          SalePrice: item.SalePrice,
          IsCapex: item.IsCapex,
          IsOpex: item.IsOpex,
          PrintTags: item.PrintTags,
          Unorderable: item.Unorderable,
          UseSerial: item.UseSerial,
          EarnCommission: item.EarnCommission,
          EarnRewards: item.EarnRewards,
          ShippingWeight: item.ShippingWeight,
          ShippingHeight: item.ShippingHeight,
          ShippingLength: item.ShippingLength,
          ShippingWidth: item.ShippingWidth,
          Income: item.Income,
          Asset: item.Asset,
          TaxCode: item.TaxCode,
        },
        children: childNodes,
      };

      treeNodes.push(treeNode);
    }

    return treeNodes;
  }

  deleteChartItem(id: string, HasDetail: boolean) {
    if (HasDetail == true) {
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Category/Parent Item cannot be Deleted',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
    } else {
      if (this.ModulelistResp$[0]?.Delete === false) {
        this.loadingerror = true;
        return;
      }
      this.confirmService.confirm({
        message: 'Are you sure you want to delete this item?',
        header: 'Delete',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.apiService
            .delete(ApiEndpoints.deleteChartofItem, { ItemCode: id })
            .subscribe((res) => {
              if (res === true) {
                return this.toastService.sendMessage({
                  message: 'Item Deleted Successfully!',
                  type: NotificationType.deleted,
                  title: 'Deleted',
                });
              }
            });
          this.loadAllChartItem();
        },
      });
    }
  }
  getRadioControl(): string {
    return this.selectedRadio;
  }

  filterGlobal(event: any) {
    const id = this.getRadioControl();
    let filterFields: string[] = [];

    if (id === 'Title') {
      filterFields.push('ItemName');
    } else if (id === 'Code') {
      filterFields.push('ItemCode');
    }

    if (event?.target?.value) {
      let searchString = event.target.value;
      if (searchString.startsWith('%')) {
        searchString = searchString.substr(1);
        this.dt.filterGlobal(searchString, 'startsWith');
      } else if (searchString.endsWith('%')) {
        searchString = searchString.substr(0, searchString.length - 1);
        this.dt.filterGlobal(searchString, 'endsWith');
      } else {
        this.dt.filterGlobal(searchString, 'contains');
      }
    }

    this.filterFields = filterFields;
  }

  clearFilter(event: any) {
    if (!event?.target?.value) {
      this.dt.filterGlobal(event?.target?.value, '');
    }
  }

  //--------------------------------------------------------------------------------------------

  transformDatatree(apiData: any): TreeNode[] {
    return this.generateTreeNodes(apiData['Children'], 1);
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

  toggleMainDialog(value: boolean) {
    this.mainDialog = value;
  }

  hideDialogue() {
    this.mainDialog = false;
  }

  addNewCategoryDialog() {
    this.categoryDialog = true;
    this.isUpdateCategory = false;
    this.mainHeaderCategory = 'Add Category';
  }

  closeCategoryDialog() {
    this.categoryDialog = false;
  }

  openPrintCategoryDialog() {
    this.printCategoryDialog = true;
  }

  closePrintCategoryDialog() {
    this.printCategoryDialog = false;
  }
  addCategory() {
    if (this.addNewCategory.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.addNewCategory);
      this.toastService.sendMessage({
        message: 'Invalid form fields please check the form!',
        type: NotificationType.error,
      });
      return;
    }
    this.model = this.addNewCategory.value;
    this.model.BranchCode = this.globalBranchCode;
    if (!this.selectedParentCode) {
      this.model.ParentItemCode = '0';
    } else {
      const containsDash = this.selectedParentCode.includes('-');
      if (containsDash == true) {
        // this.model.ParentItemCode = this.selectedParentCode.substring(
        //   0,
        //   this.selectedParentCode.indexOf('-')
        // );
        this.model.ParentItemCode = this.selectedParentCode.split('-').join('');
      } else {
        this.model.ParentItemCode = this.selectedParentCode;
      }
    }
    const itemcode = this.addNewCategory.get('ItemCode')?.value;
    if (this.model.ParentItemCode === '0') {
      this.model.ItemCodeWithSeperator = itemcode;
      this.model.ItemCode = itemcode;
    } else {
      this.model.ItemCodeWithSeperator = this.selectedParentCode.concat(
        '-',
        itemcode
      );
      this.model.ItemCode =
        this.model.ItemCodeWithSeperator.split('-').join('');
    }
    this.apiService
      .post(this.model, ApiEndpoints.addCategory)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Category Created Successfully!',
          type: NotificationType.success,
        });
        this.addNewCategory.reset();
        this.categoryDialog = false;
        this.loadAllParentCodeItem();
        this.subCat = false;
        this.loadAllChartItem();
      });
  }

  loadAllParentCodeItem() {
    this.api.getAllParentItemCode().subscribe((res: any) => {
      this.parentCodeResponse$ = res.filter(
        (item: any) => item.IsDetail === false || item.IsDetail === null
      );
      this.categoryService.updateParentCode(res);
    });
  }

  changeParentCode(event: any) {
    this.selectedParentCode = event?.value;
    let selectedParentCode = event?.value.split('-').join('');
    this.loadGetMaxAccountCode(selectedParentCode);
  }
  loadGetMaxAccountCode(ParentAccountCode: string) {
    this.subCat = true;
    this.api.GetMaxItemCode(ParentAccountCode).subscribe((res: any) => {
      this.addNewCategory.controls['ItemCode'].setValue(res.AccountCode);
    });
  }

  ParentItemCode!: number;
  printitemListReport() {
    if (this.selectedParentCode) {
      this.ParentItemCode = parseInt(
        this.selectedParentCode.split('-').join('')
      );
    } else {
      this.ParentItemCode = 0;
    }
    this.loading = true;
    this.apiservice
      .printItemsListReport(
        this.globalBranchCode,
        this.selectedStore,
        this.ParentItemCode
      )
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.printCategoryDialog = false;
      });
  }
}
