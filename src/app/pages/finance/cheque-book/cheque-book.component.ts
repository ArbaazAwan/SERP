import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-cheque-book',
  templateUrl: './cheque-book.component.html',
  styleUrls: ['./cheque-book.component.scss']
})
export class ChequeBookComponent implements OnInit {

  Masterform! : FormGroup
  selectedStore: number = 0;
  selectedProject: number = 0;
  componentName: string = "Cheque Book";
  isLoadingData:boolean=false;
  globalBranchCode : number = 0 ;
  allBankCashAccounts:any;
  ModulelistResp$: any = [];
  loadingerror:boolean=false;
  userId :number = 0;
  allChequeBooks:any;
  isSticky:boolean=false;
  isUpdate : boolean = false;
  isToastShown :boolean = false

  AccountId:number =0
  constructor(private fb: FormBuilder, private apiService: ApiProviderService, private utilityService:UtilityService,
    private toastService:ToastService, private storeProjectService: StoreProjectService, private confirmservice : ConfirmationService,
    private router:Router) { }

  ngOnInit(): void {
    this.globalBranchCode= +localStorage.getItem('BranchCode')!;
    this.userId = +localStorage.getItem('UserId')!;
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    this.formsInit()
    this.getAllBankAccounts();
    this.loadAllChequeBook();

  }


  formsInit(){
    (this.Masterform = this.fb.group({
      AccountId: this.fb.control('', Validators.required),
      NoOfLeafs: this.fb.control('', Validators.required),
      ChequeNoFrom: this.fb.control('', Validators.required),
      ChequeNoTo: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false)
    }));
  }

  onSelectedOptionChanged(option: any) {
    if (option) {
      this.selectedStore = option.DepartmentCode; // Updated variable name
      this.selectedProject = option.ProjectCode;
    }

  }

  visible: boolean = false;
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

  add(){
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.confirmservice.confirm({
      message: 'Are you sure that you want to Create Cheque Book?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.getMaxChequeBookId();
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

  getMaxChequeBookId() {
    this.apiService.get(ApiEndpoints.ChequeBook+`/MaxId`).subscribe((res:any) => {
      let ChequeBookId = res.data[0].ChequeBookId;
      this.createChequeBook(ChequeBookId)
    });
  }

  createChequeBook(ChequeBookId:number){
    if (this.Masterform.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.Masterform);
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
    let payLoad = this.Masterform.value;
    payLoad.BranchCode = this.globalBranchCode;
    payLoad.CreatedBy = this.userId;
    payLoad.ChequeBookId = ChequeBookId;
    payLoad.StatusId = 1;
    this.apiService.post(payLoad, ApiEndpoints.ChequeBook).subscribe((res) => {
      this.toastService.sendMessage({
        message: 'New Cheque Book Created Successfully!',
        type: NotificationType.success,
      });
      this.Masterform.reset();
      this.visible = false
      this.loadAllChequeBook()
    });
  }

  calculateToNumber(){
    if(this.Masterform.controls['NoOfLeafs'].value!=undefined && this.Masterform.controls['ChequeNoFrom'].value!=undefined){
      let ToNumber =  (this.Masterform.controls['NoOfLeafs'].value + this.Masterform.controls['ChequeNoFrom'].value)-1
      this.Masterform.controls['ChequeNoTo'].setValue(ToNumber)
    }
  }

  loadAllChequeBook() {
    this.apiService.get(ApiEndpoints.ChequeBook+`/chequeBookList/${this.globalBranchCode}/${this.AccountId}`).subscribe((res: any) => {
      this.allChequeBooks= res.data;
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

  updateAllow(data:any){
    this.isUpdate = true;
    // this.tableResponse$ = data;
    //this.masterResponse$ = data;
    if (data) {
      let Cheque_book_id = data.ChequeBookId;
      this.router.navigate(['/Finance/cheque-book-detail'], {
        queryParams: { cheque_book_id: Cheque_book_id},
      });
    }
  }
  
}
