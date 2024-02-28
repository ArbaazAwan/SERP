import { SelectItem } from 'primeng/api';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
  TreeNode,
} from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ChartItemService } from 'src/app/_shared/services/chart-item-service.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { environment } from 'src/environments/environment';
import { ItemChartComponent } from '../item-chart/item-chart.component';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { take } from 'rxjs/operators';
import { CategoryService } from 'src/app/_shared/services/shared-service';

export class UploadedFile {
  file: File | undefined;
  url: string | undefined;
}
@Component({
  selector: 'app-new-chartofitem',
  templateUrl: './new-chartofitem.component.html',
  styleUrls: ['./new-chartofitem.component.scss'],
  providers: [MessageService],
})
export class NewChartofitemComponent implements OnInit {
  @Output() saveSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @ViewChild(ItemChartComponent) itemChartComponent!: ItemChartComponent;
  chartResponse!: TreeNode[];
  isLoadingData: boolean = false;

  mainHeader!: string;
  mainDialog!: boolean;
  mainBtn!: string;
  model: any = [];
  modelRec: any;
  receipeMasterDetail: any;
  table1DataMaster!: any[];
  table2DataMasterDetails!: any[];
  addNewItemform!: FormGroup;
  receipeformMaster!: FormGroup;
  receipeformMasterDetail!: FormGroup;
  itemform!: FormGroup;
  storeResponse$: any = [];
  coaResponse$: any = [];
  IncomeResponse$: any = [];
  AssetResponse$: any = [];
  parentCodeResponse$: any = [];
  selectedParentCode!: string;
  selectedParentReceipDetail!: string;
  selectedCOAHead!: string;
  selectedIncome!: string;
  selectedAsset!: string;
  selectedStores: any[] = [];
  selectedItems: any[] = [];
  selectedTax: any[] = [];
  account: any[] = [];
  aasets: any[] = [];
  @ViewChild('dt') dt!: any;

  //Form Control
  radioButton = new FormControl(false);
  selectedRadio: string = '';
  filterFields: string[] = [];

  //Global Variables
  globalBranchCode!: number;
  globalUserId!: number;
  isInnerUpdate!: boolean;
  isInnerUpdateMaster: boolean = true;
  isInnerUpdateMasterDetail: boolean = false;
  innerHeader!: string;
  receipeHeader!: string;
  innerBtn!: string;
  innerRecBtn!: string;
  parentwithName!: string;
  updateMasterform: string = 'Update';
  //Size
  formSize!: FormGroup;
  sizeResponse$: any = [];
  sizeModel$: any = [];
  selectedSize!: number;
  innerDialogSize!: boolean;
  ItemSizeCode!: number;
  //Colour
  formColour!: FormGroup;
  colourResponse$: any = [];
  colourModel$: any = [];
  innerDialogColour!: boolean;
  selectedColour!: number;
  ItemColourCode!: number;

  //Type
  formType!: FormGroup;
  typeResponse$: any = [];
  typeModel$: any = [];
  innerDialogType!: boolean;
  selectedType!: number;
  itemTypeCode!: number;

  //Category
  formCategory!: FormGroup;
  categoryResponse$: any = [];
  categoryModel$: any = [];
  innerDialogCategory!: boolean;
  selectedCategory!: number;
  ItemCategoryCode!: number;

  //Grade
  formGrade!: FormGroup;
  gradeResponse$: any = [];
  gradeModel$: any = [];
  innerDialogGrade!: boolean;
  selectedGrade!: number;
  ItemGradeCode!: number;

  //Manufacturer
  formManufacturer!: FormGroup;
  manufacturerResponse$: any = [];
  manufacturerModel$: any = [];
  innerDialogManufacturer!: boolean;
  selectedManufacturer!: number;
  ItemManufacturerCode!: number;

  //Brand
  formBrand!: FormGroup;
  brandResponse$: any = [];
  brandModel$: any = [];
  innerDialogBrand!: boolean;
  selectedBrand!: number;
  ItemBrandCode!: number;

  //Model
  formModel!: FormGroup;
  modelResponse$: any = [];
  modelModel$: any = [];
  innerDialogModel!: boolean;
  selectedModel!: number;
  ItemModelCode!: number;

  //Unit
  formUnit!: FormGroup;
  unitResponse$: any = [];
  unitModel$: any = [];
  receipeMasterDetailModel: any = [];
  innerDialogUnit!: boolean;
  selectedUnit!: number;
  ItemUnitCode!: number;

