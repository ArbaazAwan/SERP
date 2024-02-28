import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-approval-hirarchy',
  templateUrl: './approval-hirarchy.component.html',
  styleUrls: ['./approval-hirarchy.component.scss'],
})
export class ApprovalHirarchyComponent implements OnInit {
  form!: FormGroup;
  formuser!: FormGroup;
  ApprovalHirarchy: any = [];
  ApprovalHirarchyresponse$: any = [];
  isUpdate!: boolean;
  tableLength!: number;
  DocTypeResponse$: any = [];
  selectedDocType: any = [];
  MaxApprovalHirarchyId: any;
  globalBranchCode: number = 0;
  userlist$: any = [];
  componentName: string = 'Approval Hierarchy';

  selectedUser: number = 0;
  UserPriorityLevelUpper!: number;
  PriorityLevelChangeUpper: number = -1;
  UserPriorityLevelLower: number = -1;
  PriorityLevelChangeLower!: number;
  GetUserByDocumentTypeId$: any = [];
  priorityLevelselected: number = 0;

  selectedRow: any = null; // Initialize with null or an empty object
  selectedRowIndex: number = -1; // Initialize with -1 to indicate no selection

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
      ApprovalPriorityLevel: this.fb.control('', Validators.required),
      IsFinalApproval: this.fb.control('', Validators.required),
    });
    this.formuser = this.fb.group({
      UserId: this.fb.control(''),
    });

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    // this.loadAllApprovalHirarchy();
    this.loadAllDocTypes();
    this.loadAllUserList();
  }
  toggleRowSelection(rowData: any) {
    if (this.selectedRow === rowData) {
      this.selectedRow = null; // Deselect the row if it's clicked again
    } else {
      if (this.selectedRow) {
        this.selectedRow.selected = false; // Deselect the previously selected row
      }
      this.selectedRow = rowData; // Select the new row
      this.selectedRow.selected = true; // Set the selected property of the new row to true
    }
  }

  saveuser() {
    let model = this.formuser.value;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = this.selectedDocType;
    let ApprovalPriorityLevel = parseInt(
      localStorage.getItem('ApprovalPriorityLevel') || '0',
      10
    );
    model.ApprovalPriorityLevel = ApprovalPriorityLevel;
    model.UserId = this.selectedUser;
    this.apiService
      .post(model, ApiEndpoints.AddApprovalHirarchyUsers)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Approval Hierarchy User Saved Successfully!',
          type: NotificationType.success,
        });
        this.getUserApprove(model);
      });
  }
  getUserApprove(data: any) {
    localStorage.setItem('ApprovalPriorityLevel', data.ApprovalPriorityLevel);
    this.priorityLevelselected = data.ApprovalPriorityLevel;
    this.apiService
      .get(
        ApiEndpoints.GetUserByDocumentTypeId +
          `?BranchCode=${this.globalBranchCode}&DocumentTypeId=${data.DocumentTypeId}&PriorityLevel=${data.ApprovalPriorityLevel}`
      )
      .subscribe((res) => {
        this.GetUserByDocumentTypeId$ = res;
      });
  }
  priorityLevelValidator(data: any) {
    if (data.value > this.MaxApprovalHirarchyId || data.value === '0') {
      this.toastService.sendMessage({
        message:
          'Priority level must be greater than zero and not exceed the maximum allowed',
        type: NotificationType.error,
      });
    }

    return null;
  }
  IsFinalApproval() {
    const IsFinalApproval = this.form.get('IsFinalApproval');
    if (IsFinalApproval) {
      IsFinalApproval.setValue(!IsFinalApproval.value);
    }
  }
  changeDocType(e: any) {
    this.selectedDocType = +e.value;
    this.loadMaxApprovalHirarchyId(this.selectedDocType);
    this.loadApprovalHirarchyByDocType(this.selectedDocType);
  }
  loadAllDocTypes() {
    this.apiService
      .get(ApiEndpoints.GetAllDocumentTypes+
        `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.DocTypeResponse$ = res;
      });
  }

  changeUsers(e: any) {
    this.selectedUser = +e.value;
  }
  loadAllUserList() {
    this.apiService.get(ApiEndpoints.GetBranchUsers +
      `?BranchCode=${this.globalBranchCode}`).subscribe((res) => {
      this.userlist$ = res;
    });
  }

  // loadAllApprovalHirarchy() {
  //   this.apiServices.getAllApprovalHirarchy().subscribe((res: any) => {
  //     this.ApprovalHirarchyresponse$ = res;
  //   });
  // }

  loadApprovalHirarchyByDocType(DocumentTypeId: number) {
    this.apiService
      .get(
        ApiEndpoints.GetApprovalHirarchyByDocTypeId +
          `?BranchCode=${this.globalBranchCode}&DocumentTypeId=${DocumentTypeId}`
      )
      .subscribe((res: any) => {
        this.ApprovalHirarchyresponse$ = res;
      });
  }
  loadMaxApprovalHirarchyId(DocumentTypeId: number) {
    this.apiService
      .get(
        ApiEndpoints.GetMaxApprovalPriorityLevel +
          `?BranchCode=${this.globalBranchCode}&DocumentTypeId=${DocumentTypeId}` 
      )
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.MaxApprovalHirarchyId = +x.ApprovalPriorityLevel;
      });
  }

  save() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.ApprovalPriorityLevel = model.ApprovalPriorityLevel;
    model.IsFinalApproval = model.IsFinalApproval || false;
    model.DocumentTypeId = this.selectedDocType;
    model.UserId = this.selectedUser;
    // model.UserId = +localStorage.getItem('UserId')!;
    model.ApprovalPriorityLevel = this.MaxApprovalHirarchyId;
    //api/DocumentApprovalHirarchy/AddDocumentApprovalHirarchy
    this.apiService
      .post(model, ApiEndpoints.AddDocumentApprovalHirarchy)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Approval Hierarchy Saved Successfully!',
          type: NotificationType.success,
        });
        this.loadMaxApprovalHirarchyId(this.selectedDocType);
        this.loadApprovalHirarchyByDocType(this.selectedDocType);
        //this.form.reset();
        this.refresh();
      });
    this.form.markAsUntouched();
  }

  // getSelectedRow(data: any) {
  //   this.isUpdate = true;
  //   this.ApprovalHirarchy = { ...data };
  //   if (typeof data.DocumentTypeId === 'string') {
  //     this.ApprovalHirarchy.DocumentTypeId = data.DocumentTypeId.trim();
  //   }
  //   if (typeof data.UserId === 'string') {
  //     this.ApprovalHirarchy.UserId = data.UserId.trim();
  //   }
  //   this.tableLength = Object.keys(this.ApprovalHirarchy).length;
  // }

  update() {
    let model = this.form.value;
    model.BranchCode = this.globalBranchCode!;
    model.DocumentTypeId = +this.ApprovalHirarchy.DocumentTypeId;
    // model.UserId = +this.ApprovalHirarchy.UserId;
    //api/DocumentApprovalHirarchy/UpdateDocumentApprovalHirarchy?
    this.apiService
      .update(model, ApiEndpoints.UpdateDocumentApprovalHirarchy + `?`)
      .subscribe(() => {
        this.loadMaxApprovalHirarchyId(this.selectedDocType);
        this.loadApprovalHirarchyByDocType(this.selectedDocType);
        this.toastService.sendMessage({
          message: 'Approval Hierarchy Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }
  DeleteApprovalHirarchyUsers(data: any) {
    let ApprovalPriorityLevel = parseInt(
      localStorage.getItem('ApprovalPriorityLevel') || '0',
      10
    );
    data.ApprovalPriorityLevel = ApprovalPriorityLevel;
    data.DocumentTypeId = this.selectedDocType;
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteApprovalHirarchyUsers +
              `?BranchCode=${this.globalBranchCode}&DocumentTypeId=${data.DocumentTypeId}&UserId=${data.UserId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Approval Hierarchy Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadMaxApprovalHirarchyId(this.selectedDocType);
            this.loadApprovalHirarchyByDocType(this.selectedDocType);
            this.getUserApprove(data);
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
  delete(data: any) {
    data.BranchCode = this.globalBranchCode!;
    let userId = parseInt(localStorage.getItem('UserId') || '0', 10);
    data.UserId = userId;
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteDocumentApprovalHirarchy +
              `?BranchCode=${data.BranchCode}&DocumentTypeId=${data.DocumentTypeId}&ApprovalPriorityLevel=${data.ApprovalPriorityLevel}&UserId=${data.UserId}`
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Document Approval Hierarchy Deleted Successfully!',
              type: NotificationType.error,
            });
            this.loadMaxApprovalHirarchyId(this.selectedDocType);
            this.loadApprovalHirarchyByDocType(this.selectedDocType);
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
    this.ApprovalHirarchy.DocumentTypeId = null;
    this.ApprovalHirarchy.UserId = null;
    this.loadApprovalHirarchyByDocType(this.selectedDocType);
  }

  onUpArrowClick(data: any) {
    this.ApprovalHirarchy = { ...data };

    this.UserPriorityLevelUpper = data.ApprovalPriorityLevel;
    // this.PriorityLevelChangeUpper = this.UserPriorityLevelUpper + 1;
    //TBD----------------------------------------------------------------
    this.apiService
      .update({}, ApiEndpoints.ChangeUserApprovalPriorityLevel)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Priority Level Up',
          type: NotificationType.success,
        });
        this.loadApprovalHirarchyByDocType(this.selectedDocType);
      });
  }

  onDownArrowClick(data: any) {
    this.ApprovalHirarchy = { ...data };

    // this.UserPriorityLevelLower = data.ApprovalPriorityLevel;
    this.PriorityLevelChangeLower = data.ApprovalPriorityLevel;
    this.apiService
      .update(
        {},
        ApiEndpoints.ChangeUserApprovalPriorityLevel +
          `?BranchCode=${this.globalBranchCode}&DocumentTypeId=${this.selectedDocType}&UserId=${this.selectedUser}&UserPriorityLevel=${this.UserPriorityLevelLower}&PriorityLevelChange=${this.PriorityLevelChangeLower}`
      )
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Priority Level Down',
          type: NotificationType.success,
        });
        this.loadApprovalHirarchyByDocType(this.selectedDocType);
      });
  }
}
