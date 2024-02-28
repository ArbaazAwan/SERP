import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { VoucherTypeModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-voucher-type',
  templateUrl: './voucher-type.component.html',
  styleUrls: ['./voucher-type.component.scss'],
})
export class VoucherTypeComponent implements OnInit {
  form!: FormGroup;
  vouchertype: any = [];
  isUpdate!: boolean;
  Vouchermodel!: VoucherTypeModel;
  VoucherTypeMaxId!: number;
  vouchernumbering: any;
  selectvouchernumbering!: number;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  componentName: string = "Voucher Type";
  isLoadingData: boolean = false;
  isSticky: boolean = false;
  //selectVoucher: any = null;

  isDisabled = true;
  isDisableded = true;

  constructor(
    private fb: FormBuilder,
    private apiservice: ApiProviderService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService
  ) {}

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
     if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  ngOnInit(): void {
   
this.formInIT();
    //=====================Get User Rights =================
    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 4;
    this.apiservice.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.loadAllVoucherTypes();
    this.loadVoucherTypeMaxId();
    this.loadAllVoucherNumberingTypes();
  }

  formInIT(){
    this.form = this.fb.group({
      VoucherTypeCode: this.fb.control('', Validators.required),
      VoucherTypeName: this.fb.control('', Validators.required),
      ShortName: this.fb.control('', Validators.required),
      Description: this.fb.control('', Validators.required),
      IsOpenning: this.fb.control(false, Validators.required),
      NumberingTypeCode: this.fb.control('', Validators.required),
      IsPrefix: this.fb.control(false, Validators.required),
      IsDatePrefix: this.fb.control(false, Validators.required),
      PrefixText: this.fb.control(''),
      ReportName: this.fb.control('', Validators.required),
      ApprovalLimitDays: this.fb.control(''),
      IsAutoApprove: this.fb.control(false, Validators.required),
      IsActive: this.fb.control(false, Validators.required),
    });
  }


  ChangeTextBoxPrefix() {
    this.isDisabled = !this.isDisabled;
    return;
  }

  ChangeTextBoxApprove() {
    this.isDisableded = !this.isDisableded;
    return;
  }


  loadAllVoucherTypes() {
    this.isLoadingData = true;
    this.apiservice.get(ApiEndpoints.getAllVoucherTypes).subscribe((res) => {
      this.vouchertype = res;
      this.isLoadingData = false;
    });
  }
  IsPrefix(){
    const IsPrefix = this.form.get('IsPrefix');
    if (IsPrefix) {
      IsPrefix.setValue(!IsPrefix.value);
    }
  }
  IsDatePrefix(){
    const IsDatePrefix = this.form.get('IsDatePrefix');
    if (IsDatePrefix) {
      IsDatePrefix.setValue(!IsDatePrefix.value);
    }
  }
  IsAutoApp(){
    const IsAutoApp = this.form.get('IsAutoApprove');
    if (IsAutoApp) {
      IsAutoApp.setValue(!IsAutoApp.value);
    }
  }
  IsActive(){
    const IsActive = this.form.get('IsActive');
    if (IsActive) {
      IsActive.setValue(!IsActive.value);
    }
  }
  IsOpenning(){
    const IsOpenning = this.form.get('IsOpenning');
    if (IsOpenning) {
      IsOpenning.setValue(!IsOpenning.value);
    }
  }
  loadVoucherTypeMaxId() {
    this.apiservice.get(ApiEndpoints.getVoucherTypeMaxId).subscribe((res) => {
      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
      this.VoucherTypeMaxId = +x.VoucherTypeCode;
      this.vouchertype.VoucherTypeCode = this.VoucherTypeMaxId;
    });
  }

  // vouchernumberingtype
  get VoucherNumberingTypesName() {
    return this.form.get('voucherDropdown');
  }
  changeNumberingType(e: any) {
    this.selectvouchernumbering = +e.target.value;
  }

  loadAllVoucherNumberingTypes() {
    this.apiservice
      .get(ApiEndpoints.getAllVoucherNumberingTypes)
      .subscribe((res: any) => {
        this.vouchernumbering = res;
      });
  }

  // save() {
  //   debugger
  //   this.form.patchValue({
  //     VoucherTypeCode: +this.VoucherTypeMaxId,
  //     NumberingTypeCode: this.selectvouchernumbering!,
  //     IsActive:
  //       this.form.get('IsActive')?.value === undefined
  //         ? false
  //         : this.form.get('IsActive')?.value,
  //     IsOpenning:
  //       this.form.get('IsOpenning')?.value === undefined
  //         ? false
  //         : this.form.get('IsOpenning')?.value,
  //     IsDatePrefix:
  //       this.form.get('IsDatePrefix')?.value === undefined
  //         ? false
  //         : this.form.get('IsDatePrefix')?.value,
  //     IsAutoApprove:
  //       this.form.get('IsAutoApprove')?.value === undefined
  //         ? false
  //         : this.form.get('IsAutoApprove')?.value,
  //     IsPrefix:
  //       this.form.get('IsPrefix')?.value === undefined
  //         ? false
  //         : this.form.get('IsPrefix')?.value,
  //     ApprovalLimitDays:
  //       this.form.get('IsPrefix')?.value === undefined
  //         ? 0
  //         : this.form.get('ApprovalLimitDays')?.value,
  //     PrefixText:
  //       this.form.get('IsPrefix')?.value === undefined
  //         ? ''
  //         : this.form.get('PrefixText')?.value,
  //   });
  //   this.toastService.sendMessage({
  //     message: 'Voucher Type Saved Successfully!',
  //     type: NotificationType.success,
  //   });
  //   if (this.form.invalid) {
  //     return this.toastService.sendMessage({
  //       message: 'Form Invalid!',
  //       type: NotificationType.error,
  //     });
  //   }

