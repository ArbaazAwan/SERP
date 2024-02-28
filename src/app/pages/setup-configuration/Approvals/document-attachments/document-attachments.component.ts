import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DocumentAttachmentsService } from 'src/app/_shared/services/document-attachments.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-document-attachments',
  templateUrl: './document-attachments.component.html',
  styleUrls: ['./document-attachments.component.scss'],
})
export class DocumentAttachmentsComponent implements OnInit {
  form!: FormGroup;
  AttachmentType: any = [];
  AttachmentTyperesponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  DocTypeResponse$: any = [];
  DocAttachmentTypeResponse$: any = [];
  selectedDocType: any = [];
  selectedDocAttachmentType: any = [];
  MaxAttachmentTypeId: any;
  globalBranchCode: number = 0;
  selectedFile:File[] = [];
  fileName!: string;
  storeResponse$: any = [];
  selectedStore!: number;
  projectResponse$: any = [];
  selectedProject!: number;
  isStoreDropdownEnabled = false;
  isProjectDropdownEnabled = false;
  componentName: string = "Document Attachments";
  constructor(
    private fb: FormBuilder,
    private apiServices: DocumentAttachmentsService,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      AttachmentAutoId: this.fb.control('', Validators.required),
      DocumentTypeId: this.fb.control('', Validators.required),
      StoreCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      AttachmentTypeId: this.fb.control('', Validators.required),
      DocumentNo: this.fb.control('', Validators.required),
      AttachmentPath: this.fb.control('', Validators.required),
      Remarks: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    // this.loadAllDocumentAttachments();
    this.loadAllDocumentTypes();
    this.loadStores();
    this.loadProjects();
  }
  onDropdownChange(rowData: any, event: any) {
    let branchcode = parseInt(localStorage.getItem('BranchCode') || '0', 10);
    rowData.BranchCode = branchcode;
    rowData.StoreCode= rowData.StoreCode
    this.apiServices
      .UpdateAttachmentType(
        rowData.BranchCode,
        rowData.AttachmentTypeId,
        rowData.StoreCode,
      )
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Document Attachment Type Updated Successfully!',
          type: NotificationType.success,
        });
      });
  }
  loadProjects() {
    //api/Projects/GetProjectsByBranchCode?BranchCode=${branchCode}
    this.apiService.get(ApiEndpoints.GetProjectsByBranchCode + `?BranchCode=${this.globalBranchCode}`)
    .subscribe((res: any) => {
      this.projectResponse$ = res;
    });
  }
  changeProject(e: any) {
    this.selectedProject = +e.target.value;
  }
  loadStores() {
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
    this.loadAllDocAttachmentType(this.selectedDocType);
    this.loadDocumentAttachmentsByDocType(this.selectedDocType);
  const selectedOption = this.DocTypeResponse$.find(
      (option:any) => option.DocumentTypeId === this.selectedDocType
    );

    if (selectedOption && selectedOption.IsStoreWise) {
      this.isStoreDropdownEnabled = true;
    } else {
      this.isStoreDropdownEnabled = false;
    }
    if (selectedOption && selectedOption.IsProjectWise) {
      this.isProjectDropdownEnabled = true;
    } else {
      this.isProjectDropdownEnabled = false;
    }
  }
  loadAllDocumentTypes() {
    this.apiService.get(ApiEndpoints.GetAllDocumentTypes).subscribe((res: any) => {
      this.DocTypeResponse$ = res;
    });
  }

  changeAttachmentType(e: any) {
    this.selectedDocAttachmentType = +e.value;
  }
  loadAllDocAttachmentType(DocumentTypeId: number) {
    this.apiService.get(ApiEndpoints.GetDocumentAttachments + `?DocumentTypeId=${DocumentTypeId}`)
      .subscribe((res: any) => {
        this.DocAttachmentTypeResponse$ = res;
      });
  }

  // loadAllDocumentAttachments() {
  //   this.apiServices.getAllDocumentAttachments().subscribe((res: any) => {
  //     this.AttachmentTyperesponse$ = res;
  //   });
  // }
  loadDocumentAttachmentsByDocType(DocumentTypeId: number) {
    //api/DocumentAttachments/GetDocumentAttachmentsByDocTypeId?DocumentTypeId=${DocumentTypeId}
    this.apiService.get(ApiEndpoints.GetDocumentAttachmentsByDocTypeId + `?DocumentTypeId=${DocumentTypeId}`)
      .subscribe((res: any) => {
        this.AttachmentTyperesponse$ = res;
      });
  }

  // selectFile(event: any): void {
  //   let selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     const fileSizeInMB = selectedFile.size / (1024 * 1024); // Calculate file size in MB
  //     if (fileSizeInMB > 2) {
  //       this.fileName = ''; // Clear the file name
  //       selectedFile=null;
  //       this.toastService.sendMessage({
  //         message: 'please select 5mb file',
  //         type: NotificationType.error,
  //       }); // Display a console message
  //     }else{

  //       this.fileName = selectedFile.name; // Set the file name
  //       this.selectedFile = selectedFile; // Store the selected file
  //     }

  //   }
  // }
  selectFile(event: any): void {
    const selectedFiles = event.target.files;

    if (selectedFiles.length === 0) {
      return; // No files selected
    }

    this.selectedFile = selectedFiles; // Store the selected files

    // Check each selected file
    for (let i = 0; i < selectedFiles.length; i++) {
      const selectedFile = selectedFiles[i];

      // Check file size for each selected file
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      if (fileSizeInMB > 5) {
        // File size exceeds 5MB limit for at least one file
        this.fileName = ''; // Clear the file name
        this.selectedFile = []; // Clear the selected files array
        this.toastService.sendMessage({
          message: 'Please select files with a size of 5MB or less.',
          type: NotificationType.error,
        });

        return; // Stop processing and display an error message
      }
    }

    // Set the file names as a comma-separated list
    this.fileName = this.selectedFile.map((file: File) => file.name).join(', ');
  }

  save() {
    
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = +this.selectedDocType;
    model.AttachmentTypeId = this.selectedDocAttachmentType|| 0;
    model.DocumentNo = this.AttachmentType.DocumentNo;
    model.StoreCode = +this.selectedStore || 0;
    model.ProjectCode = this.selectedProject || 0;
    // model.AttachmentPath = this.selectedFile || null;
    model.Remarks = model.Remarks || null;
    //TBD----------------------------------------------------------------
    this.apiServices
      .postDocumentAttachments(model, this.selectedFile)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Document Attachment Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadDocumentAttachmentsByDocType(this.selectedDocType);
        this.form.reset();
        this.refresh();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    data.AttachmentAutoId=data.AttachmentAutoId
    this.AttachmentType = { ...data };
    if (typeof data.DocumentTypeId === 'string') {
      this.AttachmentType.DocumentTypeId = data.DocumentTypeId.trim();
    }
    if (typeof data.AttachmentTypeId === 'string') {
      this.AttachmentType.AttachmentTypeId = data.AttachmentTypeId.trim();
    }
    this.tableLength = Object.keys(this.AttachmentType).length;
  }

  update() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = +this.AttachmentType.DocumentTypeId;
    model.AttachmentTypeId = +this.AttachmentType.AttachmentTypeId;
    model.StoreCode = +this.selectedStore || 0;
    model.AttachmentAutoId = this.AttachmentType.AttachmentAutoId

    model.ProjectCode = +this.selectedProject || 0;

    //api/DocumentAttachments/UpdateDocumentAttachments?
    this.apiService.update(model, ApiEndpoints.UpdateDocumentAttachments + `?`).subscribe(() => {
      this.loadDocumentAttachmentsByDocType(this.selectedDocType);
      this.toastService.sendMessage({
        message: 'Document Attachment Updated Successfully!',
        type: NotificationType.success,
      });
    });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(BranchCode: number, AttachmentAutoId: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteDocumentAttachments + `?BranchCode=${BranchCode}&AttachmentAutoId=${AttachmentAutoId}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Document Attachment Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadDocumentAttachmentsByDocType(this.selectedDocType);

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
    this.AttachmentType.AttachmentTypeId = null;
    this.form.reset();
  }

  // viewFile() {
  //   if (this.selectedFile) {
  //     const fileURL = URL.createObjectURL(this.selectedFile);
  //     window.open(fileURL);
  //   } else {
  //   }
  // }
  viewFile(m:any) {
    if (this.selectedFile && this.selectedFile.length > 0) {
      for (const selectedFile of this.selectedFile) {
        const fileURL = URL.createObjectURL(selectedFile);
        window.open(fileURL);
      }
    } else {
    }
  }
}
