import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { VoucherDetailModel } from 'src/app/_shared/model/model';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-employee-ledger',
  templateUrl: './employee-ledger.component.html',
  styleUrls: ['./employee-ledger.component.scss']
})
export class EmployeeLedgerComponent implements OnInit {

  form!: FormGroup;
  voucherlist$: any = [];
  Branches: any = [];
  selectBranch: any = null;
  selectedProjectNumber: number = 0;
  projectResponse$: any = [];
  // FinancialYearResponse$: any = [];
  // selectedFinancialYear!: number;
  // selectedFinancialMonthNumber!: number;
  // voucherMonthResponse$: any = [];
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
  employeeResponse$: any = [];
  selectedEmployeeCode: any =0;
    //-----------
    selectedStore: any;
    selectedProject: any;
    branchName: any;
    filteredBranches: any;
    AllowedBranches: any;
    isSticky:boolean = false;
    componentName:string = "Employee Ledger";
  constructor(
    private fb: FormBuilder,
    private apiservice: GlReportsService,
    private apiService: ApiProviderService,

	  private storeProjectService: StoreProjectService,

  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      AccountName: this.fb.control('', Validators.required),
      AccountCode: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
      employeeCode: this.fb.control('', Validators.required),
      FinancialYearCode: this.fb.control('', Validators.required),
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
    this.loadUserProjects();
    this.loadAccountTitle();
    this.loadAccountTitleTo();
    // this.loadAllFinancialYear();
    this.loadEmployee();

    this.assignCurrentDateIfEmpty('DateFrom');
    this.assignCurrentDateIfEmpty('DateTo');
  }
  changeACDescription(e: any) {
    this.selectedAccountCode = e.value;
    let x = this.accountDescriptionResponse$.find((x: VoucherDetailModel) => {
      return this.selectedAccountCode == x.AccountCode;
    });
    Object.assign(this.detailModel, x);
  }
  loadAccountTitle() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.accountDescriptionResponse$ = res;
    });
  }
  changeACTo(e: any) {
    this.selectedAccountCodeTo = e.value;
    let x = this.accountToResponse$.find((x: VoucherDetailModel) => {
      return this.selectedAccountCodeTo == x.AccountCode;
    });
    Object.assign(this.detailModel, x);
  }
  loadAccountTitleTo() {
    this.apiService.get(ApiEndpoints.GetAccountTitle)
    .subscribe((res: any) => {
      this.accountToResponse$ = res;
    });
  }
  changeBranch(e: any) {
    this.selectBranch = +e.target.value;
  }
  LoadallBranches() {
    this.apiService.get(ApiEndpoints.getAllBranches)
    .subscribe((res: any) => {
      this.Branches = res;
    });
  }

   changeProjectCode(e: any) {

    if(e.value != null){
      this.selectedProjectNumber = e.value.ProjectCode;
    }
    else{
      this.selectedProjectNumber = 0;
    }

  }


  loadUserProjects() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let UserId = +localStorage.getItem('UserId')!;

    //api/UserProjects/GetUserProjects?BranchCode=${BranchCode}&UserId=${UserId}
    this.apiService.get(ApiEndpoints.GetUserProjects + `?BranchCode=${BranchCode}&UserId=${UserId}`)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }
  printGeneralLedgerReport() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    let employeecode = this.selectedEmployeeCode;

    this.loading = true;
    this.apiservice
      .printGeneralLedgerEmployeeInfoReport(
        this.globalBranchCode,
        this.selectedProject,
        DateFrom,
        DateTo,
        employeecode
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
  elResponse$:any;
  GeneralLedgerReportData() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    let employeecode = this.selectedEmployeeCode;

    this.loading = true;
    this.apiservice
      .GeneralLedgerEmployeeInfoData(
        this.globalBranchCode,
        this.selectedProject,
        DateFrom,
        DateTo,
        employeecode
      )
      .subscribe((res: any) => {

        this.loading = false
        this.elResponse$ = res.Table;
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

  RefreshVouchersList(){
    this.form.reset();
    this.elResponse$=[];
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

   assignCurrentDateIfEmpty(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value === '') { // Use safe navigation operator
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
