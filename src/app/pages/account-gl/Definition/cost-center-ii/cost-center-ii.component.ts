import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-cost-center-ii',
  templateUrl: './cost-center-ii.component.html',
  styleUrls: ['./cost-center-ii.component.scss'],
})
export class CostCenterIIComponent implements OnInit {
  form!: FormGroup;
  codelevelii: any = [];
  codeleveliiresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  codeleveliiResponse$: any = [];
  selectedcodelevelii: any = [];
  codeleveliiMaxId!: number;
  loadingerror = false;
ModulelistResp$: any = [];
UserId:any;
componentName: string = "Cost Center Level II";
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
      CodeLevel2: this.fb.control('', Validators.required),
      Name: this.fb.control('', Validators.required),
    });
     //=====================Get User Rights =================
     const UserId  = localStorage.getItem('UserId');

     if (UserId !== null) {
       this.UserId = +UserId;
     }
     const ModuleId = 1;
     const FormId = 14;
     this.apiServices.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
       .subscribe((res: any) => {
         this.ModulelistResp$ = res;
       });
    this.loadAllCostCentersLevel2();
    this.loadAllCostCentersLevel1();
  }
  changecodelevelii(e: any) {
    this.selectedcodelevelii = +e.value;
    this.loadMaxCostCentersLevel2Id(this.selectedcodelevelii);
  }
  loadAllCostCentersLevel1() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllCostCentersLevel1)
      .subscribe((res: any) => {
        this.codeleveliiResponse$ = res;
        this.isLoadingData = false;
      });
  }
  loadAllCostCentersLevel2() {
    this.isLoadingData = true;
    this.apiServices
      .get(ApiEndpoints.getAllCostCentersLevel2)
      .subscribe((res: any) => {
        this.codeleveliiresponse$ = res;
        this.isLoadingData = false;
      });
  }

  loadMaxCostCentersLevel2Id(CodeLevel: number) {
    this.apiServices
      .get(ApiEndpoints.getMaxCostCentersLevel2Code + '?CodeLevel=' + CodeLevel)
      .subscribe((res: any) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.codeleveliiMaxId = +(x as { CodeLevel2: number }).CodeLevel2;
      });
  }

  save() {
    let model = this.form.value;
    model.CodeLevel = +this.selectedcodelevelii;
    model.CodeLevel2 = this.codeleveliiMaxId;
    model.Name = this.codelevelii.Name;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices
      .post(model, ApiEndpoints.postCostCentersLevel2)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Cost Center II Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadAllCostCentersLevel2();
        this.form.reset();
        this.refresh();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.codelevelii = { ...data };
    if (typeof data.CodeLevel === 'string') {
      this.codelevelii.CodeLevel = data.CodeLevel.trim();
    }
    this.tableLength = Object.keys(this.codelevelii).length;
  }

  update() {
    let model = this.form.value;
    model.CodeLevel = +this.codelevelii.CodeLevel;
    this.apiServices
      .update(model, ApiEndpoints.putCostCentersLevel2)
      .subscribe(() => {
        this.loadAllCostCentersLevel2();
        this.toastService.sendMessage({
          message: 'Cost Center II Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(CodeLevel: number, CodeLevel2: number) {
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
            ApiEndpoints.deleteCostCentersLevel2 +
              '?CodeLevel=' +
              CodeLevel +
              '&CodeLevel2=' +
              CodeLevel2
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Cost Center II Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllCostCentersLevel2();
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
    this.codelevelii.CodeLevel = null;
    this.form.reset();
    this.loadAllCostCentersLevel2();
  }
}
