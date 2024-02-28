import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cheque-book-detail',
  templateUrl: './cheque-book-detail.component.html',
  styleUrls: ['./cheque-book-detail.component.scss']
})
export class ChequeBookDetailComponent implements OnInit {
  selectedStore: number=0;
  selectedProject:number=0;
  componentName:string = "Cheque Book";
  globalBranchCode : number =0;
  userId : number = 0;
  allCheques : any;
  routeChequeBookId : number =0;
  isLoadingData : boolean = false;
  isSticky : boolean = false;
  allStatus: any;


  constructor(private apiService: ApiProviderService, private storeProjectService :StoreProjectService,
              private route:ActivatedRoute, private toastService : ToastService, private router: Router) { }

  ngOnInit(): void {
    this.globalBranchCode= +localStorage.getItem('BranchCode')!;
    this.userId = +localStorage.getItem('UserId')!;
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.routeChequeBookId = params['cheque_book_id'];
    });
    this.loadAllCheques();
    this.loadAllChequeBookStatus();

  }

  loadAllCheques() {
    this.apiService.get(ApiEndpoints.ChequeBook+`/${this.globalBranchCode}/${this.routeChequeBookId}`).subscribe((res: any) => {
      this.allCheques= res.data;
    });
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

  loadAllChequeBookStatus(){
    this.apiService.get(ApiEndpoints.ChequeBook).subscribe((res: any) => {
      this.allStatus= res.data;
    });
  }

  onDropdownChange(data: any) {
    let model = {
      BranchCode : this.globalBranchCode,
      ChequeNo : data.ChequeNo,
      ChequeBookId: this.routeChequeBookId,
      ChequeStatusId : data.ChequeStatusId,
      StatusChangedBy : this.userId,
      AccountId :  data.AccountId

    }
    this.apiService.update(model,ApiEndpoints.ChequeBook).subscribe((res:any)=>{
      this.toastService.sendMessage({
        message: 'Cheque Status Updated Successfully!',
        type: NotificationType.success,
      });
      this.loadAllCheques();
    })
  }

  viewHistory(data:any){
    this.router.navigate(['/Finance/cheque-history'], {
      queryParams: {AccountId:data.AccountId, chequeBookId: data.ChequeBookId, chequeNo : data.ChequeNo },
    })
  }
}
