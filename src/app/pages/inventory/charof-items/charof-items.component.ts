import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';

@Component({
  selector: 'app-charof-items',
  templateUrl: './charof-items.component.html',
  styleUrls: ['./charof-items.component.scss'],
})
export class CharofItemsComponent implements OnInit {
  // charofitems
  chartResponse!: TreeNode[];

  mainHeader!: string;
  mainDialog!: boolean;
  mainBtn!: string;
  model: any = [];
  isUpdate!: boolean;
  form!: FormGroup;
  storeResponse$: any = [];
  coaResponse$: any = [];
  parentCodeResponse$: any = [];
  selectedParentCode!: string;
  selectedCOAHead!: string;
  selectedStores: any[] = [];
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

  //Size
  formSize!: FormGroup;
  sizeResponse$: any = [];
  sizeModel$: any = [];
  selectedSize!: number;
  innerDialogSize!: boolean;

  //Colour
  formColour!: FormGroup;
  colourResponse$: any = [];
  colourModel$: any = [];
  innerDialogColour!: boolean;
  selectedColour!: number;

  //Type
  formType!: FormGroup;
  typeResponse$: any = [];
  typeModel$: any = [];
  innerDialogType!: boolean;
  selectedType!: number;

  //Category
  formCategory!: FormGroup;
  categoryResponse$: any = [];
  categoryModel$: any = [];
  innerDialogCategory!: boolean;
  selectedCategory!: number;

  //Grade
  formGrade!: FormGroup;
  gradeResponse$: any = [];
  gradeModel$: any = [];
  innerDialogGrade!: boolean;
  selectedGrade!: number;

  //Manufacturer
  formManufacturer!: FormGroup;
  manufacturerResponse$: any = [];
  manufacturerModel$: any = [];
  innerDialogManufacturer!: boolean;
  selectedManufacturer!: number;

  //Brand
  formBrand!: FormGroup;
  brandResponse$: any = [];
  brandModel$: any = [];
  innerDialogBrand!: boolean;
  selectedBrand!: number;

  //Model
  formModel!: FormGroup;
  modelResponse$: any = [];
  modelModel$: any = [];
  innerDialogModel!: boolean;
  selectedModel!: number;
  selectedFiles: File[] = [];

