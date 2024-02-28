import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cost-center-iii',
  templateUrl: './cost-center-iii.component.html',
  styleUrls: ['./cost-center-iii.component.scss'],
})
export class CostCenterIIIComponent implements OnInit {
  form!: FormGroup;
  selectedCostCentersLevel1: any;
  selectedCostCentersLevel2: any;
  CostCentersLevel1$: any = [];
  CostCentersLevel2$: any = [];
  CostCentersLevel3$: any = [];
  isUpdate!: boolean;
  MaxCostCentersLevel3Id: any;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
 componentName: string = "Cost Center Level III";
 isLoadingData: boolean = false;

  CostCenteriiiResponse$: any = [];
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      CodeLevel: this.fb.control('', Validators.required),
      CodeLevel2: this.fb.control('', Validators.required),
      CodeLevel3: this.fb.control('', Validators.required),
      Name: this.fb.control('', Validators.required),
    });
    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 15;
    this.apiService.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.loadAllCostCentersLevel1();
    this.loadAllCostCentersLevel3();
  }

  changeCostCentersLevel1(e: any) {
    this.selectedCostCentersLevel1 = +e.value;
    this.loadAllCostCentersLevel2(this.selectedCostCentersLevel1);
  }
  loadAllCostCentersLevel1() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.getAllCostCentersLevel1)
      .subscribe((res: any) => {
        this.CostCentersLevel1$ = res;
        this.isLoadingData = false;
      });
  }

  changeCostCentersLevel2(e: any) {
    this.selectedCostCentersLevel2 = +e.value;
    this.loadMaxCostCentersLevel3Id(
      this.selectedCostCentersLevel1,
      this.selectedCostCentersLevel2
    );
  }
  loadAllCostCentersLevel2(CodeLevel: number) {
    this.apiService
      .get(ApiEndpoints.getAllCostCentersLevel2 + '?CodeLevel=' + CodeLevel)
      .subscribe((res: any) => {
        this.CostCentersLevel2$ = res;
      });
  }
  loadAllCostCentersLevel3() {

    this.apiService
      .get(ApiEndpoints.getAllCostCentersLevel3)
      .subscribe((res: any) => {
        this.CostCentersLevel3$ = res;
      });
  }

  loadMaxCostCentersLevel3Id(CodeLevel: number, CodeLevel2: number) {
    this.apiService
      .get(
        ApiEndpoints.getMaxCostCentersLevel3 +
          '?CodeLevel=' +
          CodeLevel +
          '&CodeLevel2=' +
          CodeLevel2
      )
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.MaxCostCentersLevel3Id = +x.CodeLevel3;
      });
  }

  save() {
    let model = this.form.value;
    model.CodeLevel = this.selectedCostCentersLevel1;
    model.CodeLevel2 = this.selectedCostCentersLevel2;
    model.CodeLevel3 = this.MaxCostCentersLevel3Id;
    model.Name = this.CostCenteriiiResponse$.Name;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiService
      .post(model, ApiEndpoints.postCostCentersLevel3)
      .subscribe(() => {
        this.loadAllCostCentersLevel3();
        this.toastService.sendMessage({
          message: 'Cost Center III Saved Successfully!',
          type: NotificationType.success,
        });

        this.refresh();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.CostCenteriiiResponse$ = { ...data };
    if (typeof data.CodeLevel === 'string') {
      this.CostCenteriiiResponse$.CodeLevel = data.CodeLevel.trim();
    }
    if (typeof data.CodeLevel2 === 'string') {
      this.CostCenteriiiResponse$.CodeLevel2 = data.CodeLevel2.trim();
    }
  }

  update() {
    let model = this.form.value;
    model.CodeLevel = this.selectedCostCentersLevel1;
    if (isNaN(model.CodeLevel)) {
      model.CodeLevel = this.CostCenteriiiResponse$.CodeLevel;
    }
    model.CodeLevel2 = this.selectedCostCentersLevel2;
    if (isNaN(model.CodeLevel2)) {
      model.CodeLevel2 = this.CostCenteriiiResponse$.CodeLevel2;
    }
    model.CodeLevel3 = this.CostCenteriiiResponse$.CodeLevel3;
    model.Name = this.CostCenteriiiResponse$.Name;
    this.apiService
      .update(model, ApiEndpoints.putCostCentersLevel3)
      .subscribe(() => {
        this.loadAllCostCentersLevel3();
        this.toastService.sendMessage({
          message: 'Cost Center III Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(CodeLevel: number, CodeLevel2: number, CodeLevel3: number) {
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
            ApiEndpoints.deleteCostCentersLevel3 +
              '?CodeLevel=' +
              CodeLevel +
              '&CodeLevel2=' +
              CodeLevel2 +
              '&CodeLevel3=' +
              CodeLevel3
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Cost Center III Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCostCentersLevel3();
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
    this.CostCenteriiiResponse$.CodeLevel = null;
    this.CostCenteriiiResponse$.CodeLevel2 = null;
    this.form.reset();
  }
}
