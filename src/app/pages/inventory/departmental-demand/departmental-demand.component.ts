import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import {
  DemandDetailModel,
  DemandMasterModel,
} from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DepartmentaldemandService } from 'src/app/_shared/services/departmentaldemand.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { StatusListDemand } from 'src/app/_shared/model/status-list.model';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-departmental-demand',
  templateUrl: './departmental-demand.component.html',
  styleUrls: ['./departmental-demand.component.scss'],
})
export class DepartmentalDemandComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  modelMaster!: DemandMasterModel;
  modelDetail!: DemandDetailModel;
  selectDepartment!: number;
  departmentResponse$: any = [];
  selectStore!: number;
  StoreResponse$: any = [];
  selectWorkOrder!: number;
  WorkOrderResponse$: any = [];
  masterResponse$: any = [];
  MasterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  isUpdate!: boolean;
  iscreated!: boolean | false;
  selectStoreItem!: number;
  StoreItemResponse$: any = [];
  tableLength!: number;
  globalBranchCode!: number;
  globalStoreCode: any = [];
  globalDemandRaisedByDeptCode: any = [];
  globalDemandNo: any = [];
  datePipe = new DatePipe('en-US');
  selectedStoreCode!: number;
  selectedDemandCode!: number;
  routeStoreCode: number = 0;
  IsLocked: boolean = false;
  loading = false;
  isLoading = false;
  PreviousDemand$: any = [];
  NextDemand$: any = [];
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  DemandNo: number = 0;
  isLoadingData: boolean = false;
  statusList: any = StatusListDemand
  ImageDirectory: any;
  uploadDoc: boolean = false;
  displayDocumentDialog: boolean = false;
  UploadDocform!: FormGroup;
  documentResponse: any;
  imagePathOnServer!: string;
  selectedFiles: any;
  DocumentId: any;

  constructor(
    private fb: FormBuilder,
    private apiservice: DepartmentaldemandService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiProviderService,
    private cdRef: ChangeDetectorRef,
    private documentUploadService: DocumentUploadService,
    private _utilityService:UtilityService,
    private _toastService:ToastService
  ) { }

  ngOnInit(): void {
    this.Masterform = this.fb.group({
      DemandNo: this.fb.control('', Validators.required),
      DemandRaisedByDeptCode: this.fb.control('', Validators.required),
      BranchCode: this.fb.control('', Validators.required),
      StoreCode: this.fb.control('', Validators.required),
      DemandDate: this.fb.control('', Validators.required),
      wo_number: this.fb.control('', Validators.required),
      RequiredOnDate: this.fb.control('', Validators.required),
      DemandRaisedByUserEmail: this.fb.control('', Validators.required),
      IsLocked: this.fb.control('', Validators.required),
      Status: this.fb.control('', Validators.required),
      Remarks: this.fb.control('', Validators.required),
    });
    this.ducumentFormInIt();
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 3;
    const FormId = 6;
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

    this.Detailform = this.fb.group({
      ItemCode: this.fb.control('', Validators.required),
      DemandQty: this.fb.control('', Validators.required),
      Unit: this.fb.control('', Validators.required),
      Remarks: this.fb.control(''),
      Status: this.fb.control(false),
      itemDesc: this.fb.control('')
    });

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalStoreCode = +localStorage.getItem('StoreCode')!;
    this.globalDemandRaisedByDeptCode = +localStorage.getItem(
      'DemandRaisedByDeptCode'
    )!;
    this.globalDemandNo = +localStorage.getItem('DemandNo')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeStoreCode = params['StoreCode'];
      this.DemandNo = params['DemandNo'];
    });

    this.loadDemandMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.DemandNo
    );

    localStorage.setItem('DemandNo', this.DemandNo + '');

    this.LoadStoreItem(this.routeStoreCode);
    this.LoadDemandDetails();
    this.LoadAllWorkOrder();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();
  }

  LoadAllWorkOrder() {
    let y: number = +localStorage.getItem('BranchCode')!;
    this.apiservice.getWorkOrder(y).subscribe((res: any) => {
      this.WorkOrderResponse$ = res.data;
    });

  }
  //======Load-Master-Next-Form=======
  loadDemandMasterInfo(
    BranchCode: number,
    StoreCode: number,
    DemandNo: number
  ) {
    this.apiService
      .get(
        ApiEndpoints.GetDemandMasterInfo +
        `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandNo=${DemandNo}`
      )
      .subscribe((res: any) => {
        let x = res.data[0];
        this.Masterform.controls['wo_number'].setValue(x.wo_number)
        this.Masterform.controls['Remarks'].setValue(x.Remarks === 'null' ? '' : x.Remarks);
        this.Masterform.controls['DemandRaisedByUserEmail'].setValue(x.DemandRaisedByUserEmail === 'null' ? '' : x.DemandRaisedByUserEmail);
        if (x) {
          Object.assign(this.masterResponse$, x);
          const DemandDate = this.datePipe.transform(
            this.masterResponse$?.DemandDate,
            'yyyy-MM-dd'
          );
          const RequiredOnDate = this.datePipe.transform(
            this.masterResponse$?.RequiredOnDate,
            'yyyy-MM-dd'
          );
          this.masterResponse$.DemandDate = DemandDate;
          this.masterResponse$.RequiredOnDate = RequiredOnDate;
          this.selectedStoreCode = this.masterResponse$.StoreCode;
          this.selectedDemandCode = this.masterResponse$.DemandNo;
          this.IsLocked = this.masterResponse$.IsLocked;
          this.LoadDemandDetails();
        }
      });
  }

  //  =====StoreItemDropdown-Start=====

  changeStoreItem(e: any) {
    this.selectStoreItem = e.value;
    let x = this.StoreItemResponse$.find((x: any) => {
      return this.selectStoreItem === x?.Code;
    });
    this.detailResponse$.Unit = x?.Unit;
    this.detailResponse$.UnitCode = x?.UnitCode;
    this.detailResponse$.ItemCode = x?.Code;
  }
  LoadStoreItem(StoreCode: number) {
    const BranchCode: number = +localStorage.getItem('BranchCode')!;
    this.apiService
      .get(
        ApiEndpoints.LoadStoreItems +
        `?StoreCode=${StoreCode}&BranchCode=${BranchCode}`
      )
      .subscribe((res: any) => {
        this.StoreItemResponse$ = res.data;
      });
  }

  //  =====StoreItemDropdown-End=====

  //  =====Demand-Master-update=====
  updateMaster() {
    let branch = localStorage.getItem('BranchCode');
    this.Masterform.patchValue({
      BranchCode: +branch!,
    });
    this.modelMaster = this.Masterform.value;
    this.modelMaster.DemandNo = this.Masterform.get('DemandNo')?.value;
    this.modelMaster.StoreCode = this.masterResponse$.StoreCode;
    this.modelMaster.RequiredOnDate =
      this.Masterform.get('RequiredOnDate')?.value;
    this.modelMaster.DemandRaisedByUserEmail = this.Masterform.get(
      'DemandRaisedByUserEmail'
    )?.value;
    if (this.modelMaster.IsLocked == null) {
      this.modelMaster.IsLocked = false;
    }
    // this.modelMaster.IsLocked = this.Masterform.get('IsLocked')?.value;
    this.modelMaster.IsRejected = false;
    this.modelMaster.Remarks = this.Masterform.get('Remarks')?.value;
    if (this.modelMaster.IsLocked) {
      this.IsLocked = true;
    }
    if (this.modelMaster.wo_number == null) {
      this.modelMaster.wo_number = 0
    }
    this.cdRef.detectChanges();
    this.apiService
      .update(this.modelMaster, ApiEndpoints.UpdateDepartmentDemandMaster + `?`)
      .subscribe((res) => {
        this.loadDemandMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.DemandNo
        );

        this.toastService.sendMessage({
          message: 'Department Demand Updated Successfully!',
          type: NotificationType.success,
        });
        // location.reload();
      });
    this.isUpdate = false;
  }
  //  =====Button-Add-Update=====
  addorUpdate() {
    // if (this.Detailform.invalid) {
    //   console.log('INVALID');
    // }
    if (!this.isUpdate) {
      this.AddDemandDetail();
    } else {
      this.updateDemndDetail();
    }
  }
  goToPage() {
    this.router.navigate(['/inventory/demand']);
  }
  refreshdetail() {
    this.isUpdate = false;
    // this.Masterform.reset();
    this.Detailform.reset();
  }
  //======Demand-Detail-Grid========
  LoadDemandDetails() {
    this.isLoadingData = true
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let DemandNo = +localStorage.getItem('DemandNo')!;
    //let StoreCode = this.masterResponse$.StoreCode;
    this.apiService
      .get(
        ApiEndpoints.LoadDemandDetails +
        `?BranchCode=${BranchCode}&StoreCode=${this.routeStoreCode}&DemandNo=${DemandNo}`
      )
      .subscribe((res: any) => {
        this.isLoadingData = false
        this.tableResponse$ = res.data;
      });
  }
  //======Demand-Detail-Add=======
  AddDemandDetail() {
    let branch = localStorage.getItem('BranchCode');
    this.iscreated = true;
    let val = this.Detailform.value;
    this.modelDetail = val;
    this.modelDetail.DemandNo = this.Masterform.get('DemandNo')?.value;
    this.modelDetail.StoreCode = this.masterResponse$.StoreCode;
    this.modelDetail.ApprovedQty = this.Detailform.get('DemandQty')?.value;
    this.modelDetail.UnitCode = this.detailResponse$.UnitCode;
    this.modelDetail.ItemCode = this.detailResponse$.ItemCode;
    this.modelDetail.BranchCode = +branch!;
    this.modelDetail.CreatedBy = this.UserId
    this.apiService
      .post(this.modelDetail, ApiEndpoints.CreateDepartmentDemandDetail + `?`)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Department Demand Saved Successfully!',
          type: NotificationType.success,
        });
        this.LoadDemandDetails();
        this.Detailform.reset();
      });
    this.Detailform.markAsUntouched();
  }
  hideErrorPopup() {
    this.loadingerror = false;
  }
  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.Detailform.controls['Status'].setValue(data.Status)
    this.detailResponse$ = { ...data };
    this.StoreItemResponse$.ItemCode = data.ItemCode.trim();
  }
  //  =====Demand-Detail-Update=====
  updateDemndDetail() {
    let user = localStorage.getItem('UserId');
    this.detailResponse$.ClosedBy = +user!
    this.detailResponse$.BranchCode = this.globalBranchCode;
    this.detailResponse$.StoreCode = this.selectedStoreCode;
    this.detailResponse$.ModifiedBy = this.UserId
    this.detailResponse$.Status = this.Detailform.controls['Status'].value
    let x = this.StoreItemResponse$.find((x: any) => {
      return x.Code === this.StoreItemResponse$.ItemCode;
    });
    this.detailResponse$.UnitCode = x.UnitCode;
    this.apiService
      .update(
        this.detailResponse$,
        ApiEndpoints.UpdateDepartmentDemandDetail + `?`
      )
      .subscribe((res) => {
        this.LoadDemandDetails();
        this.toastService.sendMessage({
          message: 'Department Demand Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.Detailform.reset();
  }
  //======Demand-Detail-Delete=======

  deleteDemandDetail(DemandSrNo: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let StoreCode = this.masterResponse$.StoreCode;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteDepartmentDemandDetail +
            `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&DemandSrNo=${DemandSrNo}`
          )
          .subscribe((res: any) => {
            this.LoadDemandDetails();
            this.toastService.sendMessage({
              message: 'Demand Detail Deleted Successfully!',
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
    this.Detailform.markAsUntouched();
  }

  DemandDetailReportpdf() {
    let DemandNo = +localStorage.getItem('DemandNo')!;
    this.loading = true;
    this.isLoading = true;
    //TBD----------------------------------------------------------------
    this.apiservice
      .pintDemandDetailReport(
        this.globalBranchCode,
        this.routeStoreCode,
        DemandNo
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
  LoadPreviousDemand() {
    this.apiService
      .get(
        ApiEndpoints.GetPreviousDemandNo +
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&DemandNo=${this.selectedDemandCode}`
      )
      .subscribe((res: any) => {
        this.PreviousDemand$ = res.data;
        Object.assign(this.masterResponse$, res[0]);
        const previousDemandMasterId = this.PreviousDemand$[0].DemandNo;
        this.selectedDemandCode = previousDemandMasterId;
        localStorage.setItem('DemandNo', previousDemandMasterId);
        this.loadDemandMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          previousDemandMasterId
        );
        this.LoadDemandDetails();
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /DemandNo=\d+/,
          `DemandNo=${previousDemandMasterId}`
        );
        window.history.replaceState({}, '', updatedURL);
        this.cdRef.detectChanges();
      });
  }

  LoadNextDemand() {
    this.apiService
      .get(
        ApiEndpoints.GetNextDemandNo +
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&DemandNo=${this.selectedDemandCode}`
      )
      .subscribe((res: any) => {
        this.NextDemand$ = res.data;
        Object.assign(this.masterResponse$, res[0]);
        let nextDemandMasterId = this.NextDemand$[0].DemandNo;

        this.selectedDemandCode = nextDemandMasterId;
        localStorage.setItem('DemandNo', nextDemandMasterId);

        this.loadDemandMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          nextDemandMasterId
        );
        this.LoadDemandDetails();
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /DemandNo=\d+/,
          `DemandNo=${nextDemandMasterId}`
        );
        window.history.replaceState({}, '', updatedURL);
        this.cdRef.detectChanges();
      });
  }


  //Documnet Upload Working start from here-----------------------------------------------------------------

  getGetMaxDocumentId() {

    let BranchCode = this.globalBranchCode;
    let StoreCode = +this.routeStoreCode;
    let DemandNo = this.globalDemandNo;
    this.documentUploadService.getMaxDocumentId(BranchCode, StoreCode, DemandNo).subscribe(
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
    model.DemandNo = this.globalDemandNo;
    this.apiService
      .get(
        ApiEndpoints.GetAllDemandDocuments +
        `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&DemandNo=${model.DemandNo}`
      )
      .subscribe((res: any) => {

        this.documentResponse = res.data;
      });
  }

  saveDocument() {
    let model = this.UploadDocform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = +this.routeStoreCode;
    model.DemandNo = this.globalDemandNo;
    model.DocumentId = +this.DocumentId;
    model.CreatedBy = this.UserId;
    model.ImageDirectory = this.ImageDirectory;
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.documentUploadService.saveDemandDocuments(model, this.selectedFiles).subscribe(() => {
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
    let DemandNo = this.globalDemandNo;
    let DocumentId = data.DocumentId;
    this.documentUploadService

      .viewDocuments(BranchCode, StoreCode, DemandNo, DocumentId)
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
    data.DemandNo = this.globalDemandNo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteDemandDocuments +
            `?BranchCode=${data.BranchCode}&StoreCode=${data.StoreCode}&DemandNo=${data.DemandNo}&DocumentId=${data.DocumentId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Demand Document Deleted Successfully!',
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
        this.ImageDirectory = res[0].DemandPath;
      });
  }
  onSubmit() {
    // if (this.Detailform.invalid) {
    //   this._utilityService.markAllFieldsAsDirtyAndTouched(
    //     this.Detailform
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
