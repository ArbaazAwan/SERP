import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-purchase-payment',
  templateUrl: './purchase-payment.component.html',
  styleUrls: ['./purchase-payment.component.scss']
})
export class PurchasePaymentComponent implements OnInit {
  partyResponse: any;
  currentDate!: Date;
  header: string = '';
  viewForm!: FormGroup;
  filterForm!: FormGroup;
  filteredPayments: any;
  instrumentResponse: any;
  isUpdate: boolean = false;
  saveorUpdate: string = '';
  selectedStore: number = 0;
  submitted: boolean = false;
  purchasePaymentsList: any;
  selectedParty: number = 0;
  isSticky: boolean = false;
  selectedProject: number = 0;
  globalUserCode: number = 0;
  globalBranchCode: number = 0;
  InstrumentTypeId: number = 0;
  paymentDialog: boolean = false;
  purchasePaymentForm!: FormGroup;
  isLoadingData: boolean = false;
  FiltersDialogue: boolean = false;
  showClearFilterButton: boolean = false;
  componentName: string = 'Purchase Payment';
  get filterFormValue() { return this.filterForm.getRawValue() }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private utilityService: UtilityService,
    private apiService: ApiProviderService,
    private storeProjectService: StoreProjectService,
  ) { }

  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.formsInit()
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
    this.viewForm.controls['DateFrom'].setValue(formattedFirstDate);
    this.viewForm.controls['DateTo'].setValue(formattedLastDate);
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
    this.loadAllParties();
    this.loadInstrument();
    this.loadAllPurchasePayments();
  }

  formsInit() {
    this.purchasePaymentForm = this.fb.group({
      PartyCode: this.fb.control(''),
      InstrumentTypeId: this.fb.control(''),
      PurchasePaymentDate: this.fb.control('')
    })
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
      InstrumentTypeId: null
    });
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  loadInstrument() {
    this.apiService.get(ApiEndpoints.getAllInstrumentType).subscribe((res) => {
      this.instrumentResponse = res;
    });
  }

  loadAllParties() {
    this.apiService.get(ApiEndpoints.GetAllParties +
      `?BranchCode=${this.globalBranchCode}`).subscribe((res: any) => {
        this.partyResponse = res.data;
      });
  }

  loadAllPurchasePayments() {
    let val = this.viewForm.value;
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.GetPurchasePaymentList +
      `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&DateFrom=${val.DateFrom}&DateTo=${val.DateTo}&PartyCode=${this.selectedParty}&InstrumentTypeId=${this.InstrumentTypeId}`)
      .subscribe((res: any) => {
        this.purchasePaymentsList = res.data;
        this.filteredPayments = res.data
        this.isLoadingData = false;
      });
  }

  CreateNewPurchasePayment() {
    this.header = 'Purchase Payment';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.paymentDialog = true;
    this.isUpdate = false;
  }

  hideDialog() {
    this.paymentDialog = false;
    this.submitted = false;
    this.purchasePaymentForm.reset();
    this.isUpdate = false;
  }

  hideDialogFilter() {
    this.FiltersDialogue = false;
  }

  clearFilter() {
    this.filterForm.reset();
    this.filteredPayments = this.purchasePaymentsList;
    this.showClearFilterButton = false;
    this.FiltersDialogue = false;
  }

  createPurchasePayment() {
    let model = this.purchasePaymentForm.value;
    model.StoreCode = this.selectedStore;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUserCode;
    this.apiService.post(model, ApiEndpoints.CreatePurchasePaymentMaster).subscribe((res) => {
      this.paymentDialog = false
      model.PurchasePaymentNo = res;
      const PurchasePaymentNo = model.PurchasePaymentNo;
      if (PurchasePaymentNo != null) {
        localStorage.setItem('PurchasePaymentNo', PurchasePaymentNo);
        this.router.navigate(['/POS/purchase-payment-detail'], {
          queryParams: {
            StoreCode: this.selectedStore,
            PurchasePaymentNo: PurchasePaymentNo,
          },
        });
        this.purchasePaymentForm.reset();
        this.purchasePaymentForm.markAsUntouched();
      } else {
        this.toastService.sendMessage({
          message: 'Cannot Create Purchase Invoice Number',
          type: NotificationType.error,
        });
      }
    });
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


  filter() {
    this.showClearFilterButton = true;
    if (!!this.filterFormValue.DateFrom || !!this.filterFormValue.DateTo) {
      this.filteredPayments = this.utilityService
        .filterObjectsByDateRange(this.purchasePaymentsList, this.filterFormValue.DateFrom, this.filterFormValue.DateTo, "PurchasePaymentDate")
        .filter((pi: any) => {
          return (this.filterFormValue.PartyName === null || pi.Party === this.filterFormValue.PartyName) &&
            (this.filterFormValue.InstrumentTypeId === null || pi.InstrumentTypeId === this.filterFormValue.InstrumentTypeId);
        });
    } else {
      this.filteredPayments = this.purchasePaymentsList.filter((pi: any) => {
        const condition = (this.filterFormValue.PartyName === null || pi.Party === this.filterFormValue.PartyName) &&
          (this.filterFormValue.InstrumentTypeId === null || pi.InstrumentTypeId === this.filterFormValue.InstrumentTypeId);
        return condition;
      });
    }
    this.FiltersDialogue = false;
  }

  getSelectedRow(data: any) {
    if (data) {
      const PurchasePaymentNo = data.PurchasePaymentNo;
      const store = data.StoreCode;
      this.router.navigate(['/POS/purchase-payment-detail'], {
        queryParams: { StoreCode: store, PurchasePaymentNo: PurchasePaymentNo },
      });
    }
  }
}
