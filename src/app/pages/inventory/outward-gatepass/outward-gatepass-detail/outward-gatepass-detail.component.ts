import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { OGPDetailModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { PurchaseInvoiceService } from 'src/app/_shared/services/purchase-invoice.service';
import { ToastService } from 'src/app/_shared/services/toast.service';




@Component({
  selector: 'app-outward-gatepass-detail',
  templateUrl: './outward-gatepass-detail.component.html',
  styleUrls: ['./outward-gatepass-detail.component.scss'],
  providers: [DateFormatPipe,DatePipe],
})
export class OutwardGatepassDetailComponent implements OnInit {
  date1: Date | undefined;
  routeStoreCode:any;
  OGPNo:any;
  selectedStoreCode:any;
  masterForm!:FormGroup;
  detailForm!:FormGroup;
  masterData:any;
  datePipe = new DatePipe('en-US');
  StoreItemResponse$:any;
  items:any;
  detailResponse$: any = [];
  issuedialog: boolean = false;
  add: number = 0;
  issueResponse$: any = [];
  issueModel: any = [];
  isLoadingData: boolean = false;
  isDisabled: boolean = true;
  //For date Formate Working
 selectedFormatKey!: number;
 globalBranchCode!:number;
 calculationBtn: boolean = true;
 UserId: any;
 isSticky:boolean = false;
 selectedItemNameAndCodeName:any;
 totalQuantity:number = 0;
 num!:number;
changedValues: { GRNSrNo: number, GRNNo: string ,IssuedQty:number,PONo:string,POSrNo:number}[] = [];
detailsData:any;
isUpdate:boolean = false;
loading = false;
OGP_Pk!:number;
contracts: string[] = ['Printing','Dyeing', 'Embroidery','Processing'];
  constructor(
    private fb: FormBuilder,
    private confirmService: ConfirmationService,
    private apiService: ApiProviderService,
    private activatedRoute: ActivatedRoute,
    private dateFormatPipe:DateFormatPipe,
    private toastService: ToastService,
    private apiservice: PurchaseInvoiceService,
  ) {
    this.detailsFormInIt();
    this.masterFormInit();
  }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe((params) => {
      this.selectedStoreCode = params['StoreCode']
      this.OGPNo = params['OGPNo'];
    });
    this.isDisabled = true;
    this.UserId = +localStorage.getItem('UserId')!;
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;

    this.loadAllCompanyConfig();
    this.loadMasterData();
    this. LoadStoreItem();
    this.LoadOGPDetailList();
   
  }

  masterFormInit() {
    
    this.masterForm = this.fb.group({
      DepartmentName: ['', Validators.required],
      PartyName: ['', Validators.required],
      Location: ['', Validators.required],
      PurposeTitle: ['', Validators.required],
      OGPNo: ['', Validators.required],
      Driver: ['',],
      VehicleNo: ['', ],
      OGPDate:['', Validators.required],
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
      StoreCode: ['', Validators.required],
      ItemCode: ['', Validators.required],
      ContractType: [''],
      ItemName: ['', Validators.required],
      ItemUnit: ['', Validators.required],
      ContractNo: [null],
      IssuedQty: [null, Validators.required],
      GRNNo: [null, Validators.required],
      GRNSrNo: [null, Validators.required],
      OGPNo: [null, Validators.required],
      UnitCode: [null, Validators.required],
      Remarks: [''],
    });
  }
  
  formConfig(){
    if(this.isUpdate == true){
      this.detailForm.get('ItemCode')!.disable();
      this.detailForm.get('IssuedQty')!.disable();
      this.detailForm.get('ItemName')!.disable();
      this.detailForm.get('ItemUnit')!.disable();
    }
    else{
      this.detailForm.get('ItemCode')!.enable();
      this.detailForm.get('IssuedQty')!.enable();
      this.detailForm.get('ItemName')!.enable();
      this.detailForm.get('ItemUnit')!.enable();
    }
    
  }

  loadMasterData() {
    let BranchCode = +localStorage.getItem('BranchCode')!;
    this.apiService
      .get(ApiEndpoints.GetOGPMasterData + `?BranchCode=${BranchCode}&StoreCode=${this.selectedStoreCode}&OGPNo=${this.OGPNo}`)
      .subscribe((res: any) => {
        
        this.masterData = res[0];
        this.masterData.OGPDate = this.parseAndFormatDate(this.masterData.OGPDate);
        this.masterForm.patchValue({...this.masterData})
       
      });
  }

  UpdateMasterDetails(){
    
    let model = this.masterForm.value;
    model.BranchCode = this.globalBranchCode;
    model.ModifiedBy = this.UserId;
    model.StoreCode = this.masterData.StoreCode;
    model.LockedBy = this.UserId;
    model.IsReturnable = this.masterForm.value.IsReturnable || false;
    model.IsOpen = this.masterForm.value.IsOpen || false;
    model.OGPDate = this.datePipe.transform(model.OGPDate, 'MMM-d-y');
      this.apiService.update(model,ApiEndpoints.UpdateOGPMaster ).subscribe((res) => {
        this.toastService.sendMessage({
          message: 'OGP Master Update Successfully!',
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
openGRNS(){
  
  if (this.detailForm.value.IssuedQty != null) {
    
        if(+this.items != this.num){
          this.issuedialog = true;
        this.apiService.get(ApiEndpoints.LoadItemStockDetailsOGP + 
          `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStoreCode}&ItemCode=${this.items}`)
          .subscribe((res: any) => {
            
            this.issueResponse$ = res;
          });
        }
        else{
          this.issuedialog = true;
        }
        this.num = +this.items;
      }
}

hideIssueDialog(){
  this.issuedialog = false;
  //this.changedValues = [];
}

checkIssueQty(){
 if(this.totalQuantity != this.detailForm.value.IssuedQty){
  return this.toastService.sendMessage({
    message: `Selected Quantity should be equal to Issued Quantity`,
    type: NotificationType.error,
    
});
 }
 else{
  this.issuedialog = false;
 // this.totalQuantity = 0;
 
 }
}

collectiveQuantity(data:any){

this.totalQuantity = this.issueResponse$.reduce((sum:any, m:any) => sum + (m.IssQty || 0), 0);

let x = this.issueResponse$.filter((x:any) => {

  const hasInvalidQuantity = this.issueResponse$.some((x: any) => {
    return data.GRNSrNo === x.GRNSrNo && data.IssQty > x.StockQty;
  });
  this.calculationBtn = hasInvalidQuantity;

if(data.GRNSrNo == x.GRNSrNo && data.IssQty>x.StockQty){
  return this.toastService.sendMessage({
            message: `GRN SR # ${data.GRNSrNo} Issued Qty should be less than or equal to Stock Qty!`,
            type: NotificationType.error,
            
  });
}

if(data.GRNSrNo == x.GRNSrNo && this.totalQuantity > this.detailForm.value.IssuedQty){
  
  return this.toastService.sendMessage({
    message: `Selected Quantity should be equal to Issued Quantity`,
    type: NotificationType.error,
    
});
 }
});

const changedValueIndex = this.changedValues.findIndex(item =>
  item.GRNSrNo === data.GRNSrNo && item.GRNNo === data.GRNNo
);

if (data.IssQty === 0 || data.IssQty === null) {
  // If the value is zero, remove the entry from the array
  if (changedValueIndex !== -1) {
    this.changedValues.splice(changedValueIndex, 1);
  }
} else if (changedValueIndex === -1) {
  // If not found, add to the array
  this.changedValues.push({ GRNSrNo: data.GRNSrNo, GRNNo: data.GRNNo, IssuedQty: data.IssQty, PONo :data.PONo , POSrNo : data.POSrNo});
} else {
  // If found, update the existing value only if it has changed
  if (this.changedValues[changedValueIndex].IssuedQty !== data.IssQty) {
    this.changedValues[changedValueIndex].IssuedQty = data.IssQty;
  }
}

}

//CRUD OGP DETAILS----------------------------------------------------------------
saveOGPDetails(){
  
let model = this.detailForm.value;
if(this.masterForm.value.IsOpen == false){
  if(model.IssuedQty != this.totalQuantity){
    return this.toastService.sendMessage({
      message: `Selected Quantity should be equal to Issued Quantity`,
      type: NotificationType.error,
      
  });
  }
}


model.BranchCode =  +this.globalBranchCode;
model.CreatedBy = +this.UserId;
model.StoreCode = +this.selectedStoreCode;
model.OGPNo = +this.OGPNo;
if(this.masterForm.value.IsOpen == true){
model.ItemCode = 0;
model.UnitCode = 0;
}
if(this.masterForm.value.IsOpen == false){
  model.ItemName = this.selectedItemNameAndCodeName.ItemName;
  model.ItemUnit = this.selectedItemNameAndCodeName.Unit;
  model.UnitCode= this.selectedItemNameAndCodeName.UnitCode;
  }
  const changedValuesArray = Array.isArray(this.changedValues) ? this.changedValues : [this.changedValues];
model.dt_GRN = changedValuesArray;
this.apiService.sendData(model).subscribe(
 
  response => {
    this.toastService.sendMessage({
      message: 'OGP Detail Saved Successfully!',
      type: NotificationType.success,
    });
    console.log('Success:', response);
    this.LoadOGPDetailList();
    this.refreshDeails();
    
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

//Get OGP Details List

LoadOGPDetailList() {
  
  let BranchCode = +localStorage.getItem('BranchCode')!;
  let OGPNo = +this.OGPNo;
  let StoreCode = +this.selectedStoreCode;
  this.apiService
    .get(ApiEndpoints.LoadOGPDetail + `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&OGPNo=${OGPNo}`)
    .subscribe((res: any) => {
      
      this.detailsData = res;
     
    });
}

//Get Data for Update
getSelectedRow(data:any){

this.detailForm.patchValue({...data})
this.items = data.ItemCode;
this.OGP_Pk = data.OGP_PK;
this.isUpdate = true;
this. formConfig()
}

// Update OGP Details
UpdateOGPDetail(){
  
  let model = this.detailForm.value;
  model.BranchCode =  +this.globalBranchCode;
  model.ModifiedBy = +this.UserId;
  model.StoreCode = +this.selectedStoreCode;
  model.OGPNo = +this.OGPNo;
  model.OGP_Pk = this.OGP_Pk;
  this.apiService.update( model, ApiEndpoints.UpdateOGPDetail).subscribe(
   
    response => {
      this.toastService.sendMessage({
        message: 'OGP Detail Update Successfully!',
        type: NotificationType.success,
      });
      console.log('Success:', response);
      this.LoadOGPDetailList();
      this.refreshDeails();
      
      // Handle success response
    },
    error => {
      
      this.toastService.sendMessage({
        message: 'Update Failed!',
        type: NotificationType.error,
      });
      console.error('Error:', error);
      // Handle error response
    }
      ); 
}

refreshDeails(){
  
  this.detailForm.reset()
  this.isUpdate = false;
  this.formConfig();
  this.totalQuantity = 0;
  this.changedValues = [];
  this.num = 0;
  this.items = undefined;
}
//Delete OGP Details

deleteOGPDetail(data:any){
  
  let BranchCode = +localStorage.getItem('BranchCode')!;
  let OGPNo = +this.OGPNo;
  let StoreCode = +this.selectedStoreCode;
  this.confirmService.confirm({
    message: 'Are you sure that you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.apiService
        .delete(ApiEndpoints.DeleteOGPDetail + `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&OGPNo=${OGPNo}&OGP_PK=${data}`)
        .subscribe((res: any) => {
          this.toastService.sendMessage({
            message: 'OGP Detail Deleted Successfully!',
            type: NotificationType.deleted,
          });
          this.LoadOGPDetailList();
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
  let OGPNo = +this.OGPNo;
  let StoreCode = +this.selectedStoreCode;
  this.apiservice
    .pintOGPReport(
      BranchCode,
      StoreCode,
      OGPNo
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
}
