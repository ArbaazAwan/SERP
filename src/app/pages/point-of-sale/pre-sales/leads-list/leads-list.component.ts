import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss'],
})
export class LeadsListComponent implements OnInit {
  form!: FormGroup;
  Masterform!: FormGroup;
  filterForm!: FormGroup;
  MasterTableResponse$: any = [];
  isUpdate: boolean = false;
  tableLength!: number;
  LeadMasterResponse$: any = [];
  editableData: any;
  globalBranchCode!: number;
  saveDisabled: boolean = true;
  updateDisabled: boolean = false;
  model: any = [];
  MasterResponse$: any = [];
  tableResponse$: any = [];
  loadingerror = false;
  FiltersDialogue: boolean = false;
  ModulelistResp$: any = [];
  Statusresponse$: any = [];
  employeeTableResponse: any;
  selectedCountryCode: number = 0;
  selectedOwnerCode: number = 0;
  selectedStatus: number = 0;
  isLoadingData: boolean = false;
  UserId: any;
  componentName: string = 'Leads List';
  get showFilterButton(): boolean {
    return (
      (this.filterForm.get('EmployeeCode')?.value !== null &&
        this.filterForm.get('EmployeeCode')?.value !== 0) ||
      (this.filterForm.get('CountryCode')?.value !== null &&
        this.filterForm.get('CountryCode')?.value !== 0) ||
      (this.filterForm.get('StatusCode')?.value !== null &&
        this.filterForm.get('StatusCode')?.value !== 0)
    );
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private apiService: ApiProviderService
  ) {}
  ngOnInit() {
    this.Masterform = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      LeadCode: this.fb.control('', Validators.required),
    });

    this.filterForm = this.fb.group({
      EmployeeCode: this.fb.control(''),
      CountryCode: this.fb.control(''),
      StatusCode: this.fb.control(''),
    });
    //=====================Get User Rights =================
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 9;
    const FormId = 4;
    this.apiService
      .get(
        ApiEndpoints.GetUserFormRights +
          '?UserId=' +
          UserId +
          '&ModuleId=' +
          ModuleId +
          '&FormId=' +
          FormId
      )
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });
    this.form = this.fb.group({
      PartyTypeId: this.fb.control('', Validators.required),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllLeadsMaster();
    this.loadAllEmployee();
    this.loadAllLeadStatus();
    this.loadAllCountries();
  }
  loadAllLeadsMaster() {
    this.apiService
      .get(
        ApiEndpoints.GetAllLeadMaster +
          `?BranchCode=${this.globalBranchCode}&EmployeeCode=0&CountryCode=0&StatusCode=0`
      )
      .subscribe((res: any) => {
        this.MasterTableResponse$ = res.data;
        //localStorage.setItem('LeadCode', this.MasterTableResponse$.leadCode);
        const leadCodeToStore = res.data.LeadCode;
        localStorage.setItem('LeadCode', leadCodeToStore);
      });
  }

  navigateToDetailForm() {
    let val = this.Masterform.value;
    this.model = val;
    this.model.BranchCode = this.globalBranchCode!;
    this.model.CreatedBy = localStorage.getItem('UserId');
    this.apiService
      .post(this.model, ApiEndpoints.CreateLeadMaster + `?`)
      .subscribe((res) => {
        this.MasterResponse$.LeadCode = res;
        const LeadCode = this.MasterResponse$.LeadCode;
        if (LeadCode) {
          localStorage.setItem('LeadCode', LeadCode);
          this.router.navigate(['/Pre-sales/leads-info'], {
            queryParams: { LeadCode: LeadCode },
          });
        }
        // this.toastService.sendMessage({
        //   message: 'Saved',
        //   type: NotificationType.success,
        // });
      });
    this.Masterform.markAsUntouched();
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.navigateToDetailForm();
  }

  updateAllow(data: any) {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.getSelectedRow(data);
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.tableResponse$ = data;
    if (data) {
      let LeadCode = data.LeadCode;
      let EmployeeCode = data.EmployeeCode;
      this.router.navigate(['/Pre-sales/leads-info'], {
        queryParams: { LeadCode: LeadCode, EmployeeCode: EmployeeCode },
      });
    }
  }

  delete(LeadCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.apiService
      .delete(
        ApiEndpoints.DeleteLead +
          `?BranchCode=${this.globalBranchCode}` +
          `&LeadCode=${LeadCode}`
      )
      .subscribe((res: any) => {
        this.toastService.sendMessage({
          message: 'Leads List Deleted Successfully!',
          type: NotificationType.deleted,
        });
        this.loadAllLeadsMaster();
      });

    this.form.markAsUntouched();
  }
  filter() {
    this.FiltersDialogue = true;
  }
  hideDialogFilter() {
    this.FiltersDialogue = false;
  }

  loadAllEmployee() {
    this.apiService.get(ApiEndpoints.EmployeeSetup).subscribe((res: any) => {
      this.employeeTableResponse = res;
    });
  }

  changeLeadOwner(event: any) {
    if (event.value != 0 && event.value != null) {
      this.selectedOwnerCode = +event.value;
    } else {
      this.selectedOwnerCode = 0;
    }
  }

  changeStatus(e: any) {
    this.selectedStatus = +e.value;
  }

  loadAllLeadStatus() {
    this.apiService
      .get(ApiEndpoints.GetAllLeadsStatus)
      .subscribe((res: any) => {
        this.Statusresponse$ = res.data;
      });
  }

  countryResponse$: any;

  loadAllCountries() {
    this.apiService
      .get(ApiEndpoints.Country + `/${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.countryResponse$ = res.data;
      });
  }
  countrySelect(event: any) {
    if (event.value != 0) {
      this.selectedCountryCode = event.value;
    } else {
      this.selectedCountryCode = 0;
    }
  }
  get formValue() {
    return this.filterForm.getRawValue();
  }
  checkFormValuesBeforeSubmit() {
    if (
      !this.formValue.EmployeeCode ||
      this.formValue.EmployeeCode == null ||
      this.formValue.EmployeeCode == undefined
    ) {
      this.form.get('EmployeeCode')?.setValue(0);
    }
    if (
      !this.formValue.CountryCode ||
      this.formValue.CountryCode == null ||
      this.formValue.CountryCode == undefined
    ) {
      this.form.get('CountryCode')?.setValue(0);
    }
    if (
      !this.formValue.StatusCode ||
      this.formValue.StatusCode == null ||
      this.formValue.StatusCode == undefined
    ) {
      this.form.get('StatusCode')?.setValue(0);
    }
  }
  // this.formValue.EmployeeCode,
  //       this.formValue.CountryCode,
  //       this.formValue.StatusCode,

  getFilterList() {
    let status = this.selectedStatus || 0;
    let country = this.selectedCountryCode || 0;
    let owner = this.selectedOwnerCode || 0;
    this.apiService
      .get(
        ApiEndpoints.GetAllLeadMaster +
          `?BranchCode=${this.globalBranchCode}&EmployeeCode=${owner}&CountryCode=${country}&StatusCode=${status}`
      )
      .subscribe((res: any) => {
        this.MasterTableResponse$ = res.data;
      });
    this.FiltersDialogue = false;
  }

  clearFilter() {
    this.filterForm.reset();
    this.loadAllLeadsMaster();
    this.FiltersDialogue = false;
    this.selectedStatus = 0;
    this.selectedCountryCode = 0;
    this.selectedOwnerCode = 0;
  }
}
