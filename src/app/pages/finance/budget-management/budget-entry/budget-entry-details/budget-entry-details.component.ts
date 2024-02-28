import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmEventType, ConfirmationService, TreeNode } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { IGPService } from 'src/app/_shared/services/igp.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-budget-entry-details',
  templateUrl: './budget-entry-details.component.html',
  styleUrls: ['./budget-entry-details.component.scss'],
})
export class BudgetEntryDetailsComponent implements OnInit {
  chartResponse2!: TreeNode[];
  chartResponse3!: TreeNode[];
  filteredTreeData!: TreeNode[];
  globalBranchCode!: number;
  accountsList: any;
  budget: number = 0;
  rowData: any = {};
  ChildCode: string = '';
  valueAround: number = 0;
  myResponse: any;
  ParentVal: any;
  childVal: number = 0;
  ChildsSum: number = 0;
  childValCountFromParentSide: number = 0;
  BranchCode: number = 0;
  ProjectCode: number = 0;
  BudgetCode: number = 0;
  budgetMasterList: any;
  budgetDetailList:any;
  UserId: any;
  budgetEntryDetails!: FormGroup;
  budgetStatusList:any;
  loadingerror:boolean = false;
  loading: boolean= false;
  Child: {
    AccountCode: string;
    ParentAccountCode: string;
    value: number;
  }[] = [];

  Parent: {
    AccountCode: string;
    ParentAccountCode: string;
    value: number;
  }[] = [];
  ChildAccountCodesAndBudget: { AccountCode: string; Childbudget: number }[] =
    [];

  constructor(
    private _confirmService: ConfirmationService,
    private _apiService: ApiProviderService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _budgetEntryService: IGPService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    
    this._activatedRoute.queryParams.subscribe((params) => {
      this.BranchCode = +params['BranchCode'];
      this.ProjectCode = +params['ProjectCode'];
      this.BudgetCode = +params['BudgetCode'];
    });
    this.UserId = +localStorage.getItem('UserId')!;
    this.formInIt();
   
   this.budgetStatusNamesList();
    this.loadBudgetEntryMasterData();
    this.loadAllChartofAccount();
   
    this.loadAllAccounts();
  }

  formInIt() {
    this.budgetEntryDetails = this._fb.group({
      BudgetCode: ['', Validators.required],
      BudgetCycleTitle: ['', Validators.required],
      ProjectName: ['', Validators.required],
      RevisionNo: ['', Validators.required],
      BudgetStatus: ['', Validators.required],
      BudgetStatusCode:['', Validators.required],
    });
  }

  loadAllChartofAccount() {
    
    this._apiService
      .get(ApiEndpoints.GetChartOfAccountsTree)
      .subscribe((res: any) => {

        this.loadBudgetEntryDetailData(res);
       
        
       // this.loadBudgetEntryDetailData(this.chartResponse2);
        console.log('chartResponse2', this.chartResponse2);
      });
  }


 
  budgetStatusNamesList() {
    this._apiService
      .get(ApiEndpoints.GetAllBudgetStatus)
      .subscribe((res: any) => {
        
        this.budgetStatusList = res;
      });
  }

  transformDatatree(apiData: any, childBudget: number): TreeNode[] {
    return this.generateTreeNodes(apiData['Children'], 1, childBudget);
  }
  
  findChildBudget:number = 0;
  generateTreeNodes(items: any[], level: number, parentChildBudget: number): TreeNode[] {
    
    if (level > 15) {
      return [];
    }
  
    const treeNodes: TreeNode[] = [];
  
    for (const item of items) {
      const childBudget = parentChildBudget + 1; // Increment ChildBudget for each level
  
      const childNodes: TreeNode[] = this.generateTreeNodes(
        item.Children || [],
        level + 1,
        childBudget
      );
  
      if(this.budgetDetailList.length > 0) {
       let findChildBudgets = this.budgetDetailList.find((items:any) => items.AccountCode ==  item.AccountCode)
       if(findChildBudgets == undefined){
        this.findChildBudget = 0
       }
       else{
        this.findChildBudget = findChildBudgets.Childbudget
       }
      
      }
      else{
        this.findChildBudget = 0;
      }
      const treeNode: TreeNode = {
       
        data: { ...item, ChildBudget: this.findChildBudget},
        children: childNodes,
      };
  
      treeNodes.push(treeNode);
    }
  
    return treeNodes;
  }
//------------------OLD VERSION END----------------




