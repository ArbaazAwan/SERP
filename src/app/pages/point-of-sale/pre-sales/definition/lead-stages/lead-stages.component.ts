import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-lead-stages',
  templateUrl: './lead-stages.component.html',
  styleUrls: ['./lead-stages.component.scss'],
})
export class LeadStagesComponent implements OnInit {
  form!: FormGroup;
  stages: any = [];
  stagesresponse$: any = [];
  stagesMAxCode: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Leads Stages';
  isLoadingData: boolean = false;
  
  @Input() displayHeader: any;
  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.stages.IsActive = true;
    this.form = this.fb.group({
      StageCode: this.fb.control('', Validators.required),
      StageName: this.fb.control('', Validators.required),
      StagePercentage: this.fb.control('', [Validators.required,Validators.pattern(/^[1-9]\d*$/)]),
      IsActive: this.fb.control(true, Validators.required),
    });

    //=====================Get User Rights =================

    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 9;
    const FormId = 1;
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
    this.loadAllLeadStages();
  }

  loadAllLeadStages() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.GET_ALL_LeadStages)
      .subscribe((res: any) => {
        this.stagesresponse$ = res.data;
        this.isLoadingData = false;
      });
    this.loadStagesMAxCode();
  }
  loadStagesMAxCode() {
    this.apiServices
      .get(ApiEndpoints.GET_MAX_LeadStages_CODE)
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.stagesMAxCode = +x.StageCode;
        this.form.get('StageCode')?.setValue(this.stagesMAxCode);
      });
  }
  save() {
    
    this.form.patchValue({
      StageCode: this.stagesMAxCode,
    });
    let model = this.form.value;
    model.IsActive = this.form.value.IsActive || false;
    this.apiServices
      .post(model, ApiEndpoints.ADD_LeadStages)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Lead Stages Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllLeadStages();
        this.form.reset();
      });
  }

  getSelectedRow(data: any) {
    
    this.isUpdate = true;
    this.stages = { ...data };
    this.tableLength = Object.keys(this.stages).length;
  }
  update() {
    this.apiServices
      .update(this.stages, ApiEndpoints.UPDATE_LeadStages)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Lead Stages Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllLeadStages();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(StageCode: number) {
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
          .delete(ApiEndpoints.DELETE_LeadStages + '?StageCode=' + StageCode)
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Lead Stages Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllLeadStages();
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
    this.form.reset();
    this.loadAllLeadStages();
  }
  IsActive() {
    const IsActiveControl = this.form.get('IsActive');
    if (IsActiveControl) {
      IsActiveControl.setValue(!IsActiveControl.value);
    }
  }
  
}
