import { SaleInvoiceService } from './../../../../_shared/services/sale-invoice.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
  TreeNode,
} from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { PartySetupModel } from 'src/app/_shared/model/model';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';

interface LockStatus {
  disabled: boolean;
  value: string;
}

@Component({
  selector: 'app-sale-invoice-detail',
  templateUrl: './sale-invoice-detail.component.html',
  styleUrls: ['./sale-invoice-detail.component.scss'],
})
export class SaleInvoiceDetailComponent implements OnInit {
  Masterform!: FormGroup;
  UploadDocform!: FormGroup;
  CopySaleform!: FormGroup;
  Detailform!: FormGroup;
  POform!: FormGroup;
  itemform!: FormGroup;
  customerform!: FormGroup;
  displayDocumentDialog: boolean = false;

  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  instrumentResponse$: any = [];
  poResponse$: any = [];
  docCopyResponse$: any = [];
  storeItemResponse$: any = [];
  customerResponse$: any = [];
  saleResponse$: any = [];
  objModel: any = [];

  routeSaleInvoiceNo: number = 0;
  routeStoreCode: number = 0;
  GrossAmount: number = 0;
  TaxAmount: number = 0;
  LineDiscount: number = 0;
  NetTotal: number = 0;
  QTY: number = 0;
  Receivable: string = '0';

  selectedStoreItem!: number;
  globalBranchCode!: number;
  globalUserCode!: number;
  globalUserName!: string;
  selectedCustomerId!: number;

  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  prdialog: boolean = false;
  uploadDoc: boolean = false;
  prdialogCopy: boolean = false;
  POMasterId: number = 0;
  lockStatus!: LockStatus[];
  DiscountPercentage: FormControl = new FormControl('');
  DiscountAmount: FormControl = new FormControl('');
  InstrumentTypeId: FormControl = new FormControl(0);
  IsLocked: boolean = false;
  selectedPrintPage!: string;
  ItemsResponse$: any = [];

  chartResponse!: TreeNode[];
  headerCustomer: string = 'Add new Customer';
  mainHeader!: string;
  mainDialog!: boolean;
  mainBtn!: string;
  model: any = [];
  form!: FormGroup;
  storeResponse$: any = [];
  coaResponse$: any = [];
  parentCodeResponse$: any = [];
  selectedParentCode!: string;
  selectedCOAHead!: string;
  selectedStores: any[] = [];
  @ViewChild('dt') dt!: any;

  //Global Variables
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

  //Item
  formItem!: FormGroup;
  ItemResponse$: any = [];
  ItemModel$: any = [];
  innerDialogItem!: boolean;
  selectedItem!: number;

  submitted!: boolean;
  subCategories$: any;

  //Customer
  productDialog!: boolean;

  //party-customer-fields
  cities!: any[];
  partyTableResponse$!: PartySetupModel[];
  partyObjectResponse$: any = [];
  payableResponse$: any = [];
  receiveableResponse$: any = [];
  selectedPartyTypes: any;
  selectedAccRec!: number;
  selectedAccPay!: number;
  LeadDetailResponse$: any; //dumy varialbes
  header!: string;
  saveorUpdate!: string;
  disableEditRow: boolean = false;
  netTotal: any = 0;
  InvoiceSrNoResponse$: any = [];
  selectedCustomers!: number;
  selectedSalesMan!: number;
  selectedFiles: File[] = [];
  documentResponse: any;
  imagePathOnServer!: string;
  documentMaxId: any;
  selectedSaleType: number = 0;
  saleTypeResponse$: any = [];
  RefSaleNo: any;
  projectCode: any;
  itemName: string = '';
  UPC: number = 0;
  componentName: any = '';
  isLoadingData: boolean = false;
  selectedStore: number = 0;
  selectedProject: number = 0;

  DocumentId: any;
  ImageDirectory: any;
  constructor(
    private fb: FormBuilder,
    private apiservice: SaleInvoiceService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiProviderService,
    private api: DocumentUploadService,
    private messageService: MessageService,
    private storeProjectService: StoreProjectService,
    private documentUploadService: DocumentUploadService
  ) {
    this.lockStatus = [
      { disabled: false, value: 'UnLocked' },
      { disabled: true, value: 'Locked' },
    ];
  }

