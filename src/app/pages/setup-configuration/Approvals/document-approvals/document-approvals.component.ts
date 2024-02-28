import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-document-approvals',
  templateUrl: './document-approvals.component.html',
  styleUrls: ['./document-approvals.component.scss'],
})
export class DocumentApprovalsComponent implements OnInit {
  form!: FormGroup;
  DocApproval: any = [];
  ApprovalHirarchyresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  DocTypeResponse$: any = [];
  selectedDocType: any = [];
  globalBranchCode: number = 0;
  storeResponse$: any = [];
  selectedStore!: number;
  projectResponse$: any = [];
  selectedProject: number = 0;
  componentName: string = "Documents Approvals";
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      UserId: this.fb.control('', Validators.required),
      DocumentTypeId: this.fb.control('', Validators.required),
      StoreCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      ApprovalPriorityLevel: this.fb.control('', Validators.required),
      IsFinalApproval: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllDocTypes();
    this.loadStores();
    this.loadProjects();
  }
  loadProjects() {
    this.apiService.get(ApiEndpoints.GetProjectsByBranchCode + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.projectResponse$ = res;
    });
  }
  changeProject(e: any) {
    this.selectedProject = +e.target.value;
  }
  loadStores() {
    //api/Demand/LoadStores?BranchCode=${BranchCode}
    this.apiService.get(ApiEndpoints.LoadStores + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.storeResponse$ = res.data;
    });
  }
  changeStore(e: any) {
    this.selectedStore = +e.value;
  }
  changeDocType(e: any) {
    this.selectedDocType = +e.value;
  }
  loadAllDocTypes() {
    this.apiService.get(ApiEndpoints.GetAllDocumentTypes).subscribe((res: any) => {
      this.DocTypeResponse$ = res;
    });
  }

  save() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = this.selectedDocType;
    this.apiService.post(model, ApiEndpoints.AddDocumentApprovalHirarchy).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Document Approval Saved Successfully!',
        type: NotificationType.success,
      });
      this.form.reset();
      this.refresh();
    });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.DocApproval = { ...data };
    if (typeof data.DocumentTypeId === 'string') {
      this.DocApproval.DocumentTypeId = data.DocumentTypeId.trim();
    }
    this.tableLength = Object.keys(this.DocApproval).length;
  }

  update() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = +this.DocApproval.DocumentTypeId;
    //api/DocumentApprovalHirarchy/UpdateDocumentApprovalHirarchy?
    this.apiService.update(model, ApiEndpoints.UpdateDocumentApprovalHirarchy).subscribe(() => {
      this.toastService.sendMessage({
        message: 'Document Approval Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(
    BranchCode: number,
    DocumentTypeId: number,
    ApprovalPriorityLevel: number,
    UserId: number
  ) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteDocumentApprovalHirarchy +`?BranchCode=${BranchCode}&DocumentTypeId=${DocumentTypeId}&ApprovalPriorityLevel=${ApprovalPriorityLevel}&UserId=${UserId}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Document Approval Deleted Successfully!',
              type: NotificationType.error,
            });
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
    this.DocApproval.DocumentTypeId = null;
    this.form.reset();
  }
}
