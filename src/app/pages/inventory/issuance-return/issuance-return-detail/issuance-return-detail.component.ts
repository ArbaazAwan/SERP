import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GrnService } from 'src/app/_shared/services/grn.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-issuance-return-detail',
  templateUrl: './issuance-return-detail.component.html',
  styleUrls: ['./issuance-return-detail.component.scss']
})
export class IssuanceReturnDetailComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  masterResponse: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  poResponse$: any = [];
  issueResponse$: any = [];
  storeItemResponse$: any = [];
  objModel: any = [];
  issueModel: any = [];
  routeIssuanceReturnNo: number = 0;
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
  add: number = 0;
  IsLocked: boolean = false;
  loading = false;
  PreviousIssuance$: any = [];
  NextIssuance$: any = [];
  allDepartments : any;
  isButtonEnabled: boolean = true; 
  constructor(    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private apiservice: GrnService,
    ) { }

  ngOnInit(): void {
    this.Masterform = this.fb.group({
      IssuanceReturnNo: this.fb.control('', Validators.required),
      StoreName: this.fb.control('', Validators.required),
      ReturnDate: this.fb.control(''),
      IsLocked: this.fb.control(''),
      Remarks: this.fb.control(''),
      DepartmentCode : this.fb.control('')
    });

    this.Detailform = this.fb.group({
      ItemCode: this.fb.control('', Validators.required),
      Unit: this.fb.control(''),
      AvgRate: this.fb.control(''),
      LastPurRate: this.fb.control(''),
      IssuedQty: this.fb.control(''),
      Notes: this.fb.control(''),
    });

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.globalBranchName = localStorage.getItem('BranchName')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeIssuanceReturnNo = params['IssuanceReturnNo'];
      this.routeStoreCode = params['StoreCode'];
      //this.routeStoreName = params['StoreName'];
    });

    this.loadIssuanceReturnMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeIssuanceReturnNo
    );

    this.loadStoreItem(this.routeStoreCode);
    this.LoadIssuanceReturnDetails(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeIssuanceReturnNo
    );
    this.loadIssueToDept()
  }

  loadIssueToDept() {
    this.apiService
      .get(
        ApiEndpoints.LoadIssueToDept + `?BranchCode=${this.globalBranchCode}`
      )
      .subscribe((res: any) => {
        this.allDepartments = res;
      });
  }
  

  loadIssuanceReturnMasterInfo(
    BranchCode: number,
    StoreCode: number,
    routeIssuanceReturnNo: number
  ) {
    this.apiService.get(ApiEndpoints.LoadIssuanceReturnMasterInfo + 
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IssuanceReturnNo=${routeIssuanceReturnNo}`)
      .subscribe((res: any) => {
        this.masterResponse = res[0];
        this.Masterform.patchValue({...this.masterResponse});
        const ReturnDate = this.datePipe.transform(this.masterResponse?.ReturnDate,'y-MM-dd');
        this.Masterform.controls['ReturnDate'].setValue(ReturnDate);
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
      this.apiService.get(ApiEndpoints.LoadItemIssuancesDetails + 
        `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IssuedToDeptCode=${this.Masterform.controls['DepartmentCode'].value}&ItemCode=${this.detailResponse$.ItemCode}`)
        .subscribe((res: any) => {
          this.issueResponse$ = res;
        });
    }
  }

  checkIssueQty() {
    let x = this.issueResponse$.filter((x: any) => {
      if (x.ReturnQty >= 0) {
        this.add = this.add + x.ReturnQty;
      }
      return x.ReturnQty > 0;
    });
    if (this.add > this.detailResponse$.IssuedQty) {
      this.add = 0;
      return this.toastService.sendMessage({
        message: `Total Return Qty should be less than or equal to Issued Qty!`,
        type: NotificationType.error,
      });
    }
    this.issueModel = x;
    this.issuedialog = false;
  }

  checkStockQty() {
   this.issueResponse$.filter((x: any) => {
      if (x.ReturnQty > x.IssuedQty) {
        return this.toastService.sendMessage({
          message: `GRN# ${x.GRNNo} Return Qty should be less than or equal to Issued Qty!`,
          type: NotificationType.error,
        });
      }
    });
  }

  hideIssueDialog() {
    this.issuedialog = false;
    this.add = 0;
  }
  isLoadingData : boolean = false
  LoadIssuanceReturnDetails(
    BranchCode: number,
    StoreCode: number,
    routeIssuanceReturnNo: number
  ) {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.LoadIssuanceReturnDetails + 
      `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IssuanceReturnNo=${routeIssuanceReturnNo}`)
      .subscribe((res) => {
        this.tableResponse$ = res;
        this.isLoadingData = false
      });
  }

  StoreIssuanceReturnReportpdf() {
    this.loading = true;
    this.apiservice
      .pintIssuanceReturnReport(
        this.routeStoreCode,
        this.routeIssuanceReturnNo,
        this.globalBranchName,
        this.globalBranchCode
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
  // StoreIssuanceReturnReportpdf() {
  //   this.loading = true;
  //   this.apiService.get(ApiEndpoints.StoreIssuanceNoteReport + 
  //     `?FileType=PDF&StoreCode=${this.routeStoreCode}&IssuanceReturnNo=${this.routeIssuanceReturnNo}&BranchName=${this.globalBranchName}&ReportName=Store Issuance Report`)
  //     .subscribe((pdf: any) => {
  //       const file = new Blob([pdf], {
  //         type: 'application/pdf',
  //       });
  //       this.loading = false;
  //       const fileURL = URL.createObjectURL(file);
  //       window.open(fileURL);
  //     });
  // }

  updateMaster() {
    let model = this.Masterform.value;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUserCode;
    model.StoreCode = this.routeStoreCode;
    model.LockedBy = this.Masterform.controls['IsLocked'].value ? this.globalUserCode : 0;
    this.apiService.update(model, ApiEndpoints.UpdateIssReturnMaster + `?`)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Issuance Return Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.loadIssuanceReturnMasterInfo(
      this.globalBranchCode,
      this.routeStoreCode,
      this.routeIssuanceReturnNo
      )
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

  saveDetail() {
    for (let a in this.issueModel) {
      let model: any = [];
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.masterResponse.StoreCode;
      model.IssuanceReturnNo = this.routeIssuanceReturnNo;
      model.wo_number = 0;
      model.ItemCode = this.detailResponse$.ItemCode;
      model.UnitCode = this.detailResponse$.UnitCode;
      model.ReturnQty = this.issueModel[a].ReturnQty;
      model.GRNNo = this.issueModel[a].GRNNo;
      model.GRNSrNo = this.issueModel[a].GRNSrNo;
      model.IssuanceSrNo = this.issueModel[a].IssuanceSrNo;
      model.IssuanceNo = this.issueModel[a].IssuanceNo;
      model.ActualRate = this.issueModel[a].ActualRate;
      model.AvgRate = this.detailResponse$.AvgRate;
      model.LastPurRate = this.detailResponse$.LastPurRate;
      this.apiService.post(model, ApiEndpoints.SaveIssReturnDetail + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Issuance Return Saved Successfully!',
          type: NotificationType.success,
        });
        this.issueResponse$ = [];
        this.detailResponse$.ItemCode = null;
        this.LoadIssuanceReturnDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceReturnNo
        );
        this.Detailform.reset();
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
    this.detailResponse$.UnitCode = obj.UnitCode;
  }

  deleteIssuanceReturnDetail(IssuanceReturnSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteIssReturnDetail + 
          `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IssuanceReturnNo=${this.routeIssuanceReturnNo}&IssuanceReturnSrNo=${IssuanceReturnSrNo}`)
          .subscribe(() => {
            this.detailResponse$.ItemCode = null;
            this.LoadIssuanceReturnDetails(
              this.globalBranchCode,
              this.routeStoreCode,
              this.routeIssuanceReturnNo
            );
            this.toastService.sendMessage({
              message: 'Issuance Return Deleted Successfully!',
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

  refreshdetail() {
    this.isUpdate = false;
    this.detailResponse$.ItemCode = null;
    this.Detailform.reset();
  }

  //====get-Previous-Issuance====
  LoadPreviousIssuanceReturn() {
    this.apiService.get(ApiEndpoints.GetPreviousIssuanceReturnNo + 
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IssuanceReturnNo=${this.routeIssuanceReturnNo}`)
      .subscribe((res: any) => {
        this.PreviousIssuance$ = res;
        Object.assign(this.masterResponse, res[0]);
        const previousIssuanceMasterId = this.PreviousIssuance$[0].IssuanceReturnNo;
        this.loadIssuanceReturnMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceReturnNo
        );
        this.LoadIssuanceReturnDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceReturnNo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /IssuanceReturnNo=\d+/,
          `IssuanceReturnNo=${previousIssuanceMasterId}`
        );
        localStorage.setItem('IssuanceReturnNo', previousIssuanceMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
  //====get-Next-Issuance====
  LoadNextIssuanceReturn() {
    this.apiService.get(ApiEndpoints.GetNextIssuanceReturnNo + 
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.routeStoreCode}&IssuanceReturnNo=${this.routeIssuanceReturnNo}`)
      .subscribe((res: any) => {
        this.NextIssuance$ = res;
        Object.assign(this.masterResponse, res[0]);
        let nextIssuanceMasterId = this.NextIssuance$[0].IssuanceReturnNo;
        this.loadIssuanceReturnMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceReturnNo
        );
        this.LoadIssuanceReturnDetails(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeIssuanceReturnNo
        );
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /IssuanceReturnNo=\d+/,
          `IssuanceReturnNo=${nextIssuanceMasterId}`
        );
        localStorage.setItem('IssuanceReturnNo', nextIssuanceMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }

}
