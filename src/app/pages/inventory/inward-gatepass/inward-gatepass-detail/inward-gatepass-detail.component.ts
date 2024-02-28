import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ActivatedRoute } from '@angular/router';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';
import { PurchaseInvoiceService } from 'src/app/_shared/services/purchase-invoice.service';
import { IGPService } from 'src/app/_shared/services/igp.service';
@Component({
  selector: 'app-inward-gatepass-detail',
  templateUrl: './inward-gatepass-detail.component.html',
  styleUrls: ['./inward-gatepass-detail.component.scss'],
  providers: [DateFormatPipe,DatePipe],
})
export class InwardGatepassDetailComponent implements OnInit {
  routeStoreCode:any;
  IGPNo:any;
  selectedStoreCode:any;
  masterForm!:FormGroup;
  detailForm!:FormGroup;
  masterData:any;
  datePipe = new DatePipe('en-US');
  StoreItemResponse$:any;
  items:any;
  detailResponse$: any = [];
  issuedialog: boolean = false;
  OGPDialog: boolean = false;
  PODialog: boolean = false;
  add: number = 0;
  POData: any = [];
  OGPData: any = [];
  issueModel: any = [];
  isLoadingData: boolean = false;
  isDisabled: boolean = true;
  //For date Formate Working
 selectedFormatKey!: number;
 globalBranchCode!:number;
 calculationBtn: boolean = true;
 calculationBtnOGP: boolean = true;
 UserId: any;
 isSticky:boolean = false;
 selectedItemNameAndCodeName:any;
 totalQuantity:number = 0;
 num!:number;


changedValuesOGP: { 
  GRNSrNo: number, 
  GRNNo: string ,
  OGP_Pk: number, 
  OGPNo: string ,
  IssuedQty:number,
  PONo:string,
  ContractNo:string,
  ContractType:string
  POSrNo:number,
  RcvdQty:number,
  ItemCode:string,
  UnitCode:number,
  ItemName:string,
  ItemUnit:string,
  POQty:number,
  AlreadyRcvdQty:number,
  BalQty:number,}[] = [];


changedValuesPO: {
  RcvdQty:number,
  PONo:string,
  POSrNo:number,
  ItemCode:string,
  UnitCode:number,
  ItemName:string,
  ItemUnit:string,
  POQty:number,
  AlreadyRcvdQty:number,
  BalQty:number,
  }[] = [];
detailsData:any;
isUpdate:boolean = false;
loading = false;
OGP_Pk!:number;
contracts: string[] = ['Printing','Dyeing', 'Embroidery','Processing'];
RecievedQuantity:number = 0;
//------No Meaning--------------------------------
PONo!:string;
OGPNo!:string;

