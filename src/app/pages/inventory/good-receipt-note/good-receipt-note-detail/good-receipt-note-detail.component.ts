import { GrnService } from './../../../../_shared/services/grn.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

interface LockStatus {
  disabled: boolean;
  value: string;
}

@Component({
  selector: 'app-good-receipt-note-detail',
  templateUrl: './good-receipt-note-detail.component.html',
  styleUrls: ['./good-receipt-note-detail.component.scss'],
})
export class GoodReceiptNoteDetailComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  POform!: FormGroup;

  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  poResponse$: any = [];
  storeItemResponse$: any = [];
  workOrderResponse$: any = [];
  objModel: any = [];

  routeGRNNo: number = 0;
  routeStoreCode: number = 0;

  selectedStoreItem!: number;
  selectedWorkOrder!: number;
  globalBranchCode!: number;
  globalUserCode!: number;

  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  prdialog: boolean = false;
  POMasterId: number = 0;
  lockStatus!: LockStatus[];
  routeBranchName!: string;
  IsLocked: boolean = false;
  loading = false;
  PreviousGRN$: any = [];
  NextGRN$: any = [];

  uploadDoc: boolean = false;
  displayDocumentDialog: boolean = false;
  UploadDocform!: FormGroup;
  documentResponse: any;
  imagePathOnServer!: string;
  selectedFiles: any;
  DocumentId: any;
  ImageDirectory: any;
  isLoadingData: boolean = false

  constructor(
    private fb: FormBuilder,
    private apiservice: GrnService,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private documentUploadService: DocumentUploadService
  ) {
    this.lockStatus = [
      { disabled: false, value: 'UnLocked' },
      { disabled: true, value: 'Locked' },
    ];
  }

  ngOnInit(): void {
    this.Masterform = this.fb.group({
      GRNNo: this.fb.control('', Validators.required),
      Store: this.fb.control('', Validators.required),
      GRNPurpose: this.fb.control('', Validators.required),
      GRNDate: this.fb.control(''),
      DCRcvdDate: this.fb.control('', Validators.required),
      LockedStatus: this.fb.control(''),
      IsLocked: this.fb.control(''),
      PartyBillNo: this.fb.control(''),
      PartyChallanNo: this.fb.control(''),
      Remarks: this.fb.control(''),
    });

    this.ducumentFormInIt();
    this.POMasterId = +localStorage.getItem('PONo')!;

    this.Detailform = this.fb.group({
      ItemCode: [{ value: '', disabled: true }, Validators.required],
      wo_number: [{ value: '', disabled: true }],
      Unit: [{ value: '', disabled: true }],
      Packs: [{ value: '', disabled: true }, Validators.required],
      PerPackQty: [{ value: '', disabled: true }],
      GRNQty: [{ value: '', disabled: true }],
      BillQty: [{ value: '', disabled: true }],
      AcceptedQty: [{ value: '', disabled: true }],
      RejectedQty: [{ value: '', disabled: true }],
      FreeQty: [{ value: '', disabled: true }],
      Notes: [{ value: '', disabled: true }],
    });

    this.POform = this.fb.group({
      PONo: this.fb.control('', Validators.required),
    });

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.routeBranchName = localStorage.getItem('BranchName')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeGRNNo = params['GRNNo'];
      this.routeStoreCode = params['StoreCode'];
    });

    this.loadGRNMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeGRNNo
    );
    this.loadStoreItem(this.routeStoreCode);
    this.loadGRNDetails(
      this.routeGRNNo,
      this.globalBranchCode,
      this.routeStoreCode
    );
    this.loadWorkOrder();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();
  }

  loadPendingPO() {
    const x = this.POform.value;
    this.apiService.get(ApiEndpoints.PendingToReceivePOs +
      `?BranchCode=${this.globalBranchCode}&PONo=${x.PONo}&StoreCode=${this.routeStoreCode}`)
      .subscribe((res) => {
        this.poResponse$ = res;
      });
  }

  loadGRNMasterInfo(BranchCode: number, StoreCode: number, GRNNo: number) {
    //api/GRN/GetGRNMasterByGRNNo?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}
    this.apiService.get(ApiEndpoints.GetGRNMasterByGRNNo +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&GRNNo=${GRNNo}`)
      .subscribe((res: any) => {
        let x = res[0];
        if (x) {
          Object.assign(this.masterResponse$, x);
          const GRNDate = this.datePipe.transform(
            this.masterResponse$?.GRNDate,
            'MMM-d-y'
          );
          this.masterResponse$.GRNDate = GRNDate;
          const DCRcvdDate = this.datePipe.transform(
            this.masterResponse$?.DCRcvdDate,
            'y-MM-dd'
          );
          this.masterResponse$.DCRcvdDate = DCRcvdDate;
          this.IsLocked = this.masterResponse$.IsLocked;
        }
      });
  }

  loadStoreItem(StoreCode: number) {
    this.apiService.get(ApiEndpoints.LoadStoreItems + `?StoreCode=${StoreCode}`)
      .subscribe((res: any) => {
        this.storeItemResponse$ = res.data;
      });
  }

  loadWorkOrder() {
    this.apiService.get(ApiEndpoints.LoadWorkOrders + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.workOrderResponse$ = res.data;
      });
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

  changeWorkOrder(e: any) {
    this.selectedWorkOrder = e.value;
    let x = this.workOrderResponse$.find((x: any) => {
      return this.selectedWorkOrder == x?.wo_number;
    });
    this.detailResponse$.wo_number = x?.wo_number;
  }

  loadGRNDetails(GRNNo: number, BranchCode: number, StoreCode: number) {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.LoadGRNDetails +
      `?GRNNo=${GRNNo}&BranchCode=${BranchCode}&StoreCode=${StoreCode}`)
      .subscribe((res) => {
        this.tableResponse$ = res;
        this.isLoadingData = false
      });
  }

  GRNReportpdf() {
    this.loading = true;
    //TBD----------------------------------------------------------------
    this.apiservice
      .pintGRNReport(
        this.globalBranchCode,
        this.routeStoreCode,
        this.routeGRNNo,
        this.routeBranchName
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
    let PreviousLockedStatus = 'UnLocked';
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUserCode;
    model.StoreCode = this.masterResponse$.StoreCode;
    model.LockedBy = this.globalUserCode;
    model.IsLocked = this.Masterform.get('IsLocked')?.value;
    // if (model.IsLocked) {
    //   model.PreviousLockedStatus = 'Locked';
    // } else {
    //   model.PreviousLockedStatus = PreviousLockedStatus;
    // }
    if (model.IsLocked) {
      this.IsLocked = true;
    }
    this.apiService.update(model, ApiEndpoints.UpdateGRNMaster + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Updated!',
          type: NotificationType.success,
        });
        // location.reload();
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

  disableAddtoGRN: boolean = false
  getObjonBlur(event: any) {
    if (event.CurQty > event.BalToRcvQty) {
      this.toastService.sendMessage({
        message: 'Quantity should be Less!',
        type: NotificationType.error,
      });
      this.disableAddtoGRN = true
    } else {
      let x = this.poResponse$.filter((x: any) => {
        return x.CurQty > 0;
      });
      this.objModel = x;
      this.disableAddtoGRN = false
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
      model.GRNQty = this.objModel[a].CurQty;

      this.apiService.post(model, ApiEndpoints.GRNDetailEntry + `?`)
        .subscribe(() => {
          this.prdialog = false;
          this.toastService.sendMessage({
            message: ' PO Added to GRN Successfully!',
            type: NotificationType.success,
          });
          this.poResponse$ = [];
          this.POform.reset();
          this.loadGRNDetails(
            this.routeGRNNo,
            this.globalBranchCode,
            this.routeStoreCode
          );
        });
    }
  }

  saveDetail() {
    let model;
    model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.masterResponse$.StoreCode;
    model.GRNNo = this.masterResponse$.GRNNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.wo_number = this.detailResponse$.wo_number;
    if (!this.masterResponse$.GRNPurpose.includes('Purchase')) {
      this.apiService.post(model, ApiEndpoints.CreateGRNDetail + `?`)
        .subscribe(() => {
          this.loadGRNDetails(
            this.routeGRNNo,
            this.globalBranchCode,
            this.routeStoreCode
          );
          this.detailResponse$.ItemCode = null;
          this.detailResponse$.wo_number = null;
          this.Detailform.reset();
          this.toastService.sendMessage({
            message: 'GRN Saved Successfully!',
            type: NotificationType.success,
          });
        });
    } else {
      this.toastService.sendMessage({
        message: 'Please use Copy From PO!',
        type: NotificationType.error,
      });
    }
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
      this.apiService.post(model, ApiEndpoints.GRNDetailEntry + `?`)
        .subscribe(() => {
          this.prdialog = false;
          this.toastService.sendMessage({
            message: 'GRN Shift Saved Successfully!',
            type: NotificationType.success,
          });
          this.poResponse$ = [];
          this.POform.reset();
          this.loadGRNDetails(
            this.routeGRNNo,
            this.globalBranchCode,
            this.routeStoreCode
          );
        });
    }
  }

  getSelectedRow(data: any) {
    this.Detailform.enable()
    this.isUpdate = true;
    this.detailResponse$ = { ...data };
    const obj: any = Object.values(this.storeItemResponse$).find((y: any) => {
      return y.Code == this.detailResponse$.ItemCode;
    });
    this.detailResponse$.ItemCode = obj.Code;
    this.detailResponse$.Unit = obj.Unit;
  }

  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updateGRNDetail();
    }
  }

  updateGRNDetail() {
    let model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.routeStoreCode;
    model.GRNSrNo = this.detailResponse$.GRNSrNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.GRNNo = this.detailResponse$.GRNNo;
    model.wo_number = +model?.wo_number?.wo_number;
    if (isNaN(model.wo_number)) {
      model.wo_number = this.detailResponse$.wo_number;
    }
    this.apiService.update(model, ApiEndpoints.UpdateGRNDetail + `?`)
      .subscribe((res) => {
        this.loadGRNDetails(
          this.routeGRNNo,
          this.globalBranchCode,
          this.routeStoreCode
        );
        this.detailResponse$.ItemCode = null;
        this.detailResponse$.wo_number = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: 'GRN Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.Detailform.disable()
    this.isUpdate = false;
  }

  deleteGRNDetail(GRNSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteGRNDetail +
          `?BranchCode=${this.globalBranchCode}&GRNNo=${this.routeGRNNo}&GRNSrNo=${GRNSrNo}`)
          .subscribe(() => {
            this.loadGRNDetails(
              this.routeGRNNo,
              this.globalBranchCode,
              this.routeStoreCode
            );
            this.toastService.sendMessage({
              message: 'GRN Deleted Successfully!',
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
    this.router.navigate(['/inventory/good-receipt-note']);
  }

  refreshdetail() {
    this.isUpdate = false;
    this.detailResponse$.ItemCode = null;
    this.detailResponse$.wo_number = null;
    this.Detailform.reset();
  }

  openCopyDemand() {
    this.prdialog = true;
  }

  hideCopyDemand() {
    this.prdialog = false;
  }
  //====get-Previous-GRN====
  LoadPreviousGRN() {
    this.apiService.get(ApiEndpoints.GetPreviousGRNNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&GRNNo=${this.routeGRNNo}`)
      .subscribe((res: any) => {
        this.PreviousGRN$ = res;
        Object.assign(this.masterResponse$, res[0]);
        const previousGRNMasterId = this.PreviousGRN$[0].GRNNo;
        this.loadGRNMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeGRNNo
        );
        this.loadGRNDetails(
          this.routeGRNNo,
          this.globalBranchCode,
          this.routeStoreCode
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /GRNNo=\d+/,
          `GRNNo=${previousGRNMasterId}`
        );
        localStorage.setItem('GRNNo', previousGRNMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
  //====get-Next-GRN====
  LoadNextGRN() {
    this.apiService.get(ApiEndpoints.GetNextGRNNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&GRNNo=${this.routeGRNNo}`)
      .subscribe((res: any) => {
        this.NextGRN$ = res;
        Object.assign(this.masterResponse$, res[0]);
        let nextGRNMasterId = this.NextGRN$[0].GRNNo;
        this.loadGRNMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeGRNNo
        );
        this.loadGRNDetails(
          this.routeGRNNo,
          this.globalBranchCode,
          this.routeStoreCode
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /GRNNo=\d+/,
          `GRNNo=${nextGRNMasterId}`
        );
        localStorage.setItem('GRNNo', nextGRNMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }


  //------------------------------------upload Documnet Working start from here------------------------------------


  getGetMaxDocumentId() {

    let BranchCode = +this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let GRNNo = +this.routeGRNNo;
    this.documentUploadService.getMaxGRNDocumentId(BranchCode, StoreCode, GRNNo).subscribe(
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
    model.GRNNo = +this.routeGRNNo;
    this.apiService
      .get(
        ApiEndpoints.GetAllGRNDocuments +
        `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&GRNNo=${model.GRNNo}`
      )
      .subscribe((res: any) => {

        this.documentResponse = res.data;
      });
  }

  saveDocument() {

    let model = this.UploadDocform.value;
    model.BranchCode = +this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.GRNNo = +this.routeGRNNo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = +this.globalUserCode;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.documentUploadService.saveGRNDocuments(model, this.selectedFiles).subscribe(() => {
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
    let GRNNo = +this.routeGRNNo;
    let DocumentId = +data.DocumentId;
    this.documentUploadService

      .viewGRNDocuments(BranchCode, StoreCode, GRNNo, DocumentId)
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
    data.GRNNo = this.routeGRNNo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.apiService
          .delete(
            ApiEndpoints.DeleteGRNDocuments +
            `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&GRNNo=${data.GRNNo}&DocumentId=${data.DocumentId}`
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
getDoucumnetPaths(){
  
this.apiService
    .get(
      ApiEndpoints.GetAllPaths +
        '?BranchCode=' + this.globalBranchCode
      )
      .subscribe((res: any) => {

        this.ImageDirectory = res[0].GRNPath;
      });
  }
}