  loadBudgetEntryMasterData() {
    this._apiService
      .get(
        ApiEndpoints.GetAllBudgetEntry +
          `?BranchCode=${this.BranchCode}&ProjectCode=${this.ProjectCode}&BudgetCode=${this.BudgetCode}`
      )
      .subscribe((res: any) => {
        
        this.budgetMasterList = res[0];
        this.budgetEntryDetails.patchValue({ ...this.budgetMasterList });
      });
  }

  loadBudgetEntryDetailData(data: any) {
    this._apiService
      .get(
        ApiEndpoints.GetAllBudgetCycleDetail +
          `?BranchCode=${this.BranchCode}&ProjectCode=${this.ProjectCode}&BudgetCode=${this.BudgetCode}`
      )
      .subscribe((res: any) => {
        
        this.budgetDetailList = res;
        this.ChildAccountCodesAndBudget =  this.budgetDetailList;
        this.chartResponse2 = this.transformDatatree(data,0);
        // for(let i = 0; i < this.budgetDetailList.length; i++){
        //   let ChildBudget = this.budgetDetailList[i].ChildBudget;
        //   this.chartResponse2 = this.transformDatatree(res,ChildBudget)
        // }
       
      });
  }

  updateBudgteDetails() {
    let model: {
      BranchCode: number;
      CreatedBy: number;
      BudgetCode: number;
      ModifiedBy:number;
      dt_Budget: any[];
      ProjectCode: number;
      BudgetCycleCode:number;
    } = {
      BranchCode: +this.BranchCode,
      CreatedBy: +this.UserId || 0,
      ModifiedBy: +this.UserId || 0,
      BudgetCycleCode: this.budgetMasterList.BudgetCycleCode,
      ProjectCode: +this.ProjectCode,
      BudgetCode: this.BudgetCode,
      dt_Budget: Array.isArray(this.ChildAccountCodesAndBudget)
        ? this.ChildAccountCodesAndBudget
        : [this.ChildAccountCodesAndBudget],
    };
    this.loading = true;
    this._budgetEntryService.sendBudgetEntryData(model).subscribe(
      (response) => {
        this._toastService.sendMessage({
          message: 'Budget Detail Saved Successfully!',
          type: NotificationType.success,
        });
        this.loading = false;
      },
      (error) => {
        this._toastService.sendMessage({
          message: 'Save Failed!',
          type: NotificationType.error,
        });
      }
    );
  }

  updateMaster(){
    debugger
    let model = this.budgetEntryDetails.value;
    model.BranchCode = this.BranchCode;
    model.ProjectCode = this.ProjectCode;
    model.BudgetCycleCode=this.budgetMasterList.BudgetCycleCode;
    model.BudgetCode=this.BudgetCode;
    model.BudgetStausChangedBy = this.UserId;
    this.loading = true;
    this._apiService.update(model, ApiEndpoints.UpdateBudgetEntry).subscribe({
      next: (res: any) => {
      this.loadBudgetEntryMasterData();
        this._toastService.sendMessage({
          message: 'Budget Cycle Updated Successfully',
          type: NotificationType.success,
        });
        this.loading = false;
      },
      error: (err) => {
        this._toastService.sendMessage({
          message: 'Error while updating Budget Cycle!',
          type: NotificationType.error,
        });
      },
    });
  }
  //------------------------------------Table Validations---------------------------------

