import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';

@Component({
  selector: 'app-cheque-book-reconciliation',
  templateUrl: './cheque-book-reconciliation.component.html',
  styleUrls: ['./cheque-book-reconciliation.component.scss']
})
export class ChequeBookReconciliationComponent implements OnInit {
  selectedStore:number=0;
  selectedProject:number=0;
  componentName: string ="Cheque Book Reconciliation"
  globalBranchCode:number=0;
  userId:number=0;
  isLoadingData:boolean=false;
  allBankAccounts:any;
  allChequeBooks:any;
  reconciliationForm! : FormGroup;
  cheque_bookReconciliation: any;
  allStatus: any;
  isSticky: boolean = false;
  constructor(private storeProjectService:StoreProjectService, private apiService:ApiProviderService,
    private fb:  FormBuilder,private toastService:ToastService, private router: Router) { }

  ngOnInit(): void {
    this.globalBranchCode= +localStorage.getItem('BranchCode')!;
    this.userId = +localStorage.getItem('UserId')!;
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
   
    this.formsInit();
    this.getAllBankAccounts();
    this.loadAllChequeBookStatus()
  }

  formsInit(){
    this.reconciliationForm = this.fb.group({
      AccountId : this.fb.control(null),
      ChequeBookId: this.fb.control(null)
    })
  }

  onSelectedOptionChanged(option: any) {
    if (option) {
      this.selectedStore = option.DepartmentCode; // Updated variable name
      this.selectedProject = option.ProjectCode;
    }
  }

  getAllBankAccounts() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.GetAllAccounts + '?BranchCode=' + this.globalBranchCode)
      .subscribe(
        (response: any) => {
          this.allBankAccounts = response;
          this.isLoadingData = false;
        }
      );
  }

  loadAllChequeBook(e:any) {
    this.apiService.get(ApiEndpoints.ChequeBook+`/chequeBookList/${this.globalBranchCode}/${e.value}`).subscribe((res: any) => {
      this.allChequeBooks= res.data;
      this.allChequeBooks = this.allChequeBooks.map((item:any) => ({
        ...item,
        label: `${item.FromNumber} - ${item.ToNumber}`
      }));
    });
  }

  chequeBookReconciliation(){
    this.apiService.get(ApiEndpoints.ChequeBook+`/${this.globalBranchCode}/${this.reconciliationForm.controls['AccountId'].value}/${this.reconciliationForm.controls['ChequeBookId'].value}`).subscribe((res: any) => {
      this.cheque_bookReconciliation= res.data;
    });
  }

  loadAllChequeBookStatus(){
    this.apiService.get(ApiEndpoints.ChequeBook).subscribe((res: any) => {
      this.allStatus= res.data;
    });
  }

  onDropdownChange(data: any) {
    let model = {
      BranchCode : this.globalBranchCode,
      ChequeNo : data.ChequeNo,
      ChequeBookId: data.ChequeBookId,
      ChequeStatusId : data.ChequeStatusId,
      StatusChangedBy : this.userId,
      AccountId :  data.AccountId

    }
    this.apiService.update(model,ApiEndpoints.ChequeBook).subscribe((res:any)=>{
      this.toastService.sendMessage({
        message: 'Cheque Status Updated Successfully!',
        type: NotificationType.success,
      });
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

  viewHistory(data:any){
    this.router.navigate(['/Finance/cheque-history'], {
      queryParams: {AccountId:data.AccountId, chequeBookId: data.ChequeBookId, chequeNo : data.ChequeNo },
    })
  }
}
