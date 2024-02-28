import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-budget-status',
  templateUrl: './budget-status.component.html',
  styleUrls: ['./budget-status.component.scss'],
})
export class BudgetStatusComponent implements OnInit {
  form!: FormGroup;
  componentName: string = 'Budget Status';
  budgetStatusList: any[] = [];
  ModulelistResp$: any = [];
  globalBranchCode!: number;
  globalUserId!: number;
  isUpdate: boolean = false;
  selectedRow: any;
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  errorDialogue: boolean = false;
  isEdit!: string;
  isToastShown: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private apiProviderService: ApiProviderService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.formInit();

    const UserId = localStorage.getItem('UserId');
    const ModuleId = 2;
    const FormId = 1;
    this.apiProviderService
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
    this.getAllBudgetStatus();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
  }

  getAllBudgetStatus() {
    this.isLoadingData = true;
    this.apiProviderService.get(ApiEndpoints.GetAllBudgetStatus).subscribe({
      next: (res: any) => {
        this.budgetStatusList = res;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.toastService.sendMessage({
          message: 'Error in fetching Budget Status Data!',
          type: NotificationType.error,
        });
      },
    });
  }

  formInit() {
    this.form = this.fb.group({
      BudgetStatusCode: [null],
      BudgetStatus: ['', Validators.required],
      IsActive: [true],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }

  save() {
    let model = this.form.value;
    model.CreatedBy = this.globalUserId;
    this.apiProviderService
      .post(model, ApiEndpoints.CreateBudgetStatus)
      .subscribe({
        next: (res: any) => {
          this.getAllBudgetStatus();
          this.toastService.sendMessage({
            message: 'Budget Status Saved Successfully!',
            type: NotificationType.success,
          });
          this.clearForm();
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error while saving Budget Status!',
            type: NotificationType.error,
          });
        },
      });
  }

  update() {
    let model = this.form.value;
    model.ModifiedBy = this.globalUserId;
    this.apiProviderService
      .update(model, ApiEndpoints.UpdateBudgetStatus)
      .subscribe({
        next: (res: any) => {
          this.getAllBudgetStatus();
          this.toastService.sendMessage({
            message: 'Budget Status Updated Successfully!',
            type: NotificationType.success,
          });
          this.clearForm();
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error while Updating Budget Status!',
            type: NotificationType.error,
          });
        },
      });
  }

  edit(data: any) {
    if (
      data.BudgetStatusCode == 1 ||
      data.BudgetStatusCode == 2 ||
      data.BudgetStatusCode == 3 ||
      data.BudgetStatusCode == 4
    ) {
      this.isEdit = 'edit';
      this.errorDialogue = true;
    } else {
      this.isUpdate = true;
      this.selectedRow = data;
      this.form.patchValue(data);
    }
  }

  delete(id: any) {
    if (id == 1 || id == 2 || id == 3 || id == 4) {
      this.isEdit = 'delete';
      this.errorDialogue = true;
    } else {
      this.confirmService.confirm({
        message: 'Are you sure that you want to delete?',
        header: 'Confrimation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.apiProviderService
            .delete(ApiEndpoints.DeleteBudgetStatus + '?BudgetStatusCode=' + id)
            .subscribe({
              next: (res: any) => {
                this.getAllBudgetStatus();
                this.toastService.sendMessage({
                  message: 'Budget Status Deleted Successfully!',
                  type: NotificationType.deleted,
                });
                this.clearForm();
              },
              error: (err: any) => {
                this.toastService.sendMessage({
                  message: 'Error while Deleting Budget Status!',
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
  }

  clearForm() {
    this.isUpdate = false;
    this.selectedRow = null;
    this.formInit();
  }

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  hideErrorPopup() {
    this.errorDialogue = false;
  }
}
