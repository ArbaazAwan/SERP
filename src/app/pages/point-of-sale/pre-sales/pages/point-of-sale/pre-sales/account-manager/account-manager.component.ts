import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, TreeNode } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss'],
})
export class AccountManagerComponent implements OnInit {
  //-----COMPONENT NAME
  componentName = 'Account Manager';

  //----FORM NAME
  AccountManagerForm!: FormGroup;
  FilterForm!: FormGroup;


  //-----DIALOGUE VARIABLES
  mainDialog: boolean = false;
  mainHeader: string = '';

  //-----Filter Variables
  filterDialog:boolean = false;
  filterFields: string[] = [];
  @ViewChild('dt') dt!: any;

  ParentCodes: any;
  accountManagerCode: any;
  selectedParentCode: any;
  isLoadingData: boolean = false;
  globalBranchCode!: number;
  isEditing: boolean = false;
  otherProperties: any;
  FirstName: string = '';
  LastName: string = '';
  AccountCode: number = 0;
  model: any = [];
  isUpdate: boolean = false;
  isSave: boolean = false;
  chartResponse!: TreeNode[];
  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.AccountManagerForm = this.fb.group({
      AccountManagerCode: this.fb.control(0),
      LastName: this.fb.control('', Validators.required),
      FirstName: this.fb.control('', Validators.required),
      Phone: this.fb.control('', Validators.required),
      Email: this.fb.control('', Validators.required),
      Address: this.fb.control('', Validators.required),
      ParentManagerCode: this.fb.control(0, Validators.required),
      Landline: this.fb.control('', Validators.required),
      IsActive: this.fb.control(false, Validators.required),
    });
    this.FilterForm = this.fb.group({
      Name: this.fb.control('', Validators.required),
      Phone: this.fb.control('', Validators.required),
      Email: this.fb.control('', Validators.required),
      Landline: this.fb.control('', Validators.required),
    });
    this.loadAllParentCodes();
    this.loadAllAcountManager();
  }

  //----------------OPEN CREATE EDIT DIALOGUE---------------------
  openNew(event?: any, action?: string) {
    if (action === 'add') {
      this.isUpdate = false;
      this.isSave = true;
      this.mainHeader = 'Create New Manager';
      this.mainDialog = true;
    } else if (action === 'edit') {
      this.isUpdate = true;
      this.isSave = false;
      this.mainHeader = 'Update Manager Information';
      this.mainDialog = true;
      this.getRowData(event);
    } else if (action === 'filter') {
      this.mainHeader = 'Filter your list...';
      this.filterDialog = true;
    }
  }

  //----------------GET ROW DATA FOR UPDATE---------------------
  getRowData(rowData: any) {
    let names: string[] = rowData.AccManagerName.split(' ');
    this.FirstName = names[0];
    this.LastName = names.slice(1).join(' ');
    this.AccountCode = rowData.AccountManagerCode;
    this.isEditing = true;
    this.AccountManagerForm.patchValue({ ...rowData });
    this.AccountManagerForm.patchValue({
      FirstName: this.FirstName,
      LastName: this.LastName,
    });
  }

  //----------------CRUD OPERATIONS---------------------

  //--CREATE
  save() {
    let model = {
      BranchCode: localStorage.getItem('BranchCode'),
      ParentManagerCode: this.selectedParentCode || 0,
      FirstName: this.AccountManagerForm.controls['FirstName'].value,
      LastName: this.AccountManagerForm.controls['LastName'].value,
      Phone: this.AccountManagerForm.controls['Phone'].value,
      Email: this.AccountManagerForm.controls['Email'].value,
      Address: this.AccountManagerForm.controls['Address'].value,
      Landline: this.AccountManagerForm.controls['Landline'].value,
      IsActive: this.AccountManagerForm.controls['IsActive'].value || false,
      CreatedBy: localStorage.getItem('UserId'),
    };
    this.apiService
      .post(model, ApiEndpoints.AddAccountManager)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Lead Owner Customer Saved Successfully!',
          type: NotificationType.success,
        });
        this.mainDialog = false;
        this.loadAllParentCodes();
        this.loadAllAcountManager();
        this.refresh();
      });
  }

  //--READ
  loadAllAcountManager() {
    this.isLoadingData = true;
    this.apiService
      .get(
        ApiEndpoints.GetAccountManagerTree +
          `?BranchCode=${this.globalBranchCode}`
      )
      .subscribe((res: any) => {

        this.chartResponse = res;
        this.chartResponse = this.transformDatatree(res);
        this.isLoadingData = false;
      });
  }

  loadAllParentCodes() {
    this.apiService
      .get(
        ApiEndpoints.GetAllAccountManagers +
          `?BranchCode=${this.globalBranchCode}`
      )
      .subscribe((res: any) => {
        this.ParentCodes = res;
      });
  }
  //--UPDATE
  update() {
    let model = {
      BranchCode: localStorage.getItem('BranchCode'),
      AccountManagerCode: +this.AccountCode,
      ParentManagerCode: +this.AccountManagerForm.controls['ParentManagerCode'].value || 0,
      Phone: this.AccountManagerForm.controls['Phone'].value,
      Email: this.AccountManagerForm.controls['Email'].value,
      Address: this.AccountManagerForm.controls['Address'].value,
      Landline: this.AccountManagerForm.controls['Landline'].value,
      IsActive: this.AccountManagerForm.controls['IsActive'].value || false,
      CreatedBy: localStorage.getItem('UserId'),
    };
    this.apiService
      .update(model, ApiEndpoints.UpdateAccountManager)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Lead Owner Customer Updated Successfully!',
          type: NotificationType.success,
        });
        this.mainDialog = false;
        this.loadAllParentCodes();
        this.loadAllAcountManager();
        this.refresh();
      });
  }

  //--DELETE
  delete(AccountManagerCode: any) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteAccountManager +
              `?BranchCode=${this.globalBranchCode}&AccountManagerCode=${AccountManagerCode}`
          )
          .subscribe(
            () => {
              this.toastService.sendMessage({
                message: 'Manager Deleted Successfully!',
                type: NotificationType.success,
              });
              this.loadAllAcountManager();
            },
            (error) => {
              console.error('Delete request failed:', error);
              this.toastService.sendMessage({
                message: 'Failed to delete Manager info.',
                type: NotificationType.deleted,
              });
            }
          );
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

  //----------------METHODS FOR CREATE TREE---------------------
  transformDatatree(apiData: any): TreeNode[] {
    return this.generateTreeNodes(apiData['Children'], 1);
  }

  generateTreeNodes(items: any[], level: number): TreeNode[] {
    if (level > 15) {
      return [];
    }
    const treeNodes: TreeNode[] = [];

    for (const item of items) {
      const childNodes: TreeNode[] = this.generateTreeNodes(
        item.Children || [],
        level + 1
      );
      const treeNode: TreeNode = {
        data: { ...item },
        children: childNodes,
      };
      treeNodes.push(treeNode);
    }
    return treeNodes;
  }

  //----------------FILTER METHODS HERE---------------------
   expandNode(node: any) {
    node.expanded = true;
    if (node.children) {
      node.expanded = true;
      node.children.forEach((child: any) => this.expandNode(child));
    } else if (node.filteredValue && Array.isArray(node.filteredValue)) {
      const children = node.filteredValue[0].children;

      if (children) {
        node.expanded = true;
        children.forEach((child: any) => this.expandNode(child));
      }
    }
  }
  filterGlobal(event: any) {
    let id ;
    let filterFields: string[] = [];

      filterFields.push('AccManagerName');


    if (event?.target?.value) {
      let searchString = event.target.value;
      if (searchString.startsWith('%')) {
        searchString = searchString.substr(1);
        this.dt.filterGlobal(searchString, 'startsWith');
      } else if (searchString.endsWith('%')) {
        searchString = searchString.substr(0, searchString.length - 1);
        this.dt.filterGlobal(searchString, 'endsWith');
      } else {
        this.dt.filterGlobal(searchString, 'contains');
      }
    }

    this.filterFields = filterFields;
  }
  clearFilter(event: any) {
    if (!event?.target?.value) {
      this.dt.filterGlobal(event?.target?.value, '');
    }
  }

  //----------------SOME CHUNK METHODS---------------------
  changeManager(e: any) {
    this.selectedParentCode = +e.value;
  }

  hideDialog() {
    this.mainDialog = false;
    this.filterDialog = false;
    this.refresh();
  }

  refresh() {
    this.AccountManagerForm.reset();
    this.isUpdate = false;
    this.isSave = true;
  }

}
