import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-purchase-requsition-type',
  templateUrl: './purchase-requsition-type.component.html',
  styleUrls: ['./purchase-requsition-type.component.scss']
})
export class PurchaseRequsitionTypeComponent implements OnInit {

  //----------Component Name---------------
  componentName:string = "PR Type";

  //----------Form Name--------------------
  prTypeForm!:FormGroup;

  //-----------List Name-------------------
  prTypesList:any[] = [];
  
  //-----------Other Variables-------------
  isUpdate:boolean = false;
  isLoadingData:boolean = false;
  branchCode:number = 0;
  userId : number =0;
  PRTypeNo: number = 0;

  constructor(
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _apiService: ApiProviderService,
    private _confirmservice: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.branchCode = +localStorage.getItem('BranchCode')!;
    this.userId = +localStorage.getItem('UserId')!;
    this.formInIt();
    this.getList();
  }

  //-------------------Form Initialization Method-----------------------------
  formInIt(){
    this.prTypeForm = this._fb.group({
      PRTypeName: this._fb.control('',Validators.required),
      IsActive: this._fb.control(''),
    });
  }

  //------------------CRUD Methods-------------------------------------------

  getList(){
    debugger
    this._apiService.get(ApiEndpoints.PurchaseRequistionType + '?BranchCode='+this.branchCode).subscribe({
      next:(res:any)=>{
        debugger
        this.prTypesList = res;
      },
      error:()=>{
        this._toastService.sendMessage({
          message: 'Error Getting Records!',
          type: NotificationType.error,
        });
      }
    })
  }

save(){
debugger
let model = this.prTypeForm.value;
model.BranchCode = this.branchCode;
model.CreatedBy = this.userId;
model.IsActive = this.prTypeForm.get('IsActive')?.value || false;
this._apiService.post(model,ApiEndpoints.PurchaseRequistionType).subscribe({
  next:(res:any)=>{
    this._toastService.sendMessage({
      message: ' Record Saved Successfully!',
      type: NotificationType.success,
    });
    this.getList();
    this.formInIt();
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
    let model = this.prTypeForm.value;
    model.BranchCode = this.branchCode;
    model.ModifiedBy = this.userId;
    model.PRTypeNo = this.PRTypeNo;
    model.IsActive = this.prTypeForm.get('IsActive')?.value || false;
    this._apiService.update(model,ApiEndpoints.PurchaseRequistionType).subscribe({
      next:(res:any)=>{
        this._toastService.sendMessage({
          message: ' Record Updated Successfully!',
          type: NotificationType.success,
        });
        this.getList();
        this.formInIt();
      },
      error:()=>{
        this._toastService.sendMessage({
          message: ' Record Updated failed!',
          type: NotificationType.error,
        });
      }
    })
  }

  delete(id:any){
    this._confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._apiService.delete(ApiEndpoints.PurchaseRequistionType + '?PRTypeNo='+id).subscribe(() => {
          debugger
            this._toastService.sendMessage({
              message: 'Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.getList();
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


  //------------------Get Row Data Method-------------------------------------------

  getSelectedRow(data:any){
    this.isUpdate = true;
    this.PRTypeNo = data.PRTypeNo;
    this.prTypeForm.patchValue({...data});
  }

  //------------------Refresh Form Method-------------------------------------------
 
  refresh(){
    this.formInIt();
    this.isUpdate = false;
  }

}
