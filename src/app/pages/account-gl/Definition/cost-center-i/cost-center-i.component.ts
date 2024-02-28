import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cost-center-i',
  templateUrl: './cost-center-i.component.html',
  styleUrls: ['./cost-center-i.component.scss'],
})
export class CostCenterIComponent implements OnInit {
  form!: FormGroup;
  CodeLeveli: any = [];
  CodeLeveliresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  loadingerror = false;
ModulelistResp$: any = [];
UserId:any;
componentName: string = "Cost Center Level I";
isLoadingData: boolean = false;
  isSticky: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
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
      CodeLevel: this.fb.control('', Validators.required),
      Name: this.fb.control('', Validators.required),
    });
    //=====================Get User Rights =================
    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 13;
    this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.loadAllCostCentersLevel1();
  }

  loadAllCostCentersLevel1() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllCostCentersLevel1)
      .subscribe((res: any) => {
        this.CodeLeveliresponse$ = res;
        this.isLoadingData = false;
      });
    this.loadMaxCostCentersLevel1Code();
  }

  loadMaxCostCentersLevel1Code() {
    this.apiServices
      .get(ApiEndpoints.getMaxCostCentersLevel1Code)
      .subscribe((res: any) => {
        this.CodeLeveli.CodeLevel = res[0].CodeLevel;
      });
  }

  save() {
    let model = this.form.value;
    model.CodeLevel = this.CodeLeveli.CodeLevel;
    model.Name = this.CodeLeveli.Name;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices
      .post(model, ApiEndpoints.postCostCentersLevel1)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Cost Center I Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllCostCentersLevel1();
        this.form.reset();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.CodeLeveli = { ...data };
    this.tableLength = Object.keys(this.CodeLeveli).length;
  }

  update() {
    let model = this.form.value;
    this.apiServices
      .update(model, ApiEndpoints.putCostCentersLevel1)
      .subscribe(() => {
        this.loadAllCostCentersLevel1();
        this.toastService.sendMessage({
          message: 'Cost Center I Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(CodeLevel: number) {
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
            ApiEndpoints.deleteCostCentersLevel1 + '?CodeLevel=' + CodeLevel
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Cost Center I Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCostCentersLevel1();
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
    this.loadAllCostCentersLevel1();
  }
}
