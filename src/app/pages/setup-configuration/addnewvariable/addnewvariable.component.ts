import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { PartySetupModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { PartySetupService } from 'src/app/_shared/services/party-setup.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-addnewvariable',
  templateUrl: './addnewvariable.component.html',
  styleUrls: ['./addnewvariable.component.scss'],
})
export class AddnewvariableComponent implements OnInit, OnChanges {
  tableResponse$: any = [];
  partyCodeRate: any;
  mainDialog!: boolean;
  mainHeader!: string;
  form!: FormGroup;
  cities!: any[];
  partyTableResponse$!: PartySetupModel[];
  partyObjectResponse$: any = [];
  payableResponse$: any = [];
  receiveableResponse$: any = [];
  selectedPartyTypes: any;
  submitted = false;
  selectedAccRec!: number;
  selectedAccPay!: number;
  globalBranchCode!: number;
  tableLength!: number;
  datePipe = new DatePipe('en-US');
  selectedDate: string = '';
  currentDate: any;
  addNewParty = 'Add new Party';
  addNewCustomer = 'Add new Customer';
  addNew = 'Add new';
  edit = 'Edit';
  customerInfo = 'Customer Info';
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  selectedCountryCode: number = 0;

  @Input() isUpdate: boolean = false;
  @Input() selectedRow: any;
  @ViewChild('dt') dt!: any;
  @Output() saveSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private api: PartySetupService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private apiservice: ApiProviderService,
    private _utilityService: UtilityService,
    private _toastService: ToastService
  ) {
    this.formInit();
  }

  ngOnInit(): void {
    this.getUserRights();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllCountries();
    this.loadAllParties();
    this.loadPartyCodes();
    this.loadAccountPayable();
    this.loadAccountReceiveable();

    this.partyObjectResponse$.IsActive = true;
  }

  private getUserRights() {
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    let ModuleId;
    let FormId;
    if (this.partyvariable() == true) {
      ModuleId = 3;
      FormId = 4;
    } else {
      ModuleId = 5;
      FormId = 2;
    }
    this.apiservice
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
  }

  formInit() {
    this.form = this.fb.group({
      PartyTypeId: this.fb.control('', Validators.required),
      PartyName: this.fb.control('', Validators.required),
      ShortName: this.fb.control('', Validators.required),
      HeadOfficeAddress: this.fb.control(''),
      MillAddress: this.fb.control(''),
      HeadOfficePhone: this.fb.control(''),
      MillPhone: this.fb.control('', Validators.required),
      URL: this.fb.control(''),
      Email: this.fb.control('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      STRNo: this.fb.control(''),
      NTN: this.fb.control(''),
      CNICNo: this.fb.control(''),
      Remarks: this.fb.control(''),
      AccountReceivable: this.fb.control(''),
      AccountPayable: this.fb.control(''),
      IsActive: this.fb.control(true),
      IsTrackAsCompany: this.fb.control(false),
      Street: this.fb.control(''),
      Street2: this.fb.control(''),
      City: this.fb.control(''),
      State: this.fb.control(''),
      Zip: this.fb.control(''),
      SaleLicense: this.fb.control(''),
      SalesLicenseExpiry: this.fb.control(''),
      EndsLicense: this.fb.control(''),
      EndsExpiry: this.fb.control(''),
      RefrenceName: this.fb.control(''),
      IsMailAllowed: this.fb.control(false),
      IsTaxExempt: this.fb.control(false),
      IsAcceptChecks: this.fb.control(false),
      IsShippingAddress: this.fb.control(false),
      IsAllowedEmail: this.fb.control(false),
      Amount: this.fb.control(0),
      DebitCreditLimit: this.fb.control(0),
      CompanyIndividual: this.fb.control(''),
      PastDueBalance: this.fb.control(''),
      DebitCreditLimitDays: this.fb.control(''),
      DebitCreditLimitAmount: this.fb.control(''),
      CountryCode: this.fb.control('', Validators.required),
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  ngOnChanges(changes: any): void {
    if (this.isUpdate) {
      if (changes?.selectedRow?.currentValue) {
        let data = changes?.selectedRow?.currentValue;
        this.loadPartyitemsRates(data.PartyCode);
        this.partyCodeRate = data.PartyCode;
        this.getSelectedRow(data);
      }
    }
  }

  Addnew(): boolean {
    const url = this.router.url;
    return url === '/dash-board2/AddnewVar';
  }

  partyvariable(): boolean {
    const url = this.router.url;
    return url === '/Inventory/party-setup';
  }

  customervariable(): boolean {
    const url = '/POS/possaledetails';
    const url2 = '/POS/customer';
    const url3 = 'leads-info';
    const currentUrl = this.router.url;
    const currentUrl2 = this.route.snapshot.url[0].path;

    return (
      currentUrl.startsWith(url) ||
      currentUrl.startsWith(url2) ||
      currentUrl2.startsWith(url3)
    );
  }

  PartysetupForm(): boolean {
    const url = this.router.url;
    return url === '/Inventory/party-setup';
  }

  CustomersetupForm() {
    const url = this.router.url;
    return url === '/POS/sale-invoice-detail';
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  get f() {
    return this.partyObjectResponse$.controls;
  }

  partyTypes: any;
  loadPartyCodes() {
    this.apiservice
      .get(ApiEndpoints.LoadAllPartyTypes)
      .subscribe((res: any) => {
        this.partyTypes = res.data;
      });
  }

  loadAllParties() {
    this.apiservice
      .get(ApiEndpoints.LoadAllParties + `?BranchCode=${this.globalBranchCode}`)
      .subscribe((res: any) => {
        this.partyTableResponse$ = res;
      });
  }

  changeAccRec(e: any) {
    this.selectedAccRec = e.value;
  }

  loadAccountReceiveable() {
    this.apiservice.get(ApiEndpoints.GetAccountTitle).subscribe((res: any) => {
      this.receiveableResponse$ = res.data;
    });
  }

  loadPartyitemsRates(partycode: any) {
    this.api.GetPartyItemRates(partycode).subscribe((res: any) => {
      this.tableResponse$ = res.body;
    });
  }

  changeAccPay(e: any) {
    this.selectedAccPay = e.value;
  }

  loadAccountPayable() {
    this.apiservice.get(ApiEndpoints.GetAccountTitle).subscribe((res: any) => {
      this.payableResponse$ = res.data;
    });
  }

  save() {
    let model = this.form.value;
    // if (!model.IsActive) {
    //   model.IsActive = false;
    // }
    // model.PartyName = this.partyObjectResponse$.PartyName || '';
    // model.ShortName = this.partyObjectResponse$.ShortName || '';
    // model.HeadOfficeAddress = this.partyObjectResponse$.HeadOfficeAddress || '';
    // model.MillAddress = this.partyObjectResponse$.MillAddress || '';
    // model.HeadOfficePhone = this.partyObjectResponse$.HeadOfficePhone || '';
    // model.MillPhone = this.partyObjectResponse$.MillPhone || '';
    // model.URL = this.partyObjectResponse$.URL || '';
    // model.Email = this.partyObjectResponse$.Email || '';
    // model.STRNo = this.partyObjectResponse$.STRNo || '';
    // model.NTN = this.partyObjectResponse$.NTN;
    // model.CNICNo = this.partyObjectResponse$.CNICNo || '';
    // model.Remarks = this.partyObjectResponse$.Remarks || '';
    // model.AccountReceivable = this.partyObjectResponse$.AccountReceivable;
    // model.AccountPayable = this.partyObjectResponse$.AccountPayable;
    // model.Amount = this.partyObjectResponse$.Amount || 0;
    // model.DebitCreditLimit = this.partyObjectResponse$.DebitCreditLimit || 0;
    // model.CompanyIndividual = this.partyObjectResponse$.CompanyIndividual || '';
    // add new data

    // model.IsTrackAsCompany =
    //   this.partyObjectResponse$.IsTrackAsCompany || false;
    // model.Street = this.partyObjectResponse$.Street || '';
    // model.Street2 = this.partyObjectResponse$.Street2 || '';
    // model.City = this.partyObjectResponse$.City || '';
    // model.State = this.partyObjectResponse$.State || '';
    // model.Zip = this.partyObjectResponse$.Zip || '';
    // model.SaleLicense = this.partyObjectResponse$.SaleLicense || '';
    // const currentDate = new Date();
    // model.SalesLicenseExpiry =
    //   this.partyObjectResponse$.SalesLicenseExpiry || '';
    // model.EndsExpiry = this.partyObjectResponse$.EndsExpiry || '';

    // model.EndsLicense = this.partyObjectResponse$.EndsLicense || '';
    // model.RefrenceName = this.partyObjectResponse$.RefrenceName || '';
    // model.IsMailAllowed = this.partyObjectResponse$.IsMailAllowed || false;
    // model.IsTaxExempt = this.partyObjectResponse$.IsTaxExempt || false;
    // model.IsAcceptChecks = this.partyObjectResponse$.IsAcceptChecks || false;
    // model.IsShippingAddress =
    //   this.partyObjectResponse$.IsShippingAddress || false;
    // model.IsAllowedEmail = this.partyObjectResponse$.IsAllowedEmail || false;
    // model.CountryCode = this.selectedCountryCode || '';
   
    model.EndsExpiry = model.EndsExpiry == null ? '' : model.EndsExpiry;
    model.SalesLicenseExpiry = model.SalesLicenseExpiry == null ? '' : model.SalesLicenseExpiry;
    model.BranchCode = this.globalBranchCode!;
    model.UserId = +localStorage.getItem('UserId')!;
    const partyCodeValue = this.form.get('PartyTypeId')?.value;

    if (partyCodeValue) {
      let len = Object.values(partyCodeValue).length;
      for (let i = 0; i < len; i++) {
        let x: number[] = this.form.get('PartyTypeId')?.value;
        let y = x.pop();
        model.PartyTypeId = y;
      }
    } else {
      model.PartyTypeId = 0;
      // Assign a default value when no party is selected
    }
    this.apiservice
      .post(model, ApiEndpoints.CreatePartySetup + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Party Created Successfully fff!',
          type: NotificationType.success,
        });
        // this.loadAllParties();
        // this.form.reset();
      });
      this.saveSuccess.emit(true);
    this.form.markAsUntouched();
    this.refresh();
  }

  dateChange(e: any) {
    const date = this.datePipe.transform(e.target.value, 'MM-dd-yyyy');
    this.selectedDate = date!;
    this.partyObjectResponse$.EndsExpiry = date;
  }

  update() {
    this.isUpdate = false;
    let branchcode = localStorage.getItem('BranchCode');
    let user = localStorage.getItem('UserId');
    this.partyObjectResponse$.ModifiedOn = +branchcode!;
    this.partyObjectResponse$.ModifiedBy = +user!;
    if (this.partyObjectResponse$.SalesLicenseExpiry === null) {
      this.partyObjectResponse$.SalesLicenseExpiry = '';
    }
    if (this.partyObjectResponse$.EndsExpiry === null) {
      this.partyObjectResponse$.EndsExpiry = '';
    }
    this.partyObjectResponse$.IsMailAllowed = false;
    this.partyObjectResponse$.CountryCode = this.selectedCountryCode || '';
    this.apiservice
      .update(this.partyObjectResponse$, ApiEndpoints.UpdatePartySetup + `?`)
      .subscribe((res) => {
        this.loadAllParties();
        if (res === true || res == true) {
          this.isUpdate = true;
          return this.toastService.sendMessage({
            message: 'Party Updated Successfully!',
            type: NotificationType.success,
          });
        } else {
          return this.toastService.sendMessage({
            message: 'Unexpected Error!',
            type: NotificationType.error,
          });
        }
      });

    // this.form.reset();
    // this.refresh();
    this.loadAllParties();
    this.loadPartyCodes();
    this.form.markAsUntouched();
  }

  addorUpdate() {
    if (!this.isUpdate) {
      this.add();
    } else {
      this.updateAllow();
    }
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.save();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  refresh() {
    this.form.reset();
    this.partyObjectResponse$.AccountReceivable = null;
    this.partyObjectResponse$.AccountPayable = null;
    this.countryResponse$.CountryCode = null;
    this.loadAllParties();
    this.loadPartyCodes();
    this.form.markAsUntouched();
    this.isUpdate = false;
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    let model = data;
    this.partyObjectResponse$ = { ...data };
    this.partyObjectResponse$.SalesLicenseExpiry = this.datePipe.transform(
      data.SalesLicenseExpiry,
      'MM-dd-yyyy'
    );
    this.partyObjectResponse$.EndsExpiry = this.datePipe.transform(
      data.EndsExpiry,
      'MM-dd-yyyy'
    );
    if (typeof data.AccountReceivable === 'string') {
      this.partyObjectResponse$.AccountReceivable =
        data.AccountReceivable.trim();
    }
    if (typeof data.AccountPayable === 'string') {
      this.partyObjectResponse$.AccountPayable = data.AccountPayable.trim();
    } else {
      this.partyObjectResponse$.AccountPayable =
        data.AccountPayable.toString().trim();
    }
    this.tableLength = Object.keys(this.partyObjectResponse$).length;
  }
  openNew() {
    const url = this.router.url;
    if (url === '/Inventory/party-setup') {
      this.mainHeader = 'Add Party Sale Rate';
    } else if (url === '/POS/customer') {
      this.mainHeader = 'Add Customer Sale Rate';
    } else {
      // Add a default header value if the URL does not match any of the above conditions
      this.mainHeader = 'Add';
    }

    this.mainDialog = true;
  }

  hideDialog() {
    // this.loadAllParties();
    this.mainDialog = false;
  }
  deleteRate(code: string) {
    const partyCode = this.partyCodeRate;
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Party Code ${code}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiservice
          .delete(ApiEndpoints.DeletePartyItemRates + `?`, {
            PartyCode: partyCode,
            ItemCode: code,
          })
          .subscribe((res) => {
            if (res === 200) {
              return this.toastService.sendMessage({
                message: 'Party Setup Deleted Successfully!',
                type: NotificationType.warning,
              });
            }
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
  }
  filterGlobal(event: any) {
    if (event?.target?.value) {
      this.dt.filterGlobal(event?.target?.value, 'contains');
    }
  }

  clearFilter(event: any) {
    if (!event?.target?.value) {
      this.dt.filterGlobal(event?.target?.value, '');
    }
  }
  IssueOnBlur(data: any) {
    const partyCode = this.partyCodeRate;
    this.apiservice
      .update(
        {},
        ApiEndpoints.PutPartyItemRates +
          `?PartyCode=${partyCode}&ItemCode=${data.ItemCode}&Rate=${data.Rate}`
      )
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Party Item Rates Updated Successfully!',
          type: NotificationType.success,
        });
      });
  }

  countryResponse$: any;

  loadAllCountries() {
    this.apiservice.get(ApiEndpoints.Country).subscribe((res: any) => {
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
  onSubmit() {
    if (this.form.invalid) {
      this._utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      this._toastService.sendMessage({
        message: 'Invalid form fields, please fill out all required fields',
        type: NotificationType.error,
        title: 'Invalid Form',
      });
      return;
    }
    this.addorUpdate();

    // const payLoad: IRecruitmentRequirement = {
    //   ...this.formValues,
    // };

    //   if (this.isUpdate) {
    //     this.updateRecruitmentRequirement(payLoad);
    //   } else {
    //     this.postRecruitmentRequirement(payLoad);
    //   }
    // }
  }
}