  // Receipe
  innerDialogRec!: boolean;
  //dpt
  tableLength!: number;
  TaxResponse$: any = [];
  isupdateMasterDetail: boolean = false;
  formReset: boolean = false;
  IsUpdate: boolean = false;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  itemCode: string = '';
  ItemCode: string = '';
  defaultUrl = '../../../../assets/user.svg';
  @Input() isUpdate: boolean = false;
  @Input() selectedRow: any;
  //table 1: Item Type
  typeDropDown: any;
  //table 2: Item Size
  sizeDropDown: any;
  //table 3: Item Manufacturer
  manufacturerDropDown: any;
  //table 4: Item Unit
  unitDropDown: any;
  //table 5: Item Colour
  colourDropDown: any;
  //table 6: Item Category
  categoryDropDown: any;
  //table 7: Item Grade
  gradeDropDown: any;
  //table 8: Item Brand
  brandDropDown: any;
  //table 9: Item Model
  modelDropDown: any;
  IsCapex = true;
  IsOpex = false;
  isToastShown: boolean = false;
  updateCheckboxCap() {
    this.IsOpex = false;
    this.IsCapex = true;
  }
  updateCheckboxOp() {
    this.IsCapex = false;
    this.IsOpex = true;
  }
  selectedStore: any = [];
  selectedTexas: any = [];
  itemsCode: string = '';
  constructor(
    private api: ChartItemService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private apiService: ApiProviderService,
    private utilityService: UtilityService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
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

    //Main
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.formsInit();
    this.loadAllParentCodeItem();
    this.loadAllChartOfAccountHead();
    this.LoadAllDropDownChartOfItem();
    this.api.selectedRow$.subscribe((itemData) => {
      if (itemData) {
        this.getImage(itemData.ChartOfItems[0].ItemCode);
        this.IsUpdate = true;
        this.addNewItemform.patchValue({ ...itemData.ChartOfItems[0] });
        this.addNewItemform.controls['ParentItemCode'].setValue(
          itemData.ChartOfItems[0].ParentItemCodeWithSeperator
        );
        //get Selected Stores in Edit item
        if(itemData.ItemStores.length!=0){
          this.selectedStores = itemData.ItemStores.filter(
            (store: any) => store.StoreName !== null
          ).map((store: any) => {
            return {
              StoreName: store.StoreName,
              StoreCode: store.StoreCode,
            };
          });
          this.addNewItemform.controls['stores'].patchValue(this.selectedStores);
        }
       

        //get Selected Texas in Edit item
        if(itemData.ItemTaxes.length!=0){
          this.selectedTexas = itemData.ItemTaxes.map((tax: any) => {
            return {
              TaxId: tax.TaxId,
              TaxTitle: tax.TaxTitle,
            };
          });
          this.addNewItemform.controls['items'].patchValue(this.selectedTexas);
        }   
      }
    });
    this.categoryService.parentCode$.subscribe((data: any) => {
      if (data) {
        this.parentCodeResponse$ = data.filter(
          (item: any) => item.IsDetail === false || item.IsDetail === null
        );
      }
    });
  }

