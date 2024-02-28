import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss'],
})
export class ProfitLossComponent implements OnInit {
  form!: FormGroup;
  profitandLoss: any = [];
  Branches: any = [];
  selectBranch: any = null;
  selectedProjectNumber: any = null;
  projectResponse$: any = [];
  loading = false;
  globalBranchCode!:number;

    //-----------
    selectedStore: any;
    selectedProject: any;
    branchName: any;
    filteredBranches: any;
    AllowedBranches: any;
      isSticky:boolean = false;
  componentName:string = "Profit & Loss Report";
  constructor(private fb: FormBuilder, private apiservice: GlReportsService,
    private storeProjectService: StoreProjectService,) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      DateFrom: this.fb.control('', Validators.required),
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
    this.LoadallBranches();
    this.loadUserProjects();

    this.assignCurrentDateIfEmpty('DateFrom');
    this.assignCurrentDateIfEmpty('DateTo');
  }
  changeBranch(e: any) {
    this.selectBranch = +e.target.value;
  }
  LoadallBranches() {
    this.apiservice.getAllBranches().subscribe((res: any) => {
      this.Branches = res;
    });
  }
  changeProjectCode(e: any) {
    this.selectedProjectNumber = +e.target.value;
  }

  loadUserProjects() {
    this.apiservice.getAllProject().subscribe((res: any) => {
      this.projectResponse$ = res;
    });
  }
  pintProfitandLossReport() {
    let DateFrom = this.form.get('DateFrom')?.value;
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
    this.apiservice
      .printProfitandLossReport(
        this.globalBranchCode,
        this.selectedProject,
        DateFrom,
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

  plResponse$: any;

  LoadProfitandLossReportData() {
    let DateFrom = this.form.get('DateFrom')?.value;
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
    this.apiservice
      .ProfitandLossReportData(
        this.globalBranchCode,
        this.selectedProject,
        DateFrom,
        DateTo
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.plResponse$ = res;
      });
  }


  RefreshVouchersList(){
    this.form.reset();
    this.plResponse$=[];
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