  constructor(
    private fb: FormBuilder,
    private confirmService: ConfirmationService,
    private apiService: ApiProviderService,
    private activatedRoute: ActivatedRoute,
    private dateFormatPipe:DateFormatPipe,
    private toastService: ToastService,
    private apiservice: PurchaseInvoiceService,
    private IGPService: IGPService,
  ) {
    this.detailsFormInIt();
    this.masterFormInit();
  }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedStoreCode = params['StoreCode']
      this.IGPNo = params['IGPNo'];
    });
    this.isDisabled = true;
    this.UserId = +localStorage.getItem('UserId')!;
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;

    this.loadAllCompanyConfig();
    this.loadMasterData();
    this. LoadStoreItem();
    this.LoadIGPDetailList();
   
  }

  masterFormInit() {
    
    this.masterForm = this.fb.group({
      StoreName: ['', Validators.required],
      PartyName: ['', Validators.required],
      Location: ['', Validators.required],
      PurposeTitle: ['', Validators.required],
      IGPNo: ['', Validators.required],
      Driver: ['',],
      VehicleNo: ['', ],
      IGPDate:['', Validators.required],
      Remarks: [''],
      IsLocked: [false],
      IsReturnable: [false],
      IsOpen: [false, Validators.required],
      PreviousLockedStatus: [false],
      LockedBy: [false],
    });
  }

  

  detailsFormInIt(){
    this.detailForm = this.fb.group({
      ContractType: ['',],
      ItemName: ['', Validators.required],
      ItemUnit: ['', Validators.required],
      ContractNo: [null,],
      RcvdQty: [null, Validators.required],
      Remarks: [''],
    });
  }
  


  loadMasterData() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.apiService
      .get(ApiEndpoints.LoadAllIGP + `?BranchCode=${BranchCode}&StoreCode=${this.selectedStoreCode}&IGPNo=${this.IGPNo}`)
      .subscribe((res: any) => {
        
        this.masterData = res[0];
        this.masterData.IGPDate = this.parseAndFormatDate(this.masterData.IGPDate);
        this.masterForm.patchValue({...this.masterData})
       
      });
  }

  UpdateMasterDetails(){
    
    let model = this.masterForm.value;
    model.BranchCode = this.globalBranchCode;
    model.ModifiedBy = this.UserId;
    model.StoreCode = this.masterData.StoreCode;
    model.LockedBy = this.UserId;
    model.IsOpen = this.masterForm.value.IsOpen || false;
    model.IGPDate = this.datePipe.transform(model.IGPDate, 'MMM-d-y');
      this.apiService.update(model,ApiEndpoints.UpdateIGPMaster ).subscribe((res) => {
        this.toastService.sendMessage({
          message: 'IGP Master Update Successfully!',
          type: NotificationType.success,
        });
          }); 
  }


  LoadStoreItem() {
    this.apiService
      .get(
        ApiEndpoints.LoadStoreItems +
        `?StoreCode=${this.selectedStoreCode}&BranchCode=${this.globalBranchCode}`
      )
      .subscribe((res: any) => {
        
        this.StoreItemResponse$ = res.data;
      });
  }


  changeStoreItem(e: any) {
    
    this.items = e;
    let x = this.StoreItemResponse$.find((x: any) => {
      return this.items == x?.Code;
    });
    this.selectedItemNameAndCodeName = x;
this.detailForm.get('UnitCode')?.setValue(x.Unit);
  }


  //------------------------------Date Format Working------------------------
loadAllCompanyConfig() {
  this.apiService.get(ApiEndpoints.getAllCompanyConfig).subscribe((res: any) => {
    this.selectedFormatKey = res[0].DateFormatCode;
  });
}
currentDate: Date = new Date();
formatDateForInput(): string {
 return this.dateFormatPipe.transform(this.selectedFormatKey);
}

parseAndFormatDate(dateString: string): Date {
  
  let targetFormat = 'yyyy-MM-dd';

  const parsedDate: string | null = this.datePipe.transform(dateString, targetFormat);

  if (parsedDate !== null) {
    return new Date(parsedDate);
  } else {
    console.error(`Failed to parse date: ${dateString}`);
    return new Date(); 
  }
}
//----------------------------------------------------------------
get IsOpen(): boolean {
  return this.masterForm.get('IsOpen')!.value;
}



//---------------------------------------Open And add GRN Item Details Methods--------------------------------


hideIssueDialog(){
  this.issuedialog = false;
  //this.changedValues = [];
}

checkIssueQty(){
 if(this.totalQuantity){
  return this.toastService.sendMessage({
    message: `Selected Quantity should be equal to Issued Quantity`,
    type: NotificationType.error,
    
});
 }
 else{
  this.PODialog = false;
 
 }
}
//-----------------------------------PO Working--------------------------------
collectiveQuantity(data:any){
  
  this.RecievedQuantity = data.IssQty;
let x = this.POData.filter((x:any) => {

  const hasInvalidQuantity = this.POData.some((x: any) => {
    return data.POSrNo === x.POSrNo && data.IssQty > x.BalQty;
  });
  this.calculationBtn = hasInvalidQuantity;

if(data.POSrNo == x.POSrNo && data.IssQty>x.BalQty){
  return this.toastService.sendMessage({
            message: `GRN SR # ${data.POSrNo} Issued Qty should be less than or equal to Balanced Qty!`,
            type: NotificationType.error,
  });
}
});

const changedValueIndex = this.changedValuesPO.findIndex(item =>
  item.POSrNo === data.POSrNo && item.PONo === data.PONo
);

if (data.IssQty === 0 || data.IssQty === null) {
  // If the value is zero, remove the entry from the array
  if (changedValueIndex !== -1) {
    this.changedValuesPO.splice(changedValueIndex, 1);
  }
} else if (changedValueIndex === -1) {
  // If not found, add to the array
  this.changedValuesPO.push({ POSrNo: data.POSrNo, RcvdQty: data.IssQty, PONo :this.PONo ,ItemCode:data.ItemCode, UnitCode:data.UnitCode, ItemName:data.ItemName, ItemUnit:data.ItemUnit, POQty:data.POQty, AlreadyRcvdQty:data.AlreadyRcvdQty, BalQty:data.BalQty});
} else {
  // If found, update the existing value only if it has changed
  if (this.changedValuesPO[changedValueIndex].RcvdQty !== data.IssQty) {
    this.changedValuesPO[changedValueIndex].RcvdQty = data.IssQty;
  }
}

}


