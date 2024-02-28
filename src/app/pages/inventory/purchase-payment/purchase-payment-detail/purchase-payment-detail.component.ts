import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { StatusListPI } from 'src/app/_shared/model/status-list.model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { PurchaseInvoiceService } from 'src/app/_shared/services/purchase-invoice.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-purchase-payment-detail',
  templateUrl: './purchase-payment-detail.component.html',
  styleUrls: ['./purchase-payment-detail.component.scss']
})
export class PurchasePaymentDetailComponent implements OnInit {
  objModel: any;
  selectedFiles: any;
  partyResponse: any;
  masterResponse: any;
  ImageDirectory: any;
  Detailform!: FormGroup;
  Masterform!: FormGroup;
  documentResponse: any;
  globalUserCode!: number;
  instrumentResponse: any;
  DocumentId: number = 0;
  allBankCashAccounts: any;
  loading: boolean = false;
  globalBranchCode!: number;
  isSticky: boolean = false;
  routePaymentNo: number = 0;
  UploadDocform!: FormGroup;
  routeStoreCode: number = 0;
  uploadDoc: boolean = false;
  importGrns: boolean = false;
  purchasePaymentDetails: any;
  purchasePaymentsDetails: any;
  pendingToPaymentInvoices: any;
  statusList: any = StatusListPI;
  isLoadingData: boolean = false;
  datePipe = new DatePipe('en-US');
  pendingToPaymentInvoiceDetail: any;
  openImportInvoicesDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private activatedRoute: ActivatedRoute,
    private apiservice: PurchaseInvoiceService,
    private confirmservice: ConfirmationService,
    private documentUploadService: DocumentUploadService
  ) { }

  ngOnInit(): void {
    this.formsInit();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routePaymentNo = params['PurchasePaymentNo'];
      this.routeStoreCode = params['StoreCode'];
    });
    this.loadAllParties();
    this.loadInstrument();
    this.getAllBankAccounts();
    this.loadAllDocuments();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadPaymentMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePaymentNo
    );
    this.getPurchasePaymentsInfo()
  }

  formsInit() {
    this.Masterform = this.fb.group({
      PurchasePaymentNo: this.fb.control(''),
      PurchasePaymentDate: this.fb.control(''),
      PartyCode: this.fb.control(''),
      Status: this.fb.control(''),
      InstrumentTypeId: this.fb.control(''),
      AccountId: this.fb.control(''),
      Remarks: this.fb.control('')
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

  loadInstrument() {
    this.apiService.get(ApiEndpoints.getAllInstrumentType).subscribe((res) => {
      this.instrumentResponse = res;
    });
  }

  getAllBankAccounts() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.GetAllAccounts + '?BranchCode=' + this.globalBranchCode)
      .subscribe(
        (response: any) => {
          this.allBankCashAccounts = response;
          this.isLoadingData = false;
        }
      );
  }
  loadPaymentMasterInfo(
    BranchCode: number,
    StoreCode: number,
    PurchasePaymentNo: number
  ) {
    this.apiService.get(ApiEndpoints.GetPurchasePaymentMaster +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PurchasePaymentNo=${PurchasePaymentNo}`)
      .subscribe((res: any) => {
        this.masterResponse = res.data[0]
        let x = res.data[0];
        if (x) {
          this.Masterform.controls['PurchasePaymentNo'].setValue(x.PurchasePaymentNo)
          let PIDate = this.datePipe.transform(x.PurchasePaymentDate, 'yyyy-MM-dd');
          this.Masterform.controls['PurchasePaymentDate'].setValue(PIDate)
          this.Masterform.controls['PartyCode'].setValue(x.PartyCode)
          this.Masterform.controls['Status'].setValue(x.Status)
          this.Masterform.controls['InstrumentTypeId'].setValue(x.InstrumentTypeId)
        }
      });
  }


  updatePurchasePaymentMaster() {
    let model = this.Masterform.value
    model.BranchCode = this.globalBranchCode
    model.StoreCode = this.routeStoreCode
    model.ModifiedBy = this.globalUserCode
    this.apiService.update(model, ApiEndpoints.UpdatePurchasePaymentMaster).subscribe(res => {
      this.toastService.sendMessage({
        message: 'Purchase Payment Updated Successfully!',
        type: NotificationType.success,
      });
    })
  }

  openImportDialog() {
    this.openImportInvoicesDialog = true
  }
  closeImportDialog() {
    this.openImportInvoicesDialog = false;
    this.importGrns = false
  }

  getPendingToPaymentInvoices() {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.GetPendingToPaymentInvoiceMasters + `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PartyCode=${this.Masterform.controls['PartyCode'].value}`).
      subscribe((res: any) => {
        this.pendingToPaymentInvoices = res.data
        this.isLoadingData = false
      })
  }

  ImportInvoices(InvoiceNo: number) {
    this.importGrns = true
    this.loadInvoiceDetail(InvoiceNo)
  }

  loadInvoiceDetail(InvoiceNo: number) {
    this.apiService.get(ApiEndpoints.GetPendingToPaymentInvoiceDetail + `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PartyCode=${this.Masterform.controls['PartyCode'].value}&PurchaseInvoiceNo=${InvoiceNo}`).
      subscribe((res: any) => {
        this.pendingToPaymentInvoiceDetail = res.data
        this.isLoadingData = false
      })
  }

  goBack() {
    this.importGrns = false
  }

  getPurchasePaymentDetails() {
    this.apiService.get(ApiEndpoints.GetPurchasePaymentDetails + `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PartyCode=${this.Masterform.controls['PartyCode'].value}`).subscribe((res: any) => {
      this.purchasePaymentDetails = res.data
    })

  }


  getObjonBlur(event: any) {
    let x = this.purchasePaymentDetails.filter((x: any) => {
      return x.PaidNow > 0;
    });
    this.objModel = x;
    console.log(this.objModel, 'model1S')
    if (event.PaidNow > event.GrossAmount) {
      return this.toastService.sendMessage({
        message: 'Quantity should be Less',
        type: NotificationType.error,
      });
    }
  }

  importInvoiceToPayment() {
    for (let a in this.objModel) {
      let model: any = [];
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.routeStoreCode;
      model.PurchasePaymentNo = this.masterResponse.PurchasePaymentNo;
      model.PurchaseInvoiceNo = this.objModel[a].PurchaseInvoiceNo;
      model.PaidAmount = this.objModel[a].PaidNow
      model.CreatedBy = this.globalUserCode;
      this.apiService.post(model, ApiEndpoints.ImportPurchasePaymentDetails).subscribe(res => {
        this.toastService.sendMessage({
          message: 'Invoice Added to Payment Successfully!',
          type: NotificationType.success,
        });
        this.getPurchasePaymentsInfo()
        this.openImportInvoicesDialog = false
      })
    }
  }

  getPurchasePaymentsInfo() {
    this.apiService.get(ApiEndpoints.GetPurchasePaymentsInfo + `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PurchasePaymentNo=${this.routePaymentNo}`).
      subscribe((res: any) => {
        this.purchasePaymentsDetails = res.data
      })
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
    this.apiService
      .get(
        ApiEndpoints.GetAllPurchasePaymentDocuments +
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PurchasePaymentNo=${this.routePaymentNo}`
      )
      .subscribe((res: any) => {

        this.documentResponse = res.data;
      });
  }


  getGetMaxDocumentId() {

    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PurchasePaymentNo = this.routePaymentNo;
    this.documentUploadService.getMaxPurchasePaymentDocumentId(BranchCode, StoreCode, PurchasePaymentNo).subscribe(
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
    model.PurchasePaymentNo = this.routePaymentNo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = this.globalUserCode;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.documentUploadService.savePurchasePaymentDocuments(model, this.selectedFiles).subscribe(() => {
      this.toastService.sendMessage({
        message: 'New Document Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllDocuments();
      this.UploadDocform.reset();
      this.getGetMaxDocumentId();
      // this.uploadDoc = false
    });

    this.Detailform.markAsUntouched();
  }

  HideUploadDoc() {
    this.uploadDoc = false;
  }

  ViewDocuments(data: any) {
    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PurchasePaymentNo = this.routePaymentNo;
    let DocumentId = data.DocumentId;
    this.documentUploadService.viewPurchasePaymentDocuments(BranchCode, StoreCode, PurchasePaymentNo, DocumentId)
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
    data.PurchasePaymentNo = this.routePaymentNo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeletePurchasePaymentDocuments +
            `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&PurchasePaymentNo=${data.PurchasePaymentNo}&DocumentId=${data.DocumentId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Purchase Payment Document Deleted Successfully!',
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
    this.apiService.get(ApiEndpoints.GetAllPaths + '?BranchCode=' + this.globalBranchCode)
      .subscribe((res: any) => {
        this.ImageDirectory = res[0].PurchasePaymentPath;
      });
  }



  PurchasePaymentDetailReportpdf() {
    this.loading = true;
    this.apiservice.pintPurchasePaymentReport(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePaymentNo
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

}
