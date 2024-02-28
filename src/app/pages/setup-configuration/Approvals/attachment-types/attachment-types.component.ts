import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-attachment-types',
  templateUrl: './attachment-types.component.html',
  styleUrls: ['./attachment-types.component.scss'],
})
export class AttachmentTypesComponent implements OnInit {
  form!: FormGroup;
  AttachmentType: any = [];
  AttachmentTyperesponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  DocTypeResponse$: any = [];
  selectedDocType: any = [];
  MaxAttachmentTypeId: any;
  globalBranchCode: number = 0;
  componentName: string = 'Attachment Types';

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
      AttachmentTypeId: this.fb.control('', Validators.required),
      AttachmentTypeTitle: this.fb.control('', Validators.required),
      IsCompulsory: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllDocumentTypes();
  }
  changeDocType(e: any) {
    this.selectedDocType = +e.value;
    this.loadMaxAttachmentTypeId(this.selectedDocType);
    this.loadAttachmentTypesByDocType(this.selectedDocType);
  }
  loadAllDocumentTypes() {
    this.apiService.get(ApiEndpoints.GetAllDocumentTypes)
    .subscribe((res: any) => {
      this.DocTypeResponse$ = res;
    });
  }
  IsCompulsory() {
    const IsCompulsory = this.form.get('IsCompulsory');
    if (IsCompulsory) {
      IsCompulsory.setValue(!IsCompulsory.value);
    }
  }
  // loadAllAttachmentTypes() {
  //   this.apiServices.getAllDocumentAttachmentTypes().subscribe((res: any) => {
  //     this.AttachmentTyperesponse$ = res;
  //   });
  // }
  loadAttachmentTypesByDocType(DocumentTypeId: number) {
    this.apiService.get(ApiEndpoints.GetAttachmentTypeByDocTypeId + `?DocumentTypeId=${DocumentTypeId}`)
      .subscribe((res: any) => {
        this.AttachmentTyperesponse$ = res;
      });
  }
  loadMaxAttachmentTypeId(DocumentTypeId: number) {
    this.apiService.get(ApiEndpoints.GetMaxAttachmentTypeId + `?DocumentTypeId=${DocumentTypeId}`)
    .subscribe((res) => {
      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
      this.MaxAttachmentTypeId = +x.AttachmentTypeId;
    });
  }

  save() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.IsCompulsory = model.IsCompulsory || false;
    model.DocumentTypeId = +this.selectedDocType;
    model.AttachmentTypeId = this.MaxAttachmentTypeId;
    model.AttachmentTypeTitle = this.AttachmentType.AttachmentTypeTitle;
    this.apiService.post(model, ApiEndpoints.AddDocumentAttachmentTypes)
    .subscribe(() => {
      this.toastService.sendMessage({
        message: 'Attachment Types Saved Successfully!',
        type: NotificationType.success,
      });
      this.loadMaxAttachmentTypeId(this.selectedDocType);
      this.loadAttachmentTypesByDocType(this.selectedDocType);
      // this.form.reset();
      this.refresh();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.AttachmentType = { ...data };
    if (typeof data.DocumentTypeId === 'string') {
      this.AttachmentType.DocumentTypeId = data.DocumentTypeId.trim();
    }
    this.tableLength = Object.keys(this.AttachmentType).length;
  }

  update() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = +this.AttachmentType.DocumentTypeId;
    this.apiService.update(model, ApiEndpoints.UpdateDocumentAttachmentTypes + `?`).subscribe(() => {
      this.loadMaxAttachmentTypeId(this.selectedDocType);
      this.loadAttachmentTypesByDocType(this.selectedDocType);
      this.toastService.sendMessage({
        message: 'Attachment Types Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(BranchCode: number, DocumentTypeId: number, AttachmentTypeId: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteDocumentTypes + `?BranchCode=${BranchCode}&DocumentTypeId=${DocumentTypeId}&AttachmentTypeId=${AttachmentTypeId}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Attachment Types Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadMaxAttachmentTypeId(this.selectedDocType);
            this.loadAttachmentTypesByDocType(this.selectedDocType);
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
    this.AttachmentType.DocumentTypeId = null;
    this.form.reset();
  }
}
