import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss'],
})
export class DocumentTypeComponent implements OnInit {
  model: any = [];
  isSticky: boolean = false;
  isLoadingData: boolean = false;
  DocumentTypeList: any = [];
  globalUserCode!: number;
  isUpdate!: boolean;
  DocumentTypeForm!: FormGroup;
  isToastShown = false;

  get DocumentTypeFormValue() {
    return this.DocumentTypeForm.getRawValue();
  }
  get f() {
    return this.DocumentTypeForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private utilityService: UtilityService
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.getAllDocumentType();
  }

  formInit() {
    this.DocumentTypeForm = this.fb.group({
      DocumentTypeCode: [{ value: null, disabled: true }],
      DocumentType: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s+-]+$/)],
      ],
      IsActive: [true],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }

  getRowDocumentType(data: any) {
    this.isUpdate = true;
    this.DocumentTypeForm.patchValue({ ...data });
  }

  getAllDocumentType() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.DocumentTypes).subscribe({
      next: (res: any) => {
        this.DocumentTypeList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdateDocumentType() {
    if (this.isUpdate) this.updateDocumentType();
    else this.saveDocumentType();
  }

  saveDocumentType() {
    if (this.DocumentTypeForm.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.DocumentTypeForm);
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
    let payLoad = { ...this.DocumentTypeFormValue };
    payLoad.CreatedBy = this.globalUserCode;
    payLoad.IsActive = payLoad.IsActive ?? false;
    this.apiService
      .post(payLoad, ApiEndpoints.DocumentTypes)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'New Document Type Saved Successfully!',
          type: NotificationType.success,
        });
        this.DocumentTypeForm.reset();
        this.getAllDocumentType();
      });
  }

  updateDocumentType() {
    let payLoad = { ...this.DocumentTypeFormValue };
    payLoad.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(payLoad, ApiEndpoints.DocumentTypes)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Document Type Update Successfully!',
          type: NotificationType.success,
        });
        this.isUpdate = false;
        this.DocumentTypeForm.reset();
        this.getAllDocumentType();
      });
  }

  deleteDocumentType(DocumentTypeCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Document Type?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.DocumentTypes + `/${DocumentTypeCode}`)
          .subscribe((res) => {
            this.getAllDocumentType();
            if (res === true) {
              return this.toastService.sendMessage({
                message: 'Document Type Deleted Successfully!',
                type: NotificationType.deleted,
                title: 'Deleted',
              });
            }
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

  refresh() {
    this.isUpdate = false;
    this.DocumentTypeForm.reset();
  }

  // Scroll , Sticky
  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }
}
