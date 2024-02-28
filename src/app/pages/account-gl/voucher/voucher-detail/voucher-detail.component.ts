import {
  VoucherDetailModel,
  VoucherEntryConfig,
} from './../../../../_shared/model/model';
import { VoucherMasterModel } from 'src/app/_shared/model/model';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { AbbreviationPipe } from 'src/app/_shared/pipe/abbreviation.pipe';

interface Asset {
  AssetName: string;
  AssetCode: string;
  IsDetail: boolean;
}
@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.scss'],

})



export class VoucherDetailComponent implements OnInit {
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  voucherEntryConfig: Array<VoucherEntryConfig> = [];

  detailModel: any = [];
  masterModel!: VoucherMasterModel;

  selectedAccountCode: any = [];
  selectedAssetCode: any = [];
  selectedEmployeeCode: any = [];
  accountDescriptionResponse$: any = [];
  assetsResponse$: any = [];
  filteredAssets: Asset[] = [];
  employeeResponse$: any = [];

  currencyResponse$: any = [];
  instrumentsResponse$: any = [];
  selectedCurrency!: number;
  selectedInstrument!: string;
  voucherResponse$: any = [];
  voucherDetailResponse$: any = [];
  VoucherMasterId: number = 0;
  VoucherByIdResponse$: any = [];
  VoucherReportResponse$: any = [];
  tableLength!: number;
  AccountId:number=0;
  isUpdate!: boolean;
  datePipe = new DatePipe('en-US');
  VoucherDetailId!: number;
  PostVoucherResponse$: any = [];
  isDebitDisabled: boolean = false;
  isCreditDisabled: boolean = false;
  currentDate: any;
  voucherDetailResponsegrid$: any = [];
  IsDisabled: boolean = false;
  totalDebit: number = 0;
  totalCredit: number = 0;
  workOrderResponse$: any = [];
  selectedWorkOrder!: number;
  globalBranchCode!: number;
  partyResponse$: any = [];
  selectedParty: any = [];

  Functionresponse$: any = [];
  selectedFunction: any = [];
  CostCentersLevel1$: any = [];
  CostCentersLevel2$: any = [];
  CostCentersLevel3$: any = [];
  selectedCostCentersLevel1: any;
  selectedCostCentersLevel2: any;
  selectedCostCentersLevel3: any;

  // cash flowtag
  cashflowtag1$: any = [];
  cashflowtag2$: any = [];
  selectedcashflowtag1: any;
  selectedcashflowtag2: any;

  NextVoucherresponse$: any = [];
  PreviousVoucherresponse$: any = [];
  globalBranch: any = [];
  globalProjectCode: any = [];
  globalVoucherId: any = [];
  globalVoucherTypeCode: any = [];

  assetdropdown: boolean = false;
  partydropdown: boolean = false;
  employeedropdown: boolean = false;
  workOrderdropdown: boolean = false;
  costCentersLevel1dropdown: boolean = false;
  costCentersLevel2dropdown: boolean = false;
  costCentersLevel3dropdown: boolean = false;
  functionsdropdown: boolean = false;
  cashFlowTag1dropdown: boolean = false;
  cashFlowTag2dropdown: boolean = false;
  Nextvoucher: any = [];
  chequeBookId : number = 0
  ChequeNo:number = 0;
  monthDates:any;

  uploadDoc: boolean = false;
  displayDocumentDialog: boolean = false;
 UploadDocform!:FormGroup;
 documentResponse:any;
 imagePathOnServer!: string;
 selectedFiles:any;
 DocumentId:any;
 ImageDirectory:any;
 minDate:any;
 maxDate:any;
 isLoadingData : boolean = false;
 allBankCashAccounts : any;
 allChequesNo : any;
isEdit:string='';
 

