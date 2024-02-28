import { DatePipe } from '@angular/common';
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
  selector: 'app-hardline-budget',
  templateUrl: './hardline-budget.component.html',
  styleUrls: ['./hardline-budget.component.scss'],
  providers: [DatePipe],
})
export class HardlineBudgetComponent implements OnInit {
  componentName: string = 'Hard Line Budget';
  isSticky!: boolean;
  mainDialog:boolean = false;
  hardlineForm!:FormGroup;
  budgeCycletListList:any;
  isLoadingData:boolean = false;
  globalBranchCode:number = 0;
  selectedProject:number = 0;
  budgetCode:number = 0;
  BudgetCycleCode:any;
  budgeTransferList:any;
  hardlineBudgetMaster!:FormGroup;
  globalUserId:number = 0;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _storeProjectService: StoreProjectService,
    private _apiService: ApiProviderService,
    private _datePipe: DatePipe,
    private _toastService: ToastService,
    private _confirmService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this._storeProjectService.getSelectedOption().subscribe((option: any) => {
      if (option) {
        this.selectedProject = option.ProjectCode;
      }
    });
    
   this.hardlineForm= this._fb.group({
    BudgetCode:[null,Validators.required],
   })
   this.budgetTransferList();
    this.budgetEntryNamesList();
    this. masterFormInIt();
  }


  masterFormInIt(){
    this.hardlineBudgetMaster= this._fb.group({
      BudgetCode:[null],
      TransferDate:[''],
      IsLocked:[false],
      IsApproved:[false],
     })
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



  budgetEntryNamesList() {
    
    this._apiService
      .get(ApiEndpoints.GetAllBudgetEntryLocked + `?BranchCode=${this.globalBranchCode}&ProjectCode=${this.selectedProject}`)
      .subscribe((res: any) => {
        debugger
        this.budgeCycletListList = res;
      });
  }

  budgetTransferList() {
    
    this._apiService
      .get(ApiEndpoints.GetAllHardBudgetTransfer + `?BranchCode=${this.globalBranchCode}&ProjectCode=${this.selectedProject}`)
      .subscribe((res: any) => {
        debugger
        this.budgeTransferList = res;
      });
  }



  onSelectBudget(data:any){
    debugger
    this.budgetCode = data.value;
    this.BudgetCycleCode=this.budgeCycletListList.find((val:any) => val.BudgetCode === this.budgetCode)
  }

  openNew(){
    this.mainDialog = true;
  }


  create(){
    let model = this.hardlineBudgetMaster.value;
    model.BranchCode =this.globalBranchCode;
    model.ProjectCode = this.selectedProject;
    model.BudgetCycleCode = this.BudgetCycleCode.BudgetCycleCode;
    model.BudgetCode =  this.budgetCode;
    model.CreatedBy = this.globalUserId;
    model.LockedBy = this.globalUserId;
    model.TransferDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd')
    model.ApprovedBy = this.globalUserId;
    this._apiService.post(model, ApiEndpoints.CreateBudgetTransfer).subscribe({
      next: (res: any) => {
      this._toastService.sendMessage({
        message: 'Budget Transfer Saved Successfully',
        type: NotificationType.success,
      });
      debugger
      res
      this._router.navigate(['/Finance/hard-line-budget-details'], {
        queryParams: { BranchCode: this.globalBranchCode, ProjectCode:  this.selectedProject , BudgetCode: this.budgetCode,TransferNoteNo: res,BudgetCycleCode:this.BudgetCycleCode.BudgetCycleCode},
      });

    },
      error: (err) => {
        this._toastService.sendMessage({
          message: 'Error while saving Budget Cycle!',
          type: NotificationType.error,
        });
      },

    });
  }

  updateMaster(data: any) {
    this._router.navigate(['/Finance/hard-line-budget-details'], {
      queryParams: { BranchCode: data.BranchCode, ProjectCode:  data.ProjectCode , BudgetCode: data.BudgetCode, TransferNoteNo:  data.TransferNoteNo,BudgetCycleCode:data.BudgetCycleCode},
    });
debugger
  }



  
delete(data: any) {
  debugger
  let model = {
    BranchCode:this.globalBranchCode,
    ProjectCode:this.selectedProject,
    BudgetCode:data.BudgetCode,
    BudgetCycleCode:data.BudgetCycleCode
  }
  this._confirmService.confirm({
    message: 'Are you sure that you want to delete?',
    header: 'Confrimation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this._apiService.delete(ApiEndpoints.DeleteBudgetTransferMaster, model)
        .subscribe({
          next: (res: any) => {
            this._toastService.sendMessage({
              message: 'Budget Transfer Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.budgetTransferList() 

          },
          error: (err: any) => {
            this._toastService.sendMessage({
              message: 'Error while Deleting Budget Transfer!',
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
  this._apiService.delete(ApiEndpoints.DeleteBudgetTransfer, model)
}


refresh(){
  this.hardlineForm.reset();
}
}