  formsInit() {
    this.addNewItemform = this.fb.group({
      ItemCode: this.fb.control(''),
      ParentItemCode: this.fb.control(''),
      ItemCodeWithSeperator: this.fb.control(''),
      ItemName: this.fb.control(''),
      ShortName: this.fb.control(''),
      MinLevel: this.fb.control(''),
      MaxLevel: this.fb.control(''),
      CreatedOn: this.fb.control(''),
      ApprovedOn: this.fb.control(''),
      // HasDetail: this.fb.control(false),
      IsDetail: this.fb.control(true),
      isActive: this.fb.control(true),
      Hirarchy: this.fb.control(''),
      Remarks: this.fb.control(''),
      ItemSizeCode: this.fb.control(''),
      ItemColourCode: this.fb.control(''),
      ItemTypeCode: this.fb.control(''),
      ItemCategoryCode: this.fb.control(''),
      ItemGradeCode: this.fb.control(''),
      ItemManufacturerCode: this.fb.control(''),
      ItemBrandCode: this.fb.control(''),
      ItemModelCode: this.fb.control(''),
      ItemUnitCode: this.fb.control(''),
      RegistrationNo: this.fb.control(''),
      ItemSrNo: this.fb.control(''),
      stores: this.fb.control(''),
      items: this.fb.control(''),
      SalePrice: this.fb.control(''),
      AccountCode: this.fb.control(''),
      IsCapex: this.fb.control(true),
      IsOpex: this.fb.control(false),
      PrintTags: this.fb.control(false),
      Unorderable: this.fb.control(false),
      UseSerial: this.fb.control(false),
      EarnCommission: this.fb.control(false),
      EarnRewards: this.fb.control(false),
      ShippingWeight: this.fb.control(''),
      ShippingHeight: this.fb.control(''),
      ShippingLength: this.fb.control(''),
      ShippingWidth: this.fb.control(''),
      Income: this.fb.control(''),
      Asset: this.fb.control(''),
      TaxCode: this.fb.control(''),
      UPC: this.fb.control(''),
      ItemImagePath: this.fb.control(''),
    });

    this.receipeformMaster = this.fb.group({
      ItemRecCode: this.fb.control(''),
      RecCode: this.fb.control(''),
      ItemName: this.fb.control(''),
      recRemark: this.fb.control(''),
      TotalCost: this.fb.control(''),
      active: this.fb.control(''),
      approved: this.fb.control(''),
    });

    this.receipeformMasterDetail = this.fb.group({
      ItemRec2: this.fb.control(''),
      unitRec: this.fb.control(''),
      qtyRec: this.fb.control(''),
      priceRec: this.fb.control(''),
      recRemark2: this.fb.control(''),
    });

    this.formSize = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemSize: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formColour = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemColour: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formType = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemType: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formCategory = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemCategory: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formGrade = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemGrade: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formManufacturer = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemManufacturer: this.fb.control('', Validators.required),
      PhoneNumber: this.fb.control('', Validators.required),
      Address: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formBrand = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemBrand: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formModel = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemModel: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    this.formUnit = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemUnit: this.fb.control('', Validators.required),
      ShortName: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });
  }
  // ngAfterViewChecked(): void {
  //   this.changeDetectorRef.detectChanges();
  // }

  // ngOnChanges(changes: any): void {
  //   debugger
  //   this.selectedRow;
  //   this.model;
  //   if (this.selectedRow) {
  //     this.itemCode = this.selectedRow.ItemCode;
  //     // this.getRow(this.selectedRow);
  //     this.getImage(this.itemCode);
  //   }

  //   // if (this.isUpdate) {
  //   //   if (changes?.selectedRow?.currentValue) {
  //   //     let data = changes?.selectedRow?.currentValue;
  //   //     this.itemCode = this.selectedRow.ItemCode;

  //   //     this.getImage();
  //   //   }
  //   // }
  //   if (this.addNewItemform) {
  //     this.addNewItemform.reset();
  //   }
  // }

  HasDetail() {
    this.addNewItemform.controls['HasDetail'].setValue(true);
    this.addNewItemform.controls['IsDetail'].setValue(false);
  }
  IsDetail() {
    this.addNewItemform.controls['IsDetail'].setValue(true);
    this.addNewItemform.controls['HasDetail'].setValue(false);
  }

  loadAllTax() {
    this.apiService.get(ApiEndpoints.GetAllTaxes).subscribe((res: any) => {
      this.TaxResponse$ = res.map((x: any) => {
        return {
          TaxId: x.TaxId,
          TaxTitle: x.TaxTitle,
        };
      });
    });
  }
  loadAllChartOfAccountHead() {
    this.apiService.get(ApiEndpoints.GetAccountTitle).subscribe((res: any) => {
      this.account = res.data;
    });
  }
  loadAllStoreItem() {
    this.api.getItemStores(this.globalBranchCode, '0').subscribe((res: any) => {
      this.storeResponse$ = res.map((x: any) => {
        return {
          StoreCode: x.StoreCode,
          StoreName: x.StoreName,
        };
      });
    });
  }

  loadAllParentCodeItem() {
    this.api.getAllParentCode().subscribe((res: any) => {
      this.parentCodeResponse$ = res.filter(
        (item: any) => item.IsDetail === false || item.IsDetail === null
      );
      this.parentCodeResponse$ = res;
    });
  }

  changeParentCodeMasterDetial(event: any) {
    this.selectedParentReceipDetail = event?.value;
  }

  changeParentCode(event: any) {
    this.selectedParentCode = event?.value;
    let selectedParentCode = event?.value.split('-').join('');
    this.loadGetMaxAccountCode(selectedParentCode);
  }
  loadGetMaxAccountCode(ParentAccountCode: string) {
    this.api.GetMaxItemCode(ParentAccountCode).subscribe((res: any) => {
      this.ItemCode = res.AccountCode;
    });
  }

  hideDialog() {
    this.mainDialog = false;
    this.formsInit();
  }
  addorUpdate() {
    if (!this.isUpdate) {
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

  save() {
    this.model = this.addNewItemform.value;
    this.model.BranchCode = +this.globalBranchCode;
    this.model.CreatedBy = +this.globalUserId;
    this.model.ApprovedBy = +this.globalUserId;
    if (!this.selectedParentCode) {
      this.model.ParentItemCode = '0';
    } else {
      const containsDash = this.selectedParentCode.includes('-');
      if (containsDash == true) {
        this.model.ParentItemCode = this.selectedParentCode.split('-').join('');
      } else {
        this.model.ParentItemCode = this.selectedParentCode;
      }
    }
    const itemcode = this.ItemCode;
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
    this.api.saveChartofItem(this.model, this.selectedFiles).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Chart of Item Saved Successfully!',
        type: NotificationType.success,
      });
      this.saveSuccess.emit(true);
      this.LoadAllDropDownChartOfItem();
      this.resetForm();
    });
  }

  update() {
    this.model = this.addNewItemform.value;
    this.model.BranchCode = +this.globalBranchCode;
    this.model.ModifiedBy = +this.globalUserId;
    this.api.updateChartofItem(this.model, this.selectedFiles).subscribe(
      (res) => {
        // Handle successful update (if needed)
        this.toastService.sendMessage({
          message: 'Chart of Item Updated Successfully! sss',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.saveSuccess.emit(true);
        this.categoryService.updateIsUpdateValue(this.isUpdate);
        this.resetForm();
        this.onRefresh();
      },
      (error) => {
        // Handle update error (if needed)
        console.error('Error updating item:', error);
      }
    );
  }

  getRow(data: any) {
    this.mainHeader = 'Update Item Information';
    this.mainBtn = 'Update';
    this.mainDialog = true;
    this.isUpdate = true;
    this.model = { ...data };
    // this.IsCapex = this.model.IsCapex;
    // this.IsOpex = this.model.IsOpex;
    this.model.IsDetail = this.model.IsDetail;
    this.model.HasDetail = this.model.HasDetail;
    this.model.ItemImagePath = data?.ItemImagePath;
    this.model.AccountCode = +data?.AccountCode;
    const fileName = this.extractFileNameFromPath(this.model.ItemImagePath);
    this.model.isActive = this.model.IsActive;
    if (data.incom) {
      this.model.Income = data?.Income.trim();
    }

    this.model.Asset = data?.Asset.trim();
    this.model.TaxCode = data?.TaxCode.trim();
    //this.model = { ...data, ItemImagePath: data.ItemImagePath };
    let taxcode = this.TaxResponse$.find((x: any) => {
      return x.TaxCode === this.model.TaxCode;
    });
    //this.selectedTax = taxcode.TaxCode;
    this.tableLength = Object.keys(this.model).length;

    let x = this.parentCodeResponse$.find((x: any) => {
      let rem = x.ItemCode.replace(/-/g, '');
      return rem == this.model.ParentItemCode;
    });
    this.parentwithName = `${x?.ItemCode} - ${x?.ItemName}`;
    if (this.parentwithName.includes('undefined')) {
      this.parentwithName = '0';
    }
    this.getItemStore(this.globalBranchCode, this.model.ItemCode);
    this.getItemTax(this.model.ItemCode);
  }
  getItemStore(BranchCode: number, ItemCode: string) {
    this.api.getItemStores(BranchCode, ItemCode).subscribe((res: any) => {
      const filteredOptions = res.filter((x: any) => x.Selected);
      this.selectedStores = filteredOptions.map((x: any) => {
        return {
          StoreCode: x.StoreCode,
          StoreName: x.StoreName,
        };
      });
    });
  }

  getItemTax(ItemCode: string) {
    this.api.getItemTax(ItemCode).subscribe((res: any) => {
      const filteredOptions = res.filter((x: any) => x.Selected);
      this.selectedTax = filteredOptions.map((x: any) => {
        return {
          TaxId: x.TaxId,
          TaxTitle: x.TaxTitle,
        };
      });
    });
  }

  Active() {
    // const ActiveControl = this.addNewItemform.get('IsActive');
    // if (ActiveControl) {
    //   ActiveControl.setValue(!ActiveControl.value);
    // }
  }
  Approved() {
    // const ActiveControl = this.addNewItemform.get('IsActive');
    // if (ActiveControl) {
    //   ActiveControl.setValue(!ActiveControl.value);
    // }
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
                      HasDetail: grandChildChildItem.HasDetail,
                      isActive: grandChildChildItem.isActive,
                      IsDetail: grandChildChildItem.IsDetail,
                      ShortName: grandChildChildItem.ShortName,
                      MinLevel: grandChildChildItem.MinLevel,
                      MaxLevel: grandChildChildItem.MaxLevel,
                      CreatedOn: grandChildChildItem.CreatedOn,
                      ApprovedOn: grandChildChildItem.ApprovedOn,
                      ApprovedBy: grandChildChildItem.ApprovedBy,
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
                      // ItemImagePath: grandChildChildItem.ItemImagePath,
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
                  HasDetail: grandChildItem.HasDetail,
                  isActive: grandChildItem.isActive,
                  IsDetail: grandChildItem.IsDetail,
                  ShortName: grandChildItem.ShortName,
                  MinLevel: grandChildItem.MinLevel,
                  MaxLevel: grandChildItem.MaxLevel,
                  CreatedOn: grandChildItem.CreatedOn,
                  ApprovedOn: grandChildItem.ApprovedOn,
                  ApprovedBy: grandChildItem.ApprovedBy,
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
                  // ItemImagePath: grandChildItem.ItemImagePath,
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
              isActive: childItem.isActive,
              HasDetail: childItem.HasDetail,
              IsDetail: childItem.IsDetail,
              ShortName: childItem.ShortName,
              MinLevel: childItem.MinLevel,
              MaxLevel: childItem.MaxLevel,
              CreatedOn: childItem.CreatedOn,
              ApprovedOn: childItem.ApprovedOn,
              ApprovedBy: childItem.ApprovedBy,
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
              //   ItemImagePath: childItem.ItemImagePath,
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
          isActive: item.isActive,
          HasDetail: item.HasDetail,
          IsDetail: item.IsDetail,
          ShortName: item.ShortName,
          MinLevel: item.MinLevel,
          MaxLevel: item.MaxLevel,
          CreatedOn: item.CreatedOn,
          ApprovedOn: item.ApprovedOn,
          ApprovedBy: item.ApprovedBy,
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
          //   ItemImagePath: item.ItemImagePath,
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

  // Size API and Dropdown Rendering
  openNewSize() {
    this.innerHeader = 'Add Item Size';
    this.innerBtn = 'Save';
    this.innerDialogSize = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogSize() {
    this.innerDialogSize = false;
    this.isInnerUpdate = false;
    this.formSize.reset();
  }

  saveSize() {
    if (this.formSize.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formSize);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelSize;
    let val = this.formSize.value;
    modelSize = val;
    modelSize.BranchCode = this.globalBranchCode;
    modelSize.AddByUserId = this.globalUserId;
    this.apiService.post(modelSize, ApiEndpoints.saveItemSize).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Size Saved Successfully!',
        type: NotificationType.success,
      });
      this.formSize.reset();
      this.LoadAllDropDownChartOfItem();
    });
  }

  changeSize(e: any) {
    this.selectedSize = e.value;
  }

  getRowSize(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Item Size';
    this.innerBtn = 'Update';
    this.ItemSizeCode = data.ItemSizeCode;
    this.formSize.patchValue({ ...data });
  }

  updateSize() {
    this.sizeResponse$ = this.formSize.value;
    this.sizeResponse$.BranchCode = this.globalBranchCode;
    this.sizeResponse$.AddByUserId = this.globalUserId;
    this.sizeResponse$.ItemSizeCode = this.ItemSizeCode;
    this.apiService
      .update(this.sizeResponse$, ApiEndpoints.updateItemSize)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Size Updated Successfully!',
          type: NotificationType.success,
        });
        this.formSize.reset();
        this.openNewSize();
        this.LoadAllDropDownChartOfItem();
      });
  }

  addorUpdateSize() {
    if (!this.isInnerUpdate) {
      this.saveSize();
    } else {
      this.updateSize();
    }
  }

  deleteSize(ItemSizeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Item Size?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemSize, { ItemSizeCode: ItemSizeCode })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Size Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Colour API and Dropdown Rendering
  openNewColour() {
    this.innerHeader = 'Add Item Colour';
    this.innerBtn = 'Save';
    this.innerDialogColour = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogColour() {
    this.innerDialogColour = false;
    this.isInnerUpdate = false;
    this.formColour.reset();
  }

  saveColour() {
    if (this.formColour.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formColour);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelColour;
    let val = this.formColour.value;
    modelColour = val;
    modelColour.BranchCode = this.globalBranchCode;
    modelColour.AddByUserId = this.globalUserId;
    this.apiService
      .post(modelColour, ApiEndpoints.saveItemColour)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Colour Saved Successfully!',
          type: NotificationType.success,
        });
        this.formColour.reset();
        this.isInnerUpdate = false;
        this.LoadAllDropDownChartOfItem();
      });
  }

  changeColour(e: any) {
    this.selectedColour = e.value;
  }

  getRowColour(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Item Colour';
    this.innerBtn = 'Update';
    this.ItemColourCode = data.ItemColourCode;
    this.formColour.patchValue({ ...data });
  }

  updateColour() {
    this.colourResponse$ = this.formColour.value;
    this.colourResponse$.BranchCode = this.globalBranchCode;
    this.colourResponse$.AddByUserId = this.globalUserId;
    this.colourResponse$.ItemColourCode = this.ItemColourCode;
    this.apiService
      .update(this.colourResponse$, ApiEndpoints.updateItemColour)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Colour Updated Successfully!',
          type: NotificationType.success,
        });
        this.formColour.reset();
        this.openNewColour();
        this.LoadAllDropDownChartOfItem();
      });
    this.isInnerUpdate = false;
  }

  addorUpdateColour() {
    if (!this.isInnerUpdate) {
      this.saveColour();
    } else {
      this.updateColour();
    }
  }

  deleteColour(ItemColourCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Colour?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemColour, { ItemColourCode })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Colour Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Type API and Dropdown Rendering
  openNewType() {
    this.innerHeader = 'Add Item Type';
    this.innerBtn = 'Save';
    this.innerDialogType = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogType() {
    this.innerDialogType = false;
    this.isInnerUpdate = false;
    this.formType.reset();
  }
  saveformEnable() {
    this.isInnerUpdateMaster = false;
    this.updateMasterform = 'Save';
    this.api.GetMaxRecipeCode(this.model.ItemCode).subscribe((res: any) => {
      this.modelRec = res[0].RecipeCode;
      // this.receipeformMaster.get('RecCode').setValue(this.modelRec);
      this.receipeformMaster.patchValue({
        RecCode: this.modelRec,
      });
      // this.model.ItemCode=res
    });
  }

  saveType() {
    if (this.formType.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formType);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelType;
    let val = this.formType.value;
    modelType = val;
    modelType.BranchCode = this.globalBranchCode;
    modelType.AddByUserId = this.globalUserId;
    this.apiService.post(modelType, ApiEndpoints.saveItemType).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Type Saved Successfully!',
        type: NotificationType.success,
      });
      this.formType.reset();
      this.isInnerUpdate = false;
      this.LoadAllDropDownChartOfItem();
    });
  }

  changeType(e: any) {
    this.selectedType = e.value;
  }

  getRowType(data: any) {
    this.isInnerUpdate = true;
    this.itemTypeCode = data.ItemTypeCode;
    this.innerHeader = 'Update Item Type';
    this.innerBtn = 'Update';
    this.formType.patchValue({ ...data });
  }

  updateType() {
    this.typeResponse$ = this.formType.value;
    this.typeResponse$.BranchCode = this.globalBranchCode;
    this.typeResponse$.AddByUserId = this.globalUserId;
    this.typeResponse$.ItemTypeCode = this.itemTypeCode;
    this.apiService
      .update(this.typeResponse$, ApiEndpoints.updateItemType)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Type Updated Successfully!',
          type: NotificationType.success,
        });
        this.formType.reset();
        this.openNewType();
        this.LoadAllDropDownChartOfItem();
      });
  }

  addorUpdateType() {
    if (!this.isInnerUpdate) {
      this.saveType();
    } else {
      this.updateType();
    }
  }

  deleteType(ItemTypeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Item Type?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemType, { ItemTypeCode: ItemTypeCode })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Item Type Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Category API and Dropdown Rendering
  openNewCategory() {
    this.innerHeader = 'Add Item Category';
    this.innerBtn = 'Save';
    this.innerDialogCategory = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogCategory() {
    this.innerDialogCategory = false;
    this.isInnerUpdate = false;
    this.formCategory.reset();
  }

  saveCategory() {
    if (this.formCategory.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formCategory);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelCategory;
    let val = this.formCategory.value;
    modelCategory = val;
    modelCategory.BranchCode = this.globalBranchCode;
    modelCategory.AddByUserId = this.globalUserId;
    this.apiService
      .post(modelCategory, ApiEndpoints.saveItemCategory)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Category Saved Successfully!',
          type: NotificationType.success,
        });
        this.formCategory.reset();
        this.isInnerUpdate = false;
        this.LoadAllDropDownChartOfItem();
      });
  }

  changeCategory(e: any) {
    this.selectedCategory = e.value;
  }

  getRowCategory(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Item Category';
    this.innerBtn = 'Update';
    this.ItemCategoryCode = data.ItemCategoryCode;
    this.formCategory.patchValue({ ...data });
  }

  updateCategory() {
    this.categoryResponse$ = this.formCategory.value;
    this.categoryResponse$.BranchCode = this.globalBranchCode;
    this.categoryResponse$.AddByUserId = this.globalUserId;
    this.categoryResponse$.ItemCategoryCode = this.ItemCategoryCode;
    this.apiService
      .update(this.categoryResponse$, ApiEndpoints.updateItemCategory)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Category Updated Successfully!',
          type: NotificationType.success,
        });
        this.formCategory.reset();
        this.openNewCategory();
        this.LoadAllDropDownChartOfItem();
      });
  }

  addorUpdateCategory() {
    if (!this.isInnerUpdate) {
      this.saveCategory();
    } else {
      this.updateCategory();
    }
  }

  deleteCategory(ItemCategoryCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Item Category?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemCategory, {
            ItemCategoryCode: ItemCategoryCode,
          })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Category Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Grade API and Dropdown Rendering
  openNewGrade() {
    this.innerHeader = 'Add Item Grade';
    this.innerBtn = 'Save';
    this.innerDialogGrade = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogGrade() {
    this.innerDialogGrade = false;
    this.isInnerUpdate = false;
    this.formGrade.reset();
  }

  saveGrade() {
    if (this.formGrade.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formGrade);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelGrade;
    let val = this.formGrade.value;
    modelGrade = val;
    modelGrade.BranchCode = this.globalBranchCode;
    modelGrade.AddByUserId = this.globalUserId;
    this.apiService
      .post(modelGrade, ApiEndpoints.saveItemGrade)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Grade Saved Successfully!',
          type: NotificationType.success,
        });
        this.formGrade.reset();
        this.isInnerUpdate = false;
        this.LoadAllDropDownChartOfItem();
      });
  }

  changeGrade(e: any) {
    this.selectedGrade = e.value;
  }

  getRowGrade(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Item Grade';
    this.innerBtn = 'Update';
    this.ItemGradeCode = data.ItemGradeCode;
    this.formGrade.patchValue({ ...data });
  }

  updateGrade() {
    this.gradeResponse$ = this.formGrade.value;
    this.gradeResponse$.BranchCode = this.globalBranchCode;
    this.gradeResponse$.AddByUserId = this.globalUserId;
    this.gradeResponse$.ItemGradeCode = this.ItemGradeCode;
    this.apiService
      .update(this.gradeResponse$, ApiEndpoints.updateItemGrade)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Grade Updated Successfully!',
          type: NotificationType.success,
        });
        this.formGrade.reset();
        this.openNewGrade();
        this.LoadAllDropDownChartOfItem();
      });
  }

  addorUpdateGrade() {
    if (!this.isInnerUpdate) {
      this.saveGrade();
    } else {
      this.updateGrade();
    }
  }

  deleteGrade(ItemGradeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Grade?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemGrade, { ItemGradeCode })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Grade Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Manufacturer API and Dropdown Rendering
  openNewManufacturer() {
    this.innerHeader = 'Add Manufacturer';
    this.innerBtn = 'Save';
    this.innerDialogManufacturer = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogManufacturer() {
    this.innerDialogManufacturer = false;
    this.isInnerUpdate = false;
    this.formManufacturer.reset();
  }

  saveManufacturer() {
    if (this.formManufacturer.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formManufacturer);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelManufacturer;
    let val = this.formManufacturer.value;
    modelManufacturer = val;
    modelManufacturer.BranchCode = this.globalBranchCode;
    modelManufacturer.AddByUserId = this.globalUserId;
    this.apiService
      .post(modelManufacturer, ApiEndpoints.saveItemManufacturer)

      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Manufacturer Saved Successfully!',
          type: NotificationType.success,
        });
        this.formManufacturer.reset();
        this.isInnerUpdate = false;
        this.LoadAllDropDownChartOfItem();
      });
  }

  changeManufacturer(e: any) {
    this.selectedManufacturer = e.value;
  }

  getRowManufacturer(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Manufacturer';
    this.innerBtn = 'Update';
    this.ItemManufacturerCode = data.ItemManufacturerCode;
    this.formManufacturer.patchValue({ ...data });
  }

  updateManufacturer() {
    this.manufacturerResponse$ = this.formManufacturer.value;
    this.manufacturerResponse$.BranchCode = this.globalBranchCode;
    this.manufacturerResponse$.AddByUserId = this.globalUserId;
    this.manufacturerResponse$.ItemManufacturerCode = this.ItemManufacturerCode;
    this.apiService
      .update(this.manufacturerResponse$, ApiEndpoints.updateItemManufacturer)

      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Manufacturer Update Successfully!',
          type: NotificationType.success,
        });
        this.formManufacturer.reset();
        this.openNewManufacturer();
        this.LoadAllDropDownChartOfItem();
      });
  }

  addorUpdateManufacturer() {
    if (!this.isInnerUpdate) {
      this.saveManufacturer();
    } else {
      this.updateManufacturer();
    }
  }

  deleteManufacturer(ItemManufacturerCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Manufaturer?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemManufacturer, { ItemManufacturerCode })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Manufacturer Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Brand API and Dropdown Rendering
  openNewBrand() {
    this.innerHeader = 'Add Item Brand';
    this.innerBtn = 'Save';
    this.innerDialogBrand = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogBrand() {
    this.innerDialogBrand = false;
    this.isInnerUpdate = false;
    this.formBrand.reset();
  }

  saveBrand() {
    if (this.formBrand.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formBrand);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelBrand;
    let val = this.formBrand.value;
    modelBrand = val;
    modelBrand.BranchCode = this.globalBranchCode;
    modelBrand.AddByUserId = this.globalUserId;
    this.apiService
      .post(modelBrand, ApiEndpoints.saveItemBrand)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Brand Saved Successfully!',
          type: NotificationType.success,
        });
        this.formBrand.reset();
        this.isInnerUpdate = false;
        this.LoadAllDropDownChartOfItem();
      });
  }

  changeBrand(e: any) {
    this.selectedBrand = e.value;
  }

  getRowBrand(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Item Brand';
    this.innerBtn = 'Update';
    this.ItemBrandCode = data.ItemBrandCode;
    this.formBrand.patchValue({ ...data });
  }

  updateBrand() {
    this.brandResponse$ = this.formBrand.value;
    this.brandResponse$.BranchCode = this.globalBranchCode;
    this.brandResponse$.AddByUserId = this.globalUserId;
    this.brandResponse$.ItemBrandCode = this.ItemBrandCode;
    this.apiService
      .update(this.brandResponse$, ApiEndpoints.updateItemBrand)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Brand Updated Successfully!',
          type: NotificationType.success,
        });
        this.formBrand.reset();
        this.openNewBrand();
        this.LoadAllDropDownChartOfItem();
      });
  }

  addorUpdateBrand() {
    if (!this.isInnerUpdate) {
      this.saveBrand();
    } else {
      this.updateBrand();
    }
  }

  deleteBrand(ItemBrandCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Brand?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemBrand, { ItemBrandCode })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Brand Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Model API and Dropdown Rendering
  openNewModel() {
    this.innerHeader = 'Add Item Model';
    this.innerBtn = 'Save';
    this.innerDialogModel = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogModel() {
    this.innerDialogModel = false;
    this.isInnerUpdate = false;
    this.formModel.reset();
  }

  saveModel() {
    if (this.formModel.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formModel);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let modelModel;
    let val = this.formModel.value;
    modelModel = val;
    modelModel.BranchCode = this.globalBranchCode;
    modelModel.AddByUserId = this.globalUserId;
    this.apiService
      .post(modelModel, ApiEndpoints.saveItemModel)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Model Saved Successfully!',
          type: NotificationType.success,
        });
        this.formModel.reset();
        this.isInnerUpdate = false;
        this.LoadAllDropDownChartOfItem();
      });
  }

  changeModel(e: any) {
    this.selectedModel = e.value;
  }

  getRowModel(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Item Model';
    this.innerBtn = 'Update';
    this.ItemModelCode = data.ItemModelCode;
    this.formModel.patchValue({ ...data });
  }

  updateModel() {
    this.modelResponse$ = this.formModel.value;
    this.modelResponse$.BranchCode = this.globalBranchCode;
    this.modelResponse$.AddByUserId = this.globalUserId;
    this.modelResponse$.ItemModelCode = this.ItemModelCode;
    this.apiService
      .update(this.modelResponse$, ApiEndpoints.updateItemModel)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Model Updated Successfully!',
          type: NotificationType.success,
        });
        this.formModel.reset();
        this.openNewModel();
        this.LoadAllDropDownChartOfItem();
      });
  }

  onRefresh() {
    this.resetForm();
    this.isupdateMasterDetail = false;
    this.receipeformMasterDetail.reset();
  }

  addorUpdateModel() {
    if (!this.isInnerUpdate) {
      this.saveModel();
    } else {
      this.updateModel();
    }
  }

  deleteModel(ItemModelCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Modal?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemModel, {
            BranchCode: this.globalBranchCode,
            ItemModelCode,
          })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Model Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  //Unit API and Dropdown Rendering
  openNewUnit() {
    this.innerHeader = 'Add Item Unit';
    this.innerBtn = 'Save';
    this.innerDialogUnit = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  hideDialogUnit() {
    this.innerDialogUnit = false;
    this.isInnerUpdate = false;
    this.formUnit.reset();
  }

  saveUnit() {
    if (this.formUnit.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.formUnit);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let unitModel;
    let val = this.formUnit.value;
    unitModel = val;
    unitModel.BranchCode = this.globalBranchCode;
    unitModel.AddByUserId = this.globalUserId;
    this.apiService.post(unitModel, ApiEndpoints.saveItemUnit).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Unit Saved Successfully!',
        type: NotificationType.success,
      });
      this.formUnit.reset();
      this.isInnerUpdate = false;
      this.LoadAllDropDownChartOfItem();
    });
  }

  changeUnit(e: any) {
    this.selectedUnit = e.value;
  }

  getRowUnit(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Item Unit';
    this.innerBtn = 'Update';
    this.ItemUnitCode = data.ItemUnitCode;
    this.formUnit.patchValue({ ...data });
  }

  updateUnit() {
    this.unitResponse$ = this.formUnit.value;
    this.unitResponse$.BranchCode = this.globalBranchCode;
    this.unitResponse$.AddByUserId = this.globalUserId;
    this.unitResponse$.ItemUnitCode = this.ItemUnitCode;
    this.apiService
      .update(this.unitResponse$, ApiEndpoints.updateItemUnit)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Unit Update Successfully!',
          type: NotificationType.success,
        });
        this.formUnit.reset();
        this.openNewUnit();
        this.LoadAllDropDownChartOfItem();
      });
  }

  addorUpdateUnit() {
    if (!this.isInnerUpdate) {
      this.saveUnit();
    } else {
      this.updateUnit();
    }
  }

  deleteUnit(ItemUnitCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Unit?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemUnit, { ItemUnitCode: ItemUnitCode })
          .subscribe((res) => {
            this.LoadAllDropDownChartOfItem();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Unit Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }
  openNewReceipe() {
    this.receipeHeader = 'Add Receipe';
    this.innerRecBtn = 'Save';
    this.innerDialogRec = true;
    this.api.GetMaxRecipeCode(this.model.ItemCode).subscribe((res: any) => {
      this.modelRec = res[0].RecipeCode;
      // this.model.ItemCode=res
    });
    this.api
      .GetItemRecipeMasterDetails(this.model.ItemCode)
      .subscribe((res: any) => {
        // this.receipeMasterDetail=res;
        this.table1DataMaster = res.Table1;
        this.table2DataMasterDetails = res.Table2;
      });
  }
  deleteReceDetail(RecipeCode: number, Itemcode: any) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${RecipeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .DeleteItemRecipeDetail(RecipeCode, Itemcode)
          .subscribe((res) => {
            // this.loadAllUnit();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Recipe Deleted Successfully!',
                type: NotificationType.error,
                title: 'Success',
              });
            }
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
  }

  getRowReceMasterDetail(data: any) {
    this.isupdateMasterDetail = true;
    this.isInnerUpdateMasterDetail = true;
    // this.innerHeader = 'Update Unit Item';
    this.innerBtn = 'Update';
    this.receipeMasterDetailModel = { ...data };
  }

  addorUpdateRecformMaster() {
    if (!this.isInnerUpdateMaster) {
      this.saveRecformMaster();
    } else {
      this.updateRecformMaster();
    }
  }

  saveRecformMaster() {
    let modelModel;
    let val = this.receipeformMaster.value;
    modelModel = val;
    modelModel.RecipeCode = modelModel.RecCode;
    modelModel.ItemCode = modelModel.ItemRecCode;
    modelModel.IsActive = modelModel.active;
    modelModel.IsApproved = modelModel.approved;
    modelModel.TotalCost = modelModel.TotalCost;
    modelModel.Remarks = modelModel.recRemark;
    this.api.CreateNewItemRecipeMaster(modelModel).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Recipe Saved Successfully!',
        type: NotificationType.success,
      });
    });
  }
  updateRecformMaster() {
    let modelModel;
    let val = this.receipeformMaster.value;
    modelModel = val;
    modelModel.RecipeCode = modelModel.RecCode;
    modelModel.ItemCode = modelModel.ItemRecCode;
    modelModel.IsActive = modelModel.active;
    modelModel.IsApproved = modelModel.approved;
    modelModel.TotalCost = modelModel.TotalCost;
    modelModel.Remarks = modelModel.recRemark;
    this.api.UpdateItemRecipeMaster(modelModel).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Recipe Updated Successfully!',
        type: NotificationType.success,
      });
      this.receipeformMaster.reset();
    });
  }
  addorUpdateMasterDetail() {
    if (!this.isupdateMasterDetail) {
      this.saveRecformMasterDetail();
    } else {
      this.updateRecformMasterDetail();
    }
  }
  saveRecformMasterDetail() {
    let modelModel;
    let val = this.receipeformMasterDetail.value;
    modelModel = val;
    modelModel.RecipeCode = this.table1DataMaster[0].RecipeCode;
    modelModel.Itemcode = this.selectedParentReceipDetail;
    modelModel.Unit = modelModel.unitRec;
    modelModel.Qty = modelModel.qtyRec;
    modelModel.Price = modelModel.priceRec;
    modelModel.Remarks = modelModel.recRemark2;
    this.api.CreateNewItemRecipeDetails(modelModel).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Recipe Saved Successfully!',
        type: NotificationType.success,
      });
    });
  }
  updateRecformMasterDetail() {
    let modelModel;
    let val = this.receipeformMasterDetail.value;
    modelModel = val;
    modelModel.RecipeCode = this.table1DataMaster[0].RecipeCode;
    modelModel.Itemcode = this.selectedParentReceipDetail;
    modelModel.Unit = modelModel.unitRec;
    modelModel.Qty = modelModel.qtyRec;
    modelModel.Price = modelModel.priceRec;
    modelModel.Remarks = modelModel.recRemark2;
    this.api.UpdateItemRecipeDetail(modelModel).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Recipe Updated Successfully!',
        type: NotificationType.success,
      });
      this.receipeformMasterDetail.reset();
    });
  }

  //==================================Upload Image ================================

  selectedFiles: File[] = [];
  uploadedImages: UploadedFile[] = [];

  imageData: any;
  selectFiles(event: any): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      // Clear existing uploaded images and selected files
      this.uploadedImages = [];
      this.selectedFiles = [];

      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const uploadedFile: UploadedFile = {
            file: files[i],
            url: e.target.result,
          };
          this.uploadedImages.push(uploadedFile);
        };
        reader.readAsDataURL(files[i]);
      }
      // Set the model.ItemImagePath to the path of the selected file
      this.model.ItemImagePath = files[0].name;
      this.displayImage();
    }
  }

  getImage(itemCode: any) {
    //
    if (!this.imageData) {
      this.api.GetImageByItemCode(itemCode).subscribe(
        (response: any) => {
          //
          this.imageData = response;
        },
        (error) => {
          console.error('Error fetching image:', error);
        }
      );
    }
  }

  displayImage() {
    this.formReset = true;
    if (this.imageData) {
      const contentType = 'image/jpeg';
      const base64Data = btoa(
        String.fromCharCode(...new Uint8Array(this.imageData))
      );
      return `data:${contentType};base64,${base64Data}`;
    } else if (this.selectedFiles && this.selectedFiles.length > 0) {
      return this.uploadedImages[0].url;
    } else {
      return '../../../../assets/user.svg';
    }
  }

  //==================================

  extractFileNameFromPath(path: any): void {
    if (path) {
      const parts = path.split('\\');
      return parts[parts.length - 1];
    }
  }

  // Call this function to get the filename
  getFileName(): void {
    return this.extractFileNameFromPath(this.model.ItemImagePath);
  }
  resetForm() {
    this.isUpdate = false;
    this.formsInit();
    this.formReset = false;
    this.model.ItemImagePath = '';
    this.selectedRow = '';
    this.uploadedImages = [];
    this.imageData = null;
  }

  LoadAllDropDownChartOfItem() {
    this.apiService
      .get(
        ApiEndpoints.getDropDownChartOfItem +
          `?BranchCode=${this.globalBranchCode}`
      )
      .subscribe({
        next: (res: any) => {
          //Taxes
          this.TaxResponse$ = res.Taxes;

          //Parent Codes
          this.parentCodeResponse$ = res.ParentCode;

          //Item Type
          this.typeResponse$ = res.ItemType;
          this.typeDropDown = res.ItemType.filter(
            (x: any) => x.IsActive === true
          );

          //Item Unit
          this.unitResponse$ = res.ItemUnit;
          this.unitDropDown = res.ItemUnit.filter(
            (x: any) => x.IsActive === true
          );

          // Item Sizes
          this.sizeResponse$ = res.ItemSize;
          this.sizeDropDown = res.ItemSize.filter(
            (x: any) => x.IsActive === true
          );

          // Item Grades
          this.gradeResponse$ = res.ItemGrade;
          this.gradeDropDown = res.ItemGrade.filter(
            (x: any) => x.IsActive === true
          );

          // Item Brands
          this.brandResponse$ = res.ItemBrand;
          this.brandDropDown = res.ItemBrand.filter(
            (x: any) => x.IsActive === true
          );

          // Item Modals
          this.modelResponse$ = res.ItemModel;
          this.modelDropDown = res.ItemModel.filter(
            (x: any) => x.IsActive === true
          );

          // Item Colors
          this.colourResponse$ = res.ItemColour;
          this.colourDropDown = res.ItemColour.filter(
            (x: any) => x.IsActive === true
          );

          // Item Categories
          this.categoryResponse$ = res.ItemCategory;
          this.categoryDropDown = res.ItemCategory.filter(
            (x: any) => x.IsActive === true
          );

          // Item Manufacturers
          this.manufacturerResponse$ = res.ItemManufacturer;
          this.manufacturerDropDown = res.ItemManufacturer.filter(
            (x: any) => x.IsActive === true
          );

          //Stores
          this.storeResponse$ = res.Stores.map((x: any) => {
            return {
              StoreCode: x.DepartmentCode,
              StoreName: x.DepartmentName,
            };
          });

          //COAccounts Heades
          this.account = res.COAccountsHeades;

          //COAssets Heades
          this.aasets = res.COAssetsHeades;
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error in Loading Data!',
            type: NotificationType.error,
          });
        },
      });
  }

  onSubmit() {
    // if (this.addNewItemform.invalid) {
    //   this._utilityService.markAllFieldsAsDirtyAndTouched(
    //     this.addNewItemform
    //   );
    //   this._toastService.sendMessage({
    //     message: 'Please Check Form Values',
    //     type: NotificationType.error,
    //     title: 'Invalid Form',
    //   });
    //   return;
    // }
    this.addorUpdate();

    // const payLoad: IRecruitmentRequirement = {
    //   ...this.formValues,
    // };

    //   if (this.isUpdate) {
    //     this.updateRecruitmentRequirement(payLoad);
    //   } else {
    //     this.postRecruitmentRequirement(payLoad);
    //   }
    // }
  }
}
