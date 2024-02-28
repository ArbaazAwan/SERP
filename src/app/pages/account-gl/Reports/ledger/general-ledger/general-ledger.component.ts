import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { VoucherDetailModel } from 'src/app/_shared/model/model';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-general-ledger',
  templateUrl: './general-ledger.component.html',
  styleUrls: ['./general-ledger.component.scss'],
})
export class GeneralLedgerComponent implements OnInit {
  form!: FormGroup;
  DateFrom:Date = new Date();
  DateTo : Date = new Date();
  voucherlist$: any = [];
  Branches: any = [];
  selectBranch: any = null;
  isSticky : boolean = false;
  selectedProjectNumber: number = 0;
  projectResponse$: any = [];
  componentName:string = 'General Ledger';
  globalBranchCode!: number;
  generalresponse: any = [];
  accountDescriptionResponse$: any = [];
  accountToResponse$: any = [];
  voucherDetailResponse$: any = [];
  voucherDetailToResponse$: any = [];
  selectedAccountCode: any = [];
  selectedAccountCodeTo: any = [];
  detailModel: any = [];
  loading = false;
  totalCr:number = 0;
  totalDr:number = 0;
  totalBlnc1:number = 0;
  totalBlnc2:number = 0;
  totalCr2:number = 0;
  totalDr2:number = 0;
  AccountName1:string='';
  AccountName2:string='';
  //-----------
  selectedStore: any;
  selectedProject: any;
  branchName: any;
  filteredBranches: any;
  AllowedBranches: any;
  glResponse$:any = [];
  glResponse2$:any = [];
  constructor(
    private fb: FormBuilder,
    private apiservice: GlReportsService,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService,
  ) {}

  ngOnInit(): void {
    
    this.form = this.fb.group({
      BranchCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
      AccountCodeFrom: this.fb.control('', Validators.required),
      AccountCodeTo: this.fb.control('', Validators.required),
    });
       //---------------Branch Code Working Here
       let BranchCode = +localStorage.getItem('BranchCode')!;
       let allowedBranchesString = localStorage.getItem('AllowedBranches')!;
       this.AllowedBranches = JSON.parse(allowedBranchesString);
       
       if (Array.isArray(this.AllowedBranches)) {
         this.filteredBranches = this.AllowedBranches.filter((branch: { BranchCode: number; BranchName: string }) => branch.BranchCode === BranchCode);
         console.log(this.filteredBranches);
       } else {
         console.error('Invalid data in AllowedBranches.');
       }
       this.branchName =  this.filteredBranches[0].BranchName;
     
     
     //-------------StoreProjectService
     
       this.storeProjectService.getSelectedOption().subscribe((option: any) => {
        if (option) {
          this.selectedStore = option.DepartmentCode;
          this.selectedProject = option.ProjectCode;
        }
      });
      
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.LoadallBranches();
    this.loadAccountTitle();
    this.loadAccountTitleTo();
    
    // this.loadAllFinancialYear();

    this.assignCurrentDateIfEmpty('DateFrom');
    this.assignCurrentDateIfEmpty('DateTo');
  }
  // changeACDescription(e: any) {
  //   this.selectedAccountCode = e.value;
  //   let x = this.accountDescriptionResponse$.find((x: VoucherDetailModel) => {
  //     return this.selectedAccountCode == x.AccountCode;
  //   });
  //   Object.assign(this.detailModel, x);
  // }

  changeACDescription(e: any) {
    
    if(e.value != null){
      this.selectedAccountCode = e.value.AccountCode;
      this.AccountName1 = e.value.AccountName;
    }
    else{
      this.selectedAccountCode = 0;
    }

  }

