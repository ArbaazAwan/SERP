import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss'],
})
export class BalancesheetComponent implements OnInit {
  form!: FormGroup;
  balanceSheet: any = [];
  Branches: any = [];
  selectBranch: any = null;
  selectedProjectNumber: any = null;
  projectResponse$: any = [];
  loading = false;
  selectFinancialyear: any;
  financialyear: any = [];
    //-----------
    selectedStore: any;
    selectedProject: any;
    branchName: any;
    filteredBranches: any;
    AllowedBranches: any;
      isSticky:boolean = false;
  componentName:string = "Balance Sheet Report";
  globalBranchCode!:number;

  constructor(
    private fb: FormBuilder,
    private apiservice: GlReportsService,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService,
    ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      FinancialYearCode: this.fb.control('', Validators.required),
      DateTo: this.fb.control('', Validators.required),
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
    this.loadUserProjects();
    this.LoadallBranches();
    this.LoadallFinancialYear();
    this.assignCurrentDateIfEmpty('DateTo');
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
    this.selectedProjectNumber = +e.target.value;
  }

  loadUserProjects() {
    this.apiService.get(ApiEndpoints.getAllProject)
    .subscribe((res: any) => {
      this.projectResponse$ = res;
    });
  }
//   changeFinancialYear(e: any) {
//     this.selectFinancialyear = +e.target.value;
  
// }

changeFinancialYear(e: any) {
  if (e.value != null) {
    this.selectFinancialyear = e.value;
  } else {
    this.selectFinancialyear = 0;
  }
}
  LoadallFinancialYear() {
    this.apiService.get(ApiEndpoints.getAllFinancialyear)
    .subscribe((res: any) => {
      this.financialyear = res.data;
    });
  }
  pintBalanceSheetReport() {
    let DateTo = this.form.get('DateTo')?.value;

    if (this.selectBranch === null) {
      this.selectBranch = 0;
    } else {
      this.selectBranch;
    }
    if (this.selectedProjectNumber === null) {
      this.selectedProjectNumber = 0;
    } else {
      this.selectedProjectNumber;
    }
    this.loading = true;
    //TBD----------------------------------------------------------------
    this.apiservice.printBalanceSheetReport(
      this.globalBranchCode,
      this.selectedProject,
      this.selectFinancialyear,
      DateTo
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

  bsResponse$: any;

 LoadBalanceSheetReport() {
    let DateTo = this.form.get('DateTo')?.value;

    if (this.selectBranch === null) {
      this.selectBranch = 0;
    } else {
      this.selectBranch;
    }
    if (this.selectedProjectNumber === null) {
      this.selectedProjectNumber = 0;
    } else {
      this.selectedProjectNumber;
    }
    this.loading = true;
    this.apiservice.BalanceSheetReportData(
      this.globalBranchCode,
      this.selectedProject,
      this.selectFinancialyear,
      DateTo
      )
      .subscribe((res: any) => {
        this.bsResponse$ = res;
        this.loading = false;

      });
  }

  RefreshVouchersList(){
    this.form.reset();
    this.bsResponse$=[];
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
  		//--------------------
		
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
