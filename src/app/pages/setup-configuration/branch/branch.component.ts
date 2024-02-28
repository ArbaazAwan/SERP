import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { BranchModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {
  Branch: any = [];
  form!: FormGroup;
  model!: BranchModel;
  isUpdate: boolean = false;
  tableLength!: number;
  componentName: string = "Branch";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      BranchCode: this.fb.control(''),
      BranchName: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      ShortName: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
      Description: this.fb.control('', [Validators.required, Validators.maxLength(90)]),
      CreatedOn: this.fb.control('', Validators.required),
      CreatedBy: this.fb.control('', Validators.required),
      ModifiedOn: this.fb.control(''),
      ModifiedBy: this.fb.control(''),
    });
    this.loadAllBranches();
  }

  loadAllBranches() {
    this.apiService
      .get(ApiEndpoints.getAllBranchesList)
      .subscribe((res: any) => {
        this.Branch = res.data;
      });
  }

  addBranchDetails() {
    let val = this.form.value;
    this.model = val;
    console.table(val);
    let x = +this.form.get('BranchCode')?.value;
    this.apiService
      .post(this.model, ApiEndpoints.saveBranch)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Branch Saved Successfully!',
          type: NotificationType.success,
        });
        this.form.reset();
        this.loadAllBranches();
      });
    this.form.markAsUntouched();
  }

  updateBranchDetails() {
    this.apiService
      .update(this.form.value, ApiEndpoints.updateBranch)
      .subscribe((res) => {
        this.form.patchValue({
          BranchModel: this.Branch,
        });
        this.toastService.sendMessage({
          message: 'Branch Updated Successfully!',
          type: NotificationType.success,
        });
        this.form.reset();
        this.loadAllBranches();
      });
    this.isUpdate = false;
    this.form.reset();
  }
  deleteBranchDetails(BranchCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Delete',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteBranch + '?BranchCode=' + BranchCode)
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Branch Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.loadAllBranches();
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
  getSelectedRow(data: any) {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.isUpdate = true;
    this.form.patchValue({...data});
    this.form.patchValue({
      ModifiedBy: +user!,
      ModifiedOn: currentDate.toLocaleString(),
    });
    this.tableLength = Object.keys(this.Branch).length;
  }

  addorUpdate() {
    let user = localStorage.getItem('UserId');
    let currentDate = new Date();
    this.form.patchValue({
      CreatedBy: +user!,
      CreatedOn: currentDate.toLocaleString(),
    });
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      return this.toastService.sendMessage({
        message: 'Form is Invalid',
        type: NotificationType.error,
      });
    }
    if (!this.isUpdate) {
      this.addBranchDetails();
    } else {
      this.updateBranchDetails();
    }
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.loadAllBranches();
  }
}
