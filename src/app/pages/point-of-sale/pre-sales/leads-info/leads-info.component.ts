import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { LeadDetailModel, LeadMasterModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { LeadsInfoService } from 'src/app/_shared/services/leads-info.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';
@Component({
  selector: 'app-leads-info',
  templateUrl: './leads-info.component.html',
  styleUrls: ['./leads-info.component.scss'],
  providers: [DateFormatPipe,DatePipe],

})
export class LeadsInfoComponent implements OnInit {
  Masterform!: FormGroup;
  RemarksForm!: FormGroup;
  Detailform!: FormGroup;

  modelMaster!: LeadMasterModel;
  modelDetail!: LeadDetailModel;
  routeLeadCode: number = 0;

  MasterResponse$: any = [];
  LeadMasterResponse$: any = [];
  LeadDetailResponse$: any = [];
  LeadRemarks: any = [];
  DetailTableResponse$: any = [];

  isUpdate!: boolean;
  tableLength!: number;

  CustomerResponse$: any = [];
  LeadsMasterMAxCode: any = [];
  remarksBtnUpdate: boolean = false;
  stagesresponse$: any = [];
  StagePercentageresponse$: any = [];
  Statusresponse$: any = [];
  LevelOfInterestresponse$: any = [];
  selectedStage!: number;
  selectedStatus!: number;
  selectedLevelOfInterest!: number;
  RemarksDialogue: boolean = false;

  isLoadingData: boolean = false;

  // CustomerForm
  customerform!: FormGroup;
  customerResponse$: any = [];
  remarksResponse: any = [];
  selectedCustomers!: number;
  header!: string;
  saveorUpdate!: string;
  submitted!: boolean;
  productDialog!: boolean;
  headerCustomer: string = 'Add new Customer';
  productDialogStage!: boolean;
  productDialogDocuments!: boolean;
  headerStage: string = 'Add new Stage';
  headerDocuments: string = 'You Can View Documents';
  productDialogStatus!: boolean;
  headerStatus: string = 'Add new Status';
  productDialogLevelOfInterest!: boolean;
  headerLevelOfInterest: string = 'Add new Level Of Interest';
  displayHeader = 'd-none'
  selectedFile!: File;
  fileName!: string;
  selectedFiles: File[] = [];
  editableData: any;
  datePipe = new DatePipe('en-US');
  shouldReloadDocuments = true;
  globalBranchCode!: number;
  getleadcode!: number;
  selectedOwnerCode: number = 0;
  saveDisabled: boolean = false;
  MasterDetailResponse$: any = [];
  stepCode: any;
  globalLeadCode: any = [];
  routeEmployeeCode: any;
  FiltersDialogue: boolean = false;
  saleTypeResponse$: any;
  selectedDocType: number = 0;
  leadOpportunityList: any = []
  OpportunityCode: number = 0
  openStatusLeadOpportunities: any = []
  selectedAccountManager: number =0
  AccountManagerCode : number = 0
  allAccountManagers: any = []
  globalUserCode!:number;
  uploadDoc: boolean = false;
  displayDocumentDialog: boolean = false;
 UploadDocform!:FormGroup;
 documentResponse:any;
 imagePathOnServer!: string;
 DocumentId:any;
 ImageDirectory:any;
//For date Formate Working
 selectedFormatKey!: number;
  constructor(
    private fb: FormBuilder,
    private apiServices: LeadsInfoService,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private leadInfoService: LeadsInfoService,
    private datesPipe: DatePipe,
    private documentUploadService:DocumentUploadService,
    private dateFormatPipe:DateFormatPipe,
  ) { }

  ngOnInit(): void {

    this.Masterform = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      LeadCode: this.fb.control('', Validators.required),
      LeadName: this.fb.control('', Validators.required),
      PartyCode: this.fb.control('', Validators.required),
      ContactPerson: this.fb.control('', Validators.required),
      Period: this.fb.control('', Validators.required),
      Duration: this.fb.control('', Validators.required),
      StartDate: this.fb.control('', Validators.required),
      ClosingDate: this.fb.control('', Validators.required),
      PotentialAmount: this.fb.control('', Validators.required),
      LevelOfInterestCode: this.fb.control('', Validators.required),
      StatusCode: this.fb.control('', Validators.required),
      GrossProfitPercentage: this.fb.control('', Validators.required),
      TotalAmount: this.fb.control('', Validators.required),
      Remarks: this.fb.control('', Validators.required),
      AccountManagerCode : this.fb.control('')
    });
    this.ducumentFormInIt();
    this.RemarksForm = this.fb.group({
      LeadCode: this.fb.control('', Validators.required),
      StepCode: this.fb.control('', Validators.required),
      Remarks: this.fb.control('', Validators.required),
      UserId: this.fb.control('', Validators.required),
    });

    this.Detailform = this.fb.group({
      LeadCode: this.fb.control('', Validators.required),
      StepCode: this.fb.control('', Validators.required),
      StageCode: this.fb.control('', Validators.required),
      StepDate: this.fb.control('', Validators.required),
      AccountManagerName: this.fb.control('', Validators.required),
      LeadPercentage: this.fb.control('', Validators.required),
      // DocumentType: this.fb.control('', Validators.required),
      Remarks: this.fb.control('', Validators.required),
      ImagePath: this.fb.control('', Validators.required),
      SaleTypeCode: this.fb.control('', Validators.required),
      ReferenceSaleInvoiceNo: this.fb.control('', Validators.required),


    });


    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalLeadCode = +localStorage.getItem('LeadCode')!;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeLeadCode = params['LeadCode'];
      this.routeEmployeeCode = +params['EmployeeCode'];
    });
    this.globalUserCode = +localStorage.getItem('UserId')!;
    if (this.routeEmployeeCode != null) {
      this.selectedOwnerCode = this.routeEmployeeCode;
      this.GetCustomersByEmpCode()
    }
    this.getAllAccountManagers()
    this.getAllLeadOpportunities()
    this.loadMasterInfo(this.globalBranchCode, this.routeLeadCode);
    this.loadAllLeadsDetail(this.getleadcode);
    this.loadAllLeadStages();
    this.loadAllLeadStatus();
    this.loadAllLevelOfInterest();
    this.loadCustomer();
    this.loadSaleTypes();
    this.loadAllEmployee();
    this.loadAllCompanyConfig();
    this.getDoucumnetPaths();
    this.getGetMaxDocumentId();
    this.loadAllDocuments();
    //TBD-------------------------------------------------
    this.editableData = this.apiServices.getEditableData();
    if (this.editableData !== undefined) {
      this.LeadMasterResponse$ = this.editableData;
    }
  }
  loadMasterInfo(BranchCode: number, LeadCode: number) {
    this.apiService.get(ApiEndpoints.GetMasterInfo +
      `?BranchCode=${this.globalBranchCode}&LeadCode=${this.routeLeadCode}`)
      .subscribe((res: any) => {
        this.LeadMasterResponse$ = res;
        this.LeadMasterResponse$[0].StartDate = this.datePipe.transform(this.LeadMasterResponse$[0].StartDate, 'yyyy-MM-dd');
        this.LeadMasterResponse$[0].ClosingDate = this.datePipe.transform(this.LeadMasterResponse$[0].ClosingDate, 'yyyy-MM-dd');
      });
  }
  loadAllLeadsDetail(num: any) {
    this.apiService.get(ApiEndpoints.GetAllLeadDetail + `?LeadCode=${this.routeLeadCode}&BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.DetailTableResponse$ = res.data;
      });
  }
  StatusCode : number = 1
  updateMaster() {

    let model = this.Masterform.value;
    model.BranchCode = this.globalBranchCode!;
    model.StartDate = this.LeadMasterResponse$[0].StartDate;
    model.ClosingDate = this.LeadMasterResponse$[0].ClosingDate;
    model.LeadCode = this.routeLeadCode;
    model.AccountManagerCode = this.AccountManagerCode || 0;
    model.PartyCode = this.selectedCustomers || this.LeadMasterResponse$[0].PartyCode;
    model.LevelOfInterestCode = this.LeadMasterResponse$[0].LevelOfInterestCode;
    model.StatusCode = this.selectedStatus || this.StatusCode;
    model.ModifiedBy = localStorage.getItem('UserId')
    this.apiService.update(model, ApiEndpoints.UpdateLeadMaster + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Leads Info Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadMasterInfo(this.globalBranchCode, this.routeLeadCode);
        this.loadAllLeadsDetail(this.getleadcode);
      });
  }
  saveDetail() {

    let model = this.Detailform.value;
    model.CreatedBy = localStorage.getItem('UserId')
    model.BranchCode = this.globalBranchCode!;
    model.LeadCode = this.routeLeadCode;
    model.StageCode = this.stagesresponse$[0].StageCode;
    model.StepDate = this.datePipe.transform(model.StepDate, 'yyyy-MM-dd');
    model.AccountManagerName = this.Detailform.controls['AccountManagerName'].value;
    model.LeadPercentage = this.LeadDetailResponse$.LeadPercentage;
    model.Remarks = this.LeadDetailResponse$.Remarks;
    model.Doctype = this.selectedDocType;
    if (this.selectedFiles.length != 0) {
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('imagePath', this.selectedFiles[i]);
      }
    }
    this.leadInfoService.postLeadsDetail(model, this.selectedFiles)
      // this.apiService.post(formData , ApiEndpoints.CreateLeadDetail +
      //   `?BranchCode=${model.BranchCode}&LeadCode=${model.LeadCode}&StageCode=${model.StageCode}&StepDate=${model.StepDate}&EmployeeName=${model.EmployeeName}&LeadPercentage=${model.LeadPercentage}&Remarks=${model.Remarks}`)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Leads Info Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadMasterInfo(this.globalBranchCode, this.routeLeadCode);
        this.loadAllLeadsDetail(this.routeLeadCode);
        this.Detailform.reset();
      });
    this.Detailform.markAsUntouched();
  }
  updateDetail() {

    let model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode!;
    model.LeadCode = this.routeLeadCode;
    model.StepCode = this.LeadDetailResponse$.StepCode;
    model.StepDate = this.datePipe.transform(model.StepDate, 'yyyy-MM-dd');
    model.ReferenceSaleTypeCode = this.LeadDetailResponse$.ReferenceSaleTypeCode;
    model.ModifiedBy = localStorage.getItem('UserId')
    this.apiService.update(model, ApiEndpoints.UpdateLeadDetail + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Leads Info Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadMasterInfo(this.globalBranchCode, this.routeLeadCode);
        this.loadAllLeadsDetail(this.routeLeadCode);
      });
    this.isUpdate = false;
    this.refresh();
  }

  getLabel(): string {
    switch (this.LeadMasterResponse$[0].Period) {
      case 'Month':
        return 'Month';
      case 'Week':
        return 'Week';
      case 'Days':
        return 'Days';
      default:
        return 'Days';
    }
  }
  changeCustomers(e: any) {
    this.selectedCustomers = +e.value;
  }
  loadCustomer() {
    this.apiService.get(ApiEndpoints.LoadAllParties)
      .subscribe((res: any) => {
        this.customerResponse$ = res.data;
      });
  }
  // CustomerFormStart

  openNewCustomer() {
    this.header = 'Add Customer';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialog = true;
    this.isUpdate = false;
    this.customerform.reset();
  }
  hideDialogCustomer() {
    this.productDialog = false;
    this.submitted = false;
    this.isUpdate = false;
    //this.GetCustomersByEmpCode();
    // this.customerform.reset();

  }

  // StageForm-Start
  openNewStage() {
    this.header = 'Add Stage';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialogStage = true;
    this.isUpdate = false;
    this.customerform.reset();
  }
  hideDialogStage() {
    this.loadAllLeadStages();
    this.productDialogStage = false;
    this.submitted = false;
    this.customerform.reset();
    this.isUpdate = false;
  }
  // StatusForm-Start
  openNewStatus() {
    this.header = 'Add Status';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialogStatus = true;
    this.isUpdate = false;
    this.customerform.reset();
  }
  hideDialogStatus() {
    this.loadAllLeadStatus();
    this.productDialogStatus = false;
    this.submitted = false;
    this.customerform.reset();
    this.isUpdate = false;
  }
  // LevelOfInterestForm-Start
  openNewLevelOfInterest() {
    this.header = 'Add Status';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialogLevelOfInterest = true;
    this.isUpdate = false;
    this.customerform.reset();
  }
  hideDialogLevelOfInterest() {
    this.loadAllLevelOfInterest();
    this.productDialogLevelOfInterest = false;
    this.submitted = false;
    this.customerform.reset();
    this.isUpdate = false;
  }
  // Documents-Start
  openNewDocuments(data: any) {
    this.shouldReloadDocuments = false;
    localStorage.setItem('LeadCode', data.LeadCode);
    localStorage.setItem('StepCode', data.StepCode);
    this.header = 'You Can View Documents';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialogDocuments = true;
    this.isUpdate = false;
    this.customerform.reset();
  }
  hideDialogDocuments() {
    this.shouldReloadDocuments = true;
    this.productDialogDocuments = false;
    this.submitted = false;
    this.customerform.reset();
    this.isUpdate = false;
  }

  changeStatus(e: any) {
    this.selectedStatus = +e.value;
  }
  changeLevelOfInterest(e: any) {
    this.selectedLevelOfInterest = +e.value;
  }
  loadAllLevelOfInterest() {
    this.apiService
      .get(ApiEndpoints.GetAllLevelOfInterest)
      .subscribe((res: any) => {
        this.LevelOfInterestresponse$ = res.data;
      });
  }
  loadAllLeadStages() {
    this.apiService
      .get(ApiEndpoints.GET_ALL_LeadStages)
      .subscribe((res: any) => {
        this.stagesresponse$ = res.data;
      });
  }
  changeStage(e: any) {
    this.selectedStage = +e.value;
    this.LoadLeadStagePercentage(this.selectedStage);
  }
  LoadLeadStagePercentage(StageCode: number) {
    this.apiService
      .get(ApiEndpoints.GetLeadStagePercentage + '?StageCode=' + StageCode)
      .subscribe((res) => {
        this.StagePercentageresponse$ = res;
        this.LeadDetailResponse$.LeadPercentage = this.StagePercentageresponse$;
      });
  }
  loadAllLeadStatus() {
    this.apiService
      .get(ApiEndpoints.GetAllLeadsStatus)
      .subscribe((res: any) => {
        this.Statusresponse$ = res.data;
      });
  }

  calculateClosingDate() {
    const period = this.LeadMasterResponse$[0].Period;
    const duration = this.LeadMasterResponse$[0].Duration;
    const startDate = new Date(this.LeadMasterResponse$[0].StartDate);

    if (period === 'Days') {
      const closingDate = new Date(startDate);
      closingDate.setDate(startDate.getDate() + Number(duration));
      this.LeadMasterResponse$[0].ClosingDate = closingDate
        .toISOString()
        .substr(0, 10);
    } else if (period === 'Week') {
      const closingDate = new Date(startDate);
      closingDate.setDate(startDate.getDate() + Number(duration) * 7);
      this.LeadMasterResponse$[0].ClosingDate = closingDate
        .toISOString()
        .substr(0, 10);
    } else if (period === 'Month') {
      const closingDate = new Date(startDate);
      closingDate.setMonth(startDate.getMonth() + Number(duration));
      this.LeadMasterResponse$[0].ClosingDate = closingDate
        .toISOString()
        .substr(0, 10);
    }
  }

  calculateTotalAmount() {
    if (JSON.stringify(this.LeadMasterResponse$[0].PotentialAmount).includes(',')) {
      this.LeadMasterResponse$[0].PotentialAmount =
        this.LeadMasterResponse$[0].PotentialAmount.split(',').join('');
    }
    if (JSON.stringify(this.LeadMasterResponse$[0].GrossProfitPercentage).includes(',')) {
      this.LeadMasterResponse$[0].GrossProfitPercentage =
        this.LeadMasterResponse$[0].GrossProfitPercentage.split(',').join('');
    }
    if (this.LeadMasterResponse$[0].PotentialAmount && this.LeadMasterResponse$[0].GrossProfitPercentage) {
      const calculatedTotalAmount =
        (this.LeadMasterResponse$[0].PotentialAmount * this.LeadMasterResponse$[0].GrossProfitPercentage) / 100;
      this.LeadMasterResponse$[0].TotalAmount = calculatedTotalAmount;
    }
  }

  formatInput1(event: any) {
    const formattedValue = event.target.value.replace(/,/g, '');
    this.LeadMasterResponse$[0].PotentialAmount = formattedValue;
  }
  formatInput2(event: any) {
    const formattedValue = event.target.value.replace(/,/g, '');
    this.LeadMasterResponse$[0].GrossProfitPercentage = formattedValue;
  }
  formatInput3(event: any) {
    const formattedValue = event.target.value.replace(/,/g, '');
    this.LeadMasterResponse$[0].TotalAmount = formattedValue;
  }

  selectFiles(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  // GetLeadMasterDetailInfo() {
  //   this.apiServices.getLeadMasterDetailInfo(this.globalBranchCode,leadCode).subscribe((res: any) => {
  //     this.MasterDetailResponse$ = res.data;
  //   });
  // }

  delete(LeadCode: number, StepCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteLeadDetail + `?BranchCode=${this.globalBranchCode}&LeadCode=${LeadCode}&StepCode=${StepCode}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Leads Info Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllLeadsDetail(this.getleadcode);
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

  getSelectedRow(data: any) {

    this.isUpdate = true;
    this.LeadDetailResponse$ = { ...data };

    this.LeadDetailResponse$.StepDate = this.parseAndFormatDate(this.LeadDetailResponse$.StepDate);
    this.tableLength = Object.keys(this.LeadDetailResponse$).length;

    if (this.LeadDetailResponse$.Date) {
      this.Detailform.get('Date')?.setValue(this.LeadDetailResponse$.Date);
    }
  }

  refresh() {

    this.isUpdate = false;
    this.Detailform.reset();
    this.LeadDetailResponse$.StageCode = '';
    this.LeadDetailResponse$.ReferenceSaleTypeCode = '';
  }

  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updateDetail();
    }
  }
  employeeTableResponse: any

  loadAllEmployee() {
    this.apiService.get(ApiEndpoints.EmployeeSetup)
      .subscribe((res: any) => {
        console.log();
        this.employeeTableResponse = res;
      });
  }

  changeLeadOwner(event:any){

    if(event.value != 0 && event.value != null ){
      this.selectedOwnerCode = +event.value;

    }
    else {
      this.selectedOwnerCode = 0
    }
    this.GetCustomersByEmpCode();
  }

  remarks(data:any){

    this.RemarksDialogue = true;
    this.stepCode = data.StepCode;
    this.loadRemarks();
  }
  remarksClose() {
    this.RemarksDialogue = false;
  }

  // postRemarks

  saveRemarks() {
    let model = this.RemarksForm.value;
    model.UserId = +localStorage.getItem('UserId')!;
    model.Remarks = this.RemarksForm.get('Remarks')?.value;
    model.LeadCode = +this.routeLeadCode;
    model.StepCode = +this.stepCode;
    model.BranchCode = +this.globalBranchCode;
    this.leadInfoService.postRemarks(model)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Remarks Saved Successfully!',
          type: NotificationType.success,
        });
        this.RemarksForm.reset();
        this.loadRemarks();
      });

  }


  loadRemarks() {
    let BranchCode = +this.globalBranchCode;
    let LeadCode = +this.routeLeadCode;
    let StepCode = +this.stepCode;
    this.leadInfoService.GetRemarks(BranchCode, LeadCode, StepCode)
      .subscribe((res: any) => {
        this.remarksResponse = res.data;
      });
  }
  getSelectedRemarks(data: any) {
    this.remarksBtnUpdate = true;
    this.LeadRemarks.Remarks = data.Remarks;
    this.LeadRemarks.RemarksId = data.RemarksId;

  }

  UpdateRemarks() {
    let model = this.RemarksForm.value;
    model.UserId = +localStorage.getItem('UserId')!;
    model.Remarks = this.RemarksForm.get('Remarks')?.value;
    model.LeadCode = +this.routeLeadCode;
    model.StepCode = +this.stepCode;
    model.RemarksId = this.LeadRemarks.RemarksId;
    model.BranchCode = +this.globalBranchCode;
    this.leadInfoService.updateRemarks(model)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Remarks Saved Successfully!',
          type: NotificationType.success,
        });
        this.RemarksForm.reset();
        this.loadRemarks();
        this.remarksBtnUpdate = false;
      });
  }

  deleteRemarks(data:any){

    let BranchCode = +this.globalBranchCode;
    let LeadCode = +this.routeLeadCode;
    let LeadStepCode = +this.stepCode;
    let RemarksId = +data;
    this.leadInfoService.deleteRemarks(BranchCode, LeadCode, LeadStepCode, RemarksId)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Leads Info Deleted Successfully!',
          type: NotificationType.error,
        });
        this.loadRemarks();
      });
  }

  GetCustomersByEmpCode() {
    this.leadInfoService.GetCustomersByEmpCode(this.selectedOwnerCode)
      .subscribe((res: any) => {
        this.customerResponse$ = res.data;
      });
  }

  loadSaleTypes() {
    this.apiService.get(ApiEndpoints.GetAllSaleTypes).subscribe((res: any) => {
      this.saleTypeResponse$ = res.data;
    });
  }

  changeDocType(event:any){

    if(event.value != 0 && event.value != 0){
      this.selectedDocType = +event.value;
    }
    else {
      this.selectedDocType = 0;
    }

  }

  getAllLeadOpportunities(): void {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.GetLeadOpportunityList + `?BranchCode=${localStorage.getItem('BranchCode')}&OpportunityCode=0`).subscribe((res: any) => {
      this.leadOpportunityList = res.data
      this.openStatusLeadOpportunities = this.leadOpportunityList.filter((obj: any) => obj.StatusTitle == 'Open')
      this.isLoadingData = false
    })
  }
  leadOpportunity : number =0
  leadOpportunityDetail : any
  isDetail : boolean = false
  getLeadOpportunityDetail(event:any){
    this.isDetail = true
    this.leadOpportunity = event.value
    this.apiService.get(ApiEndpoints.GetLeadOpportunityList + `?BranchCode=${localStorage.getItem('BranchCode')}&OpportunityCode=${this.leadOpportunity}`).subscribe((res:any)=>{
      this.leadOpportunityDetail = res.data[0];
      this.Masterform.controls['Period'].setValue(this.leadOpportunityDetail.Period)
      this.Masterform.controls['Duration'].setValue(this.leadOpportunityDetail.Duration)
      this.Masterform.controls['StartDate'].setValue(this.datePipe.transform(this.leadOpportunityDetail.StartDate, 'yyyy-MM-dd'))
      this.Masterform.controls['ClosingDate'].setValue(this.datePipe.transform(this.leadOpportunityDetail.ClosingDate, 'yyyy-MM-dd'))
      this.Masterform.controls['PotentialAmount'].setValue(this.leadOpportunityDetail.PotentialAmount)
      this.Masterform.controls['GrossProfitPercentage'].setValue(this.leadOpportunityDetail.GrossProfitPercentage)
      this.Masterform.controls['TotalAmount'].setValue(this.leadOpportunityDetail.TotalAmount)
    })
  }

  changeAccountManager(e: any) {
    this.selectedAccountManager = +e.value;
    this.AccountManagerCode = this.selectedAccountManager
  }

  getAllAccountManagers() {
    this.apiService.get(ApiEndpoints.GetAllAccountManagers +
      `?BranchCode=${localStorage.getItem('BranchCode')}`).subscribe((res: any) => {
        this.allAccountManagers = res;
      });
  }


