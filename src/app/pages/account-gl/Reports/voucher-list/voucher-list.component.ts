import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { AbbreviationPipe } from 'src/app/_shared/pipe/abbreviation.pipe';
import { RoundoffPipe } from 'src/app/_shared/pipe/roundoff.pipe';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss'],
  providers: [AbbreviationPipe,DatePipe,RoundoffPipe],
})
export class VoucherListComponent implements OnInit {
  form!: FormGroup;
  componentName:string = "Voucher List"
  voucherlist$: any = [];
  Branches: any = [];
  selectBranch: number = 0;
  selectedProjectNumber: number =0;
  projectResponse$: any = [];
  selectedVoucherNumber:number =0;
  voucherTypeResponse$: any = [];
  loading = false;
  selectedFinancialYear : number= 0 ;
  FinancialYearResponse$: any;
  FinancialMonthResponse$:any;
  FinancialMonthCode : number = 0
  selectedStore: number = 0;
  selectedProject: number = 0;
  filteredBranches:any;
  branchName:any;
  tableLength!: number;
  AllowedBranches: any = [];
  DateFrom:Date = new Date();
  DateTo : Date = new Date();
  currencyName:string = "";
  constructor(private fb: FormBuilder, private apiservice: GlReportsService,    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService, private router: Router,) {}

  ngOnInit(): void {
    
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      VoucherTypeCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required)
    
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
     //-----------------------Ends Here


     this.storeProjectService.getSelectedOption().subscribe((option: any) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    this.LoadallBranches();
    this.loadUserVoucherTypes();
    this.loadAllFinancialYear();
    this.loadCurrencyName();
  }
  selectBranchName : string = ''
  changeBranch(e: any) {
    
    if(e.value != null){
      this.selectBranch = e.value.BranchCode;
      this.selectBranchName = e.value.BranchName;
    }
    else{
      this.selectBranch = 0;
    }

    this.loadUserProjects();
  }
  LoadallBranches() {
    this.apiservice.getAllBranches().subscribe((res: any) => {
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
    
    let UserId = +localStorage.getItem('UserId')!;

    this.apiservice
      .getUserProjects(this.selectBranch, UserId)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }
  changeVoucherType(e: any) {
    if(e.value != null){
      this.selectedVoucherNumber =e.value.VoucherTypeCode;
    }
    else{
      this.selectedVoucherNumber = 0;
    }
  }

  loadUserVoucherTypes() {
    let UserId = +localStorage.getItem('UserId')!;

    this.apiservice.getUserVoucherTypes(UserId).subscribe((res: any) => {
      this.voucherTypeResponse$ = res.data;
    });
  }
  changeFinancialYear(e: any) {
    this.selectedFinancialYear = e.value.FinancialYearCode;
    this.loadAllFinancialMoths();
  }
  changeFinancialMonth(e: any) {
    this.FinancialMonthCode = e.target.value;
  }
  loadAllFinancialYear() {
    this.apiservice.getAllFinancialyear().subscribe((res:any) => {
      this.FinancialYearResponse$ = res.data;
      this.loadAllFinancialMoths()
    });
  }
  loadAllFinancialMoths() {
    // 
    this.apiservice.getAllFinancialMonth(this.selectedFinancialYear).subscribe((res:any) => {
      // 
      this.FinancialMonthResponse$ = res.data;
    });
  }

  printVoucherReport() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.DateFrom = this.form.get('DateFrom')?.value;
    this.DateTo = this.form.get('DateTo')?.value;
    this.loading = true;
    this.apiservice
      .GetVoucherListReport(this.selectedProject, this.selectedVoucherNumber, this.DateFrom,this.DateTo, this.branchName,BranchCode)
      .subscribe((pdf: any) => {
        const file = new Blob([pdf], {
          type: 'application/pdf',
        });
        this.loading = false;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }
  voucherResponse$:any = ''
  isLoadingData : boolean = false
  // loadVouchersList(){
  //   let BranchCode = +localStorage.getItem('BranchCode')!;
  //   this.DateFrom = this.form.get('DateFrom')?.value;
  //   this.DateTo = this.form.get('DateTo')?.value;
  //   this.isLoadingData = true
  //   this.apiservice.GetVoucherListReportData(this.selectedProject, this.selectedVoucherNumber, this.DateFrom,this.DateTo, this.branchName,BranchCode)
  //     .subscribe((res: any) => {
        
  //       this.isLoadingData = false
  //       this.voucherResponse$ = res;
  //     });
  // }

  loadVouchersList() {

   
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.DateFrom = this.form.get('DateFrom')?.value;
    this.DateTo = this.form.get('DateTo')?.value;
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetVoucherMastersList_ForEditListForm +
      `?BranchCode=${BranchCode}&ProjectCode=${this.selectedProject}&VoucherTypeCode=${this.selectedVoucherNumber}&DateFrom=${this.DateFrom}&DateTo=${this.DateTo}`)
      .subscribe((res: any) => {
        debugger
        this.voucherResponse$ = res.data;
      this.voucherResponse$;
        this.isLoadingData = false;
      });
     
  }


  RefreshVouchersList(){
   this.form.reset();
   this.voucherResponse$=[];
  }

  // getSelectedRow(data: any) {
  //   this.voucherResponse$ = data;
  //   if (data) {
  //     let x = data.VoucherId;
  //     let y = data.ProjectCode;
  //     let z = data.VoucherTypeCode;
  //     localStorage.setItem('VoucherId', x);
  //     localStorage.setItem('ProjectCode', y);
  //     localStorage.setItem('VoucherTypeCode', z);
  //     this.router.navigate(['/Accounts/voucher-detail'], {
  //       queryParams: { VoucherId: x },
  //     });
  //   }
  //   this.tableLength = Object.keys(this.voucherResponse$).length;
  // }


  
  getSelectedRow(data: any) {
    debugger
    this.voucherResponse$ = data;
    if (data) {
      let x = data.VoucherId;
      let y = data.ProjectCode;
      let z = data.VoucherTypeCode;
      localStorage.setItem('VoucherId', x);
      localStorage.setItem('ProjectCode', y);
      localStorage.setItem('VoucherTypeCode', z);
      this.router.navigate(['/Accounts/voucher-detail'], {
        queryParams: { VoucherId: x,
          ProjectCode:this.selectedProject,
          VoucherTypeCode: this.selectedVoucherNumber
          ,
        edit:"edit" },
      });
    }
    this.tableLength = Object.keys(this.voucherResponse$).length;
  }


  loadCurrencyName() {
    this.apiService
      .get(ApiEndpoints.GetPrimaryCurrencyTitle)

      .subscribe((res: any) => {
        
        this.currencyName = res[0].CurrencyTitle;
      });
  }
}
