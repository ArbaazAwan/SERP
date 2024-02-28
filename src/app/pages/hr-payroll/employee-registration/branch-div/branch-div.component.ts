import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { EmployeeBranch } from 'src/app/_shared/model/HR-Payroll';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-branch-div',
  templateUrl: './branch-div.component.html',
  styleUrls: ['./branch-div.component.scss'],
})
export class BranchDivComponent implements OnInit {
  @Input() isUpdate!: boolean;
  @Input() generalForm!: FormGroup;

  branches: EmployeeBranch[] = [];
  selectedBranches: EmployeeBranch[] = [];
  totalPercentage: number = 0;
  checkAll: boolean = false;
  selectedBranchDivisionId: number = 0;
  get EmployeeCode() {
    return +(this.generalForm.get('BasicInfoForm') as FormGroup).get(
      'EmployeeCode'
    )?.value;
  }

  constructor(
    private apiService: ApiProviderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAllBranches();
    this.getBranchDivisionsByEmployeeCode();
  }

  mapSelectedBranches() {
    if (this.isUpdate) {
      this.branches.forEach((branch) => {
        this.selectedBranches.forEach((selectedBranch: any) => {
          //check the common branches and add the values to them
          if (
            selectedBranch.BranchCode &&
            selectedBranch.BranchCode === branch.BranchCode &&
            !!selectedBranch.Percentage
          ) {
            branch.Checked = true;
            branch.Percentage = selectedBranch.Percentage;
            branch.EmployeeCode = this.EmployeeCode;
          }
        });
      });
      this.calculateTotalPercentage();
    } else {
      //if creating new then check first branch by default
      this.branches[0].Checked = true;
    }
  }

  getAllBranches() {
    this.apiService.get(ApiEndpoints.getAllBranches)
    .subscribe({
      next: (branches: any) => {
        this.branches = branches;
      },
      error: (err) => {
        this.toastService.sendMessage({
          message: 'Cannot get Branches:' + err.message,
          type: NotificationType.error,
        });
      },
    });
  }

  getBranchDivisionsByEmployeeCode() {
    this.apiService
      .get(ApiEndpoints.employeeBranchDivision + `/${this.EmployeeCode}`)
      .subscribe({
        next: (data: any) => {
          debugger
          this.selectedBranches = data;
          this.mapSelectedBranches();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  toggleAllCheckboxes() {
    this.branches.forEach((branch) => (branch.Checked = this.checkAll));
    this.calculateTotalPercentage();
  }

  calculateTotalPercentage() {
    this.totalPercentage = this.branches
      .filter(
        (branch) =>
          branch.Checked &&
          !!branch.Percentage
      )
      .reduce(
        (acc, branch) =>
          acc + (isNaN(branch.Percentage) ? 0 : branch.Percentage),
        0
      );
  }

  getSelectedBranches() {
    return this.branches
      .filter((branch) => branch.Checked && !!branch.Percentage)
      .map((branch) => ({
        BranchCode: branch.BranchCode,
        Percentage: branch.Percentage,
        EmployeeCode: this.EmployeeCode,
      }));
  }

  submitBranchDivision(selectedBranchPerc: any) {
    this.apiService
      .update(
        JSON.stringify(selectedBranchPerc),
        ApiEndpoints.employeeBranchDivision
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastService.sendMessage({
              type: NotificationType.error,
              message: 'Error Occured while Updating Branch Divisions',
            });
          } else {
            this.toastService.sendMessage({
              type: NotificationType.success,
              message: 'Branch Divisions Updated Successfully',
            });
          }
        },
        error: (err) => {
          this.toastService.sendMessage({
            type: NotificationType.error,
            message: 'Error Occured while Updating Branch Divisions',
          });
        },
      });
  }

  onSubmit() {
    if (this.totalPercentage !== 100) {
      this.toastService.sendMessage({
        message: 'Total Percentage Must be 100%',
        type: NotificationType.error,
      });
      return;
    }

    const selectedBranchPerc = this.getSelectedBranches();
    this.submitBranchDivision(selectedBranchPerc);
  }
}
