import { Component, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { LeadsInfoService } from 'src/app/_shared/services/leads-info.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  Documentsresponse$: any = [];
  tableLength!: number;
  imagePathOnServer!: string;
  form: any;
  displayDocumentDialog: boolean = false;
  globalBranchCode!: number;

  constructor(
    private leadInfoService: LeadsInfoService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private api:LeadsInfoService,
  ) {
  }
  ngOnInit() {
    this.GetDocumentsByCodes();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;

  }
  GetDocumentsByCodes(): void {
    let selectedLeadCode = parseInt(localStorage.getItem('LeadCode') || '0', 10);
    let selectedStepCode = parseInt(localStorage.getItem('StepCode') || '0', 10);

    this.apiService.get(ApiEndpoints.GetAllLeadDocument +
      `?LeadCode=${selectedLeadCode}&StepCode=${selectedStepCode}`)
    .subscribe((res) => {
      this.Documentsresponse$ = res;
    });
  }


  openDocumentViewDialog(
    BranchCode: number,
    LeadCode: number,
    StepCode: number,
    DocumentId: number
  ): void {
    let selectedLeadCode = parseInt(localStorage.getItem('LeadCode') || '0', 10);
    let selectedStepCode = parseInt(localStorage.getItem('StepCode') || '0', 10);

    let DocId = this.Documentsresponse$[0].DocumentId;

    //TBD------------------------------------------
    this.leadInfoService
      .viewStepDocuments(this.globalBranchCode,selectedLeadCode, selectedStepCode, DocumentId)
      .subscribe(
        (response: Blob) => {
          const fileUrl = URL.createObjectURL(response);
          window.open(fileUrl);
          // if (response.type === 'application/pdf') {
          //   const fileUrl = URL.createObjectURL(response);
          //   window.open(fileUrl);
          // } else {
          //   const reader = new FileReader();
          //   reader.onloadend = () => {
          //     this.imagePathOnServer = reader.result as string;
          //     this.displayDocumentDialog = true;
          //   };
          //   reader.readAsDataURL(response);
          // }
        },
        (error) => {
          console.error('Error fetching document:', error);
        }
      );
  }

  closeDocumentViewDialog(): void {
    this.displayDocumentDialog = false;
  }

  delete(m:any) {
   let BranchCode = +m.BranchCode;
    let LeadCode = +m.LeadCode;
   let StepCode = +m.StepCode;
    let DocumentId = +m.DocumentId;

    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api
          .deleteLeadsDetailImage(
            BranchCode,LeadCode,StepCode,DocumentId
          )
          .subscribe((res: any) => {
            this.toastService.sendMessage({
              message: 'Documents Deleted Successfully!',
              type: NotificationType.error,
            });
            // this.loadAllStatus();
            this.GetDocumentsByCodes()
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

  // loadAllDocuments(): void {
  //   this.leadInfoService.GetAllDocuments().subscribe((res) => {
  //     this.Documentsresponse$ = res;
  //   });
  // }
}