//------------------------------------upload Documnet Working start from here------------------------------------


getGetMaxDocumentId(){

  let BranchCode = this.globalBranchCode;
  let LeadCode = +this.routeLeadCode;
  this.documentUploadService.getMaxLeadDocumentId(BranchCode,LeadCode).subscribe(
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
    DocumentId: this.fb.control('', Validators.required),
    Description: this.fb.control('', Validators.required),
  });
}

// selectFiles(event: any): void {
//   const files: FileList = event.target.files;
//   this.selectedFiles = [];

//   for (let i = 0; i < files.length; i++) {
//     this.selectedFiles.push(files[i]);
//   }
// }
loadAllDocuments() {
  let model = this.UploadDocform.value;
  model.BranchCode = this.globalBranchCode;
  model.LeadCode = this.routeLeadCode;
  this.apiService
    .get(
      ApiEndpoints.GetAllLeadDocuments +
        `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&LeadCode=${model.LeadCode}`
    )
    .subscribe((res: any) => {

      this.documentResponse = res.data;
    });
}

saveDocument() {
  let model = this.UploadDocform.value;
  model.BranchCode = this.globalBranchCode;
  model.LeadCode = this.routeLeadCode;
  model.DocumentId = +this.DocumentId;
  model.CreatedBy = +this.globalUserCode;
  model.ImageDirectory = this.ImageDirectory;
  if (this.selectedFiles.length === 0) {
    return;
  }

  this.documentUploadService.saveLeadDocuments(model, this.selectedFiles).subscribe(() => {
    this.toastService.sendMessage({
      message: 'New Document Saved Successfully!',
      type: NotificationType.success,
    });

    // this.loadAllDocuments();
    this.loadAllDocuments();
    this.UploadDocform.reset();
    this. getGetMaxDocumentId();
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
let LeadCode = +this.routeLeadCode;
let DocumentId = data.DocumentId;
  this.documentUploadService

    .viewLeadDocuments(BranchCode,LeadCode,DocumentId)
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
data.LeadCode = +this.routeLeadCode;
  this.confirmService.confirm({
    message: 'Are you sure that you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.apiService
        .delete(
          ApiEndpoints.DeleteLeadDocuments +
            `?BranchCode=${data.BranchCode}&LeadCode=${data.LeadCode}&DocumentId=${data.DocumentId}`
        )
        .subscribe(() => {
          this.toastService.sendMessage({
            message: 'Document Deleted Successfully!',
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

      this.ImageDirectory = res[0].LeadsPath ;
    });
}


//------------------------------Date Format Working------------------------
loadAllCompanyConfig() {
  this.apiService.get(ApiEndpoints.getAllCompanyConfig).subscribe((res: any) => {
    this.selectedFormatKey = res[0].DateFormatCode;
  });
}
currentDate: Date = new Date();
formatDateForInput(): string {
 return this.dateFormatPipe.transform(this.selectedFormatKey);
}

parseAndFormatDate(dateString: string): Date {

  let targetFormat = 'yyyy-MM-dd';

  const parsedDate: string | null = this.datePipe.transform(dateString, targetFormat);

  if (parsedDate !== null) {
    return new Date(parsedDate);
  } else {
    console.error(`Failed to parse date: ${dateString}`);
    return new Date();
  }
}


}
