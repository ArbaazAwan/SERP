import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-hardline-budget-details',
  templateUrl: './hardline-budget-details.component.html',
  styleUrls: ['./hardline-budget-details.component.scss'],
  providers: [DatePipe],
})
export class HardlineBudgetDetailsComponent implements OnInit {

  hardlineBudgetMaster!:FormGroup;
  hardlineBudgetDetails!:FormGroup;
  BranchCode: number = 0;
  ProjectCode: number = 0;
  BudgetCode: number = 0;
  BudgetCycleCode:number = 0;
  TransferNoteNo:number = 0;
  currentDate:string = '';
  AccountList:any;
  balanceList:any;
  RemainingBalance:number = 0;
  globalUserId:number = 0;
  isCreditDisabled: boolean = false;
  isDebitDisabled: boolean = false;
  budgeTransferMaster:any;
  budgeTransferDetailsList:any;
  btnSave:boolean = false;
  isUpdate: boolean = false;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _storeProjectService: StoreProjectService,
    private _apiService: ApiProviderService,
    private _activatedRoute: ActivatedRoute,
    private _datePipe: DatePipe,
    private _toastService: ToastService,
    private _confirmService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.globalUserId = +localStorage.getItem('UserId')!;
    this._activatedRoute.queryParams.subscribe((params) => {
      this.BranchCode = +params['BranchCode'];
      this.ProjectCode = +params['ProjectCode'];
      this.BudgetCode = +params['BudgetCode'];
      this.BudgetCycleCode = +params['BudgetCycleCode'];
      this.TransferNoteNo = +params['TransferNoteNo'];
    });
    this.masterFormInIt();
    this.detailsFormInIt();
    this.patchMasterValue();
    this.loadAccountsList();
    this.budgetTransferList();
    this.budgetTransferDetailsList();
  }

  masterFormInIt(){
    this.hardlineBudgetMaster= this._fb.group({
      BudgetCode:[null],
      TransferDate:[''],
      IsLocked:[false],
      IsApproved:[false],
     })
  }

  detailsFormInIt(){
    this.hardlineBudgetDetails = this._fb.group({
      AccountCode:[''],
      DebitAmount:[null],
      Balance:[null],
      CreditAmount:[null],
     })
  }

  patchMasterValue(){
this.hardlineBudgetMaster.patchValue({
  BudgetCode:this.BudgetCode,
  TransferDate:this.currentDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd') || '',
})
  }

  patchDetailsValue(){
this.hardlineBudgetDetails.patchValue({
  Balance:this.balanceList.DataTable[0].DebitAmount
})
  }


  loadAccountsList(){
    this._apiService.get(ApiEndpoints.GetAllAccountName + `?BranchCode=${this.BranchCode}&ProjectCode=${this.ProjectCode}&BudgetCode=${this.BudgetCode}`).subscribe((data:any) =>{
debugger
this.AccountList = data
    });
  }

  loadBalances(data:any) {
    
    this._apiService
      .get(ApiEndpoints.GetAllBudgetTransfer + `?BranchCode=${this.BranchCode}&ProjectCode=${this.ProjectCode}&BudgetCode=${this.BudgetCode} &AccountCode=${data.value}`)
      .subscribe((res: any) => {
        debugger
        this.balanceList = res;
        this.RemainingBalance =this.balanceList.Balance;
        this.patchDetailsValue();
      });
  }


  updateMaster(){
    let model = this.hardlineBudgetMaster.value;
    model.BranchCode = this.BranchCode;
    model.ProjectCode = this.ProjectCode;
    model.ModifiedBy = this.globalUserId;
    model.LockedBy = this.globalUserId;
    model.ApprovedBy = this.globalUserId;
    model.TransferNoteNo = this.TransferNoteNo;
    this._apiService.update(model, ApiEndpoints.CreateBudgetTransfer).subscribe({
      next: (res: any) => {
      this._toastService.sendMessage({
        message: 'Budget Transfer Update Successfully',
        type: NotificationType.success,
      });

    },
      error: (err) => {
        this._toastService.sendMessage({
          message: 'Error while Update Budget Transfer!',
          type: NotificationType.error,
        });
      },

    });

  }


  disableDebit() {
    const DebitValue = this.hardlineBudgetDetails.get('DebitAmount')?.value;
    const CreditValue = this.hardlineBudgetDetails.get('CreditAmount')?.value;
    if (DebitValue > 0) {
      this.isCreditDisabled = true;
      this.hardlineBudgetDetails.get('CreditAmount')?.setValue(0);
    } else {
      this.isCreditDisabled = false;
    }

    if (CreditValue > 0) {
      this.isDebitDisabled = true;
      this.hardlineBudgetDetails.get('DebitAmount')?.setValue(0);
      if(CreditValue>this.RemainingBalance){
        this._toastService.sendMessage({
          message: 'Credit Amount should be less than remaining balance!',
          type: NotificationType.error,
        });
        this.btnSave = true;
      }
      else{
        this.btnSave = false;
      }
    } else {
      this.isDebitDisabled = false;
    }
  }


  budgetTransferList() {
    
    this._apiService
      .get(ApiEndpoints.GetAllHardBudgetTransfer + `?BranchCode=${this.BranchCode}&ProjectCode=${this.ProjectCode}&BudgetCode=${this.BudgetCode}&TransferNoteNo=${this.TransferNoteNo}`)
      .subscribe((res: any) => {
        debugger
        this.budgeTransferMaster = res[0];
       this.budgeTransferMaster.TransferDate = this._datePipe.transform(this.budgeTransferMaster.TransferDate, 'yyyy-MM-dd') 
        this.hardlineBudgetMaster.patchValue({...this.budgeTransferMaster})
      });
  }

