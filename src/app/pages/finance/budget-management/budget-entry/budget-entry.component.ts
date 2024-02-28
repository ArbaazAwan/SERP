import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-budget-entry',
  templateUrl: './budget-entry.component.html',
  styleUrls: ['./budget-entry.component.scss']
})
export class BudgetEntryComponent implements OnInit {
  componentName:string = 'Budget Entry';
  entryForm!:FormGroup;
  mainDialog:boolean = false;
  isLoadingData:boolean = false;
  budgetStatusList:any;
  budgeCycletListList:any;
  isSticky:boolean = false;
  globalBranchCode!:number;
  globalUserId!:number;
  selectedProject!:number;
  budgetList:any;
  filterDialog: boolean = false;
  filterForm!:FormGroup;
  isFilterApplied:boolean= false;
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _apiService: ApiProviderService,
    private _storeProjectService: StoreProjectService,
    private _toastService: ToastService,
    private _confirmService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    this._storeProjectService.getSelectedOption().subscribe((option: any) => {
      if (option) {
        this.selectedProject = option.ProjectCode;
      }
    });
    this.formInIt();
    this.filterFormInIt();
    this.budgeNameList();
    this.budgetStatusNamesList();
    this.budgetEntryNamesList();
   
  }

  formInIt(){
    this.entryForm = this._fb.group({
      BudgetCycleCode: ['', Validators.required],
      BudgetStatusCode: ['', Validators.required],
    });
  }

filterFormInIt(){
  this.filterForm = this._fb.group({
    BudgetCycleCode: [''],
    BudgetStatusCode: [''],
  });
}
  budgetStatusNamesList() {
    this._apiService
      .get(ApiEndpoints.GetAllBudgetStatus)
      .subscribe((res: any) => {
        
        this.budgetStatusList = res;
      });
  }

  budgeNameList() {
    this.isLoadingData = true;
    this._apiService.get(ApiEndpoints.GetAllBudgetCycle).subscribe({
      next: (res: any) => {
        
        this.budgeCycletListList = res;
        this.isLoadingData = false;
      },
      error: (err) => {
        
      },
    });
  }

  
  budgetEntryNamesList() {
    
    this._apiService
      .get(ApiEndpoints.GetAllBudgetEntry + `?BranchCode=${this.globalBranchCode}&ProjectCode=${this.selectedProject}`)
      .subscribe((res: any) => {
        
        this.budgetList = res;
      });
  }

     //----------------Edit Data Method--------------------------------
     getSelectedRow(data: any) {
      this._router.navigate(['/Finance/budget-entry-details'], {
        queryParams: { BranchCode: this.globalBranchCode, ProjectCode:  this.selectedProject , BudgetCode:  data},
      });
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

 
  openNew(){
    this.mainDialog = true;
  }

  create(){
    
    let model = this.entryForm.value;
    model.BranchCode = this.globalBranchCode;
    model.ProjectCode = this.selectedProject;
    model.CreatedBy = this.globalUserId;
    this._apiService.post(model, ApiEndpoints.AddBudgetEntry).subscribe({
      next: (res: any) => {
        this._router.navigate(['/Finance/budget-entry-details'], {
          queryParams: { BranchCode: this.globalBranchCode, ProjectCode:  this.selectedProject , BudgetCode:  res},
        });
        
        res
        this.budgetEntryNamesList();
        this._toastService.sendMessage({
          message: 'Budget Cycle Saved Successfully',
          type: NotificationType.success,
        });
        this.mainDialog = false;
        this.entryForm.reset();
      },
      error: (err) => {
        this._toastService.sendMessage({
          message: 'Error while saving Budget Cycle!',
          type: NotificationType.error,
        });
      },
    });
   // this._router.navigate(['/Finance/budget-entry-details'])
  }

  delete(BudgetCode:any){
    this._confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confrimation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._apiService
          .delete(ApiEndpoints.DeleteBudgetEntry + '?BudgetCode=' + BudgetCode)
          .subscribe({
            next: (res: any) => {
              this.budgetEntryNamesList();
              this._toastService.sendMessage({
                message: 'Budget Cycle Deleted Successfully!',
                type: NotificationType.deleted,
              });
              this.refresh();
            },
            error: (err: any) => {
              this._toastService.sendMessage({
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

  refresh(){

  }

  //--------------------------------Filters 
  openFilterDialog() {
    this.filterDialog = true;
    this.filterForm.reset();
  }

  clearFilter() {
    this.filterForm.reset();
    this.isFilterApplied = false;
    this.filterDialog = false;
    this.budgetEntryNamesList();
  }

  applyFilter() {
    
    let model = this.filterForm.value;
    model.BranchCode = this.globalBranchCode;
    model.ProjectCode = this.selectedProject;
    model.BudgetCycleCode = this.filterForm.value.BudgetCycleCode || 0;
    model.BudgetStatusCode = this.filterForm.value.BudgetStatusCode || 0;
    this._apiService
      .get(ApiEndpoints.FilterBudgetEntry, model)
      .subscribe({
        next: (res: any) => {
          this.budgetList = res;
          this.filterDialog = false;
          this.filterForm.reset();
          this.filterForm.markAsUntouched();
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: 'Error while filtering Budget Cycle!',
            type: NotificationType.error,
          });
        },
      });
    this.isFilterApplied = true;
  }
}
