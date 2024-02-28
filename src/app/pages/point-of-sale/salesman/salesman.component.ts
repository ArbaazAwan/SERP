import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-salesman',
  templateUrl: './salesman.component.html',
  styleUrls: ['./salesman.component.scss'],
})
export class SalesmanComponent implements OnInit {
  form!: FormGroup;
  salesman: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  SalesManMAxId: any = [];
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Sales Person';
  isLoadingData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private apiServices: ApiProviderService,
    private _utilityService: UtilityService,
    private _toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      SalesManId: this.fb.control('', Validators.required),
      CNIC: this.fb.control('', Validators.required),
      Name: this.fb.control('', Validators.required),
      Address: this.fb.control('', Validators.required),
      PhoneNo: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required),
    });

    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 5;
    const FormId = 3;
    this.apiServices
      .get(
        ApiEndpoints.GetUserFormRights +
          '?UserId=' +
          UserId +
          '&ModuleId=' +
          ModuleId +
          '&FormId=' +
          FormId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });

    this.loadAllSalesMan();
  }
  IsActive() {
    const IsActive = this.form.get('IsActive');
    if (IsActive) {
      IsActive.setValue(!IsActive.value);
    }
  }
  loadAllSalesMan() {
    this.isLoadingData = true;
    this.apiServices.get(ApiEndpoints.GetAllSalesMan).subscribe((res: any) => {
      this.salesman = res.data;
      this.isLoadingData = false;
    });
    this.loadAllSalesManMaxId();
  }

  // loadAllSalesManMaxId() {
  //   this.apiService.getSalesManMaxId().subscribe((res:any) => {
  //
  //     const x = Object.entries(res.data)
  //       .map((x) => x[1])
  //       .pop();
  //     this.SalesManMAxId = +x.SalesManId;
  //   });
  // }
  loadAllSalesManMaxId() {
    this.apiServices
      .get(ApiEndpoints.GetSalesManMaxId)
      .subscribe((res: any) => {
        const saleman = res.data;
        this.SalesManMAxId = saleman[0].SalesManId;
      });
  }

  save() {
    let branchCode = +localStorage.getItem('BranchCode')!;
    this.form.patchValue({
      BranchCode: +branchCode!,
      SalesManId: this.SalesManMAxId,
      IsActive: this.form.get('IsActive')?.value === undefined ? false : true,
    });
    let val = this.form.value;
    if(this.form.valid){
      this.apiServices
      .post(val, ApiEndpoints.CreateSalesMan + `?`)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Salesman Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllSalesMan();
        this.form.reset();
      });
    this.form.markAsUntouched();
    }
    
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.salesman = { ...data };
    this.tableLength = Object.keys(this.salesman).length;
  }
  update() {
    this.apiServices
      .update(this.salesman, ApiEndpoints.UpdateSalesMan + `?`)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Salesman Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllSalesMan();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(SalesManId: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(ApiEndpoints.DeleteSalesMan + `?SalesManId=${SalesManId}`)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Salesman Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllSalesMan();
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

  addorUpdate() {
    if (!this.isUpdate) {
      this.add();
    } else {
      this.updateAllow();
    }
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
    this.update();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }
  refresh() {
    this.isUpdate = false;
    //this.form.reset();
    this.resetForm();
    this.loadAllSalesMan();
  }
  resetForm() {
    const exclude: string[] = ['SalesManId'];
    Object.keys(this.form.controls).forEach((key) => {
      if (exclude.findIndex((q) => q === key) === -1) {
        this.form.get(key)?.reset();
      }
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(
        this.form
      );
      this._toastService.sendMessage({
        message: 'Please Check Form Values',
        type: NotificationType.error,
        title: 'Invalid Form',
      });
      return;
    }

    // const payLoad: IRecruitmentRequirement = {
    //   ...this.formValues,
    // };

  //   if (this.isUpdate) {
  //     this.updateRecruitmentRequirement(payLoad);
  //   } else {
  //     this.postRecruitmentRequirement(payLoad);
  //   }
  // }
}
}