  loadAccountTitle() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.accountDescriptionResponse$ = res.data;
    });
  }
  // changeACTo(e: any) {
  //   this.selectedAccountCodeTo = e.value;
  //   let x = this.accountToResponse$.find((x: VoucherDetailModel) => {
  //     return this.selectedAccountCodeTo == x.AccountCode;
  //   });
  //   Object.assign(this.detailModel, x);
  // }
  changeACTo(e: any) {
    
    if(e.value != null){
      this.selectedAccountCodeTo = e.value.AccountCode;
      this.AccountName2 = e.value.AccountName;
    }
    else{
      this.selectedAccountCodeTo = 0;
    }

  }
  loadAccountTitleTo() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.accountToResponse$ = res.data;
    });
  }
  // changeBranch(e: any) {
  //   this.selectBranch = +e.target.value;
  //   this.loadUserProjects();
  // }

  BranchName : string = ''
  changeBranch(e: any) {
    
    if(e.value != null){
      this.selectBranch = e.value.BranchCode;
      this.BranchName = e.value.BranchName;
    }
    else{
      this.selectBranch = 0;
    }
    this.loadUserProjects()
  }

  LoadallBranches() {
    this.apiservice.getAllBranches().subscribe((res: any) => {
      this.Branches = res;
    });
  }
  // changeProjectCode(e: any) {
  //   this.selectedProjectNumber = +e.target.value;
  // }

  changeProjectCode(e: any) {
    
    if(e.value != null){
      this.selectedProjectNumber = e.value.ProjectCode;
    }
    else{
      this.selectedProjectNumber = 0;
    }

  }

  loadUserProjects() {
    let UserId = +localStorage.getItem('UserId')!;

    this.apiservice
      .getUserProjects(this.selectBranch, UserId)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }
  
  pintGeneralLedgerReport() {
    this.DateFrom = this.form.get('DateFrom')?.value;
    this.DateTo = this.form.get('DateTo')?.value;
    let AccountCodeFrom = this.selectedAccountCode || 0;
    let AccountCodeTo = this.selectedAccountCodeTo || 0;
    this.loading = true;
    this.apiservice
      .pintGeneralLedgerReport(
        this.selectBranch || 0,
        this.BranchName,
        this.selectedProjectNumber || 0,
        this.DateFrom,
        this.DateTo,
        AccountCodeFrom,
        AccountCodeTo
      )
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.form.get('AccountCodeFrom')!.value
      });
  }

  //--------------------------------------------
  assignCurrentDateIfEmpty(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value === '') { // Use safe navigation operator
      const currentDate = new Date().toISOString().split('T')[0];
      control?.setValue(currentDate); // Use safe navigation operator
    }
  }


  
  isLoadingData : boolean = false
  loadGeneralLedgerReportData(){
    
    this.DateFrom = this.form.get('DateFrom')?.value;
    this.DateTo = this.form.get('DateTo')?.value;
    let AccountCodeFrom = this.selectedAccountCode || 0;
    let AccountCodeTo = this.selectedAccountCodeTo || 0;
    this.loading = true;
    this.apiservice.GeneralLedgerReportData(
      this.selectBranch || 0,
      this.BranchName,
      this.selectedProjectNumber || 0,
      this.DateFrom,
      this.DateTo,
      AccountCodeFrom,
      AccountCodeTo)
      .subscribe((res: any) => {
        
        this.totalCr = 0;
        this.totalDr = 0
        this.loading = false

        this.glResponse$ = res.filter((item:any) => item.AccountName === this.AccountName1);
        this.glResponse2$ = res.filter((item:any) => item.AccountName === this.AccountName2);
debugger
        
        this.calculateBalanceAcc1();
        this.calculateBalanceAcc2();
       
        if (this.glResponse$ && this.glResponse$.length > 0) {
          this.totalCr = 0;
          this.totalDr = 0;
          this.totalBlnc1 =0
          for (let i = 0; i < this.glResponse$.length; i++) {
            this.totalCr += +this.glResponse$[i].CreditAmount;
            this.totalDr += +this.glResponse$[i].DebitAmount;
            this.totalBlnc1 += +this.glResponse$[i].Balance;
          }
        }

        //---------------------------------------------------------------
        if (this.glResponse2$ && this.glResponse2$.length > 0) {
          this.totalCr2 = 0;
          this.totalDr2 = 0;
          this.totalBlnc2 = 0;
          for (let i = 0; i < this.glResponse2$.length; i++) {
            this.totalCr2 += +this.glResponse2$[i].CreditAmount;
            this.totalDr2 += +this.glResponse2$[i].DebitAmount;
            this.totalBlnc2 += +this.glResponse2$[i].Balance;
          }
        }
      });
  }

  calculateBalanceAcc1() {
    this.glResponse$.forEach((item:any) => {
      item.Balance = item.DebitAmount - item.CreditAmount;
    });
  }

  calculateBalanceAcc2() {
    this.glResponse2$.forEach((item:any) => {
      item.Balance = item.DebitAmount - item.CreditAmount;
    });
  }

  RefreshVouchersList(){
   this.form.reset();
   this.glResponse$=[];
   this.glResponse2$=[];
   this.totalCr = 0;
   this.totalDr = 0
   this.assignCurrentDateIfRefresh('DateFrom');
   this.assignCurrentDateIfRefresh('DateTo');
  }

  assignCurrentDateIfRefresh(controlName: string){
    
    const control = this.form.get(controlName);
    if (control?.value!= '') {
      const currentDate = new Date().toISOString().split('T')[0];
      control?.setValue(currentDate); // Use safe navigation operator
    }
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

}
