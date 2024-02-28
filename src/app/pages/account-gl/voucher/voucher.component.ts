import { ToastService } from 'src/app/_shared/services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VoucherMasterModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { VoucherRepositoryService } from 'src/app/state-mangment/Repositories/voucher-repository.service';
import { combineLatest, take } from 'rxjs';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AbbreviationPipe } from 'src/app/_shared/pipe/abbreviation.pipe';
import { RoundoffPipe } from 'src/app/_shared/pipe/roundoff.pipe';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
  providers: [AbbreviationPipe,DatePipe,RoundoffPipe],
  
})
export class VoucherComponent implements OnInit {
  form!: FormGroup;
  filterForm!: FormGroup;

  projectResponse$: any = [];
  voucherTypeResponse$: any = [];
  voucherMonthResponse$: any = [];
  voucherMonthResponseFilter$: any = [];
  voucherResponse$: any = [];
  voucherYearResponse$: any = [];

  selectedProjectNumber!: number;
  selectedVoucherNumber: number = 0;
  selectedFinancialMonthNumber: number = 0;
  selectedFinancialYear!: number;

  selectedMonth: string = '';

  model!: VoucherMasterModel;
 tableLength!: number; 
  IsPosted: boolean = true;
  IsEnabled: boolean = false;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Voucher';
  isLoadingData: boolean = false;
  selectedStore: number = 0;
  selectedProject: number = 0;
  get formValue() { return this.form.getRawValue() }
  FiltersDialogue: boolean = false;
  AddNewDialogue: boolean = false;
  showClearFilter: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService,
    private voucherRepository: VoucherRepositoryService,
    private utilityService: UtilityService,
    private confirmService: ConfirmationService,
  ) {
    this.formsInit();
  }

  ngOnInit(): void {
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');
    this.storeProjectService.getSelectedOption().subscribe((option: any) => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 19;
    this.apiService
      .get(
        ApiEndpoints.GetUserFormRights +
        '?UserId=' +
        UserId +
        '&ModuleId=' +
        ModuleId +
        '&FormId=' +
        FormId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });

    this.loadUserProjects();
    this.loadUserVoucherTypes();
    this.loadAllFinancialYear();

    this.voucherRepository.restoreState();

    combineLatest(
      this.voucherRepository.getSelectedVoucherTypeCode(),
      this.voucherRepository.getSelectedVoucherFinancialYear(),
      this.voucherRepository.getSelectedVoucherFinancialMonth()
    ).pipe(take(1))
      .subscribe(res => {
        const voucherCode = res[0];
        const financialYearCode = res[1];
        const financialMonthCode = res[2];
        this.selectedVoucherNumber = voucherCode;
        this.selectedFinancialYear = financialYearCode;
        this.selectedFinancialMonthNumber = financialMonthCode;

        this.filterForm.get('VoucherTypeCode')?.setValue(voucherCode);
        this.filterForm.get('FinancialYearCode')?.setValue(financialYearCode);
        this.loadAllFinancialMonth(financialYearCode, true);
        this.filterForm.get('FinancialMonthCode')?.setValue(financialMonthCode);
      });
  }

  formsInit() {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      ProjectCode: this.fb.control('', Validators.required),
      VoucherTypeCode: this.fb.control('', Validators.required),
      FinancialYearCode: this.fb.control('', Validators.required),
      FinancialMonthCode: this.fb.control('', Validators.required),
    });

    this.filterForm = this.fb.group({
      BranchCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      VoucherTypeCode: this.fb.control('', Validators.required),
      FinancialYearCode: this.fb.control('', Validators.required),
      FinancialMonthCode: this.fb.control('', Validators.required),
    });
    this.loadVouchers()
  }

  loadVouchers() {

    if(this.filterForm.invalid){
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.filterForm);
      return;
    }

    let BranchCode = +localStorage.getItem('BranchCode')!;
    let ProjectCode = this.selectedProject;
    let VoucherTypeCode = this.selectedVoucherNumber;
    let FinancialMonthCode = this.selectedFinancialMonthNumber;

    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getVouchers +
      `?BranchCode=${BranchCode}&ProjectCode=${ProjectCode}&VoucherTypeCode=${VoucherTypeCode}&FinancialMonthCode=${FinancialMonthCode}`)
      .subscribe((res: any) => {
        this.voucherResponse$ = res.data;
        this.isLoadingData = false;
        this.FiltersDialogue = false;
        this.showClearFilter = true;
      });
  }


  // Initialize voucherResponse$ with your service method


  get ProjectCode() {
    return this.form.get('ProjectCode');
  }

  loadUserProjects() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    let UserId = +localStorage.getItem('UserId')!;

    this.apiService.get(ApiEndpoints.GetUserProjects + `?BranchCode=${BranchCode}&UserId=${UserId}`)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }

  get VoucherTypeCode() {
    return this.form.get('VoucherTypeCode');
  }

  changeVoucherType(e: any) {
    this.selectedVoucherNumber = +e.value;
    this.voucherRepository.setVoucherTypeCode(this.selectedVoucherNumber);
  }

  loadUserVoucherTypes() {
    let UserId = +localStorage.getItem('UserId')!;

    this.apiService.get(ApiEndpoints.getUserVoucherTypes + `?UserId=${UserId}`)
      .subscribe((res: any) => {
        this.voucherTypeResponse$ = res.data;
      });
  }

  get BranchCode() {
    return this.form.get('BranchCode');
  }

  changeFinancialMonth(e: any, isFilter?: boolean) {
    this.selectedFinancialMonthNumber = +e.value;

    if(isFilter){
      this.voucherRepository.setVoucherFinancialMonth(this.selectedFinancialMonthNumber);
    }
    else{
      const obj = this.voucherMonthResponse$.find((x: any) => {
        return x.FinancialMonthCode === this.selectedFinancialMonthNumber;
      });
      if (obj.IsOpenForEntry) {
        this.IsEnabled = true;
      } else {
        this.IsEnabled = false;
      }
    }
  }

  changeFinancialYear(e: any, isFilter?: boolean) {
    this.selectedFinancialYear = +e.value;
    this.loadAllFinancialMonth(this.selectedFinancialYear, isFilter);

    this.voucherRepository.setVoucherFinancialYear(this.selectedFinancialYear);
  }

  loadAllFinancialMonth(FinancialYearCode: number, isFilter?: boolean) {
    this.apiService.get(ApiEndpoints.getFinancialMonth + `?FinancialYearCode=${FinancialYearCode}`)
      .subscribe((res: any) => {
        if (isFilter) {
          this.voucherMonthResponseFilter$ = res.data;
          this.filterForm.get('FinancialMonthCode')?.setValue(this.selectedFinancialMonthNumber);
          this.loadVouchers();
        }
        else{
          this.voucherMonthResponse$ = res.data;
        }
      });
  }

  loadAllFinancialYear() {
    this.apiService.get(ApiEndpoints.getAllFinancialyear)
      .subscribe((res: any) => {
        this.voucherYearResponse$ = res.data;
      });
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.save();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  filter() {
    this.FiltersDialogue = true;
  }

  hideDialogFilter() {
    this.FiltersDialogue = false;
  }

  addNew() {
    this.AddNewDialogue = true;
  }
  hideaddNew() {
    this.AddNewDialogue = false;
    this.form.reset();
  }

  clearFilter() {
    this.voucherResponse$ = [];
    this.filterForm.reset();
    this.FiltersDialogue = false;
    this.showClearFilter = false;
  }
  refresh(){
    this.filterForm.reset();
  }


  async save() {
    let user = localStorage.getItem('UserId');
    let branchcode = localStorage.getItem('BranchCode');
    let val = this.formValue;
    this.model = val;
    this.model.ProjectCode = this.selectedProject;
    this.model.VoucherTypeCode = this.selectedVoucherNumber;
    this.model.BranchCode = +branchcode!;
    this.model.CreatedBy = +user!;
    this.model.FinancialYearCode = this.selectedFinancialYear;
    this.model.FinancialMonthCode = this.selectedFinancialMonthNumber;
    this.apiService.post(this.model, ApiEndpoints.postVoucherMaster + `?`)
      .subscribe((res: any) => {
        const res$ = res.data;
        if (res$.length > 0) {
          const voucherid = res$[0].VoucherId;
          localStorage.setItem('VoucherId', voucherid);
          if (voucherid) {
            this.router.navigate(['/Accounts/voucher-detail'], {
              queryParams: { VoucherId: voucherid,
                              ProjectCode:this.selectedProject,
                              VoucherTypeCode:this.selectedVoucherNumber }
            });
            this.form.reset();
            this.form.markAsUntouched();
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
  }

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
          VoucherTypeCode:data.VoucherTypeCode
          ,
        edit:"edit" },
      });
    }
    this.tableLength = Object.keys(this.voucherResponse$).length;
  }
 
  delete(VoucherId: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.deleteVoucherMaster +
              '?VoucherId=' +
              VoucherId
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Voucher Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadVouchers();
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
    
    this.form.markAsUntouched();
  }

}