//-----------------------------------OGP Working--------------------------------
collectiveQuantityOGP(data:any){

this.RecievedQuantity = data.RcvQty;
  
  let x = this.OGPData.filter((x:any) => {
  
    const hasInvalidQuantity = this.OGPData.some((x: any) => {
      return data.OGP_PK === x.OGP_PK && data.RcvQty > x.IssuedQty;
    });
    this.calculationBtnOGP = hasInvalidQuantity;
  
  if(data.OGP_PK == x.OGP_PK && data.RcvQty>x.IssuedQty){
    return this.toastService.sendMessage({
              message: `GRN SR # ${data.OGP_PK} Issued Qty should be less than or equal to Issued Qty!`,
              type: NotificationType.error,
              
    });
  }
  
  });
  
  const changedValueIndex = this.changedValuesOGP.findIndex(item =>
    item.OGP_Pk === data.OGP_PK && item.OGPNo === data.OGPNo
  );
  if (data.RcvQty === 0 || data.RcvQty === null) {
    // If the value is zero, remove the entry from the array
    if (changedValueIndex !== -1) {
      this.changedValuesOGP.splice(changedValueIndex, 1);
    }
  } else if (changedValueIndex === -1) {
    // If not found, add to the array
    this.changedValuesOGP.push({ OGP_Pk: data.OGP_PK,OGPNo: data.OGPNo,GRNSrNo: data.GRNSrNo,ContractNo:data.ContractNo,ContractType:data.ContractType, GRNNo: data.GRNNo, IssuedQty: data.RcvQty, PONo :data.PONo , POSrNo : data.POSrNo,RcvdQty: data.RcvQty ,ItemCode:data.ItemCode, UnitCode:data.UnitCode, ItemName:data.ItemName, ItemUnit:data.ItemUnit, POQty:data.POQty, AlreadyRcvdQty:data.AlreadyRcvdQty, BalQty:data.BalQty});
  } else {
    // If found, update the existing value only if it has changed
    if (this.changedValuesOGP[changedValueIndex].IssuedQty !== data.RcvQty) {
      this.changedValuesOGP[changedValueIndex].IssuedQty = data.RcvQty;
    }
  }
  
  }


//CRUD OGP DETAILS----------------------------------------------------------------
savePODetails() {
   

let model: { BranchCode: number, CreatedBy: number,POOGP:string, dt_IGP: any[],IGPNo:string,StoreCode:number } = {
  BranchCode: +this.globalBranchCode,
  CreatedBy: +this.UserId,
  POOGP:"PO",
  StoreCode : +this.selectedStoreCode,
  dt_IGP: Array.isArray(this.changedValuesPO) ? this.changedValuesPO : [this.changedValuesPO],
  IGPNo:this.masterForm.value.IGPNo
};


  this.IGPService.sendData(model).subscribe(
    response => {
      this.toastService.sendMessage({
        message: 'IGP Detail Saved Successfully!',
        type: NotificationType.success,
      });
      console.log('Success:', response);
      this.LoadIGPDetailList();
      this.closeOGPDialog()
      // Handle success response
    },
    error => {
      this.toastService.sendMessage({
        message: 'Save Failed!',
        type: NotificationType.error,
      });
      console.error('Error:', error);
      // Handle error response
    }
  );
}

saveOpenIGPDetails(){
  let model = this.detailForm.value;
  model.BranchCode = +this.globalBranchCode;
  model.CreatedBy = +this.UserId;
  model.IGPNo = this.IGPNo;
  model.StoreCode = +this.selectedStoreCode;
  model.POOGP = "Open";
  this.IGPService.sendData(model).subscribe(
    response => {
      this.toastService.sendMessage({
        message: 'IGP Detail Saved Successfully!',
        type: NotificationType.success,
      });
      console.log('Success:', response);
      this.LoadIGPDetailList();
      this.detailForm.reset();
      // Handle success response
    },
    error => {
      this.toastService.sendMessage({
        message: 'Save Failed!',
        type: NotificationType.error,
      });
      console.error('Error:', error);
      // Handle error response
    }
  );
}

