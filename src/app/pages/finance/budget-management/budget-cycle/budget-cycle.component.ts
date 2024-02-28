import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-budget-cycle',
  templateUrl: './budget-cycle.component.html',
  styleUrls: ['./budget-cycle.component.scss'],
})
export class BudgetCycleComponent implements OnInit {
  form!: FormGroup;
  filterForm!: FormGroup;
  componentName: string = 'Budget Cycle';
  mainDialog!: boolean;
  mainHeader!: string;
  isLoadingData: boolean = false;
  budgeCycletList: any[] = [];
  ModulelistResp$: any = [];
  financialYearsResp$: any = [];
  budgetStatus: any = [];
  globalBranchCode!: number;
  globalUserId!: number;
  datePipe = new DatePipe('en-US');
  isUpdate: boolean = false;
  selectedRow: any;
  isSticky: boolean = false;
  Branches: any = [];
  BranchName: string = '';
  selectBranch: any = null;
  selectedProjectNumber: number = 0;
  projectResponse$: any = [];
  minDate!: string;
  maxDate!: string;
  selectedFinancialYear!: number;
  financialYears!: any;
  filterDialog: boolean = false;
  filterHeader!: string;
  isFilterApplied: boolean = false;
  filteredBudgeCycletList: any[] = [];
  isToastShown: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private apiProviderService: ApiProviderService,
    private apiService: GlReportsService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.formInit();

    this.filterForm = this.fb.group({
      BudgetCycleTitle: [''],
      FinacialYearCode: [0],
    });

