import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { PurchaseOrderService } from 'src/app/_shared/services/purchase-order.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss'],
})
export class PurchaseOrderDetailComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  PRform!: FormGroup;
  shipmentModeForm!: FormGroup;
  ShipmentModeCode: any;
  PaymentTermsForm!: FormGroup;
  PaymentTermId: any;
  FreightTermForm!: FormGroup;
  FreightTermId: any;
  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  prResponse$: any = [];
  storeItemResponse$: any = [];
  shipmentResponse$: any = [];
  paymentTermsresponse$: any = [];
  frieghtTerms$: any = [];
  currencyResponse$: any = [];
  objModel: any = [];

  routePONo: number = 0;
  routeStoreCode: number = 0;

  selectedStoreItem!: number;
  globalBranchCode!: number;
  globalUserCode!: number;

  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  prdialog: boolean = false;
  POMasterId: number = 0;
  IsLocked: boolean = false;
  loading = false;
  selectedCurrency: any;
  changeCurrencyResponse$: any = [];
  PaymentTermsresponse$: any = [];
  FrieghtTerms$: any = [];
  selectedPaymentterms: any;
  PreviousPO$: any = [];
  NextPO$: any = [];

  uploadDoc: boolean = false;
  displayDocumentDialog: boolean = false;
  UploadDocform!: FormGroup;
  documentResponse: any;
  imagePathOnServer!: string;
  selectedFiles: any;
  DocumentId: any;
  ImageDirectory: any;
  allEmployeeList: any;
  isLoadingData: boolean = false;
  frieghtToBoren$ = [
    { value: 'Company', viewValue: 'Company' },
    { value: 'Party', viewValue: 'Party' }
  ]
  // frieghtTerms$ = [
  //   { value: '100% Advance', viewValue: '100% Advance' },
  //   { value: '100% Later', viewValue: '100% Later' },
  //   { value: '50% Advance - 50% Later', viewValue: '50% Advance - 50% Later' }
  // ]

  innerHeader: string = '';
  innerHeaderPaymentTerm: string = '';
  innerBtn: string = '';
  innerBtnPaymentTerm: string = '';
  innerDialogManufacturer: boolean = false;
  innerDialogPaymentTerms: boolean = false;
  isInnerUpdate: boolean = false;

  innerHeaderFreightTerm: string = '';
  innerBtnFreightTerm: string = '';
  innerDialogFreightTerm: boolean = false;
  currentShipmentModeCode: number = 0

  allShipmentModes: any
  constructor(
    private fb: FormBuilder,
    private apiservice: PurchaseOrderService,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private documentUploadService: DocumentUploadService,
  ) { }

  ngOnInit(): void {
    this.Masterform = this.fb.group({
      PONo: this.fb.control('', Validators.required),
      Store: this.fb.control('', Validators.required),
      PartyCode: this.fb.control('', Validators.required),
      PartyName: this.fb.control('', Validators.required),
      PODate: this.fb.control('', Validators.required),
      DeliveryDate: this.fb.control('', Validators.required),
      IsLocked: this.fb.control('', Validators.required),
      ShipmentModeCode: this.fb.control('', Validators.required),
      PaymentTermId: this.fb.control('', Validators.required),
      FreightTerms: this.fb.control('', Validators.required),
      CurrencyCode: this.fb.control('', Validators.required),
      FCExchangeRate: this.fb.control('', Validators.required),
      PurchaserId: this.fb.control('', Validators.required),
      POTypeNo: this.fb.control('', Validators.required),
      POTypeName: this.fb.control('', Validators.required),
      DeliveryPlace: this.fb.control('', Validators.required),
      FreightToBoren: this.fb.control('', Validators.required),
      Freight: this.fb.control('', Validators.required),
      Remarks: this.fb.control('', Validators.required),
      TermsAndConditions: this.fb.control('', Validators.required),
      CreatedBy: this.fb.control('', Validators.required),
      LockedBy: this.fb.control('', Validators.required),
      IsApproved: this.fb.control('', Validators.required),
      ApprovedBy: this.fb.control('', Validators.required),
      IsRejected: this.fb.control('', Validators.required),
      RejectedBy: this.fb.control('', Validators.required),
      FreightTermId: this.fb.control('', Validators.required),
    });
    this.ducumentFormInIt();

    this.POMasterId = +localStorage.getItem('PONo')!;

    this.Detailform = this.fb.group({
      ItemCode: this.fb.control('', Validators.required),
      POQty: this.fb.control('', Validators.required),
      Unit: this.fb.control(''),
      Rate: this.fb.control(''),
      Amount: this.fb.control(''),
      TaxPercentage: this.fb.control(''),
      TaxAmount: this.fb.control(''),
      AmountWithTax: this.fb.control(''),
      AllowedPercentage: this.fb.control(''),
      QuotationNo: this.fb.control(''),
      Notes: this.fb.control(''),
    });

    this.PRform = this.fb.group({
      PRNo: this.fb.control('', Validators.required),
    });
    this.shipmentModeForm = this.fb.group({
      ShipmentModeName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      IsActive: [false]
    })
    this.PaymentTermsForm = this.fb.group({
      PayemntTermName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      DocumentType: ['', Validators.required],
      IsActive: [false]
    })
    this.FreightTermForm = this.fb.group({
      FreightTerms: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      IsActive: [false]
    })

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routePONo = params['PONo'];
      this.routeStoreCode = params['StoreCode'];
    });
    this.loadShipmentMode();
    this.GetPaymentTerms();
    this.loadAllEmployee();
    this.loadPOMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePONo
    );
    this.loadStoreItem(this.routeStoreCode, this.globalBranchCode);
    this.loadPODetails(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePONo
    );
    this.loadCurrency();
    // this.loadAllPaymentterms();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();
    this.GetFreightTerms();
  }


  loadCurrency() {
    this.apiService.get(ApiEndpoints.getAllCurrency + `?BranchCode=${this.globalBranchCode}`).subscribe((res: any) => {
      this.currencyResponse$ = res;
    });
  }

  changeCurrency(e: any) {
    this.selectedCurrency = +e.target.value;
  }

  loadPendingPR() {
    const x = this.PRform.value;
    this.apiService.get(ApiEndpoints.PendingPRDetailsToBeAddedInPO +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PRNo=${x.PRNo}`)
      .subscribe((res) => {
        this.prResponse$ = res;
      });
  }

  // loadPOMasterInfo(BranchCode: number, StoreCode: number, PONo: number) {
  //   this.apiService.get(ApiEndpoints.GetAllPurchaseOrderMaster +
  //     `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}`)
  //     .subscribe((res: any) => {
  //       let x = res[0];
  //       if (x) {
  //         Object.assign(this.masterResponse$, x);
  //         const PODate = this.datePipe.transform(
  //           this.masterResponse$?.PODate,
  //           'MMM-d-y'
  //         );
  //         this.masterResponse$.PODate = PODate;
  //         const DeliveryDate = this.datePipe.transform(
  //           this.masterResponse$?.DeliveryDate,
  //           'y-MM-dd'
  //         );
  //         this.masterResponse$.DeliveryDate = DeliveryDate;
  //         this.masterResponse$.POTypeName = x.POTypeName;
  //         this.IsLocked = this.masterResponse$.IsLocked;
  //         this.Masterform.controls['FreightToBoren'].setValue(x.FreightToBoren);
  //         this.Masterform.controls['ShipmentModeCode'].setValue(x.ShipmentModeCode);
  //         this.Masterform.controls['FreightTerms'].setValue(x.FreightTerms);
  //         this.Masterform.controls['PaymentTermId'].setValue(x.PaymentTermId);
  //         this.Masterform.controls['CurrencyCode'].setValue(x.CurrencyCode);
  //         this.Masterform.controls['PurchaserId'].setValue(x.PurchaserId);
  //       }
  //     });
  // }

  loadPOMasterInfo(BranchCode: number, StoreCode: number, PONo: number) {
    this.apiService.get(ApiEndpoints.GetAllPurchaseOrderMaster +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}`)
      .subscribe((res: any) => {
        debugger
        this.Masterform.patchValue({
          ...res[0],
          PODate: this.datePipe.transform(
            res[0].PODate,
            'y-MM-dd'
          ),
          DeliveryDate: this.datePipe.transform(
            res[0].DeliveryDate,
            'y-MM-dd'
          ),

        })
      });
  }

  loadStoreItem(StoreCode: number, BranchCode: number) {
    this.apiService.get(ApiEndpoints.LoadStoreItems +
      `?StoreCode=${StoreCode}&BranchCode=${BranchCode}`)
      .subscribe((res: any) => {
        this.storeItemResponse$ = res.data;
      });
  }

  calculateAmount() {
    let val = this.Detailform.value;
    const qty = +val.POQty;
    const rate = +val.Rate;
    const x = qty * rate;
    this.detailResponse$.Amount = parseFloat(x.toString()).toFixed(2);
    if (isNaN(this.detailResponse$.Amount)) {
      this.detailResponse$.Amount = 0;
    }
  }

  calculateTax() {
    let val = this.Detailform.value;
    const amount = +val.Amount;
    const tax = +val.TaxPercentage;
    const taxpercantage = (amount / 100) * tax;
    this.detailResponse$.TaxAmount = parseFloat(
      taxpercantage.toString()
    ).toFixed(2);
    const x = taxpercantage + amount;
    this.detailResponse$.AmountWithTax = parseFloat(x.toString()).toFixed(2);
  }

  changeStoreItem(e: any) {
    this.selectedStoreItem = e.value;
    let x = this.storeItemResponse$.find((x: any) => {
      return this.selectedStoreItem == x?.Code;
    });
    this.detailResponse$.PRQty = x?.PRQty;
    this.detailResponse$.UnitCode = x?.UnitCode;
    this.detailResponse$.Unit = x?.Unit;
    this.detailResponse$.ItemCode = x?.Code;
  }

  loadPODetails(BranchCode: number, StoreCode: number, PONo: number) {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.GetAllPurchaseOrderDetail +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}`)
      .subscribe((res) => {
        this.tableResponse$ = res;
        this.isLoadingData = false
      });
  }

  PurchaseOrderReportpdf() {
    this.loading = true;
    //TBD----------------------------------------------------------------
    this.apiservice
      .pintPurchaseOrderReport(
        this.globalBranchCode,
        this.routeStoreCode,
        this.routePONo
      )
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;

        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  updateMaster() {
    debugger
    let model = this.Masterform.value;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUserCode;
    model.LockedBy = this.globalUserCode;
    model.ApprovedBy= this.globalUserCode;
    model.Freight = this.Masterform.get('Freight')!.value || 0;
    model.ShipmentModeCode = this.Masterform.get('ShipmentModeCode')!.value || 0;
    model.FreightTermId = this.Masterform.get('FreightTermId')!.value || 0;
    model.PaymentTermId = this.Masterform.get('PaymentTermId')!.value || 0;
    model.PurchaserId = this.Masterform.get('PurchaserId')!.value || 0;
    model.CurrencyCode = this.Masterform.get('CurrencyCode')!.value || 0;
    model.FCExchangeRate = this.Masterform.get('FCExchangeRate')!.value || 0;
    model.StoreCode = this.routeStoreCode;
    model.IsLocked =
      this.Masterform.get('IsLocked')?.value === null
        ? false
        : this.Masterform.get('IsLocked')?.value;
    if (model.IsLocked) {
      this.IsLocked = true;
    }
    this.cdRef.detectChanges();
    this.apiService.update(model, ApiEndpoints.UpdatePurchaseOrder + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Purchase Order Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
  }

  addorUpdate() {
    if (this.Masterform.invalid) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }
    this.updateMaster();
  }
  disableAddtoPO: boolean = false
  getObjonBlur(event: any) {
    if (event.CurQty > event.BalQty) {
      this.disableAddtoPO = true
      this.toastService.sendMessage({
        message: 'Quantity should be Less',
        type: NotificationType.error,
      });
    }
    else {
      let x = this.prResponse$.filter((x: any) => {
        return x.CurQty > 0;
      });
      this.objModel = x;
      this.disableAddtoPO = false
    }
  }

  addToPo() {
    for (let a in this.objModel) {
      let model: any = [];
      const x = this.PRform.value;
      model.BranchCode = this.globalBranchCode;
      model.PONo = this.masterResponse$.PONo;
      model.StoreCode = this.masterResponse$.StoreCode;
      model.PRNo = +x.PRNo;
      model.PRSrNo = this.objModel[a].PRSrNo;
      model.ItemCode = this.objModel[a].ItemCode;
      model.POQty = this.objModel[a].CurQty;
      model.UnitCode = this.objModel[a].ItemUnitCode;
      model.Rate = 0;
      model.Amount = 0;
      model.TaxPercentage = 0;
      model.TaxAmount = 0;
      model.AmountWithTax = 0;
      model.FCRate = 0;
      model.FCAmount = 0;
      model.FCTaxAmount = 0;
      model.FCAmountWithTax = 0;
      model.AllowedPercentage = 100;
      this.apiService.post(model, ApiEndpoints.InsertNewPODetail + `?`)
        .subscribe(() => {
          if (a.length == this.objModel.length) {
            this.loadPODetails(
              this.globalBranchCode,
              this.routeStoreCode,
              this.routePONo
            );
          }
        });
    }
    this.prdialog = false;
    this.toastService.sendMessage({
      message: 'PR Added to PO Successfully!',
      type: NotificationType.success,
    });
    this.prResponse$ = [];
    this.PRform.reset();
  }
  saveDetail() {

    let model;
    model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.PONo = this.masterResponse$.PONo;
    model.StoreCode = this.routeStoreCode;

    if (this.masterResponse$.wo_number == null) {
      model.wo_number = 0;
    }
    model.POQty = this.detailResponse$.POQty;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.POSrNo = this.masterResponse$.POSrNo;
    if (this.Detailform.value.AllowedPercentage == undefined) {
      this.Detailform.value.AllowedPercentage = 0;
      model.AllowedPercentage = this.Detailform.value.AllowedPercentage;
    }
    if (this.Detailform.value.QuotationNo == undefined) {
      this.Detailform.value.QuotationNo = 0;
      model.QuotationNo = this.Detailform.value.QuotationNo;
    }
    if (this.Detailform.value.Notes == undefined) {
      this.Detailform.value.Notes = null;
      model.Notes = this.Detailform.value.Notes;
    }
    this.apiService.post(model, ApiEndpoints.InsertNewPODetail + `?`)
      .subscribe(() => {
        this.loadPODetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePONo
        );
        this.detailResponse$.ItemCode = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: 'PO Detail Added!',
          type: NotificationType.success,
        });
      });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.detailResponse$ = { ...data };
    const obj: any = Object.values(this.storeItemResponse$).find((y: any) => {
      return y.Code === this.detailResponse$.ItemCode;
    });
    this.detailResponse$.ItemCode = obj.Code;
    this.detailResponse$.Unit = obj.Unit;
  }

  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updatePODetail();
    }
  }

  updatePODetail() {
    let model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.routeStoreCode;
    model.POSrNo = this.detailResponse$.POSrNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.PONo = this.detailResponse$.PONo;
    model.PRNo = this.detailResponse$.PRNo;
    model.PRSrNo = this.detailResponse$.PRSrNo;
    this.apiService.update(model, ApiEndpoints.UpdatePurchaseOrderDetail + `?`)
      .subscribe((res) => {
        this.loadPODetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePONo
        );
        this.detailResponse$.ItemCode = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: 'Purchase Order Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
  }

  deletePODetail(POSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeletePurchaseOrderDetail +
          `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&POSrNo=${POSrNo}&PONo=${this.routePONo}`)
          .subscribe(() => {
            this.loadPODetails(
              this.globalBranchCode,
              this.routeStoreCode,
              this.routePONo
            );
            this.toastService.sendMessage({
              message: 'Purchase Order Deleted Successfully!',
              type: NotificationType.deleted,
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
    this.router.navigate(['/Inventory/purchase-order']);
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
  ChangeCurrency() {
    this.apiService.get(ApiEndpoints.changeCurrency + `?IsPrimaryCurrency=${this.selectedCurrency}`)
      .subscribe((res: any) => {
        this.changeCurrencyResponse$ = res;
        const isDisabled = this.changeCurrencyResponse$ === 1;

        // Update the enabled/disabled state of the FCExchangeRate textbox
        if (isDisabled) {
          this.Masterform.get('FCExchangeRate')?.disable();
        } else {
          this.Masterform.get('FCExchangeRate')?.enable();
        }

        this.Masterform.patchValue({
          FCExchangeRate: this.changeCurrencyResponse$,
        });
      });
  }
  //====get-Previous-PO====
  LoadPreviousPO() {
    this.apiService.get(ApiEndpoints.GetPreviousPONo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PartyCode=${this.masterResponse$.PartyCode}&PONo=${this.routePONo}`)
      .subscribe((res: any) => {
        this.PreviousPO$ = res;
        Object.assign(this.masterResponse$, res[0]);
        const previousPOMasterId = this.PreviousPO$[0].PONo;
        this.loadPOMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePONo
        );
        this.loadPODetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePONo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /PONo=\d+/,
          `PONo=${previousPOMasterId}`
        );
        localStorage.setItem('PONo', previousPOMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
  //====get-Next-PO====
  LoadNextPO() {
    this.apiService.get(ApiEndpoints.GetNextPONo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PartyCode=${this.masterResponse$.PartyCode}&PONo=${this.routePONo}`)
      .subscribe((res: any) => {
        this.NextPO$ = res;
        Object.assign(this.masterResponse$, res[0]);
        let nextPOMasterId = this.NextPO$[0].PONo;
        this.loadPOMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePONo
        );
        this.loadPODetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePONo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /PONo=\d+/,
          `PONo=${nextPOMasterId}`
        );
        localStorage.setItem('PONo', nextPOMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }


  //------------------------------------upload Documnet Working start from here------------------------------------


  getGetMaxDocumentId() {

    let BranchCode = +this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PONo = +this.routePONo;
    this.documentUploadService.getMaxPODocumentId(BranchCode, StoreCode, PONo).subscribe(
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
    model.BranchCode = +this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.PONo = +this.routePONo;
    this.apiService
      .get(
        ApiEndpoints.GetAllPODocuments +
        `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&PONo=${model.PONo}`
      )
      .subscribe((res: any) => {

        this.documentResponse = res.data;
      });
  }

  saveDocument() {

    let model = this.UploadDocform.value;
    model.BranchCode = +this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.PONo = +this.routePONo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = +this.globalUserCode;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.documentUploadService.savePODocuments(model, this.selectedFiles).subscribe(() => {
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

    let BranchCode = +this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PONo = +this.routePONo;
    let DocumentId = +data.DocumentId;
    this.documentUploadService

      .viewPODocuments(BranchCode, StoreCode, PONo, DocumentId)
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
    data.PONo = this.routePONo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.apiService
          .delete(
            ApiEndpoints.DeletePODocuments +
            `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&PONo=${data.PONo}&DocumentId=${data.DocumentId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Document Deleted Successfully!',
              type: NotificationType.deleted,
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
      .get(
        ApiEndpoints.GetAllPaths +
        '?BranchCode=' + this.globalBranchCode
      )
      .subscribe((res: any) => {

        this.ImageDirectory = res[0].PurchaseOrderPath;
      });
  }

  loadAllEmployee() {
    this.apiService.get(ApiEndpoints.EmployeeSetup)
      .subscribe((res: any) => {
        this.allEmployeeList = res;
      });
  }


  //ShipmentMode API and Dropdown Rendering
  addNewShipmentMode() {
    this.innerHeader = 'Add Shipment Mode';
    this.innerBtn = 'Save';
    this.innerDialogManufacturer = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }
  hideDialogShipmentMode() {
    this.innerDialogManufacturer = false;
    this.isInnerUpdate = false;
    this.shipmentModeForm.reset();
  }
  addorUpdateShipmentMode() {
    if (!this.isInnerUpdate) {
      this.GetMaxShipmentModeCode()

    } else {
      this.updateShipmentMode();
    }

  }
  saveShipmentMode(ShipmentModeCode: number) {
    let model = this.shipmentModeForm.value
    model.BranchCode = this.globalBranchCode
    model.AddByUserId = this.globalUserCode
    model.ShipmentModeCode = ShipmentModeCode
    this.apiService.post(model, ApiEndpoints.AddShipmentMode).subscribe(res => {
      this.toastService.sendMessage({
        message: 'New Shipment Mode Saved Successfully!',
        type: NotificationType.success,
      });
      this.shipmentModeForm.reset();
      this.loadShipmentMode();
    })
  }
  getRowShipmentMode(data: any) {

    this.isInnerUpdate = true;
    this.innerHeader = 'Update Shipment Mode';
    this.innerBtn = 'Update';
    this.shipmentModeForm.controls['ShipmentModeName'].setValue(data.ShipmentModeName)
    this.shipmentModeForm.controls['IsActive'].setValue(data.IsActive)
    this.currentShipmentModeCode = data.ShipmentModeCode
  }

  loadShipmentMode() {
    this.apiService.get(ApiEndpoints.LoadShipmentMode + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.shipmentResponse$ = res;
      });
  }

  GetMaxShipmentModeCode() {
    this.apiService.get(ApiEndpoints.GetMaxShipmentModeCode).subscribe((res: any) => {

      this.ShipmentModeCode = res[0].ShipmentModeCode
      this.saveShipmentMode(this.ShipmentModeCode);

    })
  }

  updateShipmentMode() {
    let model = this.shipmentModeForm.value
    model.ShipmentModeCode = this.currentShipmentModeCode
    model.BranchCode = this.globalBranchCode
    console.log(model, 'model')
    this.apiService.update(model, ApiEndpoints.UpdateShipmentMode)

      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Shipment Mode Update Successfully!',
          type: NotificationType.success,
        });
        this.shipmentModeForm.reset();
        this.addNewShipmentMode();
        this.loadShipmentMode();
      });
  }

  deleteShipmentMode(ShipmentModeCode: number) {
    this.confirmservice.confirm({
      message: `Are you sure that you want to delete this Shipment Mode?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteShipmentMode, { ShipmentModeCode, BRanchCode: this.globalBranchCode })
          .subscribe((res) => {
            this.loadShipmentMode();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Shipment Mode Deleted Successfully!',
                type: NotificationType.deleted,
                title: "Success"
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

  //Payment Terms API and Dropdown Rendering

  // loadAllPaymentterms() {
  //   this.apiService.get(ApiEndpoints.GetPaymentTerms + `?DocumentType=Purchase Order&BranchCode=${this.globalBranchCode}`)
  //     .subscribe((res: any) => {
  //       this.PaymentTermsresponse$ = res;
  //     });
  // }
  changePaymentTerms(e: any) {
    this.selectedPaymentterms = +e.target.value;
    // const selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
    // const selectedPaymentTerm = this.PaymentTermsresponse$[selectedIndex];
    // this.selectedPaymentterms = selectedPaymentTerm;
  }

  addNewPaymentTerms() {
    this.innerHeaderPaymentTerm = 'Add Payment Term';
    this.innerBtnPaymentTerm = 'Save';
    this.innerDialogPaymentTerms = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  GetPaymentTerms() {
    this.apiService.get(ApiEndpoints.GetPaymentTerms + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.paymentTermsresponse$ = res;
      });
  }

  GetMaxPaymentTermId() {
    this.apiService.get(ApiEndpoints.GetMaxPaymentTermId).subscribe((res: any) => {

      this.PaymentTermId = res[0].PaymentTermId
      this.savePaymentTerms(this.PaymentTermId);

    })
  }

  currentPaymentTermId: number = 0
  getRowPaymentTerm(data: any) {

    this.isInnerUpdate = true;
    this.innerHeaderPaymentTerm = 'Update Payment Term ';
    this.innerBtnPaymentTerm = 'Update';
    this.PaymentTermsForm.controls['PayemntTermName'].setValue(data.PayemntTermName)
    this.PaymentTermsForm.controls['DocumentType'].setValue(data.DocumentType)
    this.PaymentTermsForm.controls['IsActive'].setValue(data.IsActive)
    this.currentPaymentTermId = data.PaymentTermId
  }

  deletePaymentTerms(PaymentTermId: number) {
    this.confirmservice.confirm({
      message: `Are you sure that you want to delete this Shipment Mode?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeletePaymentTerms, { PaymentTermId, BRanchCode: this.globalBranchCode })
          .subscribe((res) => {
            this.GetPaymentTerms();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Payment Term Deleted Successfully!',
                type: NotificationType.deleted,
                title: "Success"
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


  hideDialogPaymentTerms() {
    this.innerDialogPaymentTerms = false;
    this.isInnerUpdate = false;
    this.PaymentTermsForm.reset();
  }

  addorUpdatePaymentTerms() {
    if (!this.isInnerUpdate) {
      this.GetMaxPaymentTermId();
    }
    else {
      this.updatePaymentTerms();
    }

  }

  savePaymentTerms(PaymentTermId: number) {
    let model = this.PaymentTermsForm.value
    model.BranchCode = this.globalBranchCode
    model.AddByUserId = this.globalUserCode
    model.PaymentTermId = PaymentTermId
    this.apiService.post(model, ApiEndpoints.AddPaymentTerms).subscribe(res => {
      this.toastService.sendMessage({
        message: 'New Payment Term Saved Successfully!',
        type: NotificationType.success,
      });
      this.PaymentTermsForm.reset();
      this.GetPaymentTerms();
    })
  }

  updatePaymentTerms() {
    let model = this.PaymentTermsForm.value
    model.PaymentTermId = this.currentPaymentTermId
    model.BranchCode = this.globalBranchCode
    console.log(model, 'model')
    this.apiService.update(model, ApiEndpoints.UpdatePaymentTerms)

      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Payment Term Update Successfully!',
          type: NotificationType.success,
        });
        this.PaymentTermsForm.reset();
        this.addNewPaymentTerms();
        this.GetPaymentTerms();
      });
  }


  //FreightTerm API and Dropdown Rendering

  GetFreightTerms() {
    this.apiService.get(ApiEndpoints.LoadFreightTerms + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        debugger
        this.frieghtTerms$ = res;
      });
  }


  GetMaxFreightTermId() {
    this.apiService.get(ApiEndpoints.GetMaxFreightTermId).subscribe((res: any) => {

      this.FreightTermId = res[0].FreightTermId
      this.saveFreightTerm(this.FreightTermId);

    })
  }

  addorUpdateFreightTerm() {
    if (!this.isInnerUpdate) {
      this.GetMaxFreightTermId();
    }
    else {
      this.updateFreightTerm();
    }

  }

  addNewFreightTerm() {
    this.innerHeaderFreightTerm = 'Add Freight Term';
    this.innerBtnFreightTerm = 'Save';
    this.innerDialogFreightTerm = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }

  currentFreightTermId: number = 0
  getRowFreightTerm(data: any) {
    this.isInnerUpdate = true;
    this.innerHeaderFreightTerm = 'Update Freight Term ';
    this.innerBtnFreightTerm = 'Update';
    this.FreightTermForm.controls['FreightTerms'].setValue(data.FreightTerms)
    this.FreightTermForm.controls['IsActive'].setValue(data.IsActive)
    this.currentFreightTermId = data.FreightTermId
  }



  saveFreightTerm(FreightTermId: number) {

    let model = this.FreightTermForm.value
    model.BranchCode = this.globalBranchCode
    model.AddByUserId = this.globalUserCode
    model.FreightTermId = FreightTermId
    this.apiService.post(model, ApiEndpoints.AddFreightTerm).subscribe(res => {
      this.toastService.sendMessage({
        message: 'New Freight Term Saved Successfully!',
        type: NotificationType.success,
      });
      this.FreightTermForm.reset();
      this.GetFreightTerms();
    })
  }



  updateFreightTerm() {
    let model = this.FreightTermForm.value
    model.FreightTermId = this.currentFreightTermId
    model.BranchCode = this.globalBranchCode
    console.log(model, 'model')
    this.apiService.update(model, ApiEndpoints.UpdateFreightTerm)

      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Payment Term Update Successfully!',
          type: NotificationType.success,
        });
        this.FreightTermForm.reset();
        this.addNewFreightTerm();
        this.GetFreightTerms();
      });
  }




  hideDialogFreightTerm() {
    this.innerDialogFreightTerm = false;
    this.isInnerUpdate = false;
    this.FreightTermForm.reset();
  }



  deleteFreightTerms(FreightTermId: number) {
    this.confirmservice.confirm({
      message: `Are you sure that you want to delete this Shipment Mode?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteFreightTerm, { FreightTermId, BRanchCode: this.globalBranchCode })
          .subscribe((res) => {
            this.GetFreightTerms();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Payment Term Deleted Successfully!',
                type: NotificationType.deleted,
                title: "Deleted"
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
