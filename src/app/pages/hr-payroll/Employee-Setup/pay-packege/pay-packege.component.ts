import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-pay-packege',
  templateUrl: './pay-packege.component.html',
  styleUrls: ['./pay-packege.component.scss'],
})
export class PayPackegeComponent implements OnInit {
  MasterForm!: FormGroup;
  PayPackage: any = [];
  loading: any = [];
  PayPackageDetail: any = [];
  PayPackageresponse$: any[] = [];
  PayPackageMAxCode: any = [];
  EmployeeResponse$: any = [];
  selectedEmployeeCode: any = [];
  bankacctype: any = [];
  selectedbankacctype!: number;
  bank: any = [];
  selectedBank!: number;
  globalBranchCode: number = 0;
  isUpdate!: boolean;
  tableLength!: number;
  payhead: any = [];
  selectedpayhead!: number;
  totalPercentage = 0;

  percentage: number = 0;
  value: number = 0;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  componentName: string = 'Pay Package';
  isLoadingData: boolean = false;

  disableEditRow: boolean = false;
  editing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiServices: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.MasterForm = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      PayPackageCode: this.fb.control('', Validators.required),
      EmployeeCode: this.fb.control('', Validators.required),
      Salary: this.fb.control('', Validators.required),
      DisbursementMode: this.fb.control('', Validators.required),
      BankAccountNo: this.fb.control(''),
      BankAccountTitle: this.fb.control(''),
      BankCode: this.fb.control(''),
      EmployeeBankAccountTypeCode: this.fb.control(''),
      DepartmentCode: this.fb.control('', Validators.required),
      DepartmentName: this.fb.control('', Validators.required),
      DesignationCode: this.fb.control('', Validators.required),
      DesignationName: this.fb.control('', Validators.required),
    });

    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    //  this.loadAllPayPackageMaster();
    this.loadPayPackageMAxCode();
    this.loadEmployee();
    this.LoadAllBanks();
    this.LoadBTAccountType();
  }

  changeEmployee(e: any) {
    this.selectedEmployeeCode = e.value;
    this.loadAllEmployeeSalaryPayHeads(
      this.globalBranchCode,
      this.selectedEmployeeCode
    );
  }
  loadEmployee() {
    this.apiServices.get(ApiEndpoints.EmployeeSetup).subscribe((res: any) => {
      this.EmployeeResponse$ = res;
    });
  }
  changeBank(e: any) {
    this.selectedBank = +e.target.value;
  }
  LoadAllBanks() {
    this.apiServices.get(ApiEndpoints.getAllBanks).subscribe((res) => {
      this.bank = res;
    });
  }
  changeBankacctype(e: any) {
    this.selectedbankacctype = +e.target.value;
  }
  LoadBTAccountType() {
    this.apiServices
      .get(ApiEndpoints.getSelectBTAccountType)
      .subscribe((res) => {
        this.bankacctype = res;
      });
  }

  // loadAllPayPackageMaster() {
  //   this.apiServices
  //     .get(ApiEndpoints.getAllPayPackageMaster)
  //     .subscribe((res: any) => {
  //       this.PayPackageresponse$ = res;
  //     });
  //   this.loadPayPackageMAxCode();
  // }
  loadAllEmployeeSalaryPayHeads(BranchCode: number, EmployeeCode: number) {
    this.apiServices
      .get(
        ApiEndpoints.getEmployeeSalaryPayHeads +
          '?BranchCode=' +
          BranchCode +
          '&EmployeeCode=' +
          EmployeeCode
      )
      .subscribe((res: any) => {
        this.PayPackageresponse$ = res;
      });
  }
  loadPayPackageMAxCode() {
    this.apiServices.get(ApiEndpoints.getMaxPayPackageCode).subscribe((res) => {
      const x = Object.entries(res)
        .map((x) => x[1])
        .pop();
      this.PayPackageMAxCode = +x.PayPackageCode;
      this.MasterForm.get('PayPackageCode')?.setValue(this.PayPackageMAxCode);
    });
  }
  savePayPackageMaster() {
    let model = this.MasterForm.value;
    model.PayPackageCode = this.PayPackage.PayPackageCode;
    model.EmployeeCode = +this.selectedEmployeeCode;
    model.Salary = this.PayPackage.Salary;
    model.DisbursementMode = this.PayPackage.DisbursementMode;
    model.BankAccountNo =
      this.MasterForm.get('BankAccountNo')?.value === undefined || null
        ? null
        : this.MasterForm.get('BankAccountNo')?.value;
    model.BankAccountTitle =
      this.MasterForm.get('BankAccountTitle')?.value === undefined || null
        ? null
        : this.MasterForm.get('BankAccountTitle')?.value;
    model.BankCode = this.selectedBank ? +this.selectedBank : 0;
    model.EmployeeBankAccountTypeCode = this.selectedbankacctype
      ? +this.selectedbankacctype
      : 0;
    model.BranchCode = this.globalBranchCode!;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiServices
      .post(model, ApiEndpoints.postPayPackageMaster)
      .subscribe(() => {
        this.savePayPackageDetail();
        this.toastService.sendMessage({
          message: 'Pay Package Saved Successfully!',
          type: NotificationType.success,
        });
        // this.loadAllPayPackageMaster();
        this.MasterForm.reset();
      });
    this.MasterForm.markAsUntouched();
  }

  savePayPackageDetail() {
    const Salary = this.PayPackageresponse$;
    let len = Object.values(Salary).length;
    for (let i = 0; i < len; i++) {
      let x = this.PayPackageresponse$;
      let y: any = x.pop();
      let storeData: any = [];
      storeData.BranchCode = this.globalBranchCode;
      storeData.PayPackageCode = this.MasterForm.get('PayPackageCode')?.value;
      storeData.PayHeadCode = y?.PayHeadCode!;
      storeData.Percentage = y?.Percentage!;
      storeData.Value = y?.Value!;
      this.apiServices
        .post(storeData, ApiEndpoints.postPayPackageDetail)
        .subscribe(() => {
          //  this.loadAllPayPackageMaster();
          this.MasterForm.reset();
          this.MasterForm.markAsUntouched();
        });
    }
  }

  updatePayPackageMaster() {
    // let model = this.MasterForm.value;
    // model.BranchCode = this.globalBranchCode!;
    // this.apiServices.putPayPackageMaster(model).subscribe(() => {
    //   this.loadAllPayPackageMaster();
    //   this.toastService.sendMessage({
    //     message: 'Update Successfully',
    //     type: NotificationType.success,
    //   });
    // });
    // this.isUpdate = false;
    // this.MasterForm.reset();
  }
  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.PayPackageDetail = { ...data };
    this.tableLength = Object.keys(this.PayPackageDetail).length;
  }
  updatePayPackageDetail() {
    let model = this.MasterForm.value;
    model.BranchCode = this.globalBranchCode!;
    this.apiServices
      .update(model, ApiEndpoints.putPayPackageDetail)
      .subscribe(() => {
        //   this.loadAllPayPackageMaster();
        this.toastService.sendMessage({
          message: 'Pay Package Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.MasterForm.reset();
  }
  delete(PayPackageCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiServices
          .delete(
            ApiEndpoints.deletePayPackage + '?PayPackageCode=' + PayPackageCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Pay Package Deleted Successfully!',
              type: NotificationType.error,
            });
            //       this.loadAllPayPackageMaster();
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

    this.MasterForm.markAsUntouched();
  }

  onSelectDisable(e: any) {
    if (e.target.value == 2) {
      this.MasterForm.get('BankCode')?.disable();
      this.MasterForm.get('EmployeeBankAccountTypeCode')?.disable();
      this.MasterForm.get('BankAccountNo')?.disable();
      this.MasterForm.get('BankAccountTitle')?.disable();
    } else {
      this.MasterForm.get('BankCode')?.enable();
      this.MasterForm.get('EmployeeBankAccountTypeCode')?.enable();
      this.MasterForm.get('BankAccountNo')?.enable();
      this.MasterForm.get('BankAccountTitle')?.enable();
    }
  }
  addorUpdate() {
    if (!this.isUpdate) {
      this.savePayPackageMaster();
    } else {
      this.updatePayPackageMaster();
    }
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.savePayPackageMaster();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.savePayPackageMaster();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.isUpdate = false;
    this.MasterForm.reset();
    //   this.loadAllPayPackageMaster();
  }
  getdata(e: any) {
    let Department = this.EmployeeResponse$[0].DepartmentName;
    let Designation = this.EmployeeResponse$[0].DesignationName;
    this.MasterForm.patchValue({
      DepartmentCode: Department,
      DesignationCode: Designation,
    });
  }

  onRowEditInit(data: any) {}

  onRowEditSave(e: any) {
    let totalPercentage = 0;
    let totalValue = 0;
    this.PayPackageresponse$.forEach((data: any) => {
      totalPercentage += parseFloat(data.Percentage);
      totalValue += parseFloat(data.Value);
    });

    this.percentage = totalPercentage;
    this.value = totalValue;
    if (totalValue === this.MasterForm.controls['Salary'].value) {
      e.editing = false;
      this.disableEditRow = true;
    } else {
      e.editing = true;
      this.disableEditRow = false;
    }
  }

  calculateValue(event: any) {
    let val = this.MasterForm.value;
    const qty = +val.Salary;
    const rate = event.Percentage;
    if (rate !== undefined && rate !== null) {
      const x = (qty * rate) / 100;
      event.Value = parseFloat(x.toString()).toFixed(2);
    }
  }
  calculatePercentage(event: any) {
    let val = this.MasterForm.value;
    const qty = +val.Salary;
    const value = event.Value;
    if (value !== undefined && value !== null) {
      const rate = (value / qty) * 100;
      event.Percentage = parseFloat(rate.toString()).toFixed(2);
    }
  }
}
