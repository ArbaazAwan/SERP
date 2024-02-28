import { PurchaseRequsitionService } from 'src/app/_shared/services/purchase-requsition.service';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { StatusListPR } from 'src/app/_shared/model/status-list.model';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';

@Component({
  selector: 'app-purchase-requsition-detail',
  templateUrl: './purchase-requsition-detail.component.html',
  styleUrls: ['./purchase-requsition-detail.component.scss'],
})
export class PurchaseRequsitionDetailComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  Demandform!: FormGroup;

  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  demandResponse$: any = [];
  storeItemResponse$: any = [];
  objModel: any = [];

  routePRNo: number = 0;
  routeStoreCode: number = 0;

  selectedStoreItem!: number;
  globalBranchCode!: number;
  globalUserCode!: number;

  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  prdialog: boolean = false;
  IsLocked: boolean = false;
  loading = false;

  PreviousPR$: any = [];
  NextPR$: any = [];
  statusList: any = StatusListPR

  uploadDoc: boolean = false;
  displayDocumentDialog: boolean = false;
  UploadDocform!: FormGroup;
  documentResponse: any;
  imagePathOnServer!: string;
  selectedFiles: any;
  DocumentId: any;
  ImageDirectory: any;
  isLoadingData: boolean = false;
  constructor(
    private fb: FormBuilder,
    private apiservice: PurchaseRequsitionService,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private documentUploadService: DocumentUploadService
  ) { }

  ngOnInit(): void {
    this.Masterform = this.fb.group({
      PRNo: this.fb.control('', Validators.required),
      StoreCode: this.fb.control('', Validators.required),
      PRDate: this.fb.control('', Validators.required),
      wo_number: this.fb.control('', Validators.required),
      IsLocked: this.fb.control('', Validators.required),
      Remarks: this.fb.control('', Validators.required),
      Status: this.fb.control('', Validators.required),
      PRTypeNo: this.fb.control('', Validators.required),
      PRTypeName: this.fb.control('', Validators.required),
    });

    this.Detailform = this.fb.group({
      ItemCode: this.fb.control('', Validators.required),
      PRQty: this.fb.control('', Validators.required),
      Unit: this.fb.control('', Validators.required),
      Note: this.fb.control('', Validators.required),
    });

    this.Demandform = this.fb.group({
      DemandNo: this.fb.control('', Validators.required),
    });
    this.ducumentFormInIt();

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routePRNo = params['PRNo'];
      this.routeStoreCode = params['StoreCode'];
    });

    this.loadPRMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePRNo
    );
    this.loadStoreItem(this.routeStoreCode);
    this.loadPRDetails(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routePRNo
    );
    //this.getNextPRSrNumber();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();

  }

  loadPendingDemand() {
    const x = this.Demandform.value;
    this.apiService.get(ApiEndpoints.LoadPendingDemandDetailsForPR +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&DemandNo=${x.DemandNo}`)
      .subscribe((res) => {
        this.demandResponse$ = res;
      });
  }

  loadPRMasterInfo(BranchCode: number, StoreCode: number, PRNo: number) {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetPurchaseRequsitionMasterInfo +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`)
      .subscribe((res: any) => {
        debugger
        this.isLoadingData = false;
        let x = res[0];
        if (x) {
          this.Masterform.controls['Remarks'].setValue(x.Remarks === 'null' ? '' : x.Remarks);
          this.Masterform.controls['Status'].setValue(x.Status)
          Object.assign(this.masterResponse$, x);
          const PRDate = this.datePipe.transform(
            this.masterResponse$?.PRDate,
            'MMM-d-y'
          );
          this.masterResponse$.PRDate = PRDate;
          this.IsLocked = this.masterResponse$.IsLocked;
          this.cdRef.detectChanges();
        }
      });
  }

  loadStoreItem(StoreCode: number) {
    this.apiService.get(ApiEndpoints.LoadStoreItems + `?StoreCode=${StoreCode}`)
      .subscribe((res: any) => {
        this.storeItemResponse$ = res.data;
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

  loadPRDetails(BranchCode: number, StoreCode: number, PRNo: number) {
    this.apiService.get(ApiEndpoints.GetPurchaseRequsitionDetailInfo +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}`)
      .subscribe((res) => {
        this.tableResponse$ = res;
      });
  }

  updateMaster() {
    debugger
    let model = this.Masterform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.masterResponse$.StoreCode;
    model.PRTypeNo = this.masterResponse$.PRTypeNo;
    if (this.masterResponse$.wo_number == null) {
      model.wo_number = 0;
    }
    model.LockedBy = this.globalUserCode;
    if (model.IsLocked == null) {
      model.IsLocked = false;
    }
    if (model.IsLocked) {
      this.IsLocked = true;
    }
    this.cdRef.detectChanges();
    this.apiService.update(model, ApiEndpoints.UpdatePurchaseRequistionNoteMaster + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Purchase Requsition Updated Successfully!',
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
  disableAddtoPR: boolean = false
  getObjonBlur(event: any) {
    if (event.CurPRQty > event.BalQty) {
      this.disableAddtoPR = true
      this.toastService.sendMessage({
        message: 'Quantity should be Less',
        type: NotificationType.error,
      });
    } else {
      let x = this.demandResponse$.filter((x: any) => {
        return x.CurPRQty > 0;
      });
      this.objModel = x;
      this.disableAddtoPR = false
    }
  }

  changeExp() {
    for (let a in this.objModel) {
      let model: any = [];
      const x = this.Demandform.value;
      model.BranchCode = this.globalBranchCode;
      model.PRNo = this.masterResponse$.PRNo;
      model.StoreCode = this.masterResponse$.StoreCode;
      model.DemandNo = x.DemandNo;
      model.ItemCode = this.objModel[a].ItemCode;
      model.PRQty = this.objModel[a].CurPRQty;
      model.UnitCode = this.objModel[a].ItemUnitCode;
      model.DemandSrNo = this.objModel[a].DemandSrNo;
      this.apiService.post(model, ApiEndpoints.CreatePurchaseRequsitionDetail + `?`)
        .subscribe(() => {
          this.loadPRDetails(
            this.globalBranchCode,
            this.routeStoreCode,
            this.routePRNo
          );
        });
      this.prdialog = false;
      this.toastService.sendMessage({
        message: 'Demands Added to PR Successfully!',
        type: NotificationType.success,
      });
      this.demandResponse$ = [];
      this.Demandform.reset();
    }
    if (this.objModel.length == 0) {
      this.toastService.sendMessage({
        message: 'Select Item Qty to add in PR',
        type: NotificationType.warning,
      });
    }
    // location.reload();
  }

  saveDetail() {
    let model;
    model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.PRNo = this.masterResponse$.PRNo;
    model.StoreCode = this.masterResponse$.StoreCode;
    if (this.masterResponse$.wo_number == null) {
      model.wo_number = 0;
    }
    model.PRQty = this.detailResponse$.PRQty;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.PRSrNo = this.masterResponse$.PRSrNo;
    model.CreatedBy = this.globalUserCode
    this.apiService.post(model, ApiEndpoints.CreatePurchaseRequsitionDetail + `?`)
      .subscribe(() => {
        this.loadPRDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePRNo
        );
        this.detailResponse$.ItemCode = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: 'PR Detail Added!',
          type: NotificationType.success,
        });
      });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.detailResponse$ = { ...data };
    const obj: any = Object.values(this.storeItemResponse$).find((y: any) => {
      return y.Code == this.detailResponse$.ItemCode;
    });
    this.detailResponse$.ItemCode = obj.Code;
  }

  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updatePRDetail();
    }
  }

  updatePRDetail() {
    let model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.routeStoreCode;
    model.PRSrNo = this.detailResponse$.PRSrNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    this.apiService.update(model, ApiEndpoints.UpdatePurchaseRequsitionDetail + `?`)
      .subscribe((res) => {
        this.loadPRDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePRNo
        );
        this.detailResponse$.ItemCode = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: 'Purchase Requsition Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
  }

  deletePRDetail(PRSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeletePurchaseRequistionNoteDetail +
          `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PRNo=${this.routePRNo}&PRSrNo=${PRSrNo}`)
          .subscribe(() => {
            this.loadPRDetails(
              this.globalBranchCode,
              this.routeStoreCode,
              this.routePRNo
            );
            this.toastService.sendMessage({
              message: 'Purchase Requsition Deleted Successfully!',
              type: NotificationType.deleted,
              title: "Deleted"
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
    this.router.navigate(['/Inventory/purchase-requsition']);
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
  PurchaseRequsitionReportpdf() {

    let PRNo = this.routePRNo;
    this.loading = true;
    let BranchName = localStorage.getItem('BranchName');
    //api/Store/PurchaseRequsitionReport?FileType=PDF&BranchCode=${BranchCode}&StoreCode=${StoreCode}&PRNo=${PRNo}&BranchName=${BranchName}&ReportName=Purchase Requsition&PrintBy=Admin
    //TBD----------------------------------------------------------------
    // this.apiService.get(ApiEndpoints.PurchaseRequsitionReport +
    //   `?FileType=PDF&BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PRNo=${PRNo}&BranchName=${BranchName}&ReportName=Purchase Requsition&PrintBy=Admin`)
    this.apiservice
      .printPurchaseRequsitionReport(
        this.globalBranchCode,
        this.routeStoreCode,
        PRNo
      )
      .subscribe({
        next: (pdf: any) => {

          const file = new Blob([pdf], {
            type: 'application/pdf',
          });
          this.loading = false;
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        },
        error: () => {

        }
      }

      );
  }
  //====get-Previous-PR====
  LoadPreviousPR() {
    this.apiService.get(ApiEndpoints.GetPreviousPRNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PRNo=${this.routePRNo}`)
      .subscribe((res: any) => {
        this.PreviousPR$ = res;
        Object.assign(this.masterResponse$, res[0]);
        const previousPRMasterId = this.PreviousPR$[0].PRNo;
        this.loadPRMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePRNo
        );
        this.loadPRDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePRNo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /PRNo=\d+/,
          `PRNo=${previousPRMasterId}`
        );
        localStorage.setItem('PRNo', previousPRMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
  //====get-Next-PR====

  LoadNextPR() {
    this.apiService.get(ApiEndpoints.GetNextPRNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&PRNo=${this.routePRNo}`)
      .subscribe((res: any) => {
        this.NextPR$ = res;
        Object.assign(this.masterResponse$, res[0]);
        let nextPRMasterId = this.NextPR$[0].PRNo;
        this.loadPRMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePRNo
        );
        this.loadPRDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routePRNo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /PRNo=\d+/,
          `PRNo=${nextPRMasterId}`
        );
        localStorage.setItem('PRNo', nextPRMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }


  //------------------------------------upload Documnet Working start from here------------------------------------

  //-------Documet upload Form Initialized-------
  ducumentFormInIt() {
    this.UploadDocform = this.fb.group({
      DocumentId: this.fb.control('', Validators.required),
      Description: this.fb.control('', Validators.required),
    });
  }

  //------- Documet upload Form Crud--------

  //READ
  getGetMaxDocumentId() {
    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PRNo = this.routePRNo;
    this.documentUploadService.getMaxPRDocumentId(BranchCode, StoreCode, PRNo).subscribe(
      (res: any) => {
        this.DocumentId = res[0].DocumentId;
      },
      (error) => {
        console.error('Error fetching document:', error);
      }
    );
  }
  ViewDocuments(data: any) {
    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let PRNo = this.routePRNo;
    let DocumentId = data.DocumentId;
    this.documentUploadService

      .viewPRDocuments(BranchCode, StoreCode, PRNo, DocumentId)
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
  loadAllDocuments() {
    let model = this.UploadDocform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.PRNo = this.routePRNo;
    this.apiService
      .get(
        ApiEndpoints.GetAllPRDocuments +
        `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&PRNo=${model.PRNo}`
      )
      .subscribe((res: any) => {

        this.documentResponse = res.data;
      });
  }
  getDoucumnetPaths() {

    this.apiService
      .get(
        ApiEndpoints.GetAllPaths +
        '?BranchCode=' + this.globalBranchCode
      )
      .subscribe((res: any) => {

        this.ImageDirectory = res[0]?.PurchaseRequisitionPath;
      });
  }

  //SAVE
  saveDocument() {
    let model = this.UploadDocform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.PRNo = this.routePRNo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = this.globalUserCode;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }
    this.documentUploadService.savePRDocuments(model, this.selectedFiles).subscribe(() => {
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

  //DELETE
  deleteDoc(data: any) {

    data.BranchCode = this.globalBranchCode;
    data.StoreCode = +this.routeStoreCode;
    data.PRNo = this.routePRNo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.apiService
          .delete(
            ApiEndpoints.DeletePRDocuments +
            `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&PRNo=${data.PRNo}&DocumentId=${data.DocumentId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Document Deleted Successfully!',
              type: NotificationType.deleted,
              title: "Deleted"
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
  //-------------File Selection Method---------------------
  selectFiles(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }
  //------------Document Dialog Methods --------------------
  openUploadDoc() {
    this.uploadDoc = true;
  }
  HideUploadDoc() {
    this.uploadDoc = false;
  }
  closeDocumentViewDialog(): void {
    this.displayDocumentDialog = false;
  }
  //------------------------------------upload Documnet Working end from here------------------------------------
}
