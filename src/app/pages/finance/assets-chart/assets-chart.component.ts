import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
  TreeNode,
} from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { InventoryReportsService } from 'src/app/_shared/services/inventory-reports.service';

@Component({
  selector: 'app-assets-chart',
  templateUrl: './assets-chart.component.html',
  styleUrls: ['./assets-chart.component.scss'],
})
export class AssetsChartComponent implements OnInit {
  //Main
  form!: FormGroup;
  mainHeader!: string;
  mainDialog!: boolean;
  mainBtn!: string;
  model: any = [];
  isUpdate!: boolean;
  // chartResponse$: any = [];
  chartResponse2!: TreeNode[];
  storeResponse$: any = [];
  coaResponse$: any = [];
  parentCodeResponse$: any = [];
  selectedParentCode!: string;
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

  //Unit
  formUnit!: FormGroup;
  unitResponse$: any = [];
  unitModel$: any = [];
  innerDialogUnit!: boolean;
  selectedUnit!: number;

  //add newfield
  dptLocationResponse$: any = [];
  departmentResponse$: any = [];
  selectedDepartment!: number;

  //User Rights
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = "Chart of Assets";

  isLoadingData: boolean = false;
  loading: boolean = false;
  isToastShown :boolean = false

  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private apiService: ApiProviderService,
    private utilityService : UtilityService,
    private apiservice: InventoryReportsService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      AssetCode: this.fb.control(''),
      ParentAssetCode: this.fb.control(''),
      AssetCodeWithSeperator: this.fb.control(''),
      AssetName: this.fb.control(''),
      ShortName: this.fb.control(''),
      HasDetail: this.fb.control(''),
      IsDetail: this.fb.control(''),
      Hirarchy: this.fb.control(''),
      Remarks: this.fb.control(''),
      AssetSizeCode: this.fb.control(''), // 1.
      AssetColourCode: this.fb.control(''), // 2.
      AssetTypeCode: this.fb.control(''), // 3.
      AssetCategoryCode: this.fb.control(''), //4.
      AssetGradeCode: this.fb.control(''), //5.
      AssetManufacturerCode: this.fb.control(''), //6.
      AssetBrandCode: this.fb.control(''), //7.
      AssetModelCode: this.fb.control(''), //8.
      AssetUnitCode: this.fb.control(''), //9.
      RegistrationNo: this.fb.control(''),
      AssetSrNo: this.fb.control(''),
      AccountCode: this.fb.control(''),
      PurchasePrice: this.fb.control(''),
      Depriciation: this.fb.control(''),
      DepartmentCode: this.fb.control(''),
    });
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 2;
    const FormId = 1;
    this.apiService.get(ApiEndpoints.GetUserFormRights + '?UserId=' + UserId + '&ModuleId=' + ModuleId + '&FormId=' + FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });


    //Main
    this.loadAllChartAssets();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.loadAllParentCodeItem();
    this.loadAllChartOfAccountHead();
    this.LoadAllDepartment();

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
  changeDepartment(e: any) {
    this.selectedDepartment = +e.value;
  }

  LoadAllDepartment() {
    this.apiService.get(ApiEndpoints.GetAllDepartmentsList)
    .subscribe((res: any) => {
      this.departmentResponse$ = res.data;
    });
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  loadAllChartOfAccountHead() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.coaResponse$ = res.data;
    });
  }

  loadAllChartAssets() {
    this.apiService.get(ApiEndpoints.GetChartOfAssetTree).subscribe((res:any) => {
       this.chartResponse2 = res;
      this.chartResponse2 = this.transformDatatree(res);
    });
  }
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

  loadAllParentCodeItem() {
    this.apiService.get(ApiEndpoints.GetAllAssetParentCode).subscribe((res) => {
      this.parentCodeResponse$ = res;
    });
  }

  changeParentCode(event: any) {
    this.selectedParentCode = event?.value;
    this.loadGetMaxAssetCode(this.selectedParentCode);
  }
  loadGetMaxAssetCode(ParentAccountCode: string) {

    ParentAccountCode = ParentAccountCode.replace(/-/g, '');
    this.apiService.get(ApiEndpoints.GetMaxAssetCode+`?ParentAssetCode=${ParentAccountCode}`).subscribe((res: any) => {
      // this.model.AssetCode = res.AssetCode
      this.form.controls['AssetCode'].setValue(res.AssetCode)
      // this.model.ItemCode=res
    })
  }

  addorUpdate() {

    if (!this.isUpdate) {
      this.add();
    } else {
      this.updateAllow();
    }
  }

  hideDialog() {
    this.mainDialog = false;
    this.form.reset();
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
  hasDetail() {
    this.form.controls['IsDetail'].setValue(false);
  }
  IsDetail() {
    this.form.controls['HasDetail'].setValue(false);
  }

  printSticker(AssetCode: any) {
    this.loading = true;
    this.apiService.getReport(ApiEndpoints.ChartOfAssetsWithBarCode + `?FileType=PDF&AssetCode=${AssetCode}`)
    .subscribe({
      next: (pdf: any)=>{
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      error: (err)=>{
        this.loading = false;
        this.toastService.sendMessage({
          message: err.message,
          type: NotificationType.error,
        })
      }
    })
  }

  save() {
    this.model = this.form.value;
    this.model.IsActive = true;
    this.model.BranchCode = +this.globalBranchCode;
    if (!this.selectedParentCode) {
      this.model.ParentAssetCode = '0';
    } else {
      this.model.ParentAssetCode = this.selectedParentCode.replace(/-/g, '');
    }
    this.model.CreatedBy = +this.globalUserId;
    this.model.ApprovedBy = +this.globalUserId;
    // this.model.RegistrationNo = +this.model.RegistrationNo || 0;
    // this.model.AssetSrNo = +this.model.AssetSrNo || 0;
    // this.model.Remarks = +this.model.Remarks || '';
    // this.model.AssetSizeCode = +this.selectedSize || 0;
    // this.model.AssetColourCode = +this.selectedColour || 0;
    // this.model.AssetTypeCode = +this.selectedType || 0;
    // this.model.AssetCategoryCode = +this.selectedCategory || 0;
    // this.model.AssetGradeCode = +this.selectedGrade || 0;
    // this.model.AssetManufacturerCode = +this.selectedManufacturer || 0;
    // this.model.AssetBrandCode = +this.selectedBrand || 0;
    // this.model.AssetModelCode = +this.selectedModel || 0;
    // this.model.AssetUnitCode = +this.selectedUnit || 0;
    // this.model.PurchasePrice = this.model.PurchasePrice || 0;
    // this.model.Depriciation = this.model.Depriciation || 0;
    // this.model.DepartmentCode = +this.selectedDepartment || 0;
    this.model.IsDetail = false;
    this.model.HasDetail = true;
    this.model.HasDetail = this.form.get('HasDetail')?.value || false;
    this.model.IsDetail = this.form.get('IsDetail')?.value || false;
    const assetcode = this.form.get('AssetCode')?.value;

    if (this.model.ParentAssetCode === '0') {
      this.model.AssetCodeWithSeperator = assetcode;
      this.model.AssetCode = assetcode;
    } else {
      this.model.AssetCode = this.model.ParentAssetCode.concat(
        assetcode
      ).replace(/-/g, '');
      this.model.AssetCodeWithSeperator = this.selectedParentCode.concat(
        '-',
        assetcode
      );
    }
    const itemwithsep: string = this.model.AssetCodeWithSeperator;
    const count = (itemwithsep.match(/[-]/g) || []).length;
    this.model.LevelCode = count + 1;
    this.apiService.post(this.model, ApiEndpoints.AddChartOfAssets).subscribe(() => {
      this.parentCodeResponse$ = [];
      this.toastService.sendMessage({
        message: 'Asset Added Successfully!',
        type: NotificationType.success,
      });
      this.loadAllChartAssets();
      this.openNew();
      this.mainDialog = false
    });
  }

  getRow(data: any) {
    console.log(data,'data')
    this.mainHeader = 'Update Item Information';
    this.mainBtn = 'Update';
    this.mainDialog = true;
    this.isUpdate = true;
    this.form.patchValue({...data})
    this.model = { ...data };
    let x = this.parentCodeResponse$.find((x: any) => {
      let rem = x.AssetCode.replace(/-/g, '');
      return rem == this.model.ParentAssetCode;
    });
    this.parentwithName = `${x?.AssetCode} - ${x?.AssetName}`;
    if (this.parentwithName.includes('undefined')) {
      this.parentwithName = '0';
    }
  }

  update() {
    this.model = this.form.value
    this.model.BranchCode = +this.globalBranchCode;
    this.model.ModifiedBy = +this.globalUserId;
    this.apiService.update(this.model, ApiEndpoints.UpdateChartOfAssets).subscribe(() => {
      this.loadAllChartAssets();
    });
    this.toastService.sendMessage({
      message: 'Asset Updated Successfully!',
      type: NotificationType.success,
    });
    this.openNew();
    this.mainDialog = false;
  }

  deleteChartItem(id: string) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.confirmService.confirm({
      message: 'Are you sure you want to delete ' + id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteChartOfAssets + `?AssetCode=${id}`)
        .subscribe((res) => {
          this.loadAllChartAssets();
        });
        this.toastService.sendMessage({
          message: 'Asset Deleted Successfully!',
          type: NotificationType.deleted,
        });
      },
    });
  }

  getRadioControl(): string {
    return this.selectedRadio;
  }

  filterGlobal(event: any) {
    const id = this.getRadioControl();
    let filterFields: string[] = [];

    if (id === 'Title') {
      filterFields.push('AssetName');
    } else if (id === 'Code') {
      filterFields.push('AssetCode');
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

  openNew() {
    this.mainHeader = 'Add Asset Information';
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemSize, { BranchCode: this.globalBranchCode } )
    .subscribe((res) => {
      this.sizeResponse$ = res;
      this.isLoadingData = false;
    });
  }

  saveSize() {
    if(this.formSize.invalid){
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

  deleteSize(AssetSizeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetSizeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemSize, { ItemSizeCode: AssetSizeCode })
        .subscribe((res) => {
          this.loadAllSize();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Size Deleted Successfully!',
              type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemColour, { BranchCode: this.globalBranchCode})
    .subscribe((res) => {
      this.colourResponse$ = res;
      this.isLoadingData = false;
    });
  }

  saveColour() {
    if(this.formColour.invalid){
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

  deleteColour(AssetColourCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetColourCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemColour, { ItemColourCode: AssetColourCode})
        .subscribe((res) => {
          this.loadAllColour();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Colour Deleted Successfully!',
              type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemType, { BranchCode: this.globalBranchCode})
    .subscribe((res) => {
      this.typeResponse$ = res;
      this.isLoadingData = false;
    });
  }

  saveType() {
    if(this.formType.invalid){
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
    this.selectedType = e.value;
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

  deleteType(AssetTypeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetTypeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemType, { ItemTypeCode: AssetTypeCode } )
        .subscribe((res) => {
          this.loadAllType();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Type Deleted Successfully!',
              type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemCategory, { BranchCode: this.globalBranchCode } )
      .subscribe((res) => {
        this.categoryResponse$ = res;
        this.isLoadingData = false;
      });
  }

  saveCategory() {
    if(this.formCategory.invalid){
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
    this.apiService.update(this.categoryModel$, ApiEndpoints.updateItemCategory)
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

  deleteCategory(AssetCategoryCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetCategoryCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemCategory, { ItemCategoryCode: AssetCategoryCode })
          .subscribe((res) => {
            this.loadAllCategory();
            if (res === 200) {
              return this.toastService.sendMessage({
                message: 'Category Deleted Successfully!',
                type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemGrade, { BranchCode: this.globalBranchCode }  )
    .subscribe((res) => {
      this.gradeResponse$ = res;
      this.isLoadingData = false;
    });
  }

  saveGrade() {
    if(this.formGrade.invalid){
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

  deleteGrade(AssetGradeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetGradeCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemGrade, { ItemGradeCode: AssetGradeCode })
        .subscribe((res) => {
          this.loadAllGrade();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Grade Deleted Successfully!',
              type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemManufacturer, { BranchCode: this.globalBranchCode})
      .subscribe((res) => {
        this.manufacturerResponse$ = res;
        this.isLoadingData = false;
      });
  }

  saveManufacturer() {
    if(this.formManufacturer.invalid){
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

  deleteManufacturer(AssetManufacturerCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetManufacturerCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemManufacturer, { ItemManufacturerCode: AssetManufacturerCode })
          .subscribe((res) => {
            this.loadAllManufacturer();
            if (res === 200) {
              return this.toastService.sendMessage({
                message: 'Manufacturer Deleted Successfully!',
                type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemBrand, { BranchCode: this.globalBranchCode })
    .subscribe((res) => {
      this.brandResponse$ = res;
      this.isLoadingData = false;
    });
  }

  saveBrand() {
    if(this.formBrand.invalid){
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

  deleteBrand(AssetBrandCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetBrandCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemBrand, { ItemBrandCode: AssetBrandCode })
        .subscribe((res) => {
          this.loadAllBrand();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Brand Deleted Successfully!',
              type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemModel, { BranchCode: this.globalBranchCode } )
    .subscribe((res) => {
      this.modelResponse$ = res;
      this.isLoadingData = false;
    });
  }

  saveModel() {
    if(this.formModel.invalid){
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
    this.apiService.update(this.modelResponse$, ApiEndpoints.saveItemModel)
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

  deleteModel(AssetModelCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetModelCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemModel, { ItemModelCode: AssetModelCode })
        .subscribe((res) => {
          this.loadAllModel();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Model Deleted Successfully!',
              type: NotificationType.deleted,
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
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllItemUnit, { BranchCode: this.globalBranchCode } )
    .subscribe((res) => {
      this.unitResponse$ = res;
      this.isLoadingData = false;
    });
  }

  saveUnit() {
    if(this.formUnit.invalid){
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
    let unitModel;
    let val = this.formUnit.value;
    unitModel = val;
    unitModel.BranchCode = this.globalBranchCode;
    unitModel.AddByUserId = this.globalUserId;
    this.apiService.post(unitModel, ApiEndpoints.saveItemUnit)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Unit Saved Successfully!',
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

  deleteUnit(AssetUnitCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Code ${AssetUnitCode}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.deleteItemUnit, { ItemUnitCode: AssetUnitCode })
        .subscribe((res) => {
          this.loadAllUnit();
          if (res === 200) {
            return this.toastService.sendMessage({
              message: 'Unit Deleted Successfully!',
              type: NotificationType.deleted,
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

  printChartOfassetsReport(){
    this.loading = true;
    this.apiservice
      .getChartOfAssetsListReport()
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
    
  }
}
