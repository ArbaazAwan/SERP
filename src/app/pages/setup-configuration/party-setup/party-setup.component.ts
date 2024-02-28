import { PartySetupModel } from './../../../_shared/model/model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { GlReportsService } from 'src/app/_shared/services/gl-reports.service';
@Component({
  selector: 'app-party-setup',
  templateUrl: './party-setup.component.html',
  styleUrls: ['./party-setup.component.scss'],
})
export class PartySetupComponent implements OnInit {
  form!: FormGroup;
  isUpdate: boolean = false;
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
  mainDialog!: boolean;
  mainHeader!: string;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId: any;
  loading = false;
  isLoadingData: boolean = false;
  selectedRow: any;
  selectCustomerId: number = 0;
  customerDetail: boolean = false;
  editCustomer: boolean = false;
  selectedCustomer: any = '';

  componentName: string = '';
  isSticky: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private cdRef: ChangeDetectorRef,
    private apiservice: ApiProviderService,
    private apiService: GlReportsService
  ) {
    this.formInit();
  }

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  partyvariable(): boolean {
    const url = this.router.url;
    return url === '/Inventory/party-setup';
  }

  customervariable(): boolean {
    const url = '/POS/customer';
    const currentUrl = this.router.url;
    return currentUrl.startsWith(url);
  }

  PartysetupForm(): boolean {
    const url = this.router.url;
    return url === '/POS/sale-invoice-detail';
  }

  ngOnInit() {
    if (this.partyvariable() == true) {
      this.componentName = 'Party Setup';
    } else {
      this.componentName = 'Customer Setup';
    }
    this.getUserRights();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.loadAllParties();
    this.loadPartyCodes();
    this.loadAccountPayable();
    this.loadAccountReceiveable();
  }
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  getUserRights(): void {
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

  formInit():void {
    this.form = this.fb.group({
      PartyTypeId: ['', Validators.required ],
      PartyName: ['', Validators.required ],
      ShortName: ['', Validators.required ],
      HeadOfficeAddress: ['', Validators.required ],
      MillAddress: ['', Validators.required ],
      HeadOfficePhone: ['', Validators.required ],
      MillPhone: ['', Validators.required ],
      URL: ['', Validators.required ],
      Email: this.fb.control('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      STRNo: ['', Validators.required ],
      NTN: ['', Validators.required ],
      CNICNo: ['', Validators.required ],
      Remarks: ['', Validators.required ],
      AccountReceivable: [''],
      AccountPayable: [''],
      IsActive: [ false, Validators.required ],
    });
  }

  openNew(event?: any, action?: string) {
    this.customerDetail = false;
    this.editCustomer = true;
    this.editCustomer = true;
    if (action === 'add') {
      const url = this.router.url;
      if (url === '/Inventory/party-setup') {
        this.mainHeader = 'Add Party Information';
      } else if (url === '/POS/customer') {
        this.mainHeader = 'Add Customer Information';
      } else {
        // Add a default header value if the URL does not match any of the above conditions
        this.mainHeader = 'Add';
      }
      // this.mainBtn = 'Save';
      this.mainDialog = true;
      this.isUpdate = false;
      this.form.reset();
      // this.loadAllParentCodeItem();
    } else if (action === 'edit') {
      this.isUpdate = true;
      const url = this.router.url;
      if (url === '/Inventory/party-setup') {
        this.mainHeader = 'Edit Party Information';
      } else if (url === '/POS/customer') {
        this.mainHeader = 'Edit Customer Information';
      } else {
        // Add a default header value if the URL does not match any of the above conditions
        this.mainHeader = 'Add';
      }

      // this.mainBtn = 'Save';
      this.mainDialog = true;
      // this.loadAllParentCodeItem();
      this.selectedRow = event;
    }
    this.loadAllParties();
  }

  get f() {
    return this.partyObjectResponse$.controls;
  }
  hideDialog() {
    this.loadAllParties();
    this.mainDialog = false;
    this.form.reset();
  }
  loadPartyCodes() {
    //api/PartySetup/LoadAllPartyTypes
    this.apiservice
      .get(ApiEndpoints.LoadAllPartyTypes)
      .subscribe((res: any) => {
        this.cities = res;
      });
  }

  loadAllParties() {
    this.apiservice.get(ApiEndpoints.LoadAllParties + `?BranchCode=${this.globalBranchCode}`).subscribe((res: any) => {
      return (this.partyTableResponse$ = res.data);
    });
  }

  changeAccRec(e: any) {
    this.selectedAccRec = e.value;
  }

  loadAccountReceiveable() {
    this.apiservice.get(ApiEndpoints.GetAccountTitle).subscribe((res: any) => {
      this.receiveableResponse$ = res;
    });
  }

  changeAccPay(e: any) {
    this.selectedAccPay = e.value;
  }

  loadAccountPayable() {
    this.apiservice.get(ApiEndpoints.GetAccountTitle).subscribe((res: any) => {
      this.payableResponse$ = res;
    });
  }
  toggleMainDialog(value: boolean) {
    this.mainDialog = value;
  }
  // save() {
  //   let model = this.form.value;
  //   if (!model.IsActive) {
  //     model.IsActive = false;
  //   }
  //   model.PartyName = this.partyObjectResponse$.PartyName;
  //   model.ShortName = this.partyObjectResponse$.ShortName;
  //   model.HeadOfficeAddress = this.partyObjectResponse$.HeadOfficeAddress;
  //   model.MillAddress = this.partyObjectResponse$.MillAddress;
  //   model.HeadOfficePhone = this.partyObjectResponse$.HeadOfficePhone;
  //   model.MillPhone = this.partyObjectResponse$.MillPhone;
  //   model.URL = this.partyObjectResponse$.URL;
  //   model.Email = this.partyObjectResponse$.Email;
  //   model.STRNo = this.partyObjectResponse$.STRNo;
  //   model.NTN = this.partyObjectResponse$.NTN;
  //   model.CNICNo = this.partyObjectResponse$.CNICNo;
  //   model.Remarks = this.partyObjectResponse$.Remarks;
  //   model.AccountReceivable = this.partyObjectResponse$.AccountReceivable;
  //   model.AccountPayable = this.partyObjectResponse$.AccountPayable;

  //   model.BranchCode = this.globalBranchCode!;
  //   model.UserId = +localStorage.getItem('UserId')!;

  //   const partyCodeValue = this.form.get('PartyTypeId')?.value;
  //   let len = Object.values(partyCodeValue).length;
  //   for (let i = 0; i < len; i++) {
  //     let x: number[] = this.form.get('PartyTypeId')?.value;
  //     let y = x.pop();
  //     model.PartyTypeId = y;
  //   }

  //   this.apiservice
  //     .post(model, ApiEndpoints.CreatePartySetup + `?`)
  //     .subscribe(() => {
  //       this.toastService.sendMessage({
  //         message: 'Party Created Successfully fff!',
  //         type: NotificationType.success,
  //       });
  //       this.loadAllParties();
  //       this.form.reset();
  //     });
  //   this.form.markAsUntouched();
  //   this.refresh();
  //   this.mainDialog = false;
  // }
  

  // update() {
  //   let branchcode = localStorage.getItem('BranchCode');
  //   let user = localStorage.getItem('UserId');
  //   this.partyObjectResponse$.ModifiedOn = +branchcode!;
  //   this.partyObjectResponse$.ModifiedBy = +user!;
  //   this.apiservice
  //     .update(this.partyObjectResponse$, ApiEndpoints.UpdatePartySetup + `?`)
  //     .subscribe((res) => {
  //       this.loadAllParties();
  //       if (res === 200) {
  //         return this.toastService.sendMessage({
  //           message: 'Party Updated Successfully!',
  //           type: NotificationType.success,
  //         });
  //       } else {
  //         return this.toastService.sendMessage({
  //           message: 'Unexpected Error!',
  //           type: NotificationType.error,
  //         });
  //       }
  //     });
  //   this.isUpdate = false;
  //   this.form.reset();
  //   this.refresh();
  //   this.mainDialog = true;
  // }

  // addorUpdate() {
  //   if (!this.isUpdate) {
  //     this.save();
  //   } else {
  //     this.update();
  //   }
  // }

  refresh() {
    this.form.reset();
    this.partyObjectResponse$.AccountReceivable = null;
    this.partyObjectResponse$.AccountPayable = null;

    this.loadAllParties();
    this.loadPartyCodes();
    this.form.markAsUntouched();
    this.isUpdate = false;
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.partyObjectResponse$ = { ...data };
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
    let type = this.cities.find((x: any) => {
      return x.PartyTypeId === this.partyObjectResponse$.PartyTypeId;
    });
    this.selectedPartyTypes = type.PartyType;
    this.tableLength = Object.keys(this.partyObjectResponse$).length;
    this.mainDialog = true;
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  delete(code: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Party Code ${code}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiservice
          .delete(ApiEndpoints.DeletePartySetup + `?`, { PartyCode: code })
          .subscribe((res) => {
            this.loadAllParties();
            if (res === 200) {
              return this.toastService.sendMessage({
                message: 'Party Setup Deleted Successfully!',
                type: NotificationType.deleted,
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
    this.form.markAsUntouched();
  }

  pintPartyReport() {
    this.loading = true;
    this.apiService.pintPartySetUpReport().subscribe((pdf: any) => {
      const file = new Blob([pdf], {
        type: 'application/pdf',
      });
      this.loading = false;
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
  }

  showUserInfo(customer: any) {
    const url = this.router.url;
    if (url === '/Inventory/party-setup') {
      this.mainHeader = 'Party Information';
    } else if (url === '/POS/customer') {
      this.mainHeader = 'Customer Information';
    }
    this.selectedCustomer = customer;
    this.selectCustomerId =
      this.selectedCustomer.CustomerId || this.selectedCustomer.PartyCode;
    this.mainDialog = true;
    this.customerDetail = true;
    this.editCustomer = false;
  }
  
  onEvent(event: any) {
    event.stopPropagation();
  }
}
