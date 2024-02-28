import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-document-types',
  templateUrl: './document-types.component.html',
  styleUrls: ['./document-types.component.scss'],
})
export class DocumentTypesComponent implements OnInit {
  form!: FormGroup;
  DocumentTypes: any = [];
  DocumentTypesresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  globalBranchCode: number = 0;
  componentName: string = "Document Types";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      DocumentTypeId: this.fb.control('', Validators.required),
      DocumentTypeName: this.fb.control('', Validators.required),
      IsActive: this.fb.control('', Validators.required),
      IsStorewise: this.fb.control('', Validators.required),
      IsProjectWise: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllDocumentTypes();
  }

  loadAllDocumentTypes() {
    this.apiService.get(ApiEndpoints.GetAllDocumentTypes+
      `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.DocumentTypesresponse$ = res;
    });
    this.loadMaxDocumentTypesCode();
  }
  IsStoreWise(){
    const IsStorewise = this.form.get('IsStorewise');
    if (IsStorewise) {
      IsStorewise.setValue(!IsStorewise.value);
    }

  }
  IsProjectWise(){
    const IsProjectWise = this.form.get('IsProjectWise');
    if (IsProjectWise) {
      IsProjectWise.setValue(!IsProjectWise.value);
    }

  }

  IsActive(){
    const IsActive = this.form.get('IsActive');
    if (IsActive) {
      IsActive.setValue(!IsActive.value);
    }

  }

  loadMaxDocumentTypesCode() {
    this.apiService.get(ApiEndpoints.GetMaxDocumentTypeId+
      `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.DocumentTypes.DocumentTypeId = res[0].DocumentTypeId;
    });
  }

  save() {
    let model = this.form.value;
    model.IsActive = model.IsActive || false;
    model.IsStorewise = model.IsStorewise || false;
    model.IsProjectWise = model.IsProjectWise || false;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = this.DocumentTypes.DocumentTypeId;
    model.DocumentTypeName = this.DocumentTypes.DocumentTypeName;
    this.apiService.post(model, ApiEndpoints.AddDocumentTypes).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Document Type Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadAllDocumentTypes();
      this.form.reset();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.DocumentTypes = { ...data };
    this.tableLength = Object.keys(this.DocumentTypes).length;
  }

  update() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    this.apiService.update(model, ApiEndpoints.UpdateDocumentTypes + `?`)
    .subscribe(() => {
      this.loadAllDocumentTypes();
      this.toastService.sendMessage({
        message: 'Document Type Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(BranchCode: number, DocumentTypeId: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteDocumentType + `?BranchCode=${BranchCode}&DocumentTypeId=${DocumentTypeId}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Document Type Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadAllDocumentTypes();
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
      this.save();
    } else {
      this.update();
    }
  }
  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllDocumentTypes();
  }
}
