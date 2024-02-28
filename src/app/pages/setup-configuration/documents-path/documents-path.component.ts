import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-documents-path',
  templateUrl: './documents-path.component.html',
  styleUrls: ['./documents-path.component.scss'],
})
export class DocumentsPathComponent implements OnInit {
  //Component Name
  componentName: string = 'Document Paths';

  //Form Name
  documentPathForm!: FormGroup;

  //Login Initials
  BranchCode!: number;
  UserId!: number;

  //Data Variables
  documentPaths: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.BranchCode = +localStorage.getItem('BranchCode')!;
    this.UserId = +localStorage.getItem('UserId')!;
    this.formInIt();
    this.get();
  }

  // Form Initialization Method
  formInIt() {
    this.documentPathForm = this.fb.group({
      SalesPath: this.fb.control('', Validators.required),
      VouchersPath: this.fb.control('', Validators.required),
      DemandPath: this.fb.control('', Validators.required),
      PurchaseRequisitionPath: this.fb.control('', Validators.required),
      PurchaseOrderPath: this.fb.control('', Validators.required),
      GRNPath: this.fb.control('', Validators.required),
      IRNPath: this.fb.control('', Validators.required),
      LeadsPath: this.fb.control('', Validators.required),
      PurchaseInvoicePath : this.fb.control('',Validators.required),
      PurchasePaymentPath : this.fb.control('',Validators.required),
      CSPath : this.fb.control('',Validators.required),
      
    });
  }

  //Get Method

  get() {
    this.apiService
      .get(ApiEndpoints.GetAllPaths + '?BranchCode=' + this.BranchCode)
      .subscribe((res: any) => {
        this.documentPaths = res[0];
        if (this.documentPaths !== null) {
          this.documentPathForm.patchValue({ ...this.documentPaths });
        }
      });
  }

  //Save Method
  save() {
    let model = this.documentPathForm.value;
    model.BranchCode = +this.BranchCode;
    model.CreatedBy = +this.UserId;
    this.apiService
      .post(model, ApiEndpoints.CreateDocumentsPath + `?`)
      .subscribe(
        () => {
          this.toastService.sendMessage({
            message: 'Path Saved Successfully!',
            type: NotificationType.success,
          });
          this.get();
        },
        (error) => {
          console.error('Failed:', error);
          this.toastService.sendMessage({
            message: 'Failed',
            type: NotificationType.error,
          });
        }
      );
  }

  //Update Method
  update() {
    let model = this.documentPathForm.value;
    model.BranchCode = +this.BranchCode;
    model.ModifiedBy = +this.UserId;
    this.apiService
      .update(model, ApiEndpoints.UpdateDocumentsPath + `?`)
      .subscribe(
        () => {
          this.toastService.sendMessage({
            message: 'Path Saved Successfully!',
            type: NotificationType.success,
          });
          this.get();
        },
        (error) => {
          console.error('Delete request failed:', error);
          this.toastService.sendMessage({
            message: 'Failed',
            type: NotificationType.error,
          });
        }
      );
  }
}
