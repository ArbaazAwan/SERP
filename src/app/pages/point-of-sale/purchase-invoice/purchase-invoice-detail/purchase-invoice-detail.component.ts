import { PurchaseInvoiceService } from './../../../../_shared/services/purchase-invoice.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { StatusListPI } from 'src/app/_shared/model/status-list.model';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';

@Component({
  selector: 'app-purchase-invoice-detail',
  templateUrl: './purchase-invoice-detail.component.html',
  styleUrls: ['./purchase-invoice-detail.component.scss'],
})
export class PurchaseInvoiceDetailComponent implements OnInit {
  loading = false;
  DocumentId: any;
  GRNNo: number = 0;
  PRform!: FormGroup;
  objModel: any = [];
  selectedFiles: any;
  ImageDirectory: any;
  discount: number = 0;
  routePINo: number = 0;
  prResponse$: any = [];
  selectedCurrency: any;
  postingDate: any = '';
  Detailform!: FormGroup;
  Masterform!: FormGroup;
  documentResponse: any;
  POMasterId: number = 0;
  amountsForm!: FormGroup;
  globalUserCode!: number;
  partyResponse: any = [];
  tableResponse$: any = [];
  checked: boolean = false;
  masterResponse$: any = [];
  IsLocked: boolean = false;
  detailResponse$: any = [];
  globalBranchCode!: number;
  isUpdate: boolean = false;
  prdialog: boolean = false;
  pendingToInvoiceGRNs: any;
  isSticky: boolean = false;
  UploadDocform!: FormGroup;
  uploadDoc: boolean = false;
  paymentResponse$: any = [];
  GRNFiltersForm!: FormGroup;
  routeStoreCode: number = 0;
  selectedStoreItem!: number;
  currencyResponse$: any = [];
  shipmentResponse$: any = [];
  importGrns: boolean = false;
  storeItemResponse$: any = [];
  selectedPaymentTerm!: number;
  selectedGRNs: Array<any> = [];
  isLoadingData: boolean = false;
  statusList: any = StatusListPI;
  datePipe = new DatePipe('en-US');
  changeCurrencyResponse$: any = [];
  pendingToInvoiceGRNsDetail: any = [];
  openImportGRNDialog: boolean = false;
  openPostInvoiceDialog: boolean = false;
  PaymentTypeId: FormControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private activatedRoute: ActivatedRoute,
    private apiservice: PurchaseInvoiceService,
    private confirmservice: ConfirmationService,
    private documentUploadService: DocumentUploadService
  ) { }

  ngOnInit(): void {
    this.formsInit();
    this.POMasterId = +localStorage.getItem('PONo')!;
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routePINo = params['PurchaseInvoiceNo'];
      this.routeStoreCode = params['StoreCode'];
    });
    this.loadPIMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePINo
    );
    this.loadPIDetails(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePINo
    );
    this.loadPayment();
    this.loadCurrency();
    this.loadAllParties();
    this.loadAllDocuments();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  formsInit() {
    this.Masterform = this.fb.group({
      Status: this.fb.control(''),
      DueDate: this.fb.control(''),
      Remarks: this.fb.control(''),
      PartyCode: this.fb.control(''),
      PartyBillNo: this.fb.control(''),
      CurrencyCode: this.fb.control(''),
      PartyBillDate: this.fb.control(''),
      FCExchangeRate: this.fb.control(''),
      AdvancePaymentId: this.fb.control(''),
      PurchaseInvoiceNo: this.fb.control(''),
      PurchaseInvoiceDate: this.fb.control(''),
      AdvancePaymentAmount: this.fb.control(''),
    });
    this.Detailform = this.fb.group({
      Remarks: this.fb.control(''),
      TotalWHT: this.fb.control(''),
      IsVerified: this.fb.control(''),
      TotalAmount: this.fb.control(''),
      CurrencyCode: this.fb.control(''),
      TotalFreeQty: this.fb.control(''),
      PaymentTypeId: this.fb.control(''),
      WHTPercentage: this.fb.control(''),
      TotalDiscount: this.fb.control(''),
      FCExchangeRate: this.fb.control(''),
      TotalNetAmount: this.fb.control(''),
      TotalReceivedQty: this.fb.control(''),
      IsPrimaryCurrency: this.fb.control(''),
      TotalFreeQtyAmount: this.fb.control(''),
      TotalDiscountPercentage: this.fb.control(''),
      TotalReceivedQtyAmount: this.fb.control(''),
    });
    this.GRNFiltersForm = this.fb.group({
      PartyCode: this.fb.control(''),
      GRNDateTo: this.fb.control(''),
      GRNDateFrom: this.fb.control(''),
    })
    this.amountsForm = this.fb.group({
      discount: this.fb.control(0),
      netTotal: this.fb.control(''),
      TaxAmount: this.fb.control(''),
      DiscAmount: this.fb.control(''),
      GrossTotal: this.fb.control(''),
    })
    this.PRform = this.fb.group({
      GRNNo: this.fb.control('', Validators.required),
    });

    this.UploadDocform = this.fb.group({
      DocumentId: this.fb.control('', Validators.required),
      Description: this.fb.control('', Validators.required),
    });
  }

  loadAllParties() {
    this.apiService.get(ApiEndpoints.GetAllParties +
      `?BranchCode=${this.globalBranchCode}`).subscribe((res: any) => {
        this.partyResponse = res.data;
      });
  }

  loadCurrency() {
    this.apiService.get(ApiEndpoints.getAllCurrency + `?BranchCode=${this.globalBranchCode}`).subscribe((res: any) => {
      this.currencyResponse$ = res;
    });
  }

  loadPayment() {
    this.apiService.get(ApiEndpoints.getAllInstrumentType)
      .subscribe((res) => {
        this.paymentResponse$ = res;
      });
  }

  loadPIMasterInfo(
    BranchCode: number,
    StoreCode: number,
    PurchaseInvoiceNo: number
  ) {
    this.apiService.get(ApiEndpoints.LoadPurchaseInvoiceMasterInfo +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchaseInvoiceNo=${PurchaseInvoiceNo}`)
      .subscribe((res: any) => {
        this.masterResponse$ = res.data[0]
        let x = res.data[0];
        if (x) {
          this.Masterform.patchValue({ ...x })
          let PIDate = this.datePipe.transform(x.PurchaseInvoiceDate, 'yyyy-MM-dd');
          this.Masterform.controls['PurchaseInvoiceDate'].setValue(PIDate);
          let PartyBillDate = this.datePipe.transform(x.PartyBillDate, 'yyyy-MM-dd');
          this.Masterform.controls['PartyBillDate'].setValue(PartyBillDate);
          let DueDate = this.datePipe.transform(x.DueDate, 'yyyy-MM-dd');
          this.Masterform.controls['DueDate'].setValue(DueDate);
        }
      });
  }

  loadPIDetails(
    BranchCode: number,
    StoreCode: number,
    PurchaseInvoiceNo: number
  ) {
    this.apiService.get(ApiEndpoints.GetPurchaseInvoiceDetail +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchaseInvoiceNo=${PurchaseInvoiceNo}`)
      .subscribe((res: any) => {
        this.tableResponse$ = res.data;
        this.calculateTotal()
      });
  }

  PIDetailReportpdf() {
    this.loading = true;
    this.apiservice
      .pintPurchaseInvoiceReport(
        this.globalBranchCode,
        this.routeStoreCode,
        this.routePINo
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
    let model = this.Masterform.value;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUserCode;
    model.StoreCode = this.masterResponse$.StoreCode;
    model.PaymentTypeId = this.selectedPaymentTerm;
    if (isNaN(model.PaymentTypeId)) {
      model.PaymentTypeId = this.masterResponse$.PaymentTypeId;
    }
    model.TotalGST = this.masterResponse$.TotalWHT;
    model.IsVerified =
      this.Detailform.get('IsVerified')?.value === undefined ? false : true;
    this.apiService.update(model, ApiEndpoints.UpdatePurchaseInvoiceMaster).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Purchase Invoice Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
  }

  updatePIMaster() {
    if (this.Masterform.invalid) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }
    this.updateMaster();
  }

  getObjonBlur(event: any) {
    let x = this.pendingToInvoiceGRNsDetail.filter((x: any) => {
      return x.InvoiceQty > 0;
    });
    this.objModel = x;
    if (event.InvoiceQty > event.GRNQty) {
      return this.toastService.sendMessage({
        message: 'Quantity should be Less',
        type: NotificationType.error,
      });
    }
    this.GRNNo = event.GRNNo
  }

  importGrnToInvoice() {
    for (let a in this.objModel) {
      let model: any = [];
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.routeStoreCode;
      model.PurchaseInvoiceNo = this.masterResponse$.PurchaseInvoiceNo;
      model.GRNNo = this.GRNNo;
      model.GRNSrNo = this.objModel[a].GRNSrNo;
      model.InvoiceQty = this.objModel[a].InvoiceQty
      model.DiscountPercentage = 0
      model.DiscountAmount = 0
      model.CreatedBy = this.globalUserCode;
      this.apiService.post(model, ApiEndpoints.ImportGRNDetailsToInvoiceDetails).subscribe(res => {
        this.toastService.sendMessage({
          message: 'GRN Added to Invoice Successfully!',
          type: NotificationType.success,
        });
        this.openPostInvoiceDialog = false
      })
    }
  }

  calculateTotal() {
    const netAmount = this.tableResponse$.reduce(
      (acc: number, data: any) => acc + data.NetAmount,
      0
    );
    const discountAmount = this.tableResponse$.reduce(
      (acc: number, data: any) => acc + data.DiscountAmount,
      0
    );
    const taxAmount = this.tableResponse$.reduce(
      (acc: number, data: any) => acc + data.TaxValues,
      0
    );
    const grossAmount = netAmount + taxAmount - discountAmount
    this.amountsForm.controls['netTotal'].setValue(netAmount.toFixed(2))
    this.amountsForm.controls['TaxAmount'].setValue(taxAmount.toFixed(2))
    this.amountsForm.controls['DiscAmount'].setValue(discountAmount)
    this.amountsForm.controls['GrossTotal'].setValue(grossAmount.toFixed(2))
  }

  refreshdetail() {
    this.isUpdate = false;
  }

  verifyInvoice() {
    let model = {
      BranchCode: this.globalBranchCode,
      StoreCode: this.routeStoreCode,
      PurchaseInvoiceNo: this.routePINo,
      VerifiedBy: this.globalUserCode
    }
    this.apiService.update(model, ApiEndpoints.VerifyInvoice).subscribe(res => {
      if (res == true) {
        this.loadPIMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePINo
        );
        this.toastService.sendMessage({
          message: 'Purchase Invoice Verified Successfully!',
          type: NotificationType.success,
        });
      }
    })
  }

  postInvoiceModel() {
    this.openPostInvoiceDialog = true;
  }

  closeInvoicePostDialog() {
    this.openPostInvoiceDialog = false;
  }

  postInvoice() {
    let model = {
      BranchCode: this.globalBranchCode,
      StoreCode: this.routeStoreCode,
      PurchaseInvoiceNo: this.routePINo,
      PostedBy: this.globalUserCode,
      PostedDate: this.postingDate
    }
    this.apiService.update(model, ApiEndpoints.PostInvoice).subscribe(res => {
      if (res == true) {
        this.loadPIMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePINo
        );
        this.openPostInvoiceDialog = false;
        this.toastService.sendMessage({
          message: 'Purchase Invoice Posted Successfully!',
          type: NotificationType.success,
        });
      }
    })
  }

  openImportDialog() {
    this.openImportGRNDialog = true
  }

  closeImportDialog() {
    this.openImportGRNDialog = false;
    this.importGrns = false
  }

  getPendingToInvoieGRNs() {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.GetPendingToInvoiceGRNMasters + `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PartyCode=${this.Masterform.controls['PartyCode'].value}`).
      subscribe((res: any) => {
        this.pendingToInvoiceGRNs = res.data
        this.isLoadingData = false
      })
  }

  ImportGRNs(GrnNo: number) {
    this.importGrns = true
    this.loadGrnDetail(GrnNo)
  }

  loadGrnDetail(GrnNo: number) {
    this.apiService.get(ApiEndpoints.GetPendingToInvoiceGRNDetails + `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PartyCode=${this.Masterform.controls['PartyCode'].value}&GRNNo=${GrnNo}`).
      subscribe((res: any) => {
        this.pendingToInvoiceGRNsDetail = res.data
        this.isLoadingData = false
      })
  }

  goBack() {
    this.importGrns = false
  }

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  calculateAmounts() {
    const formValue = this.amountsForm.getRawValue();
    const DiscountAmount = formValue.discount;
    let GrossAmount = formValue.GrossTotal - DiscountAmount
    this.amountsForm.get('DiscAmount')?.setValue(DiscountAmount)
    this.amountsForm.get('GrossTotal')?.setValue(GrossAmount)
  }

  openUploadDoc() {
    this.uploadDoc = true;
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
    model.PurchaseInvoiceNo = this.routePINo;
    this.apiService
      .get(
        ApiEndpoints.GetPurchaseInvoiceDocuments +
        `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&PurchaseInvoiceNo=${model.PurchaseInvoiceNo}`
      )
      .subscribe((res: any) => {

        this.documentResponse = res.data;
      });
  }


  getGetMaxDocumentId() {

    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PurchaseInvoiceNo = this.routePINo;
    this.documentUploadService.getMaxPurchaseInvoiceDocumentId(BranchCode, StoreCode, PurchaseInvoiceNo).subscribe(
      (res: any) => {
        this.DocumentId = res[0].DocumentId;
      },
      (error) => {
        console.error('Error fetching document:', error);
      }
    );
  }

  saveDocument() {
    let model = this.UploadDocform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.PurchaseInvoiceNo = this.routePINo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = this.globalUserCode;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.documentUploadService.savePurchaseInvoiceDocuments(model, this.selectedFiles).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Document Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllDocuments();
      this.UploadDocform.reset();
      this.getGetMaxDocumentId();
    });

    this.Detailform.markAsUntouched();
  }

  HideUploadDoc() {
    this.uploadDoc = false;
  }

  ViewDocuments(data: any) {

    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PurchaseInvoiceNo = this.routePINo;
    let DocumentId = data.DocumentId;
    this.documentUploadService.viewPurchaseInvoiceDocuments(BranchCode, StoreCode, PurchaseInvoiceNo, DocumentId)
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
    data.PurchaseInvoiceNo = this.routePINo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeletePurchaseInvoiceDocuments +
            `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&PurchaseInvoiceNo=${data.PurchaseInvoiceNo}&DocumentId=${data.DocumentId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Purchase Invoice Document Deleted Successfully!',
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

        this.ImageDirectory = res[0].PurchaseInvoicePath;
      });
  }


}
