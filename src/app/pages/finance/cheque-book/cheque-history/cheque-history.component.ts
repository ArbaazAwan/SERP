import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';

@Component({
  selector: 'app-cheque-history',
  templateUrl: './cheque-history.component.html',
  styleUrls: ['./cheque-history.component.scss']
})
export class ChequeHistoryComponent implements OnInit {
  globalBranchCode : number =0;
  userId : number = 0;
  selectedStore: number=0;
  selectedProject:number=0;
  routeChequeBookId : number =0;
  routeAccountId:number=0;
  routeChequeNo:number=0;
  isSticky : boolean = false;
  componentName:string = "Cheque History";
  history:any;
  isLoadingData : boolean = false;
  constructor(private storeProjectService: StoreProjectService, private route:ActivatedRoute, private apiService:ApiProviderService) { }

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
      this.routeChequeBookId = params['chequeBookId'];
      this.routeAccountId = params['AccountId'];
      this.routeChequeNo = params['chequeNo'];
    });

    this.GetChequeBookHistory();
  }


  onSelectedOptionChanged(option: any) {
    if (option) {
      this.selectedStore = option.DepartmentCode; // Updated variable name
      this.selectedProject = option.ProjectCode;
    }

  }

  GetChequeBookHistory() {
    this.apiService.get(ApiEndpoints.ChequeBook+`/${this.globalBranchCode}/${this.routeAccountId}/${this.routeChequeBookId}/${this.routeChequeNo}`).subscribe((res: any) => {
      this.history= res.data;
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
}
