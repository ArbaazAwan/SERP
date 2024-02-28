import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { IrnService } from 'src/app/_shared/services/irn.service';
import { ToastService } from 'src/app/_shared/services/toast.service';


interface LockStatus {
  disabled: boolean;
  value: string;
}

@Component({
  selector: 'app-inspection-receipt-note-details',
  templateUrl: './inspection-receipt-note-details.component.html',
  styleUrls: ['./inspection-receipt-note-details.component.scss']
})
export class InspectionReceiptNoteDetailsComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  POform!: FormGroup;
  IGPform!: FormGroup;
  
  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  poResponse$: any = [];
  IGPResponse$: any = [];
  storeItemResponse$: any = [];
  workOrderResponse$: any = [];
  objModel: any = [];

  routeIRNNo: number = 0;
  routeStoreCode: number = 0;

  selectedStoreItem!: number;
  selectedWorkOrder!: number;
  globalBranchCode!: number;
  globalUserCode!: number;

  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  prdialog: boolean = false;
  IGPdialog: boolean = false;
  POMasterId: number = 0;
  lockStatus!: LockStatus[];
  routeBranchName!: string;
  IsLocked: boolean = false;
  loading = false;
  PreviousIRN$: any = [];
  NextIRN$: any = [];

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
    private apiservice: IrnService,
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
      IRNNo: this.fb.control('', Validators.required),
      Store: this.fb.control('', Validators.required),
      IRNPurpose: this.fb.control('', Validators.required),
      IRNDate: this.fb.control(''),
      DCRcvdDate: this.fb.control('', Validators.required),
      LockedStatus: this.fb.control(''),
      IsLocked: this.fb.control(''),
      PartyBillNo: this.fb.control(''),
      PartyChallanNo: this.fb.control(''),
      Remarks: this.fb.control(''),
    });

    this.ducumentFormInIt();
    this.POMasterId = +localStorage.getItem('PONo')!;

   this.detailFormInIt();

    this.POform = this.fb.group({
      PONo: this.fb.control('', Validators.required),
    });

    this.IGPform = this.fb.group({
      IGPNo: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.routeBranchName = localStorage.getItem('BranchName')!;
    this.activatedRoute.queryParams.subscribe((params:any) => {
      this.routeIRNNo = params['IRNNo'];
      this.routeStoreCode = params['StoreCode'];
    });

    this.loadIRNMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeIRNNo
    );
    this.loadStoreItem(this.routeStoreCode);
    this.loadIRNDetails(
      this.routeIRNNo,
      this.globalBranchCode,
      this.routeStoreCode
    );
    this.loadWorkOrder();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();
  }

  detailFormInIt(){
    this.Detailform = this.fb.group({
      ItemCode: [{ value: '', disabled: true }, Validators.required],
      wo_number: [{ value: '' }],
      Unit: [{ value: '', disabled: true }],
      Packs: [{ value: ''}, Validators.required],
      PerPackQty: [{ value: ''}],
      IRNQty: [{ value: '', disabled: true }],
      BillQty: [{ value: '', disabled: true }],
      AcceptedQty: [{ value: '', disabled: true}],
      RejectedQty: [{ value: '' }],
      FreeQty: [{ value: '' }],
      Notes: [{ value: ''}],
    });
  }

  loadPendingPO() {
    const x = this.POform.value;
    this.apiService.get(ApiEndpoints.PendingToReceiveIRNPOs +
      `?BranchCode=${this.globalBranchCode}&PONo=${x.PONo}&StoreCode=${this.routeStoreCode}`)
      .subscribe((res:any) => {
        this.poResponse$ = res;
      });
  }

  CopyfromIGP() {
    const x = this.IGPform.value;
    this.apiService.get(ApiEndpoints.CopyfromIGP +
      `?BranchCode=${this.globalBranchCode}&IGPNo=${x.IGPNo}&StoreCode=${this.routeStoreCode}`)
      .subscribe((res:any) => {
        this.IGPResponse$ = res;
      });
  }

  loadIRNMasterInfo(BranchCode: number, StoreCode: number, IRNNo: number) {
    debugger
    this.apiService.get(ApiEndpoints.GetIRNMasterByIRNNo +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IRNNo=${IRNNo}`)
      .subscribe((res: any) => {
        let x = res[0];
        if (x) {
          Object.assign(this.masterResponse$, x);
          const IRNDate = this.datePipe.transform(
            this.masterResponse$?.IRNDate,
            'MMM-d-y'
          );
          this.masterResponse$.IRNDate = IRNDate;
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

  loadIRNDetails(IRNNo: number, BranchCode: number, StoreCode: number) {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.LoadIRNDetails +
      `?IRNNo=${IRNNo}&BranchCode=${BranchCode}&StoreCode=${StoreCode}`)
      .subscribe((res:any) => {
        this.tableResponse$ = res;
        this.isLoadingData = false
      });
  }

  IRNReportpdf() {
    this.loading = true;
    //TBD----------------------------------------------------------------
    this.apiservice
      .pintIRNReport(
        this.globalBranchCode,
        this.routeStoreCode,
        this.routeIRNNo,
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
    if (model.IsLocked) {
      this.IsLocked = true;
    }
    this.apiService.update(model, ApiEndpoints.UpdateIRNMaster + `?`)
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

  disableAddtoIRN: boolean = false
  getObjonBlur(event: any) {
    if (event.CurQty > event.BalToRcvQty) {
      this.toastService.sendMessage({
        message: 'Quantity should be Less!',
        type: NotificationType.error,
      });
      this.disableAddtoIRN = true
    } else {
      let x = this.poResponse$.filter((x: any) => {
        return x.CurQty > 0;
      });
      this.objModel = x;
      this.disableAddtoIRN = false
    }
  }

 // IRNDetailIGPEntry
  valCheckIGP(event: any) {
    debugger
    if (event.CurQty > event.BalanceQty) {
      this.toastService.sendMessage({
        message: 'Quantity should be Less!',
        type: NotificationType.error,
      });
      this.disableAddtoIRN = true
    } else {
      let x = this.IGPResponse$.filter((x: any) => {
        return x.CurQty > 0;
      });
      this.objModel = x;
      this.disableAddtoIRN = false
    }
  }

  changeExp() {
    for (let a in this.objModel) {
      let model: any = [];
      const x = this.POform.value;
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.masterResponse$.StoreCode;
      model.IRNNo = this.masterResponse$.IRNNo;
      model.PONo = x.PONo;
      model.POSrNo = this.objModel[a].POSrNo;
      model.IRNQty = this.objModel[a].CurQty;
      model.IGPNo = '0';
      model.IGP_PK = 0;
      this.apiService.post(model, ApiEndpoints.IRNDetailEntry + `?`)
        .subscribe(() => {
          this.prdialog = false;
          this.toastService.sendMessage({
            message: ' PO Added to IRN Successfully!',
            type: NotificationType.success,
          });
          this.poResponse$ = [];
          this.POform.reset();
          this.loadIRNDetails(
            this.routeIRNNo,
            this.globalBranchCode,
            this.routeStoreCode
          );
        });
    }
  }

  saveIGPToIRN() {
    debugger
    for (let a in this.objModel) {
      let model: any = [];
      const x = this.IGPform.value;
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.masterResponse$.StoreCode;
      model.IRNNo = this.masterResponse$.IRNNo;
      model.IGPNo = x.IGPNo;
      model.IGP_PK = this.objModel[a].IGPSrNo;
      model.PONo =  this.objModel[a].PONo;
      model.POSrNo = this.objModel[a].POSrNo;
      model.IRNQty = this.objModel[a].CurQty;
      model.UnitCode = this.objModel[a].UnitCode || 0;

      this.apiService.post(model, ApiEndpoints.IRNDetailEntry + `?`)
        .subscribe(() => {
          this.prdialog = false;
          this.toastService.sendMessage({
            message: ' IGP Added to IRN Successfully!',
            type: NotificationType.success,
          });
          this.IGPResponse$ = [];
          this.IGPform.reset();
          this.loadIRNDetails(
            this.routeIRNNo,
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
    model.IRNNo = this.masterResponse$.IRNNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.wo_number = this.detailResponse$.wo_number;
    if (!this.masterResponse$.IRNPurpose.includes('Purchase')) {
      this.apiService.post(model, ApiEndpoints.CreateIRNDetail + `?`)
        .subscribe(() => {
          this.loadIRNDetails(
            this.routeIRNNo,
            this.globalBranchCode,
            this.routeStoreCode
          );
          this.detailResponse$.ItemCode = null;
          this.detailResponse$.wo_number = null;
          this.Detailform.reset();
          this.toastService.sendMessage({
            message: 'IRN Saved Successfully!',
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
    model.IRNNo = this.masterResponse$.IRNNo;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.masterResponse$.StoreCode;
    model.POSrNo = 0;
    model.IRNQty = 0;
    if (model.PONo === '') {
      this.toastService.sendMessage({
        message: 'Please enter PO No!',
        type: NotificationType.error,
      });
    } else {
      this.apiService.post(model, ApiEndpoints.IRNDetailEntry + `?`)
        .subscribe(() => {
          this.prdialog = false;
          this.toastService.sendMessage({
            message: 'IRN Shift Saved Successfully!',
            type: NotificationType.success,
          });
          this.poResponse$ = [];
          this.POform.reset();
          this.loadIRNDetails(
            this.routeIRNNo,
            this.globalBranchCode,
            this.routeStoreCode
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
  }

  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updateIRNDetail();
    }
  }

  updateIRNDetail() {
    let model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.routeStoreCode;
    model.IRNSrNo = this.detailResponse$.IRNSrNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.IRNNo = this.detailResponse$.IRNNo;
    model.wo_number = +model?.wo_number?.wo_number;
    if (isNaN(model.wo_number)) {
      model.wo_number = this.detailResponse$.wo_number;
    }
    this.apiService.update(model, ApiEndpoints.UpdateIRNDetail + `?`)
      .subscribe((res:any) => {
        this.loadIRNDetails(
          this.routeIRNNo,
          this.globalBranchCode,
          this.routeStoreCode
        );
        this.detailResponse$.ItemCode = null;
        this.detailResponse$.wo_number = null;
        this.detailFormInIt();
        this.toastService.sendMessage({
          message: 'IRN Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
  }

  deleteIRNDetail(IRNSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteIRNDetail +
          `?BranchCode=${this.globalBranchCode}&IRNNo=${this.routeIRNNo}&IRNSrNo=${IRNSrNo}`)
          .subscribe(() => {
            this.loadIRNDetails(
              this.routeIRNNo,
              this.globalBranchCode,
              this.routeStoreCode
            );
            this.toastService.sendMessage({
              message: 'IRN Deleted Successfully!',
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
    this.router.navigate(['/inventory/inspection-reciept-note']);
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
  openCopyIGP() {
    this.IGPdialog = true;
  }

  hideCopyDemand() {
    this.prdialog = false;
  }
  //====get-Previous-IRN====
  LoadPreviousIRN() {
    this.apiService.get(ApiEndpoints.GetPreviousIRNNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IRNNo=${this.routeIRNNo}`)
      .subscribe((res: any) => {
        this.PreviousIRN$ = res;
        Object.assign(this.masterResponse$, res[0]);
        const previousIRNMasterId = this.PreviousIRN$[0].IRNNo;
        this.loadIRNMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIRNNo
        );
        this.loadIRNDetails(
          this.routeIRNNo,
          this.globalBranchCode,
          this.routeStoreCode
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /IRNNo=\d+/,
          `IRNNo=${previousIRNMasterId}`
        );
        localStorage.setItem('IRNNo', previousIRNMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
  //====get-Next-IRN====
  LoadNextIRN() {
    this.apiService.get(ApiEndpoints.GetNextIRNNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IRNNo=${this.routeIRNNo}`)
      .subscribe((res: any) => {
        this.NextIRN$ = res;
        Object.assign(this.masterResponse$, res[0]);
        let nextIRNMasterId = this.NextIRN$[0].IRNNo;
        this.loadIRNMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIRNNo
        );
        this.loadIRNDetails(
          this.routeIRNNo,
          this.globalBranchCode,
          this.routeStoreCode
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /IRNNo=\d+/,
          `IRNNo=${nextIRNMasterId}`
        );
        localStorage.setItem('IRNNo', nextIRNMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }


  //------------------------------------upload Documnet Working start from here------------------------------------


  getGetMaxDocumentId() {

    let BranchCode = +this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let IRNNo = +this.routeIRNNo;
    this.documentUploadService.getMaxIRNDocumentId(BranchCode, StoreCode, IRNNo).subscribe(
      (res: any) => {

        this.DocumentId = res[0].DocumentId;
      },
      (error:any) => {
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
    model.IRNNo = +this.routeIRNNo;
    this.apiService
      .get(
        ApiEndpoints.GetAllIRNDocuments +
        `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&IRNNo=${model.IRNNo}`
      )
      .subscribe((res: any) => {

        this.documentResponse = res.data;
      });
  }

  saveDocument() {

    let model = this.UploadDocform.value;
    model.BranchCode = +this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.IRNNo = +this.routeIRNNo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = +this.globalUserCode;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.documentUploadService.saveIRNDocuments(model, this.selectedFiles).subscribe(() => {
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
    let IRNNo = +this.routeIRNNo;
    let DocumentId = +data.DocumentId;
    this.documentUploadService

      .viewIRNDocuments(BranchCode, StoreCode, IRNNo, DocumentId)
      .subscribe(
        (response: Blob) => {
          const fileUrl = URL.createObjectURL(response);
          window.open(fileUrl);
        },
        (error:any) => {
          console.error('Error fetching document:', error);
        }
      );
  }


  deleteDoc(data: any) {

    data.BranchCode = this.globalBranchCode;
    data.StoreCode = +this.routeStoreCode;
    data.IRNNo = this.routeIRNNo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.apiService
          .delete(
            ApiEndpoints.DeleteIRNDocuments +
            `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&IRNNo=${data.IRNNo}&DocumentId=${data.DocumentId}`
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

        this.ImageDirectory = res[0].IRNPath;
      });
  }
}