  ngOnInit(): void {
    let saletypecode = parseInt(
      localStorage.getItem('saletypecode') || '0',
      10
    );

    this.storeProjectService.getSelectedOption().subscribe((option) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
        localStorage.setItem(
          'projectCode',
          JSON.stringify(this.selectedProject)
        );
      }
    });
    this.projectCode = localStorage.getItem('projectCode');
    this.loadSaleTypesForCopyInvoices(saletypecode);
    this.Masterform = this.fb.group({
      SaleInvoiceNo: this.fb.control('', Validators.required),
      Store: this.fb.control('', Validators.required),
      SaleDate: this.fb.control('', Validators.required),
      ProjectName: this.fb.control(''),
      CustomerId: this.fb.control('', Validators.required),
      SalesManId: this.fb.control('', Validators.required),
      SaleType: this.fb.control('', Validators.required),
      IsLocked: this.fb.control(''),
      Remarks: this.fb.control(''),
    });

    this.ducumentFormInIt();
    this.CopySaleform = this.fb.group({
      SaleInvoiceNo: this.fb.control('', Validators.required),
    });
    this.UploadDocform = this.fb.group({
      DocumentId: this.fb.control('', Validators.required),
      Description: this.fb.control('', Validators.required),
      ImagePath: this.fb.control('', Validators.required),
    });

    this.POMasterId = +localStorage.getItem('PONo')!;

    this.Detailform = this.fb.group({
      ItemCode: this.fb.control(''),
      Unit: this.fb.control(''),
      SalePrice: this.fb.control(''),
      Qty: this.fb.control(''),
      LineTotal: this.fb.control(''),
      TaxPercentage: this.fb.control(''),
      TaxAmount: this.fb.control(''),
      TotalAmountWithTax: this.fb.control(''),
      DiscountPercentage: this.fb.control(''),
      DiscountAmount: this.fb.control(''),
      NetTotal: this.fb.control(''),
    });

    this.POform = this.fb.group({
      PONo: this.fb.control('', Validators.required),
    });

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.globalUserName = localStorage.getItem('BranchName')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeSaleInvoiceNo = params['SaleInvoiceNo'];
      this.routeStoreCode = params['StoreCode'];
    });
    this.componentName = localStorage.getItem('componentName');
    this.loadCustomer();
    this.loadSaleMan();
    this.loadSaleTypes();

    this.loadInstrument();
    this.loadSaleInvoiceMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeSaleInvoiceNo
    );
    this.loadStoreItem(
      this.routeStoreCode,
      this.globalBranchCode,
      this.itemName,
      this.UPC
    );
    //Main
    this.loadAllChartItem();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.loadAllParentCodeItem();
    this.loadAllChartOfAccountHead();
    this.loadAllStoreItem();
    this.GetMaxDocumentId();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();
    //Size
  }

  // saveDocument() {
  //
  //   let model = this.UploadDocform.value;
  //   model.BranchCode = this.globalBranchCode;
  //   let StoreCode = parseInt(localStorage.getItem('StoreCode') || '0', 10);
  //   model.StoreCode = StoreCode;
  //   model.SaleInvoiceNo = this.masterResponse$.SaleInvoiceNo;
  //   model.ProjectCode = this.masterResponse$.ProjectCode;

  //   if (this.selectedFiles.length === 0) {
  //     return;
  //   }

  //   const formData = new FormData();

  //   for (let i = 0; i < this.selectedFiles.length; i++) {
  //     formData.append('files',
  //    this.selectedFiles[i],
  //    this.selectedFiles[i].name
  //    );
  //   }

  //   this.apiService
  //     .post(
  //       formData,
  //       ApiEndpoints.CreateSaleDocuments +
  //         `?BranchCode=${model.BranchCode}&ProjectCode=${model.ProjectCode}&StoreCode=${model.StoreCode}&SaleInvoiceNo=${model.SaleInvoiceNo}&DocumentName=${model.DocumentName}`
  //     )
  //     .subscribe((res) => {
  //       this.toastService.sendMessage({
  //         message: 'Sales Invoice Saved Successfully!',
  //         type: NotificationType.success,
  //       });
  //       this.loadAllDocuments();
  //       this.UploadDocform.reset();
  //       // this.refresh();
  //     });

  //   this.Detailform.markAsUntouched();
  // }

  GetMaxDocumentId() {
    let model = this.UploadDocform.value;
    let branchcode = parseInt(localStorage.getItem('BranchCode') || '0', 10);
    model.BranchCode = branchcode;
    let StoreCode = parseInt(localStorage.getItem('StoreCode') || '0', 10);
    model.StoreCode = StoreCode;
    model.SaleInvoiceNo = this.masterResponse$.SaleInvoiceNo;
    model.ProjectCode = this.masterResponse$.ProjectCode;
    this.apiService
      .get(
        ApiEndpoints.GetMaxDocumentId +
          `?BranchCode=${model.BranchCode}&ProjectCode=${model.ProjectCode}&StoreCode=${model.StoreCode}&SaleInvoiceNo=${model.SaleInvoiceNo}`
      )
      .subscribe((res: any) => {
        this.documentMaxId = res;
      });
  }

  openNewDocuments(data: any) {
    let branchcode = parseInt(localStorage.getItem('BranchCode') || '0', 10);
    data.BranchCode = branchcode;
    let StoreCode = parseInt(localStorage.getItem('StoreCode') || '0', 10);
    data.StoreCode = StoreCode;
    data.SaleInvoiceNo = this.masterResponse$.SaleInvoiceNo;
    data.ProjectCode = this.masterResponse$.ProjectCode;
    this.apiService
      .get(
        ApiEndpoints.ViewSaleInvoiceDocuments +
          `?BranchCode=${data.BranchCode}&ProjectCode=${data.ProjectCode}&StoreCode=${data.StoreCode}&SaleInvoiceNo=${data.SaleInvoiceNo}&DocumentId=${data.DocumentId}`
      )
      .subscribe(
        (response: any) => {
          if (response.type === 'application/pdf') {
            // Handling PDF files separately
            const fileUrl = URL.createObjectURL(response);
            window.open(fileUrl, '_blank');
          } else {
            // Handling other image files
            const reader = new FileReader();
            reader.onloadend = () => {
              this.imagePathOnServer = reader.result as string;
              this.displayDocumentDialog = true;
            };
            reader.readAsDataURL(response);
          }
        },
        (error) => {
          console.error('Error fetching document:', error);
        }
      );
  }
  // openNewDocuments(
  //   LeadCode: number,
  //   StepCode: number,
  //   DocumentId: number
  // ): void {
  //   this.apiservice
  //     .viewStepDocuments(LeadCode, StepCode, DocumentId)
  //     .subscribe(
  //       (response: Blob) => {
  //         if (response.type === 'application/pdf') {
  //           // Handling PDF files separately
  //           const fileUrl = URL.createObjectURL(response);
  //           window.open(fileUrl, '_blank');
  //         } else {
  //           // Handling other image files
  //           const reader = new FileReader();
  //           reader.onloadend = () => {
  //             this.imagePathOnServer = reader.result as string;
  //             this.displayDocumentDialog = true;
  //           };
  //           reader.readAsDataURL(response);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching document:', error);
  //       }
  //     );
  // }
  changeCustomers(e: any) {
    this.selectedCustomers = +e.value;
  }
  // this funtion is compulsory
  loadSaleTypes() {
    this.apiService.get(ApiEndpoints.GetAllSaleTypes).subscribe((res: any) => {
      // this.saleTypeResponse$ = res.data;
    });
  }
  loadSaleTypesForCopyInvoices(SaleTypeCode: number) {
    this.apiService
      .get(
        ApiEndpoints.GetSaleTypesForCopyInvoices +
          `?SaleTypeCode=${SaleTypeCode}`
      )
      .subscribe((res: any) => {
        this.saleTypeResponse$ = res.data;
      });
  }
  changeSalesMan(e: any) {
    this.selectedSalesMan = e.value;
  }

  // loadCustomer() {
  //   this.apiCustomer.getAllParties().subscribe((res: any) => {
  //     this.customerResponse$ = res.data;
  //   });
  // }
  loadCustomer() {
    this.apiService.get(ApiEndpoints.LoadAllParties).subscribe((res: any) => {
      this.customerResponse$ = res.data;
    });
  }
  changeSaleType(e: any) {
    this.selectedSaleType = +e.target.value;
  }

  loadSaleMan() {
    this.apiService.get(ApiEndpoints.GetAllSalesMan).subscribe((res: any) => {
      this.saleResponse$ = res.data;
    });
  }

  loadInstrument() {
    this.apiService.get(ApiEndpoints.getAllInstrumentType).subscribe((res) => {
      this.instrumentResponse$ = res;
    });
  }

  loadPendingCopy() {
    const data = this.CopySaleform.value;
    this.RefSaleNo = data.SaleInvoiceNo;

    let branchcode = parseInt(localStorage.getItem('BranchCode') || '0', 10);
    data.BranchCode = branchcode;
    let StoreCode = parseInt(localStorage.getItem('StoreCode') || '0', 10);
    data.StoreCode = this.routeStoreCode;
    // data.SaleInvoiceNo=this.masterResponse$.SaleInvoiceNo
    data.ProjectCode = this.masterResponse$.ProjectCode;
    this.apiService
      .get(
        ApiEndpoints.GetToBeCopiedSaleInvoicesDetail +
          `?BranchCode=${data.BranchCode}&ProjectCode=${data.ProjectCode}&StoreCode=${data.StoreCode}&SaleTypeCode=${this.selectedSaleType}&SaleInvoiceNo=${data.SaleInvoiceNo}`
      )
      .subscribe((res: any) => {
        this.docCopyResponse$ = res.data;
      });
  }
  loadPendingPO() {
    const x = this.POform.value;
    this.apiService
      .get(
        ApiEndpoints.PendingToReceivePOs +
          `?BranchCode=${this.globalBranchCode}&PONo=${x.PONo}&StoreCode=${this.routeStoreCode}`
      )
      .subscribe((res) => {
        this.poResponse$ = res;
      });
  }

  loadSaleInvoiceMasterInfo(
    BranchCode: number,
    StoreCode: number,
    SaleInvoiceNo: number
  ) {
    this.apiService
      .get(
        ApiEndpoints.LoadSaleInvoiceMasterInfo +
          `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}`
      )
      .subscribe((res: any) => {
        let x = res[0];
        if (x) {
          Object.assign(this.masterResponse$, x);
          const SaleDate = this.datePipe.transform(
            this.masterResponse$?.SaleDate,
            'y-MM-dd'
          );
          this.masterResponse$.SaleDate = SaleDate;
          this.IsLocked = this.masterResponse$.IsLocked;
          this.masterResponse$.CustomerId = this.customerResponse$.find(
            (x: any) => {
              return x.CustomerId === this.masterResponse$.CustomerId;
            }
          );
          this.masterResponse$.SalesManId = this.saleResponse$.find(
            (x: any) => {
              return x.SalesManId === this.masterResponse$.SalesManId;
            }
          );
          this.masterResponse$.InstrumentTypeId = this.instrumentResponse$.find(
            (x: any) => {
              return (
                x.InstrumentTypeId === this.masterResponse$.InstrumentTypeId
              );
            }
          );
        }
        // localStorage.setItem(
        //   'SaleInvoiceNo',
        //   this.masterResponse$.saleInvoiceNo
        // );
        this.loadSaleInvoiceDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.projectCode,
          this.routeSaleInvoiceNo
        );
      });
  }

  loadStoreItem(
    StoreCode: number,
    BranchCode: number,
    ItemName: string,
    UPC: number
  ) {
    this.apiService
      .get(
        ApiEndpoints.LoadStoreItems +
          `?StoreCode=${StoreCode}&BranchCode=${BranchCode}&ItemName=${ItemName}&UPC=${UPC}`
      )
      .subscribe((res: any) => {
        this.storeItemResponse$ = res.data;
      });
  }

  // loadStoreItem(
  //   StoreCode: number,
  //   BranchCode: number,
  //   ItemName: string,
  //   UPC: any
  // ) {
  //   this.apiservice
  //     .getStoreItem(StoreCode, BranchCode, ItemName, UPC)
  //     .subscribe((res: any) => {
  //       this.storeItemResponse$ = res.data;
  //     });
  // }

  changeStoreItem(e: any) {
    this.selectedStoreItem = e.value;
    let x = this.storeItemResponse$.find((x: any) => {
      return this.selectedStoreItem == x?.Code;
    });
    this.detailResponse$.Qty = x?.Qty;
    this.detailResponse$.LineTotal = x.LineTotal;
    this.detailResponse$.UnitCode = x?.UnitCode;
    this.detailResponse$.Unit = x?.Unit;
    this.detailResponse$.ItemCode = x?.Code;
    this.detailResponse$.SalePrice = x?.SalePrice;
    this.detailResponse$.TaxPercentage = x.TotalTax;
    this.detailResponse$.TaxAmount = x.TaxAmount;
    this.detailResponse$.DiscountPercentage = x.DiscountPercentage;
    this.detailResponse$.DiscountAmount = x.DiscountAmount;
    this.detailResponse$.NetTotal = x.NetTotal;
    this.detailResponse$.TotalAmountWithTax = x.NetTotal;
    // this.saveDetail();
  }

  loadSaleInvoiceDetails(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    SaleInvoiceNo: number
  ) {
    this.isLoadingData = true;
    this.apiService
      .get(
        ApiEndpoints.GetSaleInvoiceDetail +
          `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${ProjectCode}&SaleInvoiceNo=${SaleInvoiceNo}`
      )
      .subscribe((res) => {
        this.tableResponse$ = res;
        this.isLoadingData = false;
        const totalAmounts = this.tableResponse$.reduce(
          (totals: any, obj: any) => {
            return {
              LineTotal: totals.LineTotal + obj.LineTotal,
              TaxAmount: totals.TaxAmount + obj.TaxAmount,
              DiscountAmount: totals.DiscountAmount + obj.DiscountAmount,
              NetTotal: totals.NetTotal + obj.NetTotal,
              Qty: totals.Qty + obj.Qty,
            };
          },
          { LineTotal: 0, TaxAmount: 0, DiscountAmount: 0, NetTotal: 0, Qty: 0 }
        );
        this.GrossAmount = totalAmounts.LineTotal;
        this.TaxAmount = totalAmounts.TaxAmount;
        this.LineDiscount = totalAmounts.DiscountAmount;
        this.NetTotal = totalAmounts.NetTotal;
        this.QTY = totalAmounts.Qty;
      });
  }
  onSelectPrintPage(value: string) {
    this.selectedPrintPage = value;
  }

  SalesInvoiceReportpdf() {
    let saleType = localStorage.getItem('saleTypeName');
    this.apiservice
      .pintSaleInvoiceReport(
        this.globalBranchCode,
        this.routeStoreCode,
        this.masterResponse$.ProjectCode,
        this.routeSaleInvoiceNo,
        this.globalUserName,
        this.selectedPrintPage,
        saleType
      )
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  updateMaster() {
    let model = this.Masterform.value;
    let PreviousLockedStatus = 'UnLocked';
    model.BranchCode = this.globalBranchCode;
    model.ProjectCode = this.masterResponse$.ProjectCode;
    model.CreatedBy = this.globalUserCode;
    model.StoreCode = this.routeStoreCode;
    model.LockedBy = this.globalUserCode;
    model.DiscountAmount = this.DiscountAmount.value;
    model.DiscountPercentage = this.DiscountPercentage.value;
    const instrumentId = this.InstrumentTypeId.value;
    model.InstrumentTypeId = instrumentId.InstrumentTypeId;
    model.IsLocked =
      this.Masterform.get('IsLocked')?.value === null
        ? false
        : this.Masterform.get('IsLocked')?.value;
    // if (this.masterResponse$.IsLocked) {
    //   model.PreviousLockedStatus = 'Locked';
    // } else {
    //   model.PreviousLockedStatus = PreviousLockedStatus;
    // }
    if (model.IsLocked) {
      this.IsLocked = true;
    }
    // model.CustomerId = model?.CustomerId?.CustomerId;
    // model.SalesManId = model?.SalesManId?.SalesManId;
    model.CustomerId = this.selectedCustomers;
    model.SalesManId = this.selectedSalesMan;
    this.apiService
      .update(model, ApiEndpoints.UpdateSaleInvoiceMaster + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Sales Invoice Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
  }

  addorUpdateMaster() {
    if (this.Masterform.invalid) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }
    this.updateMaster();
  }

  // getObjonBlur(event: any) {
  //   let x = this.docCopyResponse$.filter((x: any) => {
  //     return x.textBoxValue > 0;
  //   });
  //   this.objModel = x;
  //   if (event.textBoxValue > event.BalQty && /^[0-9]+$/.test(event.textBoxValue)) {
  //     this.toastService.sendMessage({
  //       message: 'Quantity should be less then Balance Qty',
  //       type: NotificationType.error,
  //     });
  //     event.textBoxValue = 0;
  //   }
  // }
  getObjonBlur(event: any) {
    let x = this.docCopyResponse$.filter((item: any) => {
      return item.textBoxValue > 0;
    });

    this.objModel = x;

    if (!/^[0-9]+$/.test(event.textBoxValue)) {
      this.toastService.sendMessage({
        message: 'Please enter a valid number.',
        type: NotificationType.error,
      });
      event.textBoxValue = '';
    } else if (event.textBoxValue > event.BalQty) {
      this.toastService.sendMessage({
        message: 'Quantity should be less than Balance Qty.',
        type: NotificationType.error,
      });
      event.textBoxValue = '';
    }
  }

  changeExp() {
    for (let a in this.objModel) {
      let model: any = [];
      const x = this.POform.value;
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.masterResponse$.StoreCode;
      model.GRNNo = this.masterResponse$.GRNNo;
      model.PONo = x.PONo;
      model.POSrNo = this.objModel[a].POSrNo;
      model.GRNQty = this.objModel[a].GRNQty;

      this.apiService
        .post(model, ApiEndpoints.GRNDetailEntry + `?`)
        .subscribe(() => {
          this.prdialog = false;
          this.toastService.sendMessage({
            message: 'PO Added to GRN Successfully!',
            type: NotificationType.success,
          });
          this.poResponse$ = [];
          this.POform.reset(); // editing
          let projectCode = parseInt(
            localStorage.getItem('projectCode') || '0',
            10
          );
          this.loadSaleInvoiceDetails(
            this.globalBranchCode,
            this.routeStoreCode,
            this.masterResponse$.ProjectCode,
            this.routeSaleInvoiceNo
          );
        });
    }
  }
  // this event for import data update
  changeExpCopy() {
    const updatedData = this.docCopyResponse$.map((item: any) => {
      return {
        SaleInvoiceSrNo: item.SaleInvoiceSrNo,
        ItemCode: item.ItemCode,
        ItemUnitCode: item.ItemUnitCode,
        ItemName: item.ItemName,
        SalePrice: item.SalePrice,
        Qty: item.Qty,
        ImportedQty: item.ImportedQty,
        BalQty: item.BalQty,
        textBoxValue: item.textBoxValue,
      };
    });
    const data = this.CopySaleform.value;
    let branchcode = parseInt(localStorage.getItem('BranchCode') || '0', 10);
    data.BranchCode = branchcode;
    let StoreCode = parseInt(localStorage.getItem('StoreCode') || '0', 10);
    data.StoreCode = StoreCode;
    // data.SaleInvoiceNo=this.masterResponse$.SaleInvoiceNo
    data.ProjectCode = this.masterResponse$.ProjectCode;
    data.SaleInvoiceNo = this.masterResponse$.SaleInvoiceNo;
    // const RefSaleInvoiceNo=this.CopySaleform.value

    // const RsaleInvliceno=RefSaleInvoiceNo.SaleInvoiceNo
    this.globalUserCode = +localStorage.getItem('UserId')!;
    //TBD----------------------------------------------------------------
    this.apiservice
      .CopyDataFromInvoices(
        data.BranchCode,
        data.ProjectCode,
        data.StoreCode,
        data.SaleInvoiceNo,
        this.RefSaleNo,
        this.selectedSaleType,
        this.globalUserCode,
        updatedData
      )
      .subscribe(() => {
        this.prdialogCopy = false;
        this.toastService.sendMessage({
          message: 'Added to saleInvoice Successfully!',
          type: NotificationType.success,
        });
        this.poResponse$ = [];
        this.CopySaleform.reset();
        this.loadSaleInvoiceDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.masterResponse$.ProjectCode,
          this.routeSaleInvoiceNo
        );
      });
  }
  saveDetail() {
    let model;
    model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.routeStoreCode;
    // model.ProjectCode = this.masterResponse$.ProjectCode;
    model.ProjectCode = localStorage.getItem('projectCode');
    // model.SaleInvoiceNo = this.masterResponse$.SaleInvoiceNo;
    model.SaleInvoiceNo =
      this.routeSaleInvoiceNo || localStorage.getItem('SaleInvoiceNo');
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.SalePrice = this.detailResponse$.SalePrice;
    // model.Qty =  this.detailResponse$.Qty;
    // model.NetTotal =  this.detailResponse$.NetTotal;
    // model.LineTotal =  this.detailResponse$.LineTotal;
    // model.TaxAmount =  this.detailResponse$.TaxAmount;
    // model.TotalAmountWithTax =  this.detailResponse$.TotalAmountWithTax;
    // model.TaxPercentage =  this.detailResponse$.TaxPercentage;
    // model.UnitSalePrice =  this.detailResponse$.UnitSalePrice;
    // model.DiscountAmount =  this.detailResponse$.DiscountAmount;
    // model.DiscountPercentage =  this.detailResponse$.DiscountPercentage;
    // model.TotalAmountWithTax =  this.detailResponse$.TotalAmountWithTax;
    model.CreatedBy = this.globalUserCode;
    this.apiService
      .post(model, ApiEndpoints.CreateSaleInvoiceDetail + `?`)
      .subscribe(() => {
        this.loadSaleInvoiceDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.masterResponse$.ProjectCode,
          this.routeSaleInvoiceNo
        );
        this.detailResponse$.ItemCode = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: `${this.componentName} saved successfully!`,
          type: NotificationType.success,
        });
      });
  }

  calculateReceivablePercentage() {
    const totalAmount = +this.NetTotal;
    const discountPercentage = +this.DiscountPercentage.value;
    let discountDecimal = discountPercentage / 100;
    let discountAmount: any = totalAmount * discountDecimal;
    discountAmount = parseFloat(discountAmount.toString()).toFixed(2);
    this.DiscountAmount.setValue(discountAmount);
    const x = totalAmount - discountAmount;
    this.Receivable = parseFloat(x.toString()).toFixed(2);
  }

  calculateReceivableAmount() {
    const totalAmount = +this.NetTotal;
    const discountAmount = +this.DiscountAmount.value;
    let discountDecimal: any = (discountAmount * 100) / totalAmount;
    discountDecimal = parseFloat(discountDecimal.toString()).toFixed(2);
    this.DiscountPercentage.setValue(discountDecimal);
    const x = totalAmount - discountAmount;
    this.Receivable = parseFloat(x.toString()).toFixed(2);
  }

  calculateLineTotal() {
    let val = this.Detailform.value;
    const qty = +val.Qty;
    const rate = +val.SalePrice;
    const x = qty * rate;
    this.detailResponse$.LineTotal = parseFloat(x.toString()).toFixed(2);
    if (isNaN(this.detailResponse$.LineTotal)) {
      this.detailResponse$.LineTotal = 0;
    }
    const y =
      this.detailResponse$.SalePrice +
      this.detailResponse$.TotalAmountWithTax -
      this.detailResponse$.DiscountAmount;
    this.detailResponse$.NetTotal = parseFloat(y.toString()).toFixed(2);
  }

  calculateTaxPercentage() {
    let val = this.Detailform.value;
    const amount = +val.LineTotal;
    const tax = +val.TaxPercentage;
    if (amount === 0 || tax === 0) {
      this.detailResponse$.TotalAmountWithTax = 0;
    } else {
      const taxpercantage = (amount / 100) * tax;
      this.detailResponse$.TaxAmount = parseFloat(
        taxpercantage.toString()
      ).toFixed(2);
      const x = taxpercantage + amount;
      this.detailResponse$.TotalAmountWithTax = parseFloat(
        x.toString()
      ).toFixed(2);
    }
    const y =
      this.detailResponse$.TotalAmountWithTax -
      this.detailResponse$.DiscountAmount;
    this.detailResponse$.NetTotal = parseFloat(y.toString()).toFixed(2);
  }

  calculateTaxAmount() {
    let val = this.Detailform.value;
    const total = +val.LineTotal;
    const amount = +val.TaxAmount;
    const taxpercantage = (amount * 100) / total;
    this.detailResponse$.TaxPercentage = parseFloat(
      taxpercantage.toString()
    ).toFixed(2);
    const x = amount + total;
    this.detailResponse$.TotalAmountWithTax = parseFloat(x.toString()).toFixed(
      2
    );
    const y =
      this.detailResponse$.TotalAmountWithTax -
      this.detailResponse$.DiscountAmount;
    this.detailResponse$.NetTotal = parseFloat(y.toString()).toFixed(2);
  }

  calculateDiscountPercentage() {
    let val = this.Detailform.value;
    const percentage = +val.DiscountPercentage;
    const amount = +val.TotalAmountWithTax;
    const taxpercantage = (percentage / 100) * amount;
    this.detailResponse$.DiscountAmount = parseFloat(
      taxpercantage.toString()
    ).toFixed(2);
    const x =
      this.detailResponse$.TotalAmountWithTax -
      this.detailResponse$.DiscountAmount;
    this.detailResponse$.NetTotal = parseFloat(x.toString()).toFixed(2);
  }

  calculateDiscountAmount() {
    let val = this.Detailform.value;
    const amount = +val.DiscountAmount;
    const total = +val.TotalAmountWithTax;
    const taxpercantage = (amount * 100) / total;
    this.detailResponse$.DiscountPercentage = parseFloat(
      taxpercantage.toString()
    ).toFixed(2);
    const x =
      this.detailResponse$.TotalAmountWithTax -
      this.detailResponse$.DiscountAmount;
    this.detailResponse$.NetTotal = parseFloat(x.toString()).toFixed(2);
  }

  shiftDetail() {
    let model;
    model = this.POform.value;
    model.GRNNo = this.masterResponse$.GRNNo;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.masterResponse$.StoreCode;
    model.POSrNo = 0;
    model.GRNQty = 0;
    if (model.PONo === '') {
      this.toastService.sendMessage({
        message: 'Please enter PO No!',
        type: NotificationType.error,
      });
    } else {
      this.apiService
        .post(model, ApiEndpoints.GRNDetailEntry + `?`)
        .subscribe(() => {
          this.prdialog = false;
          this.toastService.sendMessage({
            message: 'Shift Added Successfully!',
            type: NotificationType.success,
          });
          this.poResponse$ = [];
          this.POform.reset();
          this.loadSaleInvoiceDetails(
            this.globalBranchCode,
            this.routeStoreCode,
            this.masterResponse$.ProjectCode,
            this.routeSaleInvoiceNo
          );
        });
    }
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.detailResponse$ = { ...data };
    const obj: any = Object.values(this.storeItemResponse$).find((y: any) => {
      return y.Code == this.detailResponse$.ItemCode;
    });
    this.detailResponse$.ItemCode = obj.Code;
    this.detailResponse$.Unit = obj.Unit;
    this.detailResponse$.SalePrice = data.UnitSalePrice;
  }
  updateQty(m: any, newValue: any) {
    m.Qty = newValue;
  }
  calculateSalePrice(event: any) {
    let val = event;
    this.netTotal = +val.Qty;
    const rate = +val.SalePrice;
    // const x = qty * rate;
    if (rate !== undefined && rate !== null && rate !== 0) {
      const x = this.netTotal * rate;
      event.NetTotal = parseFloat(x.toString()).toFixed(2);
    }
  }
  calculateNetTotal(event: any) {
    let val = event;
    this.netTotal = +val.Qty;
    const rate = +val.SalePrice;
    // const x = qty * rate;
    if (rate !== undefined && rate !== null && rate !== 0) {
      const x = this.netTotal * rate;
      event.NetTotal = parseFloat(x.toString()).toFixed(2);
    }
  }

  onRowEditInit(data: any) {
    this.detailResponse$ = data;
    this.isUpdate = true;
    this.detailResponse$.ItemCode = data.ItemCode;
    this.detailResponse$.Unit = data.ItemUnit;
    this.detailResponse$.SalePrice = data.SalePrice;
    this.detailResponse$.Qty = data.Qty;
    this.detailResponse$.LineTotal = data.LineTotal;
    this.detailResponse$.TaxPercentage = data.TaxPercentage;
    this.detailResponse$.TaxAmount = data.TaxAmount;
    this.detailResponse$.TotalAmountWithTax = data.TotalAmountWithTax;
    this.detailResponse$.DiscountPercentage = data.DiscountPercentage;
    this.detailResponse$.DiscountAmount = data.DiscountAmount;
    this.detailResponse$.NetTotal = data.NetTotal;
    // this.apiService
    //   .get(
    //     ApiEndpoints.GetSaleInvoiceDetailBySrNo +
    //     `?StoreCode=${this.routeStoreCode}&SaleInvoiceNo=${this.routeSaleInvoiceNo}&SaleInvoiceSrNo=${SaleInvoiceSrNo}`
    //   )
    //   .subscribe((res) => {
    //     this.InvoiceSrNoResponse$ = res;
    //   });
  }
  onRowEditCancel(data: any) {}
  onRowEditSave() {
    const data = { ...this.detailResponse$ };
    data.ModifiedBy = this.globalUserCode;

    this.apiService
      .update(data, ApiEndpoints.UpdateSaleInvoiceDetail + `?`)
      .subscribe({
        next: (updatedData) => {
          this.loadSaleInvoiceDetails(
            this.globalBranchCode,
            this.routeStoreCode,
            this.masterResponse$.ProjectCode,
            this.routeSaleInvoiceNo
          );
          this.toastService.sendMessage({
            message: `${this.componentName} saved successfully!`,
            type: NotificationType.success,
          });
          this.detailResponse$ = [];
          this.isUpdate = false;
          // Perform any additional actions after successful data update
        },
        error: (error) => {
          console.error('Error updating data:', error);
          // Handle the error and display an appropriate message to the user
        },
      });
  }

  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updateDetail(this.routeSaleInvoiceNo);
    }
  }

  updateDetail(SaleInvoiceSrNo: number) {
    let model = this.Detailform.value;
    this.detailResponse$ = { ...model };
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.routeStoreCode;
    model.ProjectCode = this.masterResponse$.ProjectCode;
    model.SaleInvoiceNo = this.masterResponse$.SaleInvoiceNo;
    model.SaleInvoiceSrNo = this.detailResponse$.SaleInvoiceSrNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.UnitSalePrice = this.detailResponse$.SalePrice;
    model.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(model, ApiEndpoints.UpdateSaleInvoiceDetail + `?`)
      .subscribe((res) => {
        this.loadSaleInvoiceDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.masterResponse$.ProjectCode,
          this.routeSaleInvoiceNo
        );
        this.detailResponse$.ItemCode = null;
        this.detailResponse$.wo_number = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: `${this.componentName} saved successfully!`,
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
  }

  deleteSaleDetail(SaleInvoiceSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteSaleInvoiceDetail +
              `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&ProjectCode=${this.masterResponse$.ProjectCode}&SaleInvoiceNo=${this.routeSaleInvoiceNo}&SaleInvoiceSrNo=${SaleInvoiceSrNo}`
          )
          .subscribe(() => {
            this.loadSaleInvoiceDetails(
              this.globalBranchCode,
              this.routeStoreCode,
              this.masterResponse$.ProjectCode,
              this.routeSaleInvoiceNo
            );
            this.toastService.sendMessage({
              message: `${this.componentName} saved successfully!`,
              type: NotificationType.warning,
            });
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

  goToPage() {
    const date = new Date();
    let model: any = {};
    model.StoreCode = this.routeStoreCode;
    model.ProjectCode = this.masterResponse$.ProjectCode;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUserCode;
    model.IsLocked = false;
    model.SaleDate = this.datePipe.transform(date, 'MMM-d-y');
    this.apiService
      .post(model, ApiEndpoints.CreateSaleInvoiceMaster + `?`)
      .subscribe((res) => {
        model.SaleInvoiceNo = res;
        const SaleInvoiceNo = model.SaleInvoiceNo;
        if (SaleInvoiceNo != null) {
          localStorage.setItem('SaleInvoiceNo', SaleInvoiceNo);
          this.toastService.sendMessage({
            message: `New ${this.componentName} Number Created Successfully!`,
            type: NotificationType.success,
          });
          const queryParams = { ...this.activatedRoute.snapshot.queryParams };
          queryParams['SaleInvoiceNo'] = SaleInvoiceNo;
          this.router.navigate([], { queryParams });
          this.loadSaleInvoiceMasterInfo(
            this.globalBranchCode,
            this.routeStoreCode,
            SaleInvoiceNo
          );
          // this.cdr.detectChanges();
        } else {
          this.toastService.sendMessage({
            message: `Cannot Create ${this.componentName} Number!`,
            type: NotificationType.error,
          });
        }
      });
  }

  refreshdetail() {
    this.isUpdate = false;
    this.detailResponse$.ItemCode = null;
    this.Detailform.reset();
  }

  openCopyDemand() {
    this.prdialog = true;
  }

  hideCopyDemand() {
    this.prdialog = false;
  }

  openCopyDocument() {
    this.prdialogCopy = true;
  }
  hideCopyDocument() {
    this.prdialogCopy = false;
  }

  openNewItem() {
    this.innerHeader = 'Add Item';
    this.innerBtn = 'Save';
    this.innerDialogItem = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;

    this.submitted = false;
  }

  hideDialogItems() {
    this.innerDialogItem = false;
    this.isInnerUpdate = false;
    this.itemform.reset();
  }

  loadAllChartOfAccountHead() {
    this.apiService.get(ApiEndpoints.GetAccountTitle).subscribe((res) => {
      this.coaResponse$ = res;
    });
  }

  loadAllStoreItem() {
    this.apiService
      .get(
        ApiEndpoints.getItemStores +
          `?BranchCode=${this.globalBranchCode}&ItemCode=${'0'}`
      )
      .subscribe((res: any) => {
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
    this.model = this.itemform.value;
    this.model.IsActive = true;
    this.model.BranchCode = +this.globalBranchCode;
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
    const itemcode = this.itemform.get('ItemCode')?.value;
    const storeCodeValue = this.selectedStores;
    let len = Object.values(storeCodeValue).length;
    for (let i = 0; i < len; i++) {
      let x: number[] = this.itemform.get('Store')?.value;
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
    this.apiService
      .post(this.model, ApiEndpoints.saveChartofItem)
      .subscribe(() => {
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
    this.apiService
      .get(
        ApiEndpoints.getItemStores +
          `?BranchCode=${BranchCode}&ItemCode=${ItemCode}`
      )
      .subscribe((res: any) => {
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
    this.apiService
      .update(this.model, ApiEndpoints.updateChartofItem)
      .subscribe((res) => {
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
    this.confirmservice.confirm({
      message: 'Are you sure you want to delete ' + id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteChartofItem, { ItemCode: id })
          .subscribe((res) => {
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
    this.apiService
      .get(ApiEndpoints.GetChartOfItemsTree)
      .subscribe((res: any) => {
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
                      ItemCodeWithSeperator:
                        grandChildChildItem.ItemCodeWithSeperator,
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
    this.itemform.reset();
    this.loadAllParentCodeItem();
  }

  //Customer Form

  openNewCustomer() {
    this.header = 'Add Customer';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialog = true;
    this.isUpdate = false;
    this.customerform.reset();
  }

  hideDialogCustomer() {
    this.productDialog = false;
    this.submitted = false;
    this.customerform.reset();
    this.isUpdate = false;
  }

  ngOnDestroy() {
    localStorage.removeItem('SaleInvoiceNo');
  }

  //----------------------------------------------------------------Document workings----------------------------------------------------------------
  getGetMaxDocumentId() {
    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let SaleInvoiceNo = +this.routeSaleInvoiceNo;
    this.documentUploadService
      .getMaxSaleInvoiceDocumentId(BranchCode, StoreCode, SaleInvoiceNo)
      .subscribe(
        (res: any) => {
          this.DocumentId = res[0].DocumentId;
        },
        (error) => {
          console.error('Error fetching document:', error);
        }
      );
  }

  openUploadDoc() {
    this.uploadDoc = true;
  }

  ducumentFormInIt() {
    this.UploadDocform = this.fb.group({
      DocumentId: this.fb.control('', Validators.required),
      Description: this.fb.control('', Validators.required),
    });
  }

  selectFiles(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }
  loadAllDocuments() {
    let model = this.UploadDocform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.SaleInvoiceNo = this.routeSaleInvoiceNo;
    this.apiService
      .get(
        ApiEndpoints.GetAllSaleInvoiceDocuments +
          `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&SaleInvoiceNo=${model.SaleInvoiceNo}`
      )
      .subscribe((res: any) => {
        this.documentResponse = res;
      });
  }

  saveDocument() {
    let model = this.UploadDocform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.SaleInvoiceNo = this.routeSaleInvoiceNo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = this.globalUserCode;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.documentUploadService
      .saveSaleInvoiceDocuments(model, this.selectedFiles)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'New Document Saved Successfully!',
          type: NotificationType.success,
        });

        // this.loadAllDocuments();
        this.loadAllDocuments();
        this.UploadDocform.reset();
        this.getGetMaxDocumentId();
        // this.refresh();
      });

    this.Detailform.markAsUntouched();
  }

  HideUploadDoc() {
    this.uploadDoc = false;
  }
  closeDocumentViewDialog(): void {
    this.displayDocumentDialog = false;
  }

  ViewDocuments(data: any) {
    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let SaleInvoiceNo = this.routeSaleInvoiceNo;
    let DocumentId = data.DocumentId;
    this.documentUploadService

      .viewSaleInvoiceDocuments(
        BranchCode,
        StoreCode,
        SaleInvoiceNo,
        DocumentId
      )
      .subscribe(
        (response: Blob) => {
          const fileUrl = URL.createObjectURL(response);
          window.open(fileUrl);
        },
        (error) => {
          console.error('Error fetching document:', error);
        }
      );
  }

  deleteDoc(data: any) {
    data.BranchCode = this.globalBranchCode;
    data.StoreCode = +this.routeStoreCode;
    data.SaleInvoiceNo = this.routeSaleInvoiceNo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteSaleInvoiceDocuments +
              `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&SaleInvoiceNo=${data.SaleInvoiceNo}&DocumentId=${data.DocumentId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Demand Document Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.loadAllDocuments();
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
  getDoucumnetPaths() {
    this.apiService
      .get(ApiEndpoints.GetAllPaths + '?BranchCode=' + this.globalBranchCode)
      .subscribe((res: any) => {
        this.ImageDirectory = res[0].SalesPath;
      });
  }
}
