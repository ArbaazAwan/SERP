import { PurchaseInvoiceService } from './../../../_shared/services/purchase-invoice.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

export class Status {
  "StatusCode": number
  "StatusTitle": "Verified" | "Posted"
  "IsActive": boolean
}

const statuses: Status[] = [
  {
    "StatusCode": 1,
    "StatusTitle": "Verified",
    "IsActive": true
  },
  {
    "StatusCode": 2,
    "StatusTitle": "Posted",
    "IsActive": true
  }
]
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
})
export class PurchaseInvoiceComponent implements OnInit {

  UserId: any;
  model: any = [];
  currentDate!: Date;
  header: string = '';
  viewForm!: FormGroup;
  isDisabled!: boolean;
  loadingerror = false;
  createForm!: FormGroup;
  filterForm!: FormGroup;
  invoiceTypes: any = [];
  globalUserCode!: number;
  partyResponse: any = [];
  tableResponse$: any = [];
  isUpdate: boolean = false;
  saveorUpdate: string = '';
  selectedStore: number = 0;
  selectedDate: string = '';
  globalBranchCode!: number;
  selectedParty: number = 0;
  ModulelistResp$: any = [];
  submitted: boolean = false;
  selectedProject: number = 0;
  isSticky: boolean = false;
  statuses: Status[] = statuses;
  productDialog: boolean = false;
  isLoadingData: boolean = false;
  purchaseInvoiceForm!: FormGroup;
  FiltersDialogue: boolean = false;
  datePipe = new DatePipe('en-US');
  filteredPurchaseInvoices: any[] = [];
  showClearFilterButton: boolean = false;
  componentName: string = 'Purchase Invoice';
  get filterFormValue() { return this.filterForm.getRawValue() }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private utilityService: UtilityService,
    private storeProjectService: StoreProjectService,
  ) {
    this.formsInit();
  }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });

    //=====================Get User Rights =================
    this.getUserRights();
    this.currentDate = new Date();
    const firstDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );

    const lastDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );
    const formattedFirstDate = this.formatDate(firstDate);
    const formattedLastDate = this.formatDate(lastDate);
    const formattedCurrentDate = this.formatDate(this.currentDate);
    this.viewForm.controls['DateFrom'].setValue(formattedFirstDate);
    this.viewForm.controls['DateTo'].setValue(formattedLastDate);
    this.createForm.controls['PurchaseInvoiceDate'].setValue(
      formattedCurrentDate
    );
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;

    this.loadAllParties();
    this.getInvoiceTypes();
    this.loadAllPurchaseInvoices();
  }

  getUserRights() {
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 5;
    const FormId = 5;
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
  }

  filter() {
    this.showClearFilterButton = true;
    if (!!this.filterFormValue.DateFrom || !!this.filterFormValue.DateTo) {
      this.filteredPurchaseInvoices = this.utilityService
        .filterObjectsByDateRange(this.tableResponse$, this.filterFormValue.DateFrom, this.filterFormValue.DateTo, "PurchaseInvoiceDate")
        .filter((pi: any) => {
          return (this.filterFormValue.PartyName === null || pi.Party === this.filterFormValue.PartyName) &&
            ((this.filterFormValue.Verified === null || this.filterFormValue.Verified == false) || pi.IsVerified === this.filterFormValue.Verified) &&
            ((this.filterFormValue.Posted === null || this.filterFormValue.Posted == false) || pi.IsPosted === this.filterFormValue.Posted);
        });
    } else {
      this.filteredPurchaseInvoices = this.tableResponse$.filter((pi: any) => {
        const condition = (this.filterFormValue.PartyName === null || pi.Party === this.filterFormValue.PartyName) &&
          ((this.filterFormValue.Verified === null || this.filterFormValue.Verified == false) || pi.IsVerified === this.filterFormValue.Verified) &&
          ((this.filterFormValue.Posted === null || this.filterFormValue.Posted == false) || pi.IsPosted === this.filterFormValue.Posted);
        return condition;
      });
    }
    this.FiltersDialogue = false;
  }

  hideDialogFilter() {
    this.FiltersDialogue = false;
  }

  clearFilter() {
    this.filterForm.reset();
    this.filteredPurchaseInvoices = this.tableResponse$;
    this.showClearFilterButton = false;
    this.FiltersDialogue = false;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  changeParty(e: any) {
    this.selectedParty = +e.value;
  }

  loadAllParties() {
    this.apiService.get(ApiEndpoints.GetAllParties +
      `?BranchCode=${this.globalBranchCode}`).subscribe((res: any) => {
        this.partyResponse = res.data;
      });
  }

  loadAllPurchaseInvoices() {
    let val = this.viewForm.value;
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetPurchaseInvoicesList +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&DateFrom=${val.DateFrom}&DateTo=${val.DateTo}&PartyCode=${this.selectedParty}`)
      .subscribe((res: any) => {
        this.tableResponse$ = res;
        this.filteredPurchaseInvoices = res;
        this.isLoadingData = false;
      });
  }

  createPurchaseInvoice() {
    let val = this.purchaseInvoiceForm.value;
    this.model = val;
    this.model.StoreCode = this.selectedStore;
    this.model.PartyCode = this.purchaseInvoiceForm.controls['PartyCode'].value;
    this.model.BranchCode = this.globalBranchCode;
    this.model.CreatedBy = this.globalUserCode;
    this.model.InvoiceTypeId = this.purchaseInvoiceForm.controls['InvoiceTypeId'].value
    this.model.PurchaseInvoiceDate = this.purchaseInvoiceForm.controls['PurchaseInvoiceDate'].value

    this.apiService.post(this.model, ApiEndpoints.CreatePurchaseInvoiceMaster).subscribe((res) => {
      this.model.PurchaseInvoiceNo = res;
      const PurchaseInvoiceNo = this.model.PurchaseInvoiceNo;
      if (PurchaseInvoiceNo != null) {
        localStorage.setItem('PurchaseInvoiceNo', PurchaseInvoiceNo);
        this.router.navigate(['/Inventory/purchase-invoice-detail'], {
          queryParams: {
            StoreCode: this.selectedStore,
            PurchaseInvoiceNo: PurchaseInvoiceNo,
          },
        });
        this.createForm.reset();
        this.createForm.markAsUntouched();
      } else {
        this.toastService.sendMessage({
          message: 'Cannot Create Purchase Invoice Number',
          type: NotificationType.error,
        });
      }
    });
  }

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.createPurchaseInvoice();
  }

  hideErrorPopup() {
    this.loadingerror = false;
  }

  getSelectedRow(data: any) {
    this.tableResponse$ = { ...data };
    if (data) {
      const PurchaseInvoiceNo = data.PurchaseInvoiceNo;
      const store = data.StoreCode;
      this.router.navigate(['/Inventory/purchase-invoice-detail'], {
        queryParams: { StoreCode: store, PurchaseInvoiceNo: PurchaseInvoiceNo },
      });
    }
  }
  formsInit() {
    this.createForm = this.fb.group({
      StoreCode: this.fb.control(''),
      PartyCode: this.fb.control(''),
      PurchaseInvoiceDate: this.fb.control(''),
    });
    this.viewForm = this.fb.group({
      DateFrom: this.fb.control(''),
      DateTo: this.fb.control(''),
      StoreCode: this.fb.control(''),
      PartyCode: this.fb.control(''),
    });
    this.filterForm = this.fb.group({
      PartyName: null,
      DateFrom: null,
      DateTo: null,
      Verified: null,
      Posted: null
    });
    this.purchaseInvoiceForm = this.fb.group({
      PartyCode: null,
      PurchaseInvoiceDate: new Date,
      InvoiceTypeId: null
    })
  }

  CreateNewPurchaseInvoice() {
    this.header = 'Purchase Invoice';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialog = true;
    this.isUpdate = false;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.purchaseInvoiceForm.reset();
    this.isUpdate = false;
  }

  getInvoiceTypes() {
    this.apiService.get(ApiEndpoints.GetInvoiceTypeId).subscribe((res: any) => [
      this.invoiceTypes = res.data
    ])
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
}
