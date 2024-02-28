import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { createFeatureSelector } from '@ngrx/store';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { CompanyCodeService } from 'src/app/_shared/services/company-code.service';
import { GrnService } from 'src/app/_shared/services/grn.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-store-issuance-detail',
  templateUrl: './store-issuance-detail.component.html',
  styleUrls: ['./store-issuance-detail.component.scss'],
})
export class StoreIssuanceDetailComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  POform!: FormGroup;

  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  poResponse$: any = [];
  issueResponse$: any = [];
  storeItemResponse$: any = [];
  objModel: any = [];
  issueModel: any = [];

  routeIssuanceNo: number = 0;
  routeStoreCode: number = 0;
  routeItemCode: number = 0;
  routeStoreName: any;

  selectedStoreItem!: number;
  globalBranchCode!: number;
  globalUserCode!: number;
  globalBranchName!: string;

  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  prdialog: boolean = false;
  issuedialog: boolean = false;
  POMasterId: number = 0;
  add: number = 0;
  IsLocked: boolean = false;
  loading = false;
  PreviousIssuance$: any = [];
  NextIssuance$: any = [];
  isLoadingData: boolean = false
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private apiservice: GrnService,
  ) { }

  ngOnInit(): void {
    this.Masterform = this.fb.group({
      IssuanceNo: this.fb.control('', Validators.required),
      Store: this.fb.control('', Validators.required),
      IssuanceDate: this.fb.control(''),
      IsLocked: this.fb.control(''),
      Remarks: this.fb.control(''),
    });

    this.POMasterId = +localStorage.getItem('PONo')!;

    this.Detailform = this.fb.group({
      ItemCode: this.fb.control('', Validators.required),
      Unit: this.fb.control(''),
      AvgRate: this.fb.control(''),
      LastPurRate: this.fb.control(''),
      IssuedQty: this.fb.control(''),
      Notes: this.fb.control(''),
    });

    this.POform = this.fb.group({
      PONo: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.globalBranchName = localStorage.getItem('BranchName')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeIssuanceNo = params['IssuanceNo'];
      this.routeStoreCode = params['StoreCode'];
      //this.routeStoreName = params['StoreName'];
    });

    this.loadIssuanceMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeIssuanceNo
    );
    this.loadStoreItem(this.routeStoreCode);
    this.loadIssuanceDetails(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeIssuanceNo
    );
  }

  loadPendingPO() {
    const x = this.POform.value;
    this.apiService.get(ApiEndpoints.PendingToReceivePOs +
      `?BranchCode=${this.globalBranchCode}&PONo=${x.PONo}&StoreCode=${this.routeStoreCode}`)
      .subscribe((res) => {
        this.poResponse$ = res;
      });
  }

  loadIssuanceMasterInfo(
    BranchCode: number,
    StoreCode: number,
    IssuanceNo: number
  ) {
    this.apiService.get(ApiEndpoints.LoadIssuanceMasterInfo +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IssuanceNo=${IssuanceNo}`)
      .subscribe((res: any) => {
        this.routeStoreName = res[0].StoreName;
        let x = res[0];
        if (x) {
          Object.assign(this.masterResponse$, x);
          const IssuanceDate = this.datePipe.transform(
            this.masterResponse$?.IssuanceDate,
            'y-MM-dd'
          );
          this.masterResponse$.IssuanceDate = IssuanceDate;
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

  changeStoreItem(e: any) {
    this.selectedStoreItem = e.value;
    let x = this.storeItemResponse$.find((x: any) => {
      return this.selectedStoreItem == x?.Code;
    });
    this.detailResponse$.PRQty = x?.PRQty;
    this.detailResponse$.UnitCode = x?.UnitCode;
    this.detailResponse$.Unit = x?.Unit;
    this.detailResponse$.ItemCode = x?.Code;
    this.apiService.get(ApiEndpoints.LoadItemRates + `?ItemCode=${this.detailResponse$.ItemCode}`)
      .subscribe((res: any) => {
        if (res[0].AvgRate == null) {
          this.detailResponse$.AvgRate = 0;
        } else {
          this.detailResponse$.AvgRate = res[0].AvgRate;
        }
        if (res[0].LastPurRate == null) {
          this.detailResponse$.LastPurRate = 0;
        } else {
          this.detailResponse$.LastPurRate = res[0].LastPurRate;
        }
      });
  }

  IssueOnBlur() {
    
    if (this.detailResponse$.IssuedQty != null) {
      this.issuedialog = true;
      this.apiService.get(ApiEndpoints.LoadItemStockDetails +
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&ItemCode=${this.detailResponse$.ItemCode}`)
        .subscribe((res: any) => {
          this.issueResponse$ = res;
        });
    }
  }

  checkIssueQty() {
    let x = this.issueResponse$.filter((x: any) => {
      if (x.IssQty >= 0) {
        this.add = this.add + x.IssQty;
      }
      return x.IssQty > 0;
    });
    if (this.add > this.detailResponse$.IssuedQty) {
      this.add = 0;
      return this.toastService.sendMessage({
        message: `Total Issued Qty should be less than or equal to Issue Qty!`,
        type: NotificationType.error,
      });
    }
    this.issueModel = x;
    this.issuedialog = false;
  }

  checkStockQty() {
    let x = this.issueResponse$.filter((x: any) => {
      if (x.IssQty > x.StockQty) {
        return this.toastService.sendMessage({
          message: `GRN# ${x.GRNNo} Issued Qty should be less than or equal to Stock Qty!`,
          type: NotificationType.error,
        });
      }
    });
  }

  hideIssueDialog() {
    this.issuedialog = false;
    this.add = 0;
  }

  loadIssuanceDetails(
    BranchCode: number,
    StoreCode: number,
    IssuanceNo: number
  ) {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.LoadIssuanceDetails +
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IssuanceNo=${IssuanceNo}`)
      .subscribe((res) => {
        this.tableResponse$ = res;
        this.isLoadingData = false
      });
  }

  StoreIssuanceReportpdf() {
    this.loading = true;
    this.apiservice
      .pintIssuanceReport(
        this.routeStoreCode,
        this.routeIssuanceNo,
        this.globalBranchName
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
    model.LockedBy = this.globalUserCode;
    model.IsLocked = this.Masterform.get('IsLocked')?.value;
    if (model.IsLocked) {
      this.IsLocked = true;
    }
    this.apiService.update(model, ApiEndpoints.UpdateIssuanceNoteMaster + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Store Issuance Details Updated Successfully!',
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

  getObjonBlur(event: any) {
    let x = this.poResponse$.filter((x: any) => {
      return x.GRNQty > 0;
    });
    this.objModel = x;
    if (event.GRNQty > event.BalToRcvQty) {
      this.toastService.sendMessage({
        message: 'Quantity should be Less',
        type: NotificationType.error,
      });
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

      // this.apiservice.createGRNDetailEntry(model).subscribe(() => {
      //   this.prdialog = false;
      //   this.toastService.sendMessage({
      //     message: 'PO Added to GRN Successfully!',
      //     type: NotificationType.success,
      //   });
      //   this.poResponse$ = [];
      //   this.POform.reset();
      //   this.loadIssuanceDetails(
      //     this.globalBranchCode,
      //     this.routeStoreCode,
      //     this.routeIssuanceNo
      //   );
      // });
    }
  }

  saveDetail() {
    for (let a in this.issueModel) {
      let model: any = [];
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.masterResponse$.StoreCode;
      model.IssuanceNo = this.masterResponse$.IssuanceNo;
      model.wo_number = 0;
      model.ItemCode = this.detailResponse$.ItemCode;
      model.UnitCode = this.detailResponse$.UnitCode;
      model.IssuedQty = this.issueModel[a].IssQty;
      model.GRNNo = this.issueModel[a].GRNNo;
      model.GRNSrNo = this.issueModel[a].GRNSrNo;
      model.ActualRate = this.issueModel[a].Rate;
      model.AvgRate = this.detailResponse$.AvgRate;
      model.Notes = this.Detailform.controls['Notes'].value
      model.LastPurRate = this.detailResponse$.LastPurRate;
      this.apiService.post(model, ApiEndpoints.SaveIssDetail + `?`)
        .subscribe(() => {
          this.toastService.sendMessage({
            message: 'Store Issuance Saved Successfully!',
            type: NotificationType.success,
          });
          this.issueResponse$ = [];
          this.detailResponse$.ItemCode = null;
          this.loadIssuanceDetails(
            this.globalBranchCode,
            this.routeStoreCode,
            this.routeIssuanceNo
          );
          this.Detailform.reset();
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
      // this.apiservice.createGRNDetailEntry(model).subscribe(() => {
      //   this.prdialog = false;
      //   this.toastService.sendMessage({
      //     message: 'Added Successfully!',
      //     type: NotificationType.success,
      //   });
      //   this.poResponse$ = [];
      //   this.POform.reset();
      //   this.loadIssuanceDetails(
      //     this.globalBranchCode,
      //     this.routeStoreCode,
      //     this.routeIssuanceNo
      //   );
      // });
    }
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.detailResponse$ = { ...data };
    const obj: any = Object.values(this.storeItemResponse$).find((y: any) => {
      return y.Code == this.detailResponse$.ItemCode;
    });
    this.detailResponse$.ItemCode = obj.Code;
    this.detailResponse$.UnitCode = obj.UnitCode;
  }

  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updateIssuanceDetail();
    }
  }

  updateIssuanceDetail() {
    let model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.routeStoreCode;
    model.IssuanceNo = this.masterResponse$.IssuanceNo;
    model.IssuanceSrNo = this.detailResponse$.IssuanceSrNo;
    model.wo_number = 0;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.ActualRate = this.detailResponse$.ActualRate;
    model.AvgRate = this.detailResponse$.AvgRate;
    model.LastPurRate = this.detailResponse$.LastPurRate;
    model.GRNNo = this.detailResponse$.GRNNo;
    model.GRNSrNo = this.detailResponse$.GRNSrNo;
    model.IssuedQty = this.detailResponse$.IssuedQty;
    model.Notes = this.detailResponse$.Notes;
    model.DemandNo = 0;
    model.DemandSrNo = 0;
    this.apiService.update(model, ApiEndpoints.UpdateIssuanceNoteDetail + `?`)
      .subscribe((res) => {
        this.loadIssuanceDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceNo
        );
        this.detailResponse$.ItemCode = null;
        this.Detailform.reset();
        this.toastService.sendMessage({
          message: 'Store Issuance Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
  }

  deleteIssuanceDetail(IssuanceSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteIssuanceNoteDetail +
          `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IssuanceNo=${this.routeIssuanceNo}&IssuanceSrNo=${IssuanceSrNo}`)
          .subscribe(() => {
            this.detailResponse$.ItemCode = null;
            this.loadIssuanceDetails(
              this.globalBranchCode,
              this.routeStoreCode,
              this.routeIssuanceNo
            );
            this.toastService.sendMessage({
              message: 'Store Issuance Deleted Successfully!',
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
  //====get-Previous-Issuance====
  LoadPreviousIssuance() {
    this.apiService.get(ApiEndpoints.GetPreviousIssuanceNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IssuanceNo=${this.routeIssuanceNo}`)
      .subscribe((res: any) => {
        this.PreviousIssuance$ = res;
        Object.assign(this.masterResponse$, res[0]);
        const previousIssuanceMasterId = this.PreviousIssuance$[0].IssuanceNo;
        this.loadIssuanceMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceNo
        );
        this.loadIssuanceDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceNo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /IssuanceNo=\d+/,
          `IssuanceNo=${previousIssuanceMasterId}`
        );
        localStorage.setItem('IssuanceNo', previousIssuanceMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
  //====get-Next-Issuance====
  LoadNextIssuance() {
    this.apiService.get(ApiEndpoints.GetNextIssuanceNo +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IssuanceNo=${this.routeIssuanceNo}`)
      .subscribe((res: any) => {
        this.NextIssuance$ = res;
        Object.assign(this.masterResponse$, res[0]);
        let nextIssuanceMasterId = this.NextIssuance$[0].IssuanceNo;
        this.loadIssuanceMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceNo
        );
        this.loadIssuanceDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceNo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /IssuanceNo=\d+/,
          `IssuanceNo=${nextIssuanceMasterId}`
        );
        localStorage.setItem('IssuanceNo', nextIssuanceMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
}
