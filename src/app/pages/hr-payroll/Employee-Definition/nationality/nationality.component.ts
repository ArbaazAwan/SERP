import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.scss'],
})
export class NationalityComponent implements OnInit {
  form: FormGroup = this.fb.group({
    BranchCode: ['', Validators.required],
    NationalityCode: ['', Validators.required],
    NationalityName: ['', Validators.required],
    Status: ['', Validators.required],
    AddDateTime: ['', Validators.required],
  });
  nationality: any = [];
  nationalityresponse$: any = [];
  NationalityMAxCode: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  isSticky: boolean = false;
  isLoadingData: boolean = false;

  constructor(
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private fb: FormBuilder
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
    this.loadAllNationalities();
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 4;
    const FormId = 15;
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
  Status() {
    const Status = this.form.get('Status');
    if (Status) {
      Status.setValue(!Status.value);
    }
  }

  loadAllNationalities() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.GET_ALL_NATIONALITIES)
      .subscribe((res: any) => {
        this.nationalityresponse$ = res;
        this.isLoadingData = false;
      });
    this.loadNationalityMAxCode();
  }
  loadNationalityMAxCode() {
    this.apiServices.get(ApiEndpoints.GET_MAX_NATIONALITY).subscribe((res) => {
      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
      this.NationalityMAxCode = +x.NationalityCode;
      this.form.get('NationalityCode')?.setValue(this.NationalityMAxCode);
    });
  }
  save() {
    let currentDate = new Date();
    this.form.patchValue({
      NationalityCode: this.NationalityMAxCode,
      Status: this.form.get('Status')?.value === undefined ? false : true,
      AddDateTime: currentDate.toLocaleString(),
    });
    let model = this.form.value;
    model.BranchCode = +localStorage.getItem('BranchCode')!;
    model.UserId = +localStorage.getItem('UserId')!;
    model.NationalityName = this.nationality.NationalityName;
    this.apiServices
      .post(model, ApiEndpoints.ADD_NATIONALITY)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Nationality Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllNationalities();
        this.form.reset();
      });
    this.form.markAsUntouched();
  }
  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.nationality = { ...data };
    this.tableLength = Object.keys(this.nationality).length;
  }
  update() {
    this.apiServices
      .update(this.nationality, ApiEndpoints.UPDATE_NATIONALITY)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Nationality Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadAllNationalities();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(NationalityCode: number) {
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
            ApiEndpoints.DELETE_NATIONALITY +
              '?NationalityCode=' +
              NationalityCode
          )
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Nationality Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllNationalities();
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
    this.loadAllNationalities();
  }
}