  //Unit
  formUnit!: FormGroup;
  unitResponse$: any = [];
  unitModel$: any = [];
  innerDialogUnit!: boolean;
  selectedUnit!: number;
  constructor(private apiService: ApiProviderService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    //form
    this.form = this.fb.group({
      ItemCode: this.fb.control(''),
      ParentItemCode: this.fb.control(''),
      ItemCodeWithSeperator: this.fb.control(''),
      ItemName: this.fb.control(''),
      ShortName: this.fb.control(''),
      MinLevel: this.fb.control(''),
      MaxLevel: this.fb.control(''),
      CreatedOn: this.fb.control(''),
      ApprovedOn: this.fb.control(''),
      HasDetail: this.fb.control(''),
      IsDetail: this.fb.control(''),
      Hirarchy: this.fb.control(''),
      Remarks: this.fb.control(''),
      ItemSizeCode: this.fb.control(''), // 1.
      ItemColourCode: this.fb.control(''), // 2.
      ItemTypeCode: this.fb.control(''), // 3.
      ItemCategoryCode: this.fb.control(''), //4.
      ItemGradeCode: this.fb.control(''), //5.
      ItemManufacturerCode: this.fb.control(''), //6.
      ItemBrandCode: this.fb.control(''), //7.
      ItemModelCode: this.fb.control(''), //8.
      ItemUnitCode: this.fb.control(''), //9.
      RegistrationNo: this.fb.control(''),
      ItemSrNo: this.fb.control(''),
      Store: this.fb.control(''),
      SalePrice: this.fb.control(''),
      AccountCode: this.fb.control(''),
    });
    //Main
    this.loadAllChartItem();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.loadAllParentCodeItem();
    this.loadAllChartOfAccountHead();
    this.loadAllStoreItem();
    //Size
    //Main
    this.loadAllChartItem();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.loadAllParentCodeItem();
    this.loadAllChartOfAccountHead();
    this.loadAllStoreItem();
    //Size
    this.loadAllSize();
    this.formSize = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemSize: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Colour
    this.loadAllColour();
    this.formColour = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemColour: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Type
    this.loadAllType();
    this.formType = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemType: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Category
    this.loadAllCategory();
    this.formCategory = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemCategory: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Grade
    this.loadAllGrade();
    this.formGrade = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemGrade: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Manufacturer
    this.loadAllManufacturer();
    this.formManufacturer = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemManufacturer: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Brand
    this.loadAllBrand();
    this.formBrand = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemBrand: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Model
    this.loadAllModel();
    this.formModel = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemModel: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });

    //Unit
    this.loadAllUnit();
    this.formUnit = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemUnit: this.fb.control(''),
      ShortName: this.fb.control(''),
      IsActive: this.fb.control(false),
      AddByUserId: this.fb.control(''),
    });
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  loadAllChartOfAccountHead() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res) => {
      this.coaResponse$ = res;
    });
  }

  loadAllStoreItem() {
    this.apiService.get(ApiEndpoints.getItemStores + `?BranchCode=${this.globalBranchCode}&ItemCode=${0}`).subscribe((res: any) => {
      this.storeResponse$ = res.map((x: any) => {
        return {
          StoreCode: x.StoreCode,
          StoreName: x.StoreName,
        };
      });
    });
  }

  loadAllParentCodeItem() {
    this.apiService.get(ApiEndpoints.getAllParentCode).subscribe((res) => {
      this.parentCodeResponse$ = res;
    });
  }

  changeParentCode(event: any) {
    this.selectedParentCode = event?.value;
  }
  changeCOAHead(event: any) {
    this.selectedCOAHead = event?.value;
  }
  hideDialog() {
    this.mainDialog = false;
    this.form.reset();
  }
  addorUpdate() {
    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }
  save() {

    this.model = this.form.value;
    this.model.IsActive = true;
    this.model.BranchCode = +this.globalBranchCode;
    this.model.ItemImagePath = this.selectedFiles[0].name;
    if (!this.selectedParentCode) {
      this.model.ParentItemCode = '0';
    } else {
      this.model.ParentItemCode = this.selectedParentCode.replace(/-/g, '');
    }

    this.model.CreatedBy = +this.globalUserId;
    this.model.ApprovedBy = +this.globalUserId;
    this.model.ItemSizeCode = +this.selectedSize;
    this.model.ItemColourCode = +this.selectedColour;
    this.model.ItemTypeCode = +this.selectedType;
    this.model.ItemCategoryCode = +this.selectedCategory;
    this.model.ItemGradeCode = +this.selectedGrade;
    this.model.ItemManufacturerCode = +this.selectedManufacturer;
    this.model.ItemBrandCode = +this.selectedBrand;
    this.model.ItemModelCode = +this.selectedModel;
    this.model.ItemUnitCode = +this.selectedUnit;
    if (!this.selectedCOAHead) {
      this.model.AccountCode = 0;
    } else {
      this.model.AccountCode = +this.selectedCOAHead;
    }
    // this.model.AccountCode = +this.selectedCOAHead;
    this.model.IsDetail = true;
    this.model.HasDetail = false;
    const itemcode = this.form.get('ItemCode')?.value;
    const storeCodeValue = this.selectedStores;
    let len = Object.values(storeCodeValue).length;
    for (let i = 0; i < len; i++) {
      let x: number[] = this.form.get('Store')?.value;
      let y: any = x.pop();
      let storeData: any = [];
      storeData.BranchCode = this.globalBranchCode;
      if (!this.selectedParentCode) {
        storeData.ItemCode = itemcode;
      } else {
        storeData.ItemCode = this.model.ParentItemCode.concat(itemcode);
      }
      storeData.StoreCode = y?.StoreCode!;
      this.apiService.post(storeData, ApiEndpoints.saveStoreItem).subscribe();
    }

    if (this.model.ParentItemCode === '0') {
      this.model.ItemCodeWithSeperator = itemcode;
      this.model.ItemCode = itemcode;
    } else {
      this.model.ItemCode = this.model.ParentItemCode.concat(itemcode).replace(
        /-/g,
        ''
      );
      this.model.ItemCodeWithSeperator = this.selectedParentCode.concat(
        '-',
        itemcode
      );
    }
    const itemwithsep: string = this.model.ItemCodeWithSeperator;
    const count = (itemwithsep.match(/[-]/g) || []).length;
    this.model.LevelCode = count + 1;
    this.apiService.post(this.model, ApiEndpoints.saveChartofItem).subscribe(() => {
      this.parentCodeResponse$ = [];
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Record Saved!',
        life: 3000,
      });
      this.loadAllChartItem();
      this.openNew();
    });
  }
  getRow(data: any) {
    this.mainHeader = 'Update Item Information';
    this.mainBtn = 'Update';
    this.mainDialog = true;
    this.isUpdate = true;
    this.model = { ...data };
    let x = this.parentCodeResponse$.find((x: any) => {
      let rem = x.ItemCode.replace(/-/g, '');
      return rem == this.model.ParentItemCode;
    });
    this.parentwithName = `${x?.ItemCode} - ${x?.ItemName}`;
    if (this.parentwithName.includes('undefined')) {
      this.parentwithName = '0';
    }
    this.getItemStore(this.globalBranchCode, this.model.ItemCode);
  }
  getItemStore(BranchCode: number, ItemCode: string) {
    this.apiService.get(ApiEndpoints.getItemStores + `?BranchCode=${BranchCode}&ItemCode=${ItemCode}`).subscribe((res: any) => {
      const filteredOptions = res.filter((x: any) => x.Selected);
      this.selectedStores = filteredOptions.map((x: any) => {
        return {
          StoreCode: x.StoreCode,
          StoreName: x.StoreName,
        };
      });
    });
  }
  update() {
    this.model.BranchCode = +this.globalBranchCode;
    this.model.ModifiedBy = +this.globalUserId;
    this.model.AccountCode = this.selectedCOAHead;
    this.apiService.update(this.model, ApiEndpoints.updateChartofItem).subscribe((res) => {
      this.loadAllChartItem();
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Updated',
      life: 3000,
    });
    this.openNew();
  }
  deleteChartItem(id: string) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete ' + id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteChartofItem, { ItemCode: id }).subscribe((res) => {
          this.loadAllChartItem();
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
  loadAllChartItem() {
    this.apiService.get(ApiEndpoints.GetChartOfItemsTree).subscribe((res: any) => {
      this.chartResponse = this.transformItemDatatree(res);
    });
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
                      ItemCodeWithSeperator: grandChildChildItem.ItemCodeWithSeperator,
                      ItemName: grandChildChildItem.ItemName,
                      HasDetail: grandChildChildItem.HasDetail,
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
                      ItemManufacturerCode: grandChildChildItem.ItemManufacturerCode,
                      ItemBrandCode: grandChildChildItem.ItemBrandCode,
                      ItemModelCode: grandChildChildItem.ItemModelCode,
                      ItemUnitCode: grandChildChildItem.ItemUnitCode,
                      RegistrationNo: grandChildChildItem.RegistrationNo,
                      ItemSrNo: grandChildChildItem.ItemSrNo,
                      ItemImagePath: grandChildChildItem.ItemImagePath,
                      AccountCode: grandChildChildItem.AccountCode,
                      AccountName: grandChildChildItem.AccountName,
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
                  ItemImagePath: grandChildItem.ItemImagePath,
                  AccountCode: grandChildItem.AccountCode,
                  AccountName: grandChildItem.AccountName,
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
              ItemImagePath: childItem.ItemImagePath,
              AccountCode: childItem.AccountCode,
              AccountName: childItem.AccountName,
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
          ItemImagePath: item.ItemImagePath,
          AccountCode: item.AccountCode,
          AccountName: item.AccountName,
        },
        children: childNodes,
      };

      treeNodes.push(treeNode);
    }

    return treeNodes;
  }

  openNew() {
    this.mainHeader = 'Add Item Information';
    this.mainBtn = 'Save';
    this.mainDialog = true;
    this.isUpdate = false;
    this.form.reset();
    this.loadAllParentCodeItem();
  }

  // Size API and Dropdown Rendering
  openNewSize() {
    this.innerHeader = 'Add Size Item';
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

  loadAllSize() {
    this.apiService.get(ApiEndpoints.getAllItemSize, { BranchCode: this.globalBranchCode })
    .subscribe((res) => {
      this.sizeResponse$ = res;
    });
  }

  saveSize() {
    let modelSize;
    let val = this.formSize.value;
    modelSize = val;
    modelSize.BranchCode = this.globalBranchCode;
    modelSize.AddByUserId = this.globalUserId;
    this.apiService.post(modelSize, ApiEndpoints.saveItemSize)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Size Saved Successfully!',
        type: NotificationType.success,
      });
      this.formSize.reset();
      this.loadAllSize();
    });
  }

  changeSize(e: any) {
    this.selectedSize = e.target.value;
  }

  getRowSize(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Size Item';
    this.innerBtn = 'Update';
    this.sizeModel$ = { ...data };
  }

  updateSize() {
    this.sizeResponse$ = this.sizeModel$;
    this.sizeResponse$.BranchCode = this.globalBranchCode;
    this.sizeResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.sizeResponse$, ApiEndpoints.updateItemSize)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Size Updated Successfully!',
        type: NotificationType.success,
      });
      this.formSize.reset();
      this.openNewSize();
      this.loadAllSize();
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
      message: `Are you sure that you want to delete this Code ${ItemSizeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemSize, { ItemSizeCode: ItemSizeCode })
        .subscribe((res) => {
          this.loadAllSize();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Size Deleted Successfully!',
              type: NotificationType.warning,
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
    this.innerHeader = 'Add Colour Item';
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

  loadAllColour() {
    this.apiService.get(ApiEndpoints.getAllItemColour, { BranchCode: this.globalBranchCode })
    .subscribe((res) => {
      this.colourResponse$ = res;
    });
  }

  saveColour() {
    let modelColour;
    let val = this.formColour.value;
    modelColour = val;
    modelColour.BranchCode = this.globalBranchCode;
    modelColour.AddByUserId = this.globalUserId;
    this.apiService.post(modelColour, ApiEndpoints.saveItemColour)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Colour Saved Successfully!',
        type: NotificationType.success,
      });
      this.formColour.reset();
      this.loadAllColour();
      this.isInnerUpdate = false;
    });
  }

  changeColour(e: any) {
    this.selectedColour = e.target.value;
  }

  getRowColour(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Colour Item';
    this.innerBtn = 'Update';
    this.colourModel$ = { ...data };
  }

  updateColour() {
    this.colourResponse$ = this.colourModel$;
    this.colourResponse$.BranchCode = this.globalBranchCode;
    this.colourResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.colourResponse$, ApiEndpoints.updateItemColour)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Colour Updated Successfully!',
        type: NotificationType.success,
      });
      this.formColour.reset();
      this.openNewColour();
      this.loadAllColour();
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
      message: `Are you sure that you want to delete this Code ${ItemColourCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemColour, { ItemColourCode })
        .subscribe((res) => {
          this.loadAllColour();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Colour Deleted Successfully!',
              type: NotificationType.warning,
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
    this.innerHeader = 'Add Type Item';
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

  loadAllType() {
    this.apiService.get(ApiEndpoints.getAllItemType, { BranchCode:this.globalBranchCode })
    .subscribe((res) => {
      this.typeResponse$ = res;
    });
  }

  saveType() {
    let modelType;
    let val = this.formType.value;
    modelType = val;
    modelType.BranchCode = this.globalBranchCode;
    modelType.AddByUserId = this.globalUserId;
    this.apiService.post(modelType, ApiEndpoints.saveItemType)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Type Saved Successfully!',
        type: NotificationType.success,
      });
      this.formType.reset();
      this.loadAllType();
      this.isInnerUpdate = false;
    });
  }

  changeType(e: any) {
    this.selectedType = e.target.value;
  }

  getRowType(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Type Item';
    this.innerBtn = 'Update';
    this.typeModel$ = { ...data };
  }

  updateType() {
    this.typeResponse$ = this.typeModel$;
    this.typeResponse$.BranchCode = this.globalBranchCode;
    this.typeResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.typeResponse$, ApiEndpoints.updateItemType)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Type Updated Successfully!',
        type: NotificationType.success,
      });
      this.formType.reset();
      this.openNewType();
      this.loadAllType();
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
      message: `Are you sure that you want to delete this Code ${ItemTypeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemType, { ItemTypeCode:ItemTypeCode })
        .subscribe((res) => {
          this.loadAllType();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Type Deleted Successfully!',
              type: NotificationType.warning,
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
    this.innerHeader = 'Add Category Item';
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

  loadAllCategory() {
    this.apiService.get(ApiEndpoints.getAllItemCategory, { BranchCode :this.globalBranchCode })
      .subscribe((res) => {
        this.categoryResponse$ = res;
      });
  }

  saveCategory() {
    let modelCategory;
    let val = this.formCategory.value;
    modelCategory = val;
    modelCategory.BranchCode = this.globalBranchCode;
    modelCategory.AddByUserId = this.globalUserId;
    this.apiService.post(modelCategory, ApiEndpoints.saveItemCategory)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Category Saved Successfully!',
        type: NotificationType.success,
      });
      this.formCategory.reset();
      this.loadAllCategory();
      this.isInnerUpdate = false;
    });
  }

  changeCategory(e: any) {
    this.selectedCategory = e.target.value;
  }

  getRowCategory(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Category Item';
    this.innerBtn = 'Update';
    this.categoryModel$ = { ...data };
  }

  updateCategory() {
    this.categoryResponse$ = this.categoryModel$;
    this.categoryResponse$.BranchCode = this.globalBranchCode;
    this.categoryResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.categoryResponse$, ApiEndpoints.updateItemCategory)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Category Updated Successfully!',
          type: NotificationType.success,
        });
        this.formCategory.reset();
        this.openNewCategory();
        this.loadAllCategory();
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
      message: `Are you sure that you want to delete this Code ${ItemCategoryCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemCategory, { ItemCategoryCode: ItemCategoryCode })
          .subscribe((res) => {
            this.loadAllCategory();
            if (res === 200) {
              return this.toastService.sendMessage({
                message: 'Category Deleted Successfully!',
                type: NotificationType.warning,
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
    this.innerHeader = 'Add Grade Item';
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

  loadAllGrade() {
    this.apiService.get(ApiEndpoints.getAllItemGrade, { BranchCode: this.globalBranchCode})
    .subscribe((res) => {
      this.gradeResponse$ = res;
    });
  }

  saveGrade() {
    let modelGrade;
    let val = this.formGrade.value;
    modelGrade = val;
    modelGrade.BranchCode = this.globalBranchCode;
    modelGrade.AddByUserId = this.globalUserId;
    this.apiService.post(modelGrade, ApiEndpoints.saveItemGrade)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Grade Saved Successfully!',
        type: NotificationType.success,
      });
      this.formGrade.reset();
      this.loadAllGrade();
      this.isInnerUpdate = false;
    });
  }

  changeGrade(e: any) {
    this.selectedGrade = e.target.value;
  }

  getRowGrade(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Grade Item';
    this.innerBtn = 'Update';
    this.gradeModel$ = { ...data };
  }

  updateGrade() {
    this.gradeResponse$ = this.gradeModel$;
    this.gradeResponse$.BranchCode = this.globalBranchCode;
    this.gradeResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.gradeResponse$, ApiEndpoints.updateItemGrade)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Grade Updated Successfully!',
        type: NotificationType.success,
      });
      this.formGrade.reset();
      this.openNewGrade();
      this.loadAllGrade();
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
      message: `Are you sure that you want to delete this Code ${ItemGradeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemGrade, { ItemGradeCode :ItemGradeCode })
        .subscribe((res) => {
          this.loadAllGrade();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Grade Deleted Successfully!',
              type: NotificationType.warning,
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
    this.innerHeader = 'Add Manufacturer Item';
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

  loadAllManufacturer() {
    this.apiService.get(ApiEndpoints.getAllItemManufacturer, { BranchCode: this.globalBranchCode })
      .subscribe((res) => {
        this.manufacturerResponse$ = res;
      });
  }

  saveManufacturer() {
    let modelManufacturer;
    let val = this.formManufacturer.value;
    modelManufacturer = val;
    modelManufacturer.BranchCode = this.globalBranchCode;
    modelManufacturer.AddByUserId = this.globalUserId;
    this.apiService.post(modelManufacturer, ApiEndpoints.saveItemManufacturer)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Manufacturer Saved Successfully!',
          type: NotificationType.success,
        });
        this.formManufacturer.reset();
        this.loadAllManufacturer();
        this.isInnerUpdate = false;
      });
  }

  changeManufacturer(e: any) {
    this.selectedManufacturer = e.target.value;
  }

  getRowManufacturer(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Manufacturer Item';
    this.innerBtn = 'Update';
    this.manufacturerModel$ = { ...data };
  }

  updateManufacturer() {
    this.manufacturerResponse$ = this.manufacturerModel$;
    this.manufacturerResponse$.BranchCode = this.globalBranchCode;
    this.manufacturerResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.manufacturerResponse$, ApiEndpoints.updateItemManufacturer)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Manufacturer Updated Successfully!',
          type: NotificationType.success,
        });
        this.formManufacturer.reset();
        this.openNewManufacturer();
        this.loadAllManufacturer();
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
      message: `Are you sure that you want to delete this Code ${ItemManufacturerCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemManufacturer, { ItemManufacturerCode: ItemManufacturerCode })
          .subscribe((res) => {
            this.loadAllManufacturer();
            if (res === 200) {
              return this.toastService.sendMessage({
                message: 'Manufacturer Deleted Successfully!',
                type: NotificationType.warning,
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
    this.innerHeader = 'Add Brand Item';
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

  loadAllBrand() {
    this.apiService.get(ApiEndpoints.getAllItemBrand, { BranchCode: this.globalBranchCode })
    .subscribe((res) => {
      this.brandResponse$ = res;
    });
  }

  saveBrand() {
    let modelBrand;
    let val = this.formBrand.value;
    modelBrand = val;
    modelBrand.BranchCode = this.globalBranchCode;
    modelBrand.AddByUserId = this.globalUserId;
    this.apiService.post(modelBrand, ApiEndpoints.saveItemBrand)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Brand Saved Successfully!',
        type: NotificationType.success,
      });
      this.formBrand.reset();
      this.loadAllBrand();
      this.isInnerUpdate = false;
    });
  }

  changeBrand(e: any) {
    this.selectedBrand = e.target.value;
  }

  getRowBrand(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Brand Item';
    this.innerBtn = 'Update';
    this.brandModel$ = { ...data };
  }

  updateBrand() {
    this.brandResponse$ = this.brandModel$;
    this.brandResponse$.BranchCode = this.globalBranchCode;
    this.brandResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.brandResponse$, ApiEndpoints.updateItemBrand)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Brand Updated Successfully!',
        type: NotificationType.success,
      });
      this.formBrand.reset();
      this.openNewBrand();
      this.loadAllBrand();
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
      message: `Are you sure that you want to delete this Code ${ItemBrandCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemBrand, { ItemBrandCode } )
        .subscribe((res) => {
          this.loadAllBrand();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Brand Deleted Successfully!',
              type: NotificationType.warning,
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
    this.innerHeader = 'Add Model Item';
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

  loadAllModel() {
    this.apiService.get(ApiEndpoints.getAllItemModel, { BranchCode: this.globalBranchCode } )
    .subscribe((res) => {
      this.modelResponse$ = res;
    });
  }

  saveModel() {
    let modelModel;
    let val = this.formModel.value;
    modelModel = val;
    modelModel.BranchCode = this.globalBranchCode;
    modelModel.AddByUserId = this.globalUserId;
    this.apiService.post(modelModel, ApiEndpoints.saveItemModel)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Model Saved Successfully!',
        type: NotificationType.success,
      });
      this.formModel.reset();
      this.loadAllModel();
      this.isInnerUpdate = false;
    });
  }

  changeModel(e: any) {
    this.selectedModel = e.target.value;
  }

  getRowModel(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Model Item';
    this.innerBtn = 'Update';
    this.modelModel$ = { ...data };
  }

  updateModel() {
    this.modelResponse$ = this.modelModel$;
    this.modelResponse$.BranchCode = this.globalBranchCode;
    this.modelResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.modelResponse$, ApiEndpoints.updateItemModel)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Model Updated Successfully!',
        type: NotificationType.success,
      });
      this.formModel.reset();
      this.openNewModel();
      this.loadAllModel();
    });
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
      message: `Are you sure that you want to delete this Code ${ItemModelCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemModel, { ItemModelCode: ItemModelCode } )
        .subscribe((res) => {
          this.loadAllModel();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Model Deleted Successfully!',
              type: NotificationType.warning,
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
    this.innerHeader = 'Add Unit Item';
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

  loadAllUnit() {
    this.apiService.get(ApiEndpoints.getAllItemUnit, { BranchCode: this.globalBranchCode} )
    .subscribe((res) => {
      this.unitResponse$ = res;
    });
  }

  saveUnit() {
    let unitModel;
    let val = this.formUnit.value;
    unitModel = val;
    unitModel.BranchCode = this.globalBranchCode;
    unitModel.AddByUserId = this.globalUserId;
    this.apiService.post(unitModel, ApiEndpoints.saveItemUnit)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Unit Saved Successfully!!',
        type: NotificationType.success,
      });
      this.formUnit.reset();
      this.loadAllUnit();
      this.isInnerUpdate = false;
    });
  }

  changeUnit(e: any) {
    this.selectedUnit = e.target.value;
  }

  getRowUnit(data: any) {
    this.isInnerUpdate = true;
    this.innerHeader = 'Update Unit Item';
    this.innerBtn = 'Update';
    this.unitModel$ = { ...data };
  }

  updateUnit() {
    this.unitResponse$ = this.unitModel$;
    this.unitResponse$.BranchCode = this.globalBranchCode;
    this.unitResponse$.AddByUserId = this.globalUserId;
    this.apiService.update(this.unitResponse$, ApiEndpoints.updateItemUnit)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Unit Updated Successfully!',
        type: NotificationType.success,
      });
      this.formUnit.reset();
      this.openNewUnit();
      this.loadAllUnit();
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
      message: `Are you sure that you want to delete this Code ${ItemUnitCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemUnit, { ItemUnitCode })
        .subscribe((res) => {
          this.loadAllUnit();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Unit Deleted Successfully!',
              type: NotificationType.warning,
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
}
