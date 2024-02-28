import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  allStores: any;
  isSticky: boolean = false;
  componentName: string = 'Store';
  storeForm!: FormGroup;
  isLoadingData: boolean = false;
  storeCode: number = 0;
  isUpdate: boolean = false;
  isToastShown: boolean = false;
  mainDialog: boolean = false;
  mainHeader!: string;
  selectedRow: any;
  constructor(
    private apiService: ApiProviderService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private utilityService: UtilityService,
    private confirmService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.formInIt();
    this.loadAllStores();
  }

  formInIt() {
    this.storeForm = this.fb.group({
      StoreName: ['',Validators.required],
      ShortName: ['',Validators.required],
      IsActive: [true],
    });
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

  loadAllStores() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetAllStores).subscribe((res: any) => {
      this.allStores = res;
      this.isLoadingData = false;
    });
  }

  refresh() {
    this.formInIt();
  }

  onSubmit() {
    if (this.storeForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.storeForm);
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
      this.GetMaxStoreCode();
    } else {
      this.update();
    }
  }

  GetMaxStoreCode() {
    this.apiService.get(ApiEndpoints.GetMaxStoreCode).subscribe((res: any) => {
      let storeCode = res[0].StoreCode;
      this.addStore(storeCode);
    });
  }

  addStore(storeCode: number): void {
    let model = this.storeForm.value;
    model.StoreCode = storeCode;
    model.IsActive = !!model.IsActive;
    this.apiService.post(model, ApiEndpoints.AddStore).subscribe({
      next: (res: any) => {
        this.toastService.sendMessage({
          message: 'Store Information Saved Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
        this.loadAllStores();
        this.mainDialog = false;
      },
      error: (err: any) => {
        this.toastService.sendMessage({
          message: 'Error while Saving Store Information',
          type: NotificationType.error,
        });
      },
    });
  }

  openNew(event?: any, action?: string) {
    this.formInIt();
    if (action === 'add') {
      // this.storeForm.reset();
      this.mainHeader = 'Add New Store Information';
      this.mainDialog = true;
      this.isUpdate = false;
    } else if (action === 'edit') {
      this.mainHeader = 'Edit Store Information';
      this.mainDialog = true;
      this.isUpdate = true;
      this.storeForm.patchValue({ ...event });
      this.selectedRow = event;
      this.storeCode = this.selectedRow.StoreCode;
    }
  }

  update() {
    let model = this.storeForm.value;
    model.StoreCode = this.storeCode;
    this.apiService.update(model, ApiEndpoints.UpdateStore).subscribe({
      next: (res: any) => {
        this.toastService.sendMessage({
          message: 'Store Information Updated Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
        this.loadAllStores();
        this.mainDialog = false;
      },
      error: (err: any) => {
        this.toastService.sendMessage({
          message: 'Error while Updating Store Information',
          type: NotificationType.error,
        });
      },
    });
  }

  delete(StoreCode: any) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DeleteStore + `?StoreCode=${StoreCode}`)
          .subscribe({
            next: (res: any) => {
              this.toastService.sendMessage({
                message: 'Store Deleted Successfully!',
                type: NotificationType.deleted,
                title: 'Deleted',
              });
              this.refresh();
              this.loadAllStores();
            },
            error: (err: any) => {
              this.toastService.sendMessage({
                message: 'Failed to delete Store',
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