saveOGPDetails() {
  

let model: { BranchCode: number,POOGP:string, CreatedBy: number, dt_IGP: any[],IGPNo:string ,StoreCode:number} = {
 BranchCode: +this.globalBranchCode,
 CreatedBy: +this.UserId,
 POOGP:"OGP",
 StoreCode : +this.selectedStoreCode,
 dt_IGP: Array.isArray(this.changedValuesOGP) ? this.changedValuesOGP : [this.changedValuesOGP],
 IGPNo:this.masterForm.value.IGPNo
};


 this.IGPService.sendData(model).subscribe(
   response => {
     this.toastService.sendMessage({
       message: 'IGP Detail Saved Successfully!',
       type: NotificationType.success,
     });
     console.log('Success:', response);
     this.LoadIGPDetailList();
     this.closeOGPDialog()
     // Handle success response
   },
   error => {
     this.toastService.sendMessage({
       message: 'Save Failed!',
       type: NotificationType.error,
     });
     console.error('Error:', error);
     // Handle error response
   }
 );
}

//Get IGP Details List

LoadIGPDetailList() {
  
  let BranchCode = +localStorage.getItem('BranchCode')!;
  let IGPNo = this.IGPNo;
  let StoreCode = +this.selectedStoreCode;
  this.apiService
    .get(ApiEndpoints.LoadIGPDetails + `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IGPNo=${IGPNo}`)
    .subscribe((res: any) => {
      
      this.detailsData = res;
     
    });
}



refreshDeails(){
  
  this.detailForm.reset()
  this.isUpdate = false;
}
//Delete OGP Details

deleteIGPDetail(data:any){
  
  let BranchCode = +localStorage.getItem('BranchCode')!;
  let IGPNo = +this.IGPNo;
  let StoreCode = +this.selectedStoreCode;
  this.confirmService.confirm({
    message: 'Are you sure that you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.apiService
        .delete(ApiEndpoints.DeleteIGPDetail + `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&IGPNo=${IGPNo}&IGP_PK=${data}`)
        .subscribe((res: any) => {
          this.toastService.sendMessage({
            message: 'OGP Detail Deleted Successfully!',
            type: NotificationType.deleted,
          });
          this.LoadIGPDetailList();
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

//Preview / Print OGP Details
//OutwardGatePassReport
printOgpDetails() {
  this.loading = true;
  let BranchCode = +localStorage.getItem('BranchCode')!;
  let IGPNo = +this.IGPNo;
  let StoreCode = +this.selectedStoreCode;
  this.apiservice
    .pintOGPReport(
      BranchCode,
      StoreCode,
      IGPNo
    )
    .subscribe((pdf: any) => {
      const file = new Blob([pdf], {
        type: 'application/pdf',
      });
      this.loading = false;

      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
}



//Table Scroll

onMainContainerScroll(event: Event) {
  const mainContainer = event.target as HTMLElement;
  const scrollPosition = mainContainer.scrollTop;
  if (scrollPosition > 0) {
    this.isSticky = true;
  } else {
    this.isSticky = false;
  }
}
OGPDialogue(){
  this.OGPDialog = true;
}
PODialogue(){
  this.PODialog = true;
}
balanceQuantity:number=0;
SearchPO(){
  let BranchCode = +localStorage.getItem('BranchCode')!;
  let PONo = this.PONo;
  let StoreCode = +this.selectedStoreCode;
  this.apiService
    .get(ApiEndpoints.ImportDataFromPOInIGP + `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&PONo=${PONo}`)
    .subscribe((res: any) => {
      
      this.POData = res;
    });
}

SearchOGP(){
  
  let BranchCode = +localStorage.getItem('BranchCode')!;
  let OGPNo = this.OGPNo;
  let StoreCode = +this.selectedStoreCode;
  this.apiService
    .get(ApiEndpoints.ImportDataFromOGPInIGP + `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&OGPNo=${OGPNo}`)
    .subscribe((res: any) => {
      
      this.OGPData = res;
    });
}

  closeOGPDialog() {
    this.OGPDialog = false;
    this.PODialog = false;
  }
}
