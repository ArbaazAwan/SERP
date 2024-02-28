import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-levelof-interest',
  templateUrl: './levelof-interest.component.html',
  styleUrls: ['./levelof-interest.component.scss'],
})
export class LevelofInterestComponent implements OnInit {
  form!: FormGroup;
  LevelofInterest: any = [];
  LevelofInterestresponse$: any = [];
  LevelofInterestMAxCode: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  isLoadingData: boolean = false;
  @Input() displayHeader: any;
  componentName: string = 'Level Of Interest';

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      LevelOfInterestCode: this.fb.control('', Validators.required),
      LevelOfInterestTitle: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required),
    });
    this.loadAllLevelofInterestMAxCode();

    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 9;
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
  }

  loadAllLevelofInterestMAxCode() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.GetAllLevelOfInterest)
      .subscribe((res: any) => {
        this.LevelofInterestresponse$ = res.data;
        this.isLoadingData = false;
      });
    this.loadLevelofInterestMAxCode();
  }
  loadLevelofInterestMAxCode() {
    this.apiServices
      .get(ApiEndpoints.GetMaxLevelOfInterestCode)
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.LevelofInterestMAxCode = +x.LevelOfInterestCode;
        this.form
          .get('LevelOfInterestCode')
          ?.setValue(this.LevelofInterestMAxCode);
      });
  }
  save() {
    this.form.patchValue({
      LevelOfInterestCode: this.LevelofInterestMAxCode,
      IsActive: this.form.get('IsActive')?.value === undefined ? false : true,
    });
    let model = this.form.value;
    model.LevelOfInterestTitle = this.LevelofInterest.LevelOfInterestTitle;
    this.apiServices
      .post(model, ApiEndpoints.AddLevelOfInterest)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Level Of Interest Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllLevelofInterestMAxCode();
        this.form.reset();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.LevelofInterest = { ...data };
    this.tableLength = Object.keys(this.LevelofInterest).length;
  }
  update() {
    this.apiServices
      .update(this.LevelofInterest, ApiEndpoints.UpdateLevelOfInterest)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Level Of Interest Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllLevelofInterestMAxCode();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(LevelOfInterestCode: number) {
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
          .delete(
            ApiEndpoints.DeleteLevelOfInterest +
              '?LevelOfInterestCode=' +
              LevelOfInterestCode
          )
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Level Of Interest Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllLevelofInterestMAxCode();
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
    this.loadAllLevelofInterestMAxCode();
  }
  IsActive() {
    const IsActiveControl = this.form.get('IsActive');
    if (IsActiveControl) {
      IsActiveControl.setValue(!IsActiveControl.value);
    }
  }
}
