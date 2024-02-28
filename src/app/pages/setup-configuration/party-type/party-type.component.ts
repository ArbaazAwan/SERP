import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-party-type',
  templateUrl: './party-type.component.html',
  styleUrls: ['./party-type.component.scss'],
})

export class PartyTypeComponent implements OnInit {
  form!: FormGroup;
  PartyTyperesponse$: any = [];
  globalBranchCode: number = 0;
  globalUserId: number = 0;
  isUpdate!: boolean;
  componentName: string = 'Party Type';

  get formValue(): any {
    return this.form.getRawValue();
  }
  get formControls(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private utilityService: UtilityService,
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.loadAllPartyType();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
  }

  formInit() {
    this.form = this.fb.group({
      BranchCode: [null],
      PartyTypeId: [null],
      PartyType: [null, Validators.required],
      Description: [null, Validators.required],
      IsActive: [true, Validators.required],
    });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.form.patchValue({ ...data });
  }

  loadAllPartyType() {
    this.apiServices.get(ApiEndpoints.PartyType).subscribe((res: any) => {
      this.PartyTyperesponse$ = res;
    });
  }

  save() {
    let payLoad = this.formValue;
    payLoad.BranchCode = this.globalBranchCode!;
    payLoad.CreatedBy = this.globalUserId!;
    payLoad.UserId = +localStorage.getItem('UserId')!;
    this.apiServices.post(payLoad, ApiEndpoints.PartyType).subscribe({
      next: () => {
        this.toastService.sendMessage({
          message: 'Party Type Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllPartyType();
        this.refresh();
      },
      error: () => {
        this.toastService.sendMessage({
          message: 'Error Occured while saving Party Type',
          type: NotificationType.error,
        });
      },
    });
  }

  update() {
    let payLoad = this.formValue;
    payLoad.BranchCode = this.globalBranchCode!;
    payLoad.ModifiedBy = this.globalUserId!;
    this.apiServices.update(payLoad, ApiEndpoints.PartyType).subscribe({
      next: () => {
        this.toastService.sendMessage({
          message: 'Party Type Updated Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
        this.loadAllPartyType();
      },
      error: (err) => {
        this.toastService.sendMessage({
          message: 'Error Occured while updating Party Type',
          type: NotificationType.error,
        });
      },
    });
  }

  delete(partyTypeId: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(ApiEndpoints.PartyType + `/${partyTypeId}`)
          .subscribe({
            next: () => {
              this.toastService.sendMessage({
                message: 'Party Type Deleted Successfully!',
                type: NotificationType.error,
                title: 'Deleted',
              });
              this.loadAllPartyType();
            },
            error: (err) => {
              this.toastService.sendMessage({
                message: 'Error Occured while Updating Party Type',
                type: NotificationType.error,
              });
            },
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

  addorUpdate() {
    if(this.form.invalid){
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      this.toastService.sendMessage({
        type: NotificationType.error,
        message: "Form is Invalid Please Check all fields"
      });
      return;
    }

    if (!this.isUpdate)
      this.save();
    else
      this.update();
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
  }
}
