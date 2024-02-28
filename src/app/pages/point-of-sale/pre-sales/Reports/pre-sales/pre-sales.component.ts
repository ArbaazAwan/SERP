import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { PosReportsService } from 'src/app/_shared/services/pos-reports.service';


@Component({
  selector: 'app-pre-sales',
  templateUrl: './pre-sales.component.html',
  styleUrls: ['./pre-sales.component.scss']
})
export class PreSalesComponent implements OnInit {

  form!: FormGroup;
  profitandLoss: any = [];
  Branches: any = [];
  selectBranch: number = 0;
  branchName: string = '';
  selectedProjectNumber: any = null;
  projectResponse$: any = [];
  loading = false;

  constructor(private fb: FormBuilder, private apiservice: PosReportsService) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
    });
    this.LoadallBranches();
  }
  changeBranch(e: any) {
    
    if(e.value != null){
      this.selectBranch = e.value.BranchCode;
      this.branchName = e.value.BranchName;
    }
    else{
      this.selectBranch = 0;
    }

  }
  LoadallBranches() {
    this.apiservice.getAllBranches().subscribe((res: any) => {
      this.Branches = res;
    });
  }


  PintPreSalesReport() {

    this.loading = true;
    this.apiservice
      .PreSalesReport(
        this.selectBranch,
        this.branchName,

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

  psResponse$: any;

  LoadPreSalesData() {
    this.loading = true;
    this.apiservice
      .PreSalesReportData(
        this.selectBranch,
        this.branchName,
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.psResponse$ = res;
      });
  }


  RefreshVouchersList(){
    this.form.reset();
    this.psResponse$=[];

   }

}