  loadAllAccounts() {
    this._apiService
      .get(
        ApiEndpoints.GetAllChartOfAccounts +
          '?BranchCode=' +
          this.globalBranchCode
      )
      .subscribe((res: any) => {
        this.accountsList = res;
      });
  }
sameParentValue:number=0;
  checkChildValue(rowData: any) {
    debugger
    this.ParentVal = 0;
    let childAccountCode = rowData.AccountCode;
    let value = rowData.ChildBudget;
    this.childVal = rowData.ChildBudget;
    this.ChildCode = childAccountCode;
    // this.ValueCheck();


    //--------------------------------------Array Push and Pop Value Logic Start here--------------------------------
    const existingIndex = this.ChildAccountCodesAndBudget.findIndex(
      (item) => item.AccountCode === childAccountCode
    );

    if (existingIndex !== -1) {
      const foundItem = this.ChildAccountCodesAndBudget[existingIndex];
      this.sameParentValue = foundItem.Childbudget;
    } else {
      console.error(`Element with AccountCode ${childAccountCode} not found.`);
    }


   if (value === 0 || value === null) {
  // If value is 0 or null
  if (existingIndex !== -1) {
    // If the AccountCode exists, update the Childbudget to 0
    this.ChildAccountCodesAndBudget[existingIndex].Childbudget = 0;
  } else {
    // If the AccountCode doesn't exist, push a new entry with Childbudget set to 0
    this.ChildAccountCodesAndBudget.push({
      AccountCode: childAccountCode,
      Childbudget: 0,
    });
  }
} else {
  // If value is not 0 or null
  if (existingIndex !== -1) {
    // If the AccountCode exists, update the Childbudget
    this.ChildAccountCodesAndBudget[existingIndex].Childbudget = value;
  } else {
    // If the AccountCode doesn't exist, push a new entry
    this.ChildAccountCodesAndBudget.push({
      AccountCode: childAccountCode,
      Childbudget: value,
    });
  }
}

    //--------------------------------------Array Push and Pop Value Logic ENDS here--------------------------------

    const childNode = this.accountsList.find(
      (node: any) => node.AccountCode === childAccountCode
    );

    // if(childNode.ParentAccountCode == '0'){
    //   this.parentChk(rowData)
      
    // }
    this.parentChk(rowData)

    const parentNode = this.accountsList.find(
      (node: any) => node.AccountCode === childNode!.ParentAccountCode
    );

    const childData = {
      AccountCode: childNode.AccountCode,
      ParentAccountCode: childNode.ParentAccountCode,
      value: value,
    };

    const matchingChild = this.ChildAccountCodesAndBudget.find(
      (item) => item.AccountCode === parentNode.AccountCode
    );
    if (matchingChild) {
      // Save the matching Childbudget value in a new variable
      const matchingChildbudget = matchingChild.Childbudget;
      this.ParentVal = matchingChildbudget;
      console.log('Matching Childbudget:', matchingChildbudget);
      // You can use the matchingChildbudget variable as needed
    }

    const parentData = {
      AccountCode: parentNode.AccountCode,
      ParentAccountCode: parentNode.ParentAccountCode,
      value: this.ParentVal,
    };

    const childSum = this.ChildAccountCodesAndBudget.reduce(
      (sum, item) => sum + (item.Childbudget || 0),
      0
    );
   
    if (
      parentData.AccountCode != '0' ||
      (parentNode &&
        (value > parentNode.Childbudget || childSum > parentNode.Childbudget))
    ) {
      if (childData.value > parentData.value || parentData.value == undefined) {
        this.loadingerror = true;
        rowData.ChildBudget = 0;
        this.ParentVal = 0;
        this.valueAround = 0;
        this.ArrayCKH();
      }
    }
    if (parentData.value != undefined && parentData.value != 0) {
      this.ValueCheck(rowData);
    }
  }



  ArrayCKH() {
    const existingIndex = this.ChildAccountCodesAndBudget.findIndex(
      (item) => item.AccountCode === this.ChildCode
    );

    //Not Important----------------------------------------------------
    if (existingIndex !== -1) {
      const foundItem = this.ChildAccountCodesAndBudget[existingIndex];
      this.sameParentValue = foundItem.Childbudget;
    } else {
      // Handle the case when the element is not found
      console.error(`Element with AccountCode ${this.ChildCode} not found.`);
    }
    //Not Important END ----------------------------------------------------


   if (this.valueAround === 0 || this.valueAround === null) {
  // If value is 0 or null
  if (existingIndex !== -1) {
    // If the AccountCode exists, update the Childbudget to 0
    this.ChildAccountCodesAndBudget[existingIndex].Childbudget = 0;
  } else {
    // If the AccountCode doesn't exist, push a new entry with Childbudget set to 0
    this.ChildAccountCodesAndBudget.push({
      AccountCode: this.ChildCode,
      Childbudget: 0,
    });
  }
} else {
  // If value is not 0 or null
  if (existingIndex !== -1) {
    // If the AccountCode exists, update the Childbudget
    this.ChildAccountCodesAndBudget[existingIndex].Childbudget = this.valueAround;
  } else {
    // If the AccountCode doesn't exist, push a new entry
    this.ChildAccountCodesAndBudget.push({
      AccountCode: this.ChildCode,
      Childbudget: this.valueAround,
    });
  }
}
  }


  findParentCode: any;

