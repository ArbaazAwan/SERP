import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.scss'],
})
export class TrialBalanceComponent implements OnInit {
  form!: FormGroup;
  DateFrom: Date = new Date();
  DateTo: Date = new Date();
  trialbalance$: any = [];
  Branches: any = [];
  selectBranch: any = null;
  FinancialYearResponse$: any = [];
  selectedFinancialYear!: number;
  loading = false;
  globalBranchCode!: number;
  ReportType: any;
  financialYears: any;
  minDate!: string;
  maxDate!: string;
  datePipe = new DatePipe('en-US');
  //-----------
  selectedStore: any;
  selectedProject: any;
  branchName: any;
  filteredBranches: any;
  AllowedBranches: any;
  isSticky: boolean = false;
  componentName: string = 'Trial Balance';
  balance: string[] = [
    'All',
    'Opening Only',
    'For The Period',
    'Closing Only',
    '12 Months Comparison Trial'
  ];
  constructor(
    private fb: FormBuilder,
    private apiservice: GlReportsService,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control(''),
      FinancialYearCode: this.fb.control(''),
      Balance: this.fb.control(''),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
    });
    //---------------Branch Code Working Here
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let allowedBranchesString = localStorage.getItem('AllowedBranches')!;
    this.AllowedBranches = JSON.parse(allowedBranchesString);

    if (Array.isArray(this.AllowedBranches)) {
      this.filteredBranches = this.AllowedBranches.filter(
        (branch: { BranchCode: number; BranchName: string }) =>
          branch.BranchCode === BranchCode
      );
      console.log(this.filteredBranches);
    } else {
      console.error('Invalid data in AllowedBranches.');
    }
    this.branchName = this.filteredBranches[0].BranchName;

    //-------------StoreProjectService

    this.storeProjectService.getSelectedOption().subscribe((option: any) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.LoadallBranches();
    this.loadAllFinancialYear();
    this.assignCurrentDateIfEmpty('DateFrom');
    this.assignCurrentDateIfEmpty('DateTo');
  }

  // changeBranch(e: any) {
  //   
  //   this.selectBranch = +e.target.value;
  // }
  BranchName: string = '';
  changeBranch(e: any) {
    
    if (e.value != null) {
      this.selectBranch = e.value.BranchCode;
      this.BranchName = e.value.BranchName;
    } else {
      this.selectBranch = 0;
    }
  }

  changeReportType(e: any) {
    if (e.value != null) {
      this.ReportType = e.value;
    } else {
      this.ReportType = "All";
    }

  }
  LoadallBranches() {
    this.apiservice.getAllBranches().subscribe((res: any) => {
      this.Branches = res;
    });
  }
  changeFinancialYear(e: any) {
    // this.selectedFinancialYear = +e.target.value;
    // this.GetFinancialYearByCode(this.selectedFinancialYear);
    if (e.value != null) {
      this.selectedFinancialYear = e.value.FinancialYearCode;
      this.GetFinancialYearByCode(this.selectedFinancialYear);
    } else {
      this.selectedFinancialYear = 0;
    }
    // this.loadAllFinancialMonth(this.selectedFinancialYear);
  }
  loadAllFinancialYear() {
    this.apiservice.getAllFinancialyear().subscribe((res: any) => {
      this.FinancialYearResponse$ = res.data;
    });
  }
  pintTrialBalanceReport() {
    this.loading = true;
    if(this.form.get('Balance')?.value=='12 Months Comparison Trial'){
      this.apiservice
      .pintTrialBalance12MonthsReport(
        this.selectBranch || 0,
        this.selectedFinancialYear || 0,
        this.ReportType,
        this.BranchName
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
    else{
  this.DateFrom = this.form.get('DateFrom')?.value;
    this.DateTo = this.form.get('DateTo')?.value;
   
    this.apiservice
      .pintTrialBalanceReport(
        this.selectBranch || 0,
        this.selectedFinancialYear || 0,
        this.ReportType || "All",
        this.DateFrom,
        this.DateTo,
        this.BranchName
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
  
  }
  tbResponse$: any;
  LoadTrialBalanceReportData() {
    this.DateFrom = this.form.get('DateFrom')?.value;
    this.DateTo = this.form.get('DateTo')?.value;
    this.loading = true;
    this.apiservice
      .TrialBalanceReportData(
        this.selectBranch || 0,
        this.selectedFinancialYear || 0,
        this.ReportType|| "All",
        this.DateFrom,
        this.DateTo,
        this.BranchName
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.tbResponse$ = res;
      });
  }

  GetFinancialYearByCode(FinancialYearCode: any) {
    this.apiService
      .get(
        ApiEndpoints.getFinancialYearById +
          '?FinancialYearCode=' +
          FinancialYearCode
      )
      .subscribe((res: any) => {
        
        this.financialYears = res[0];
        this.minDate = this.datePipe.transform(res[0].StartDate, 'YYYY-MM-dd')!;
        this.maxDate = this.datePipe.transform(res[0].EndDate, 'YYYY-MM-dd')!;
      });
  }

  RefreshVouchersList() {
    this.form.reset();
    this.tbResponse$ = [];
    this.assignCurrentDateIfRefresh('DateFrom');
    this.assignCurrentDateIfRefresh('DateTo');
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
  //--------------------------------------------
  assignCurrentDateIfEmpty(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value === '') {
      // Use safe navigation operator
      const currentDate = new Date().toISOString().split('T')[0];
      control?.setValue(currentDate); // Use safe navigation operator
    }
  }

  assignCurrentDateIfRefresh(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value != '') {
      const currentDate = new Date().toISOString().split('T')[0];
      control?.setValue(currentDate); // Use safe navigation operator
    }
  }
}
