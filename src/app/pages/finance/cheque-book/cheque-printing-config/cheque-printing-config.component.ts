import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-cheque-printing-config',
  templateUrl: './cheque-printing-config.component.html',
  styleUrls: ['./cheque-printing-config.component.scss']
})
export class ChequePrintingConfigComponent implements OnInit {
  globalBranchCode:number=0;
  userId:number=0;
  selectedStore:number=0;
  selectedProject:number=0;
  componentName:string="Cheque Configuration";
  visible: boolean = false;
  ChequePrint! : FormGroup;
  isLoadingData : boolean = false;
  allBankCashAccounts : any;
  allChequeBooksDesign:any;
  isSticky:boolean=false;
  isUpdate : boolean= false;
  currentChequeBookId : number = 0;
  accountId : number = 0;

  constructor(private storeProjectService:StoreProjectService,private fb:FormBuilder,
    private apiService :ApiProviderService, private utilityService:UtilityService, private toastService:ToastService) { }

  ngOnInit(): void {
    this.globalBranchCode= +localStorage.getItem('BranchCode')!;
    this.userId = +localStorage.getItem('UserId')!;
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
  })
  this.formsInit();
  this.getAllBankAccounts();
  this.loadAllChequeBookDesigns(); 
}

formsInit(){
  (this.ChequePrint = this.fb.group({
    AccountId: this.fb.control('', Validators.required),
    PayeeFromTop: this.fb.control('', Validators.required),
    PayeeFromLeft: this.fb.control('', Validators.required),
    DateFromTop: this.fb.control('', Validators.required),
    DateFromLeft: this.fb.control('', Validators.required),
    AmountInNumbersFromTop: this.fb.control('', Validators.required),
    AmountInNumbersFromLeft: this.fb.control('', Validators.required),
    AmountInWordsFromTop: this.fb.control('', Validators.required),
    AmountInWordsFromLeft: this.fb.control('', Validators.required),
    IsActive: this.fb.control(false)
  }));
}

  onSelectedOptionChanged(option: any) {
    if (option) {
      this.selectedStore = option.DepartmentCode; // Updated variable name
      this.selectedProject = option.ProjectCode;
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


  showDialog() {
    this.visible = true;
  }

  getAllBankAccounts() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.GetAllAccounts + '?BranchCode=' + this.globalBranchCode)
      .subscribe(
        (response: any) => {
          this.allBankCashAccounts = response;
          this.isLoadingData = false;
        }
      );
  }

  loadAllChequeBookDesigns() {
    this.apiService.get(ApiEndpoints.ChequeBookConfig+`/${this.globalBranchCode}`).subscribe((res: any) => {
      this.allChequeBooksDesign= res.data;
    });
  }

  add(){
    this.apiService.get(ApiEndpoints.ChequeBookConfig+`/MaxId`).subscribe((res:any) => {
      let ChequeBookDesignId = res.data[0].ChequeBookDesignId;
      this.createChequeBookDesign(ChequeBookDesignId)
    });
  }

  createChequeBookDesign(ChequeBookDesignId:number){
    if (this.ChequePrint.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.ChequePrint);
      this.toastService.sendMessage({
        message: 'Invalid form fields please check the form',
        type: NotificationType.error,
      });
      return;
    }
    
    let payLoad = this.ChequePrint.value;
    if(payLoad.IsActive==null){
      payLoad.IsActive = false
    }
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.userId;
    payLoad.ChequeBookDesignId = ChequeBookDesignId;
    this.apiService.post(payLoad, ApiEndpoints.ChequeBookConfig).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New Cheque Book Configured Successfully!',
        type: NotificationType.success,
      });
      this.ChequePrint.reset();
      this.visible = false
      this.loadAllChequeBookDesigns()
    });
  }

  updateAllow(data:any){
    this.currentChequeBookId = data.ChequeBookDesignId
    this.accountId = data.AccountId
    this.isUpdate = true
    this.showDialog()
    this.ChequePrint.patchValue({...data})

  }
  closeDialog(){
    this.visible=false
  }

  Update(){
    let payLoad = this.ChequePrint.value;
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.ModifiedBy = this.userId;
    payLoad.ChequeBookDesignId = this.currentChequeBookId;
    payLoad.AccountId = this.accountId
    this.apiService.update(payLoad, ApiEndpoints.ChequeBookConfig).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Cheque Book Design Updated Successfully!',
        type: NotificationType.success,
      });
      this.ChequePrint.reset();
      this.visible = false
      this.loadAllChequeBookDesigns()
    });
  }

  deleteChequebookDesign(data:any){
    this.apiService.delete(ApiEndpoints.ChequeBookConfig+`/DeleteBankAccount/${data.BranchCode}/${data.AccountId}/${data.ChequeBookDesignId}`).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'Cheque Book Design Deleted Successfully!',
        type: NotificationType.deleted,
      });
      this.ChequePrint.reset();
      this.visible = false
      this.loadAllChequeBookDesigns()
    });
  }
}