  ValueCheck(rowData: any) {
    debugger
    const childNode = this.accountsList.find(
      (node: any) => node.AccountCode === this.ChildCode
    );
    let childAccountCode = childNode.AccountCode;

    let ParentAccountCode = childNode.ParentAccountCode;
    if (ParentAccountCode != '0') {
      while (ParentAccountCode !== '0') {
        //   const existingIndex = this.ChildAccountCodesAndBudget.findIndex(item => item.AccountCode === childNode.AccountCode);
        this.findParentCode = this.ChildAccountCodesAndBudget.find(
          (item) => item.AccountCode === ParentAccountCode
        );
        let ParentBudget = this.findParentCode!.Childbudget;
        const childNode = this.accountsList.find(
          (node: any) => node.AccountCode === this.findParentCode!.AccountCode
        );

        //--------------------Not Important Filled Errors----------------------------------------------------------------
        
        let findchildNodeinArray;
        const AllParentCodesofChild = this.accountsList.filter(
          (item: any) => item.ParentAccountCode === childAccountCode
        );

        this.childValCountFromParentSide = 0;
        for (let i = 0; i < AllParentCodesofChild.length; i++) {
          let childsAccountCode = AllParentCodesofChild[i].AccountCode;
          findchildNodeinArray = this.ChildAccountCodesAndBudget.find(
            (item) => item.AccountCode === childsAccountCode
          );

          if (findchildNodeinArray) {
            this.childValCountFromParentSide +=
              findchildNodeinArray.Childbudget!;
          }
        }

        if (this.childValCountFromParentSide > this.childVal) {
          this.summationCHK(rowData);
        
        }
        //------Put Summation Logic Here-----
        debugger
        this.ChildsSum = 0;
        const findParentCodeFromAccountlist = this.accountsList.filter(
          (item: any) => item.ParentAccountCode === ParentAccountCode
        );
        for (let i = 0; i < findParentCodeFromAccountlist.length; i++) {
          let findAllChildsforSummation = this.ChildAccountCodesAndBudget.find(
            (item) =>
              item.AccountCode === findParentCodeFromAccountlist[i].AccountCode
          )
          if(findAllChildsforSummation!= undefined){
            this.ChildsSum += findAllChildsforSummation!.Childbudget;
          }
         
        }
        if (this.ChildsSum > this.findParentCode?.Childbudget!) {
       
          this.summationCHK(rowData);
        }
        //-----Ends Summation Logic Here-----

        //-------------------- End ----------------------------------------------------------------

        // if(this.childVal>ParentBudget){
        //   alert("Value Exceed");
        // }
        // this.childVal +=ParentBudget;
        ParentAccountCode = childNode.ParentAccountCode;
      }
    }
  }
  summationCHK(rowData: any) {
    if (this.ChildsSum > this.findParentCode?.Childbudget!) {
      this.loadingerror = true;
        rowData.ChildBudget = 0;
        this.ParentVal = 0;
        this.valueAround = 0;
        const existingIndex = this.ChildAccountCodesAndBudget.findIndex(
          (item) => item.AccountCode === rowData.AccountCode
        );
        this.ChildAccountCodesAndBudget[existingIndex].Childbudget = 0;
        

    }
  }

  //-----------------------------------------------------------Validation Dialogue-----------------------------------------
  hideErrorPopup() {
    this.loadingerror = false;
  }

  parentChk(rowData:any){
this.findParentCode=rowData;
 //------Put Summation Logic Here-----
 debugger
 this.ChildsSum = 0;
 const findParentCodeFromAccountlist = this.accountsList.filter(
   (item: any) => item.ParentAccountCode === rowData.AccountCode
 );
 for (let i = 0; i < findParentCodeFromAccountlist.length; i++) {
   let findAllChildsforSummation = this.ChildAccountCodesAndBudget.find(
     (item) =>
       item.AccountCode === findParentCodeFromAccountlist[i].AccountCode
   )
   if(findAllChildsforSummation!= undefined){
     this.ChildsSum += findAllChildsforSummation!.Childbudget;
   }
  
 }
 if (this.ChildsSum > this.findParentCode.ChildBudget!) {

  this.loadingerror = true;
  rowData.ChildBudget = this.sameParentValue;
  this.ParentVal = 0;
  this.valueAround = 0;

  const existingIndex = this.ChildAccountCodesAndBudget.findIndex(
    (item) => item.AccountCode === rowData.AccountCode
  );
  this.ChildAccountCodesAndBudget[existingIndex].Childbudget =  this.sameParentValue;
 }

 //-----Ends Summation Logic Here-----

  }

  
}