  constructor(
    private fb: FormBuilder,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private router: Router,
    private apiService: ApiProviderService,
    private documentUploadService:DocumentUploadService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.Masterform = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      VoucherTypeCode: this.fb.control('', Validators.required),
      VoucherNo: this.fb.control('', Validators.required),
      VoucherDate: this.fb.control('', Validators.required),
      Description: this.fb.control('', Validators.required),
      InstrumentNo: this.fb.control('', Validators.required),
      InstrumentTypeId: this.fb.control('', Validators.required),
      InstrumentDate: this.fb.control('', Validators.required),
      CurrencyCode: this.fb.control('', Validators.required),
      FCRate: this.fb.control('', Validators.required),
      AccountId : this.fb.control('',Validators.required),
      ChequeBookId : this.fb.control('', Validators.required),
      ChequeNo : this.fb.control('',Validators.required)
    });

    this.VoucherMasterId = +localStorage.getItem('VoucherId')!;

    this.Detailform = this.fb.group({
      DebitAmount: this.fb.control('', Validators.required),
      CreditAmount: this.fb.control('', Validators.required),
      Narration: this.fb.control('', Validators.required),
      AssetCode: this.fb.control('', Validators.required),
      EmployeeCode: this.fb.control('', Validators.required),
      PartyCode: this.fb.control('', Validators.required),
      wo_number: this.fb.control('', Validators.required),
      CodeLevel: this.fb.control('', Validators.required),
      CodeLevel2: this.fb.control('', Validators.required),
      CodeLevel3: this.fb.control('', Validators.required),
      FunctionCode: this.fb.control('', Validators.required),
      CashFlowTag1Code: this.fb.control('', Validators.required),
      CashFlowTag2Code: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;

    this.currentDate = new Date();
    const firstDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );
    const formattedFirstDate = this.formatDate(firstDate);
    const formattedLastDate = this.formatDate(lastDate);
    this.Masterform.controls['VoucherDate'].setValue(this.formatDate(this.currentDate));
    this.loadAccountTitle();
    this.loadAllcurrency();
    this.loadAllInstruments();
    this.loadAssets();
    this.loadEmployee();
    this.loadWorkOrder();
    this.loadPartyTypes();
    this.loadAllFunctions();
    this.loadAllCostCentersLevel1();
    this.loadAllCashflowtag1();
    this.loadVoucherMaster(this.VoucherMasterId);
    this.loadVoucherDetails(this.VoucherMasterId);

    this._activatedRoute.queryParams.subscribe((params) => {
      this.isEdit = params['edit'];
    });
    

    this.globalBranch = +localStorage.getItem('BranchCode')!;
    //this.globalProjectCode =+localStorage.getItem('projectCode')!;
    //this.globalVoucherId = +localStorage.getItem('VoucherId')!;
    //this.globalVoucherTypeCode = +localStorage.getItem('VoucherTypeCode')!;
    this.fetchVoucherEntryConfig();

    this._activatedRoute.queryParams.subscribe((params) => {
      this.globalVoucherId = +params['VoucherId'];
      this.globalProjectCode = +params['ProjectCode'];
      this.globalVoucherTypeCode = +params['VoucherTypeCode'];
    });

    this.getDoucumnetPaths();
    this.ducumentFormInIt();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();
    this.getAllBankAccounts();

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

  loadAllChequeNo(e:any) {
    let AccountId = e.value
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.ChequeBookConfig + `/${this.globalBranchCode}/${AccountId}`)
      .subscribe(
        (response: any) => {
          this.allChequesNo = response.data;
          this.chequeBookId = response.data[0].ChequeBookId
          this.isLoadingData = false;
        }
      );
  }


  fetchVoucherEntryConfig() {
    const branchCode = +localStorage.getItem('BranchCode')!;
    this.apiService.get(ApiEndpoints.GetVoucherEntryConfig + `?BranchCode=${branchCode}`)
      .subscribe((res: any) => {
        this.voucherEntryConfig = res;
        this.updateFormWithConfig();
      });
  }
  updateFormWithConfig() {
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeAssets')
    ) {
      this.assetdropdown = this.voucherEntryConfig[0].IncludeAssets === true;
    } else {
      this.assetdropdown = false;
    }

    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeParty')
    ) {
      this.partydropdown = this.voucherEntryConfig[0].IncludeParty === true;
    } else {
      this.partydropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeEmployee')
    ) {
      this.employeedropdown =
        this.voucherEntryConfig[0].IncludeEmployee === true;
    } else {
      this.employeedropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeWorkOrder')
    ) {
      this.workOrderdropdown =
        this.voucherEntryConfig[0].IncludeWorkOrder === true;
    } else {
      this.workOrderdropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeCostCentersLevel1')
    ) {
      this.costCentersLevel1dropdown =
        this.voucherEntryConfig[0].IncludeCostCentersLevel1 === true;
    } else {
      this.costCentersLevel1dropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeCostCentersLevel2')
    ) {
      this.costCentersLevel2dropdown =
        this.voucherEntryConfig[0].IncludeCostCentersLevel2 === true;
    } else {
      this.costCentersLevel2dropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeCostCentersLevel3')
    ) {
      this.costCentersLevel3dropdown =
        this.voucherEntryConfig[0].IncludeCostCentersLevel3 === true;
    } else {
      this.costCentersLevel3dropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeFunctions')
    ) {
      this.functionsdropdown =
        this.voucherEntryConfig[0].IncludeFunctions === true;
    } else {
      this.functionsdropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeCashFlowTag1')
    ) {
      this.cashFlowTag1dropdown =
        this.voucherEntryConfig[0].IncludeCashFlowTag1 === true;
    } else {
      this.cashFlowTag1dropdown = false;
    }
    if (
      this.voucherEntryConfig.length > 0 &&
      this.voucherEntryConfig[0].hasOwnProperty('IncludeCashFlowTag2')
    ) {
      this.cashFlowTag2dropdown =
        this.voucherEntryConfig[0].IncludeCashFlowTag2 === true;
    } else {
      this.cashFlowTag2dropdown = false;
    }
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async loadVoucherMaster(VoucherId: number) {

    //api/VoucherMaster/GetVoucherMasterById?VoucherId=${VoucherId}
    this.apiService.get(ApiEndpoints.getVoucherMasterById + `?VoucherId=${VoucherId}`)
      .subscribe((res: any) => {

        let x = res.data;
        debugger
        const monthMap: { [key: string]: number } = {
          'jan': 0,
          'feb': 1,
          'mar': 2,
          'apr': 3,
          'may': 4,
          'jun': 5,
          'jul': 6,
          'aug': 7,
          'sep': 8,
          'oct': 9,
          'nov': 10,
          'dec': 11
        };
//-------------------------------Date Concatination Done------------------------------------------------
        const monthTitleDate: Date = new Date( x[0]?.VoucherDate);
        const month: string = monthTitleDate.toLocaleDateString('en-US', { month: 'short' });
        const year: number = monthTitleDate.getFullYear();
        const day: number = this.currentDate.getDate();
        let newDate:Date = new Date
        const monthIndex: number = monthMap[month.toLowerCase()];
        const lastDayOfMonth: number = new Date(year, monthIndex + 1, 0).getDate();

        if(lastDayOfMonth<day){
         newDate = new Date(`${month}-${lastDayOfMonth}-${year}`);
        }
        else{
          newDate = new Date(`${month}-${day}-${year}`);
        }
       
//-------------------------------Date Concatination Done------------------------------------------------
        debugger
        this.monthDates = res.data[0].FinancialMonthCode;
        this.loadFinancialMonthDates();
        let VoucherDateToDisplay
        if(this.isEdit == 'edit'){
          VoucherDateToDisplay = this.datePipe.transform(
            x[0]?.VoucherDate,
            'yyyy-MM-dd'
          );
        }else{
           VoucherDateToDisplay = this.datePipe.transform(
            newDate,
            'yyyy-MM-dd'
          );
        }
        
        const InstrumentDateToDisplay = this.datePipe.transform(
          x[0]?.InstrumentDate,
          'yyyy-MM-dd'
        );
        Object.assign(this.voucherResponse$, x[0]);
        this.voucherResponse$.VoucherDate = VoucherDateToDisplay;
        this.voucherResponse$.InstrumentDate = InstrumentDateToDisplay;

        let IsOpenForEntry = this.voucherResponse$.IsOpenForEntry;
        if (IsOpenForEntry == false) {
          this.IsDisabled = true;
        } else {
          this.IsDisabled = false;
        }
      });


  }

  loadFinancialMonthDates() {

    this.apiService.get(ApiEndpoints.GetFinacialMonthsById + `?FinancialMonthCode=${this.monthDates}`)
      .subscribe((res: any) => {

        this.minDate = res[0].StartDate;
        this.maxDate = res[0].EndDate;
      });


  }

  changeInstrument(e: any) {
    debugger
    this.selectedInstrument = e.target.value;
  }

  loadAllInstruments() {
    this.apiService.get(ApiEndpoints.getAllInstrumentType)
      .subscribe((res: any) => {
        this.instrumentsResponse$ = res;
      });
  }

  changecurrency(e: any) {
    this.selectedCurrency = +e.target.value;
  }

  loadAllcurrency() {
    this.apiService.get(ApiEndpoints.getAllCurrency)
      .subscribe((res: any) => {
        this.currencyResponse$ = res;
      });
  }

  loadAccountTitle() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
      .subscribe((res: any) => {
        this.accountDescriptionResponse$ = res.data;
      });
  }

  changeACDescription(e: any) {
    this.selectedAccountCode = e.value;
    let x = this.accountDescriptionResponse$.find((x: VoucherDetailModel) => {
      return this.selectedAccountCode == x.AccountCode;
    });
    Object.assign(this.detailModel, x);
  }

  changeAsset(e: any) {
    this.selectedAssetCode = e.value;
  }
  loadAssets() {

    this.apiService.get(ApiEndpoints.LoadChartOfAssetsTree)
      .subscribe((res: any) => {

      this.assetsResponse$ = res;
        //this.isDetailCheck = res.IsDetail
      this.filteredAssets = this.assetsResponse$.filter((asset: Asset) => asset.IsDetail === true);
    });
  }

  changeEmployee(e: any) {
    this.selectedEmployeeCode = e.value;
  }
  loadEmployee() {
    this.apiService.get(ApiEndpoints.EmployeeSetup)
      .subscribe((res: any) => {
        this.employeeResponse$ = res;
      });
  }
  changeParty(e: any) {
    this.selectedParty = e.value;
  }
  loadPartyTypes() {
    this.apiService.get(ApiEndpoints.LoadAllParties + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.partyResponse$ = res.data;
      });
  }

  loadVoucherDetails(VoucherId: number) {
    debugger
    this.apiService.get(ApiEndpoints.GetVoucherDetails + `?VoucherId=${VoucherId}`)
      .subscribe((res: any) => {
        debugger
        this.voucherDetailResponsegrid$ = res.data;
        let debitTotal = 0;
        let creditTotal = 0;

        res.data.forEach((data: any) => {
          debitTotal += data.DebitAmount;
          creditTotal += data.CreditAmount;
        });

        this.totalDebit = debitTotal;
        this.totalCredit = creditTotal;
      });
  }

  changeWorkOrder(e: any) {
    this.selectedWorkOrder = e.value;
  }
  loadWorkOrder() {
    this.apiService.get(ApiEndpoints.LoadWorkOrders + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.workOrderResponse$ = res;
      });
  }
  UpdatePostVoucher() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let VoucherId = +localStorage.getItem('VoucherId')!;
    let PostedBy = +localStorage.getItem('UserId')!;
    const isEqual = this.isDebitEqualCredit(this.voucherDetailResponsegrid$);
    if (isEqual) {
      this.apiService.update(this.masterModel, ApiEndpoints.putPostVoucher +
        `?BranchCode=${BranchCode}&VoucherId=${VoucherId}&PostedBy=${PostedBy}`)
        .subscribe((res: any) => {
          this.toastService.sendMessage({
            message: 'Post Voucher Updated Successfully!',
            type: NotificationType.success,
          });
          location.reload();
        });
    } else {
      this.toastService.sendMessage({
        message: 'Debit and Credit should be Equal!',
        type: NotificationType.error,
      });
    }
  }

  isDebitEqualCredit(res: any): boolean {
    let debitTotal = 0;
    let creditTotal = 0;

    res.forEach((data: any) => {
      debitTotal += data.DebitAmount;
      creditTotal += data.CreditAmount;
    });

    return debitTotal === creditTotal;
  }

  VoucherReportpdf() {
    this.apiService.get(ApiEndpoints.GetVoucherReport + `?FileType=PDF&VoucherId=${this.VoucherMasterId}`)
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  loadVoucherDetailsById(VoucherDetailId: number) {
    this.apiService.get(ApiEndpoints.GetVoucherDetailsById + `?VoucherDetailId=${VoucherDetailId}`)
      .subscribe((res: any) => {
        this.VoucherByIdResponse$ = res.data;
      });
  }
  // ----------dropdown----------
  changeFunction(e: any) {
    this.selectedFunction = e.value;
  }
  loadAllFunctions() {
    this.apiService.get(ApiEndpoints.getAllFunctions)
      .subscribe((res: any) => {
        this.Functionresponse$ = res;
      });
  }
  changeCostCentersLevel1(e: any) {
    this.selectedCostCentersLevel1 = +e.value;
    this.loadAllCostCentersLevel2(this.selectedCostCentersLevel1);
  }
  loadAllCostCentersLevel1() {
    this.apiService.get(ApiEndpoints.getAllCostCentersLevel1)
      .subscribe((res: any) => {
        this.CostCentersLevel1$ = res;
      });
  }

  changeCostCentersLevel2(e: any) {
    this.selectedCostCentersLevel2 = +e.value;
    this.loadAllCostCentersLevel3(
      this.selectedCostCentersLevel1,
      this.selectedCostCentersLevel2
    );
  }
  loadAllCostCentersLevel2(CodeLevel: number) {
    this.apiService.get(ApiEndpoints.GetCostCentersLevel2 + `?CodeLevel=${CodeLevel}`)
      .subscribe((res: any) => {
        this.CostCentersLevel2$ = res;
      });
  }
  changeCostCentersLevel3(e: any) {
    this.selectedCostCentersLevel3 = +e.value;
    // this.loadAllCostCentersLevel3(this.selectedCostCentersLevel1);
  }
  loadAllCostCentersLevel3(CodeLevel: number, CodeLeve2: number) {
    this.apiService.get(ApiEndpoints.GetCostCentersLevel3 +
      `?CodeLevel=${CodeLevel}&CodeLevel2=${CodeLeve2}`)
      .subscribe((res: any) => {
        this.CostCentersLevel3$ = res;
      });
  }

  // cashflow tag
  changeCashflowtag1(e: any) {
    this.selectedcashflowtag1 = +e.value;
    this.loadAllCashflowtag2(this.selectedcashflowtag1);
  }
  loadAllCashflowtag1() {
    this.apiService.get(ApiEndpoints.getAllCashFlowTag1).subscribe((res: any) => {
      this.cashflowtag1$ = res;
    });
  }
  changeCashflowtag2(e: any) {
    this.selectedcashflowtag2 = +e.value;
  }
  loadAllCashflowtag2(num: number) {
    this.apiService.get(ApiEndpoints.getAllCashFlowTag2).subscribe((res: any) => {
      this.cashflowtag2$ = res;
    });
  }
  // ----------dropdown----------

  async saveVoucherDetail() {
debugger
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    Object.assign(this.detailModel, this.voucherResponse$);
    this.detailModel.DebitAmount = this.Detailform.get('DebitAmount')?.value;
    this.detailModel.CreditAmount = this.Detailform.get('CreditAmount')?.value;
    this.detailModel.Narration = this.Detailform.get('Narration')?.value;
    if (this.selectedAssetCode) {
      this.detailModel.AssetCode = +this.selectedAssetCode;
    } else {
      this.detailModel.AssetCode = 0;
    }
    if (this.selectedEmployeeCode) {
      this.detailModel.EmployeeCode = +this.selectedEmployeeCode;
    } else {
      this.detailModel.EmployeeCode = 0;
    }
    if (this.selectedParty) {
      this.detailModel.PartyCode = +this.selectedParty;
    } else {
      this.detailModel.PartyCode = 0;
    }
    if (this.selectedWorkOrder) {
      this.detailModel.wo_number = +this.selectedWorkOrder;
    } else {
      this.detailModel.wo_number = 0;
    }
    if (this.selectedCostCentersLevel1) {
      this.detailModel.CodeLevel = +this.selectedCostCentersLevel1;
    } else {
      this.detailModel.CodeLevel = 0;
    }
    if (this.selectedCostCentersLevel2) {
      this.detailModel.CodeLevel2 = +this.selectedCostCentersLevel2;
    } else {
      this.detailModel.CodeLevel2 = 0;
    }
    if (this.selectedCostCentersLevel3) {
      this.detailModel.CodeLevel3 = +this.selectedCostCentersLevel3;
    } else {
      this.detailModel.CodeLevel3 = 0;
    }
    if (this.selectedFunction) {
      this.detailModel.FunctionCode = +this.selectedFunction;
    } else {
      this.detailModel.FunctionCode = 0;
    }
    if (this.selectedcashflowtag1) {
      this.detailModel.CashFlowTag1Code = +this.selectedcashflowtag1;
    } else {
      this.detailModel.CashFlowTag1Code = 0;
    }
    if (this.selectedcashflowtag2) {
      this.detailModel.CashFlowTag2Code = +this.selectedcashflowtag2;
    } else {
      this.detailModel.CashFlowTag2Code = 0;
    }
    this.detailModel.CreatedBy = +user!;
    this.detailModel.CreatedOn = currentDate.toLocaleString();
    this.apiService.post(this.detailModel, ApiEndpoints.AddVoucherDetail + `?`)
      .subscribe((res) => {

        let result$ = res;
        // let x = result$ as unknown as string;
        // let obj = JSON.parse(x);
        // const voucherDetailID = obj[0].VoucherDetailId;
        this.VoucherDetailId = result$[0].VoucherDetailId;
         if (result$ !== null) {
          this.toastService.sendMessage({
            message: 'Voucher Record Added Successfully!',
            type: NotificationType.success,

          });
          this.loadVoucherDetails(this.VoucherMasterId);
          this.accountDescriptionResponse$ = [];
          this.refresh();
          this.Detailform.reset();
          this.isDebitDisabled = false;
          this.isCreditDisabled = false;
        }
      });
  }

  async updateVoucherDetail() {
    debugger
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.detailModel.DebitAmount = this.Detailform.get('DebitAmount')?.value;
    this.detailModel.CreditAmount = this.Detailform.get('CreditAmount')?.value;
    this.detailModel.Narration = this.Detailform.get('Narration')?.value;
    this.detailModel.ModifiedBy = +user!;
    this.detailModel.ModifiedOn = currentDate.toLocaleString();
    this.detailModel.EntrySeq = this.voucherDetailResponse$.EntrySeq;
    this.detailModel.VoucherDetailId =
      this.voucherDetailResponse$.VoucherDetailId;
    let obj = this.accountDescriptionResponse$.find((x: any) => {
      return this.voucherDetailResponse$.AccountCode === x.AccountCode;
    });
    this.detailModel.AccountCode = obj.AccountCode;
    this.detailModel.AccountCodeWithSeperator = obj.AccountCodeWithSeperator;
    this.detailModel.AssetCode = +this.voucherDetailResponse$.AssetCode;
    this.detailModel.PartyCode = +this.voucherDetailResponse$.PartyCode;
    this.detailModel.wo_number = +this.voucherDetailResponse$.wo_number;
    this.detailModel.EmployeeCode = +this.voucherDetailResponse$.EmployeeCode;
    this.detailModel.CodeLevel = +this.voucherDetailResponse$.CodeLevel;
    this.detailModel.CodeLevel2 = +this.voucherDetailResponse$.CodeLevel2;
    this.detailModel.CodeLevel3 = +this.voucherDetailResponse$.CodeLevel3;
    this.detailModel.CashFlowTag1Code =
      +this.voucherDetailResponse$.CashFlowTag1Code;
    this.detailModel.CashFlowTag2Code =
      +this.voucherDetailResponse$.CashFlowTag2Code;

    this.apiService.update(this.detailModel, ApiEndpoints.UpdateVoucherDetail + `?`)
      .subscribe((res) => {
        this.loadVoucherDetails(this.VoucherMasterId);
        this.Detailform.patchValue({
          VoucherDetailModel: this.voucherResponse$,
        });
      });
    this.isUpdate = false;
    this.Detailform.reset();
    this.refresh();
  }

//   updateMaster() {
// debugger
//     let user = localStorage.getItem('UserId');
//     this.masterModel = this.Masterform.value;
//     this.masterModel.VoucherId = +this.voucherResponse$.VoucherId;
//     this.masterModel.BranchCode = +this.voucherResponse$.BranchCode;
//     this.masterModel.ProjectCode = +this.voucherResponse$.ProjectCode;
//     this.masterModel.VoucherTypeCode = +this.voucherResponse$.VoucherTypeCode;
//     this.masterModel.VoucherNo = +this.voucherResponse$.VoucherNo;
//     this.masterModel.ModifiedBy = +user!;
//     this.masterModel.InstrumentTypeId =
//       this.voucherResponse$.InstrumentTypeId || 0;
//     this.masterModel.InstrumentNo = this.voucherResponse$.InstrumentNo || 0;
//     this.masterModel.InstrumentDate = this.voucherResponse$.InstrumentDate || 0;
//     if (typeof this.voucherResponse$.InstrumentTypeId === 'object') {
//       this.masterModel.InstrumentTypeId =
//         +this.voucherResponse$.InstrumentTypeId.InstrumentTypeId;
//     } else if (
//       typeof this.voucherResponse$.InstrumentTypeId === 'undefined' ||
//       this.voucherResponse$.InstrumentTypeId === null
//     ) {
//       this.masterModel.InstrumentTypeId = 0;
//     } else {
//       this.masterModel.InstrumentTypeId =
//         +this.voucherResponse$.InstrumentTypeId;
//     }

//     this.masterModel.VoucherDate = this.voucherResponse$.VoucherDate;
//     this.masterModel.CurrencyCode = this.voucherResponse$.CurrencyCode;
//     this.masterModel.FCRate = this.voucherResponse$.FCRate;
//     this.masterModel.ChequeBookId = this.chequeBookId
//     this.masterModel.ChequeNo = this.ChequeNo || 0;
//     this.masterModel.AccountId = this.AccountId || 0;
    
//     this.apiService.update(this.masterModel, ApiEndpoints.putVoucherMaster + `?`)
//       .subscribe((res) => {
//         if (res) {
//           this.toastService.sendMessage({
//             message: 'Voucher Record Updated Successfully!',
//             type: NotificationType.success,
//           });
//           // this.resetMasterForm();
//         }
//       });
//   }

  updateMaster() {
    debugger
        let user = localStorage.getItem('UserId');
        this.masterModel = this.Masterform.value;
        this.masterModel.BranchCode = +this.voucherResponse$.BranchCode;
        this.masterModel.ProjectCode = +this.voucherResponse$.ProjectCode;
        this.masterModel.ModifiedBy = +user!;
        this.masterModel.VoucherId = +this.globalVoucherId;
        this.masterModel.ChequeNo = this.Masterform.get('ChequeNo')!.value || 0;
        this.masterModel.AccountId = this.Masterform.get('AccountId')!.value || 0;
        this.masterModel.ChequeBookId = this.Masterform.get('ChequeBookId')!.value || 0;
        this.masterModel.InstrumentTypeId = this.Masterform.get('InstrumentTypeId')!.value || 0;
        this.masterModel.VoucherTypeCode = this.globalVoucherTypeCode;
        this.masterModel.InstrumentNo = this.Masterform.get('InstrumentNo')!.value || 0;
        this.apiService.update(this.masterModel, ApiEndpoints.putVoucherMaster + `?`)
          .subscribe((res) => {
            if (res) {
              this.toastService.sendMessage({
                message: 'Voucher Record Updated Successfully!',
                type: NotificationType.success,
              });
              // this.resetMasterForm();
            }
          });
      }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.voucherDetailResponse$ = { ...data };

    if (typeof data.AccountCode === 'string') {
      this.voucherDetailResponse$.AccountCode = data.AccountCode.trim();
    }

    if (typeof data.AssetCode === 'string') {
      this.voucherDetailResponse$.AssetCode = data.AssetCode.trim();
    } else {
      this.voucherDetailResponse$.AssetCode = data.AssetCode.toString().trim();
    }

    if (typeof data.PartyCode === 'string') {
      this.voucherDetailResponse$.PartyCode = data.PartyCode.trim();
    }

    if (typeof data.wo_number === 'string') {
      this.voucherDetailResponse$.wo_number = data.wo_number.trim();
    }

    if (typeof data.EmployeeCode === 'string') {
      this.voucherDetailResponse$.EmployeeCode = data.EmployeeCode.trim();
    }
    if (typeof data.CodeLevel === 'string') {
      this.voucherDetailResponse$.CodeLevel = data.CodeLevel.trim();
    }
    if (typeof data.CodeLevel2 === 'string') {
      this.voucherDetailResponse$.CodeLevel2 = data.CodeLevel2.trim();
    }
    if (typeof data.CodeLevel3 === 'string') {
      this.voucherDetailResponse$.CodeLevel3 = data.CodeLevel3.trim();
    }
    if (typeof data.FunctionCode === 'string') {
      this.voucherDetailResponse$.FunctionCode = data.FunctionCode.trim();
    }
    if (typeof data.CashFlowTag1Code === 'string') {
      this.voucherDetailResponse$.CashFlowTag1Code =
        data.CashFlowTag1Code.trim();
    }
    if (typeof data.CashFlowTag2Code === 'string') {
      this.voucherDetailResponse$.CashFlowTag2Code =
        data.CashFlowTag2Code.trim();
    }
    this.voucherDetailResponse$.VoucherDetailId = data.VoucherDetailId;
    this.tableLength = Object.keys(this.voucherDetailResponse$).length;
  }
  addorUpdate() {
    if (!this.isUpdate) {
      this.saveVoucherDetail();
    } else {
      this.updateVoucherDetail();
    }
  }

  deleteVoucherDetail(EntrySeq: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteVoucherDetail +
          `?VoucherId=${this.VoucherMasterId}&EntrySeq=${EntrySeq}`)
          .subscribe((res) => {
            this.loadVoucherDetails(this.VoucherMasterId);
            this.toastService.sendMessage({
              message: 'Voucher Record Deleted Successfully!',
              type: NotificationType.error,
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

    this.Masterform.markAsUntouched();
  }

  refresh() {
    this.isUpdate = false;
    // this.Masterform.reset();
    this.Detailform.reset();
    this.voucherDetailResponse$.AccountCode = null;
    this.voucherDetailResponse$.AssetCode = null;
    this.voucherDetailResponse$.PartyCode = null;
    this.voucherDetailResponse$.wo_number = null;
    this.voucherDetailResponse$.EmployeeCode = null;
    this.voucherDetailResponse$.CodeLevel = null;
    this.voucherDetailResponse$.CodeLevel2 = null;
    this.voucherDetailResponse$.CodeLevel3 = null;
    this.voucherDetailResponse$.FunctionCode = null;
    this.voucherDetailResponse$.CashFlowTag1Code = null;
    this.voucherDetailResponse$.CashFlowTag2Code = null;
    this.loadVoucherDetails(this.VoucherMasterId);
    this.loadAccountTitle();
  }

  resetMasterForm() {
    const exclude: string[] = [
      'InstrumentType',
      'InstrumentDate',
      'FCRate',
      'Currency',
      'Description',
    ];
    Object.keys(this.Masterform.controls).forEach((key) => {
      if (exclude.findIndex((q) => q === key) !== -1) {
        this.Masterform.get(key)?.reset();
      }
    });
  }

  disableDebit() {
    const DebitValue = this.Detailform.get('DebitAmount')?.value;
    const CreditValue = this.Detailform.get('CreditAmount')?.value;
    if (DebitValue > 0) {
      this.isCreditDisabled = true;
      this.Detailform.get('CreditAmount')?.setValue(0);
    } else {
      this.isCreditDisabled = false;
    }

    if (CreditValue > 0) {
      this.isDebitDisabled = true;
      this.Detailform.get('DebitAmount')?.setValue(0);
    } else {
      this.isDebitDisabled = false;
    }
  }
  ChangeCurrency(e:any) {
    debugger
    this.selectedCurrency = e.value;
    this.apiService.get(ApiEndpoints.changeCurrency + `?IsPrimaryCurrency=${this.selectedCurrency}`)
      .subscribe((res: any) => {
        debugger
        let currency = res;
        const isDisabled = currency === 1;

        // Update the enabled/disabled state of the FCRate textbox
        if (isDisabled) {
          this.Masterform.get('FCRate')?.disable();
        } else {
          this.Masterform.get('FCRate')?.enable();
        }

        this.Masterform.patchValue({
          FCRate: currency,
        });
      });
  }

  // ----------New Voucher Button----------
  async CreateNewVoucher() {
    let user = localStorage.getItem('UserId');
    let val = this.voucherResponse$;
    this.masterModel = val;
    this.masterModel.CreatedBy = +user!;
    this.masterModel.FinancialYearCode =
      this.voucherResponse$.FinancialYearCode;
    this.masterModel.FinancialMonthCode =
      this.voucherResponse$.FinancialMonthCode;
    this.masterModel.BranchCode = this.voucherResponse$.BranchCode;
    this.masterModel.ProjectCode = this.voucherResponse$.ProjectCode;
    this.masterModel.VoucherTypeCode = this.voucherResponse$.VoucherTypeCode;
    this.masterModel.VoucherNo = this.voucherResponse$.VoucherNo;
    this.confirmservice.confirm({
      message: 'Are you sure that you want to Create New Voucher?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.apiService.post(this.masterModel, ApiEndpoints.postVoucherMaster + `?`)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'New Voucher Created Successfully!',
              type: NotificationType.success,
            });
            location.reload();

            let res$ = res.data;
            if (res$.length > 0) {
              const voucherid = res$[0].VoucherId;
              localStorage.setItem('VoucherId', voucherid);
              if (voucherid) {
                this.router.navigate(['/dash-board2/voucher-detail'], {
                  queryParams: { VoucherId: voucherid },
                });
                this.loadVoucherMaster(this.VoucherMasterId);
              } else {
                this.toastService.sendMessage({
                  message: 'Cannot create Voucher ID!',
                  type: NotificationType.error,
                });
              }
            } else {
              this.toastService.sendMessage({
                message: 'Error in fetching the Record!',
                type: NotificationType.error,
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
    this.Masterform.reset();
    this.Detailform.reset();
    this.Detailform.markAsUntouched();

  }
  //====get-Next-Voucher====

  LoadNextVoucher() {
    this.apiService.get(ApiEndpoints.GetNextVoucher +
      `?BranchCode=${this.globalBranch}&ProjectCode=${this.globalProjectCode}&VoucherId=${this.globalVoucherId}&VoucherTypeCode=${this.globalVoucherTypeCode}`)
      .subscribe((res: any) => {
        this.Nextvoucher = res;
        Object.assign(this.voucherResponse$, res[0]);

        let nextVoucherMasterId = this.Nextvoucher[0].VoucherId;
        this.loadVoucherMaster(nextVoucherMasterId);
        this.loadVoucherDetails(nextVoucherMasterId);
        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /VoucherId=\d+/,
          `VoucherId=${nextVoucherMasterId}`
        );
        localStorage.setItem('VoucherId', nextVoucherMasterId);
        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }
  //====get-Previous-Voucher====
  LoadPreviousVoucher() {
    this.apiService.get(ApiEndpoints.GetPreviousVoucher +
      `?BranchCode=${this.globalBranch}&ProjectCode=${this.globalProjectCode}&VoucherId=${this.globalVoucherId}&VoucherTypeCode=${this.globalVoucherTypeCode}`)
      .subscribe((res: any) => {
        this.PreviousVoucherresponse$ = res;
        Object.assign(this.voucherResponse$, res[0]);

        const previousVoucherMasterId =
          this.PreviousVoucherresponse$[0].VoucherId;
        this.loadVoucherMaster(previousVoucherMasterId);
        this.loadVoucherDetails(previousVoucherMasterId);

        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(
          /VoucherId=\d+/,
          `VoucherId=${previousVoucherMasterId}`
        );
        localStorage.setItem('VoucherId', previousVoucherMasterId);

        window.history.replaceState({}, '', updatedURL);
        location.reload();
      });
  }




//------------------------------------upload Documnet Working start from here------------------------------------

getGetMaxDocumentId(){

  let BranchCode = this.globalBranchCode;
  let ProjectCode = +this.globalProjectCode;
  let VoucherId = this.globalVoucherId;
  this.documentUploadService.getMaxVoucherDocumentId(BranchCode,ProjectCode,VoucherId).subscribe(
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


ducumentFormInIt(){
  this.UploadDocform = this.fb.group({
    DocumentId: this.fb.control(''),
    ImagePath: this.fb.control(''),
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
  model.ProjectCode = +this.globalProjectCode;
  model.VoucherId = this.globalVoucherId;
  this.apiService
    .get(
      ApiEndpoints.GetAllVoucherDocuments +
        `?BranchCode=${model.BranchCode}&ProjectCode=${model.ProjectCode}&VoucherId=${model.VoucherId}`
    )
    .subscribe((res: any) => {

      this.documentResponse = res.data;
    });
}


saveDocument() {
  let UserId = localStorage.getItem('UserId');
  let model = this.UploadDocform.value;
  model.BranchCode = this.globalBranchCode;
  model.ProjectCode = +this.globalProjectCode;
  model.VoucherId = this.globalVoucherId;
  model.DocumentId = +this.DocumentId;
  model.CreatedBy = UserId;
  model.ImageDirectory = this.ImageDirectory;
  if (this.selectedFiles.length === 0) {
    return;
  }

  this.documentUploadService.saveVoucherDocuments(model, this.selectedFiles).subscribe(() => {
    this.toastService.sendMessage({
      message: 'New Document Saved Successfully!',
      type: NotificationType.success,
    });

    // this.loadAllDocuments();
    this.loadAllDocuments();
    this.UploadDocform.reset();
    this. getGetMaxDocumentId();
    this.selectedFiles = [];
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
let ProjectCode = +this.globalProjectCode;
let VoucherId = this.globalVoucherId;
let DocumentId = data.DocumentId;
  this.documentUploadService

    .viewVoucherDocuments(BranchCode,ProjectCode,VoucherId,DocumentId)
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
data.ProjectCode = +this.globalProjectCode;
data.VoucherId = this.globalVoucherId;
  this.confirmservice.confirm({
    message: 'Are you sure that you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.apiService
        .delete(
          ApiEndpoints.DeleteVoucherDocuments +
            `?BranchCode=${data.BranchCode}&ProjectCode=${data.ProjectCode}&VoucherId=${data.VoucherId}&DocumentId=${data.DocumentId}`
        )
        .subscribe(() => {
          this.toastService.sendMessage({
            message: ' Document Deleted Successfully!',
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
getDoucumnetPaths(){

this.apiService
    .get(
      ApiEndpoints.GetAllPaths +
        '?BranchCode=' + this.globalBranchCode
    )
    .subscribe((res: any) => {

      this.ImageDirectory = res[0].VouchersPath ;
    });
}

}
