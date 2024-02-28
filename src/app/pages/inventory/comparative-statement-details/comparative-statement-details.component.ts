import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { StatusListPR } from 'src/app/_shared/model/status-list.model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-comparative-statement-details',
  templateUrl: './comparative-statement-details.component.html',
  styleUrls: ['./comparative-statement-details.component.scss']
})
export class ComparativeStatementDetailsComponent implements OnInit {

//----Form Name-----
masterForm!:FormGroup;
UploadDocform!:FormGroup;

//----Routed Vriables----
routedCSNo:number = 0;
routedStoreCode:number = 0;

//-----Branch Variable----
globalBranchCode:number = 0;

//----Master Form Data Variable----
masterData:any;

//----Date Pipe Variable------
datePipe = new DatePipe('en-US');

//----All DropDowns--------
workOrderList:any;
paymentTermsList:any;
deliveryTermsList:any;
poTypesList:any;
statusList: any = StatusListPR;

//----User Vriable--------
globalUserCode!: number;

//----Copy From PR Dialogue Variable------
prDialog:boolean=false;

//------PR No Variable-------
pRNo:number=0;

//------Document Dialoge Variables------
uploadDoc:boolean=false;

//------Documents Variables --------
selectedFiles:any;
documentList:any;
imageDirectory:any;
documentsList:any;

  constructor(private _fb:FormBuilder,
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _activatedRoute: ActivatedRoute,
    private _documentUploadService: DocumentUploadService,) { }

  
  ngOnInit(): void {
    this.masterFormInIt();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this._activatedRoute.queryParams.subscribe((params:any) => {
      this.routedCSNo = +params['CSNo'];
      this.routedStoreCode = +params['StoreCode'];
    });

    this.GetCSMasterByCSNo();
    this.loadWorkOrderDropdown();
    this.loadPaymentTermsDropdown();
    this.loadDeliveryTermsDropdown();
    this.loadPOTypeDropdown();
    this.loadAllDocuments();
  }

  //-------------------------------------------Forms Initialization----------------------------------------------

masterFormInIt(){
    this.masterForm = this._fb.group({
      CSNo:[''],
      DepartmentName:[''],
      PaymentTermId: [''],
      DeliveryTermId: [''],
      POTypeNo: [''],
      CSDate: [''],
      CSValidityDate: [''],
      Remarks: [''],
      ImagePath: [''],
      Locked: [''],
      wo_number: [''],
      Status:[false]
    });
}

ducumentFormInIt() {
  this.UploadDocform = this._fb.group({
    DocumentId: ['', Validators.required],
    Description: ['', Validators.required],
  });
}


//---------------------------------CRUD Methods---------------------------------

GetCSMasterByCSNo(){
  this._apiService.get(ApiEndpoints.GetCSMasterByCSNo +`?BranchCode=${this.globalBranchCode}&StoreCode=${this.routedStoreCode}&CSNo=${this.routedCSNo}`  ).subscribe({
    next:(res:any)=>{
      debugger
this.masterData = res[0];
this.masterForm.patchValue({...this.masterData,
  CSDate:this.datePipe.transform(this.masterData.CSDate, 'yyyy-MM-dd'),
  CSValidityDate:this.datePipe.transform(this.masterData.CSValidityDate, 'yyyy-MM-dd'),
});
    },
    error:()=>{
      this._toastService.sendMessage({
        message: ' Record Saved failed!',
        type: NotificationType.error,
      });
    }
  })
}


update(){
  let model = this.masterForm.value;
  model.CSDate =this.datePipe.transform(this.masterForm.get('CSDate')!.value, 'yyyy-MM-dd'); 
  model.CSValidityDate =this.datePipe.transform(this.masterForm.get('CSValidityDate')!.value, 'yyyy-MM-dd');
  model.BranchCode = this.globalBranchCode;
  model.ModifiedBy =  this.globalUserCode;
  model.StoreCode = this.routedStoreCode;
  this._apiService.update(model, ApiEndpoints.ComparativeStatement + `?`)
  .subscribe({
    next:(res:any)=>{
      this._toastService.sendMessage({
        message: ' Record Updated Successfully!',
        type: NotificationType.success,
      });
    },
    error:()=>{
      this._toastService.sendMessage({
        message: ' Record Updated failed!',
        type: NotificationType.error,
      });
    }
});
}

//------------------------------------ALL Get Methods for Dropdowns Data-----------------------------------------
loadWorkOrderDropdown() {
  this._apiService.get(ApiEndpoints.LoadWorkOrders + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.workOrderList = res.data;
    });
}

loadPaymentTermsDropdown() {
  this._apiService.get(ApiEndpoints.GetPaymentTerms + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.paymentTermsList = res;
    });
}

loadDeliveryTermsDropdown() {
  this._apiService.get(ApiEndpoints.GetAllDeliveryTerm + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.deliveryTermsList = res;
    });
}

loadPOTypeDropdown(){
  this._apiService.get(ApiEndpoints.PurchaseOrderType + '?BranchCode='+this.globalBranchCode).subscribe({
    next:(res:any)=>{
      debugger
      this.poTypesList = res;
    }
  })
}

//--------------------------------Document Upload Working Here-------------------------------------------
//----------Select Files Method Here----------------
selectFiles(event: any): void {
  const files: FileList = event.target.files;
  this.selectedFiles = [];

  for (let i = 0; i < files.length; i++) {
    this.selectedFiles.push(files[i]);
  }
}

//--------------Get Document Path Here------------------
getDoucumnetPaths(){
  this._apiService
      .get(
        ApiEndpoints.GetAllPaths +
          '?BranchCode=' + this.globalBranchCode
        )
        .subscribe((res: any) => {
          this.imageDirectory = res[0].CSPath;
        });
    }

//-------------Get All Documents Here-------------------
loadAllDocuments() {
  let model = this.UploadDocform.value;
  model.BranchCode = +this.globalBranchCode;
  model.StoreCode = +this.routedStoreCode;
  model.CSNo = +this.routedCSNo;
  this._apiService
    .get(
      ApiEndpoints.GetAllCSDocuments +
      `?BranchCode=${model.BranchCode}&StoreCode=${model.StoreCode}&CSNo=${model.CSNo}`
    )
    .subscribe((res: any) => {
      this.documentsList = res.data;
    });
}    

//--------------Save Document Method Here----------------
saveDocument(){

  let model = this.UploadDocform.value;
  model.BranchCode = +this.globalBranchCode;
  model.StoreCode = +this.routedStoreCode;
  model.CSNo = +this.routedCSNo;
  model.CreatedBy = +this.globalUserCode;
  model.ImageDirectory = this.imageDirectory;
  if (this.selectedFiles.length === 0) {
    return;
  }

  this._documentUploadService.saveCSDocuments(model, this.selectedFiles).subscribe(() => {
    this._toastService.sendMessage({
      message: 'New Document Saved Successfully!',
      type: NotificationType.success,
    });

    this.loadAllDocuments();
    this.ducumentFormInIt();
  });
}

//--------------View Document Method Here----------------
ViewDocument(code:any){

}

//--------------Delete Document Method Here----------------
deleteDocument(code:any){

}

//----------------------------------Open Close Dialogue Method--------------------------------------------
openDialogue(val:any){
  if(val == 'pr'){
    this.prDialog = true;
  }
  if(val == 'doc'){
    this.uploadDoc = true;
  }
}

closeDialogue(val:any){
  if(val == 'pr'){
    this.prDialog = false;
  }
  if(val == 'doc'){
    this.uploadDoc = false;
  }
}

}
