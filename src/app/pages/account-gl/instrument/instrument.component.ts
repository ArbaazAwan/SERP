import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { InstrumentModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.scss'],
})
export class InstrumentComponent implements OnInit {
  form!: FormGroup;
  Instrument: any = [];
  isUpdate!: boolean;
  model!: InstrumentModel;
  tableLength!: number;
  InstrumentMaxId: number = 0;
  loadingerror = false;
  ModulelistResp$: any = [];
  componentName: string = "Instrument";
  UserId:any;
  isLoadingData: boolean = false;
  isSticky: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
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
    this.form = this.fb.group({
      InstrumentTypeId: this.fb.control('', Validators.required),
      InstrumentTypeName: this.fb.control('', Validators.required),
      ShortName: this.fb.control('', Validators.required),
      CreatedOn: this.fb.control('', Validators.required),
      CreatedBy: this.fb.control('', Validators.required),
      ModifiedOn: this.fb.control(''),
      ModifiedBy: this.fb.control(''),
      IsActive: this.fb.control(true, Validators.required),
    });

    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 3;
    this.apiService.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });

    this.LoadAllInstrumentType();
    this.LoadInstrumentMaxNo();
  }
  Active(){
    const ActiveControl = this.form.get('IsActive');
    if (ActiveControl) {
      ActiveControl.setValue(!ActiveControl.value);
    }
  }
  LoadAllInstrumentType() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.getAllInstrumentType).subscribe((res) => {
      this.Instrument = res;
      this.isLoadingData = false;
    });
  }

  LoadInstrumentMaxNo() {
    this.apiService
      .get(ApiEndpoints.getInstrumentTypeMaxId)
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.InstrumentMaxId = +x.InstrumentNo;
      });
  }

  resetForm() {
    const exclude: string[] = ['InstrumentTypeId'];
    Object.keys(this.form.controls).forEach((key) => {
      if (exclude.findIndex((q) => q === key) === -1) {
        this.form.get(key)?.reset();
      }
    });
  }

  Add() {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();

    this.form.patchValue({
      CreatedBy: +user!,
      CreatedOn: +currentDate!,
      IsActive:
        this.form.get('IsActive')?.value === undefined
          ? false
          : this.form.get('IsActive')?.value,
      InstrumentTypeId: +this.InstrumentMaxId,
    });

    if (this.form.invalid) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }

    let val = this.form.value;
    this.model = val;
    console.table(this.model);
    this.apiService
      .post(this.model, ApiEndpoints.postInstrumentType)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Instrument Saved Successfully!',
          type: NotificationType.success,
        });
        this.LoadAllInstrumentType();
        this.LoadInstrumentMaxNo();
      });
    this.resetForm();
  }

  update() {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();

    this.form.patchValue({
      ModifiedBy: +user!,
      ModifiedOn: +currentDate!,
    });

    let val = this.form.value;
    this.model = val;

    this.apiService
      .update(this.model, ApiEndpoints.putInstrumentType)
      .subscribe((res) => {

        this.toastService.sendMessage({
          message: 'Instrument Updated Successfully!',
          type: NotificationType.success,
        });
        this.LoadAllInstrumentType();
        this.LoadInstrumentMaxNo();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.Instrument = { ...data };
    this.tableLength = Object.keys(this.Instrument).length;
  }

  delete(InstrumentTypeId: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.deleteInstrumentType +
              '?InstrumentTypeId=' +
              InstrumentTypeId
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Instrument Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.LoadAllInstrumentType();
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


  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.Add();
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
    this.form.reset();
    this.LoadAllInstrumentType();
  }
}
