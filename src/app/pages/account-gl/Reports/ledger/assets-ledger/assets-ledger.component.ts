import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { VoucherDetailModel } from 'src/app/_shared/model/model';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-assets-ledger',
  templateUrl: './assets-ledger.component.html',
  styleUrls: ['./assets-ledger.component.scss']
})
export class AssetsLedgerComponent implements OnInit {
  form!: FormGroup;
  voucherlist$: any = [];
  Branches: any = [];
  selectBranch: any = null;
  selectedProjectNumber: number = 0;
  projectResponse$: any = [];

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
  assetsResponse$: any = [];
  selectedAssetCode: any = 0;

    //-----------
    selectedStore: any;
    selectedProject: any;
    branchName: any;
    filteredBranches: any;
    AllowedBranches: any;
      isSticky:boolean = false;
  componentName:string = "Asset Ledger";

  constructor( private fb: FormBuilder,
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
      assetsCode: this.fb.control('', Validators.required),

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
    this.loadAssets();

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
    this.selectedProjectNumber = +e.target.value;
  }
  loadUserProjects() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let UserId = +localStorage.getItem('UserId')!;
    this.apiService.get(ApiEndpoints.GetUserProjects + `?BranchCode=${BranchCode}&UserId=${UserId}`)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }
  pintGeneralLedgerReport() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    let assetcode = this.selectedAssetCode;

    this.loading = true;
    //TBD----------------------------------------------------------------
    this.apiservice
      .printGeneralLedgerChartOfAssetsReport(
        this.globalBranchCode,
        this.selectedProject,
        DateFrom,
        DateTo,
        assetcode
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
alResponse$ : any;
 AssetsLedgerReportData() {
    let DateFrom = this.form.get('DateFrom')?.value;
    let DateTo = this.form.get('DateTo')?.value;
    let assetcode = this.selectedAssetCode;
    this.loading = true;
    //TBD----------------------------------------------------------------
    this.apiservice
      .GeneralLedgerChartOfAssetsReportData(
        this.globalBranchCode,
        this.selectedProject,
        DateFrom,
        DateTo,
        assetcode
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.alResponse$ = res.Table;
      });
  }

  changeAsset(e: any) {
    this.selectedAssetCode = e.value;
  }
  loadAssets() {
    this.apiService.get(ApiEndpoints.LoadChartOfAssetsTree)
    .subscribe((res: any) => {
      this.assetsResponse$ = res;
    });
  }

  RefreshVouchersList(){
    this.form.reset();
    this.alResponse$=[];
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