  //   let val = this.form.value;
  //   this.Vouchermodel = val;
  //   this.Vouchermodel.PrefixText =
  //     this.form.get('PrefixText')?.value === undefined
  //       ? ''
  //       : this.form.get('PrefixText')?.value;
  //   this.Vouchermodel.ApprovalLimitDays =
  //     this.form.get('ApprovalLimitDays')?.value === undefined
  //       ? 0
  //       : this.form.get('ApprovalLimitDays')?.value;
  //   console.table(val);
  //   this.apiservice
  //     .post(this.Vouchermodel, ApiEndpoints.postNewVoucherType)
  //     .subscribe((res) => {
  //       this.loadAllVoucherTypes();
  //       this.loadVoucherTypeMaxId();
  //     });
  //   this.form.markAsUntouched();
  // }

  save(){
    debugger
    let model = this.form.value;
    model.VoucherTypeCode = +this.VoucherTypeMaxId;
    model.IsDatePrefix = this.form.get('IsDatePrefix')!.value || false;
    model.IsPrefix = this.form.get('IsPrefix')!.value || false;
    model.IsAutoApprove = this.form.get('IsAutoApprove')!.value || false;
    model.IsOpenning = this.form.get('IsOpenning')!.value || false;
    model.ApprovalLimitDays = this.form.value.ApprovalLimitDays || 0;
    this.apiservice
        .post(model, ApiEndpoints.postNewVoucherType)
        .subscribe((res) => {
          this.toastService.sendMessage({
                message: 'Voucher Type Saved Successfully!',
                type: NotificationType.success,
              });
              this.formInIT();
          this.loadAllVoucherTypes();
          this.loadVoucherTypeMaxId();
        });
  }

  // Update() {
  //   this.form.patchValue({
  //     IsActive:
  //       this.form.get('IsActive')?.value === undefined
  //         ? false
  //         : this.form.get('IsActive')?.value,
  //     IsOpenning:
  //       this.form.get('IsOpenning')?.value === undefined
  //         ? false
  //         : this.form.get('IsOpenning')?.value,
  //     IsDatePrefix:
  //       this.form.get('IsDatePrefix')?.value === undefined
  //         ? false
  //         : this.form.get('IsDatePrefix')?.value,
  //     IsAutoApprove:
  //       this.form.get('IsAutoApprove')?.value === undefined
  //         ? false
  //         : this.form.get('IsAutoApprove')?.value,
  //     IsPrefix:
  //       this.form.get('IsPrefix')?.value === undefined
  //         ? false
  //         : this.form.get('IsPrefix')?.value,
  //     ApprovalLimitDays:
  //       this.form.get('IsPrefix')?.value === undefined
  //         ? 0
  //         : this.form.get('ApprovalLimitDays')?.value,
  //     PrefixText:
  //       this.form.get('IsPrefix')?.value === undefined
  //         ? ''
  //         : this.form.get('PrefixText')?.value,
  //   });
  //   this.toastService.sendMessage({
  //     message: 'Voucher Type Updated Successfully!',
  //     type: NotificationType.success,
  //   });
  //   if (this.form.invalid) {
  //     return this.toastService.sendMessage({
  //       message: 'Form Invalid!',
  //       type: NotificationType.error,
  //     });
  //   }

  //   this.apiservice
  //     .update(this.vouchertype, ApiEndpoints.putVoucherType)
  //     .subscribe((res) => {
  //       this.loadAllVoucherTypes();
  //       this.loadVoucherTypeMaxId();
  //       this.form.patchValue({
  //         VoucherTypeModel: this.vouchertype,
  //       });
  //     });
  //   this.isUpdate = false;
  //   this.form.reset();
  // }

  Update(){
    debugger
    let model = this.form.value;
    model.ApprovalLimitDays = this.form.value.ApprovalLimitDays || 0;
    model.IsDatePrefix = this.form.get('IsDatePrefix')!.value || false;
    model.IsPrefix = this.form.get('IsPrefix')!.value || false;
    model.IsAutoApprove = this.form.get('IsAutoApprove')!.value || false;
    model.IsOpenning = this.form.get('IsOpenning')!.value || false;
    this.apiservice
        .update(model, ApiEndpoints.putVoucherType)
        .subscribe((res) => {
          this.toastService.sendMessage({
                message: 'Voucher Type Updated Successfully!',
                type: NotificationType.success,
              });
          this.loadAllVoucherTypes();
          this.loadVoucherTypeMaxId();
          this.isUpdate = false;
          this.formInIT();
         
        });
    
  }

  delete(VoucherTypeCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiservice
          .delete(
            ApiEndpoints.DeletevoucherType +
              '?VoucherTypeCode=' +
              VoucherTypeCode
          )
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Instrument Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllVoucherTypes();
            this.loadVoucherTypeMaxId();
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

    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    debugger
    this.isUpdate = true;
    this.form.patchValue({...data})
    this.form.patchValue({
      NumberingTypeCode:+data.NumberingTypeCode
    })
    // this.vouchertype = data;
    // console.table(data);
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.save();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.Update();
  }

 hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllVoucherTypes();
  }
}