    const UserId = localStorage.getItem('UserId');
    const ModuleId = 2;
    const FormId = 1;
    this.apiProviderService
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
    this.loadallBranches();
    this.allFinancialYear();
    this.getAllBudgetCycleCode();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
  }

  formInit() {
    this.form = this.fb.group({
      FinacialYearCode: ['', Validators.required],
      BudgetCycleTitle: ['', Validators.required],
      // BudgetCycleCode: [null],
      BranchCode: ['', Validators.required],
      ProjectCode: ['', Validators.required],
      DateFrom: ['', Validators.required],
      DateTo: ['', Validators.required],
    });
  }

  loadallBranches() {
    this.apiService.getAllBranches().subscribe((res: any) => {
      this.Branches = res;
    });
  }

  loadUserProjects() {
    let UserId = +localStorage.getItem('UserId')!;
    this.apiService
      .getUserProjects(this.selectBranch, UserId)
      .subscribe((res: any) => {
        this.projectResponse$ = res.data;
      });
  }

  changeBranch(e: any) {
    if (e.value != null) {
      this.selectBranch = e.value;
    } else {
      this.selectBranch = 0;
    }
    this.loadUserProjects();
  }

  changeFinancialYear(e: any) {
    this.GetFinancialYearByCode(e.value);
  }

  GetFinancialYearByCode(FinacialYearCode: any) {
    this.apiProviderService
      .get(
        ApiEndpoints.getFinancialYearById +
          '?FinacialYearCode=' +
          FinacialYearCode
      )
      .subscribe((res: any) => {
        this.financialYears = res[0];
        this.minDate = this.datePipe.transform(res[0].StartDate, 'y-MM-dd')!;
        this.maxDate = this.datePipe.transform(res[0].EndDate, 'y-MM-dd')!;
      });
  }

  allFinancialYear() {
    this.apiProviderService.get(ApiEndpoints.getAllFinancialyear).subscribe({
      next: (res: any) => {
        this.financialYearsResp$ = res.data;
      },
      error: (err) => {
        this.toastService.sendMessage({
          message: 'Error in fetching Financial Year Data!',
          type: NotificationType.error,
        });
      },
    });
  }

  getAllBudgetCycleCode() {
    debugger
    this.isLoadingData = true;
    this.apiProviderService.get(ApiEndpoints.GetAllBudgetCycle).subscribe({
      next: (res: any) => {
        debugger
        this.budgeCycletList = res;
        this.isLoadingData = false;
      },
      error: (err: any) => {
        this.toastService.sendMessage({
          message: 'Error in fetching Budget Cycle Data!',
          type: NotificationType.error,
        });
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }

  save() {
    let model = this.form.value;
    model.CreatedBy = this.globalUserId || 0;
    this.apiProviderService.post(model, ApiEndpoints.AddBudgetCycle).subscribe({
      next: (res: any) => {
        this.getAllBudgetCycleCode();
        this.toastService.sendMessage({
          message: 'Budget Cycle Saved Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
        this.mainDialog = false;
      },
      error: (err: any) => {
        this.toastService.sendMessage({
          message: 'Error while saving Budget Cycle!',
          type: NotificationType.error,
        });
      },
    });
  }

  update() {
    let model = this.form.value;
    model.ModifiedBy = this.globalUserId;
    this.apiProviderService
      .update(model, ApiEndpoints.UpdateBudgetCycle)
      .subscribe({
        next: (res: any) => {
          this.getAllBudgetCycleCode();
          this.toastService.sendMessage({
            message: 'Budget Cycle Updated Successfully!',
            type: NotificationType.success,
          });
          this.refresh();
          this.mainDialog = false;
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error while Updating Budget Cycle!',
            type: NotificationType.error,
          });
        },
      });
  }

  delete(id: any) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confrimation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiProviderService
          .delete(ApiEndpoints.DeleteBudgetCycle + '?BudgetCycleCode=' + id)
          .subscribe({
            next: (res: any) => {
              this.getAllBudgetCycleCode();
              this.toastService.sendMessage({
                message: 'Budget Cycle Deleted Successfully!',
                type: NotificationType.deleted,
              });
              this.refresh();
            },
            error: (err: any) => {
              this.toastService.sendMessage({
                message: 'Error while Deleting Budget Cycle!',
                type: NotificationType.error,
              });
            },
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

  openNew(event?: any, action?: string) {
    if (action === 'add') {
      this.form.reset();
      this.mainHeader = 'Add New Budget Cycle Information';
      this.mainDialog = true;
      this.isUpdate = false;
    } else if (action === 'edit') {
      this.mainHeader = 'Edit Budget Cycle Information';
      this.mainDialog = true;
      this.isUpdate = true;
      event.DateFrom = this.datePipe.transform(event.DateFrom, 'y-MM-dd');
      event.DateTo = this.datePipe.transform(event.DateTo, 'y-MM-dd');
      this.selectBranch = event.BranchCode;
      this.selectedProjectNumber = event.ProjectCode;
      this.loadUserProjects();
      this.form.patchValue({ ...event });
      this.selectedRow = event;
    }
  }

  hideDialog() {
    this.mainDialog = false;
    this.form.reset();
  }

  refresh() {
    this.formInit();
    this.form.markAsUntouched();
    this.form.reset();
  }

  openFilterDialog() {
    this.filterDialog = true;
    this.filterHeader = 'Filter Budget Cycle';
    this.filterForm.reset();
  }

  clearFilter() {
    this.filterForm.reset();
    this.isFilterApplied = false;
    this.filteredBudgeCycletList = [];
    this.filterDialog = false;
  }

  applyFilter() {
    let filterValues = this.filterForm.value;
    filterValues.FinacialYearCode = this.filterForm.value.FinacialYearCode || 0;
    this.apiProviderService
      .get(ApiEndpoints.FilterBudgetCycle, filterValues)
      .subscribe({
        next: (res: any) => {
          this.filteredBudgeCycletList = res;
          this.filterDialog = false;
          this.filterForm.reset();
          this.filterForm.markAsUntouched();
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error while filtering Budget Cycle!',
            type: NotificationType.error,
          });
          this.filterDialog = false;
          this.filterForm.reset();
          this.filterForm.markAsUntouched();
        },
      });
    this.isFilterApplied = true;
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