updateDetails(){
  let model = this.hardlineBudgetDetails.value;
  model.BranchCode = this.BranchCode;
  model.ProjectCode = this.ProjectCode;
  model.BudgetCode = this.BudgetCode;
  model.ModifiedBy = this.globalUserId;
  model.TransferNoteNo = this.TransferNoteNo;
  this._apiService.update(model, ApiEndpoints.UpdateBudgetEntryDetails).subscribe({
    next: (res: any) => {
    this._toastService.sendMessage({
      message: 'Budget Transfer Update Successfully',
      type: NotificationType.success,
    });
    this.budgetTransferDetailsList() 
    this.refresh()
  },
    error: (err) => {
      this._toastService.sendMessage({
        message: 'Error while Update Budget Transfer!',
        type: NotificationType.error,
      });
    },

  });
}


saveDetails(){
  let model = this.hardlineBudgetDetails.value;
  model.BranchCode = this.BranchCode;
  model.ProjectCode = this.ProjectCode;
  model.BudgetCode = this.BudgetCode;
  model.CreatedBy = this.globalUserId;
  model.TransferNoteNo = this.TransferNoteNo;
  model.BudgetCycleCode = this.BudgetCycleCode;
  this._apiService.post(model, ApiEndpoints.CreateBudgetEntryDetails).subscribe({
    next: (res: any) => {
    this._toastService.sendMessage({
      message: 'Budget Transfer Saved Successfully',
      type: NotificationType.success,
    });
    this.budgetTransferDetailsList() 
    this.refresh()

  },
    error: (err) => {
      this._toastService.sendMessage({
        message: 'Error while Saving Budget Transfer!',
        type: NotificationType.error,
      });
    },

  });
}

delete(data: any) {
  debugger
  let model = {
    BranchCode:this.BranchCode,
    ProjectCode:this.ProjectCode,
    BudgetCode:this.BudgetCode,
    TransferNoteNo:this.TransferNoteNo,
    AccountCode:data,
  }
  this._confirmService.confirm({
    message: 'Are you sure that you want to delete?',
    header: 'Confrimation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this._apiService.delete(ApiEndpoints.DeleteBudgetTransfer, model)
        .subscribe({
          next: (res: any) => {
            this._toastService.sendMessage({
              message: 'Budget Transfer Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.budgetTransferDetailsList() 

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




budgetTransferDetailsList() {
    
  this._apiService
    .get(ApiEndpoints.GetAllBudgetTransferDetail + `?BranchCode=${this.BranchCode}&ProjectCode=${this.ProjectCode}&BudgetCode=${this.BudgetCode}&TransferNoteNo=${this.TransferNoteNo}`)
    .subscribe((res: any) => {
      debugger
      this.budgeTransferDetailsList = res;
    });
}

getSelectedRow(data: any){
  this.isUpdate = true;
this.hardlineBudgetDetails.patchValue({...data})
//this.loadBalances(data.AccountCode)
this.disableDebit();
this._apiService
.get(ApiEndpoints.GetAllBudgetTransfer + `?BranchCode=${this.BranchCode}&ProjectCode=${this.ProjectCode}&BudgetCode=${this.BudgetCode} &AccountCode=${data.AccountCode}`)
.subscribe((res: any) => {
  debugger
  this.balanceList = res;
  this.RemainingBalance =this.balanceList.Balance;
  this.patchDetailsValue();
});
}


refresh(){
  this.hardlineBudgetDetails.reset();
  this.isUpdate = false;
  this.RemainingBalance = 0;
}

}
