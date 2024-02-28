import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
  TreeNode,
} from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StoreProjectService } from 'src/app/_shared/services/store-project.service';
import { SaleInvoiceService } from 'src/app/_shared/services/sale-invoice.service';

interface LockStatus {
  disabled: boolean;
  value: string;
}
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-possaledetails',
  templateUrl: './possaledetails.component.html',
  styleUrls: ['./possaledetails.component.scss'],
  providers: [DialogService, MessageService],
})
export class PossaledetailsComponent implements OnInit {
  products: any = [];
  Masterform!: FormGroup;
  Detailform!: FormGroup;
  POform!: FormGroup;
  itemform!: FormGroup;
  customerform!: FormGroup;

  masterResponse$: any = [];
  detailResponse$: any = [];
  tableResponse$: any = [];
  instrumentResponse$: any = [];
  poResponse$: any = [];

  storeItemResponse$: any = [];
  customerResponse$: any = [];
  saleResponse$: any = [];
  objModel: any = [];

  routeSaleInvoiceNo: number = 0;
  routeStoreCode: number = 0;
  GrossAmount: number = 0;
  TaxAmount: number = 0;
  LineDiscount: number = 0;
  NetTotal: number = 0;
  QTY: number = 0;
  Receivable: string = '0';

  selectedStoreItem!: number;
  globalBranchCode!: number;
  globalUserCode!: number;
  globalUserName!: string;
  selectedCustomerId!: number;

  isUpdate: boolean = false;
  datePipe = new DatePipe('en-US');
  prdialog: boolean = false;
  POMasterId: number = 0;
  lockStatus!: LockStatus[];
  DiscountPercentage: FormControl = new FormControl('');
  DiscountAmount: FormControl = new FormControl('');
  InstrumentTypeId: FormControl = new FormControl(1);
  IsLocked: boolean = false;
  selectedPrintPage!: string;
  ItemsResponse$: any = [];

  chartResponse!: TreeNode[];
  headerCustomer: string = 'Add new Customer';
  mainHeader!: string;
  mainDialog!: boolean;
  mainBtn!: string;
  model: any = [];
  form!: FormGroup;
  FIXEDform!: FormGroup;
  createForm! : FormGroup
  storeResponse$: any = [];
  coaResponse$: any = [];
  parentCodeResponse$: any = [];
  selectedParentCode!: string;
  selectedCOAHead!: string;
  selectedStores: any[] = [];
  @ViewChild('dt') dt!: any;

  //Global Variables
  globalUserId!: number;
  isInnerUpdate!: boolean;
  innerHeader!: string;
  innerBtn!: string;
  parentwithName!: string;
  header!: string;
  netTotal: any = 0;
  ItemResponse$: any = [];
  InvoiceSrNoResponse$: any = [];
  selectedCustomers!: number;
  selectedSalesMan!: number;
  //ItemDialogue
  formItems!: FormGroup;
  ItemDialogueResponse$: any = [];
  manufacturerModel$: any = [];
  innerDialogManufacturer!: boolean;
  selectedManufacturer!: number;
  SaleInvoiceNo: number = 0;
  Username: string = '';
  BranchName: string = '';
  remarks: string = '';
  currentDate: any;
  projectCode: any = '';
  invoiceData: any = '';
  saleInvoiceData: [] = [];
  selectedcustomer: any = '';
  customerLastVisitDate: any = '';
  ref: DynamicDialogRef = new DynamicDialogRef();
  selectedStore: number = 0;
  selectedProject: number = 0;
  selectedRow: any = '';
  isLoadingData: boolean = false;
  selectedDate: string = '';
  selectItem:any  = '';
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmservice: ConfirmationService,
    private toastService: ToastService,
    private router: Router,
    private confirmService: ConfirmationService,
    public dialogService: DialogService,
    private storeProjectService: StoreProjectService,
    private apiservice: SaleInvoiceService,
  ) {
    this.lockStatus = [
      { disabled: false, value: 'UnLocked' },
      { disabled: true, value: 'Locked' },
    ];
  }
  ngOnInit(): void {
    const date = new Date();
    this.currentDate = this.datePipe.transform(date, 'y-MM-dd');
    // this.route.queryParamMap.subscribe((queryParams) => {
    //   this.SaleInvoiceNo = queryParams.get('SaleInvoiceNo') || '';
    // });
    const storedUsername = localStorage.getItem('Username');
    if (storedUsername) {
      this.Username = storedUsername;
    }
    const storedBranchName = localStorage.getItem('BranchName');
    if (storedBranchName) {
      this.BranchName = storedBranchName;
    }
    this.createForm = this.fb.group({
      StoreCode: this.fb.control(''),
      ProjectCode: this.fb.control(''),
      SaleDate: this.fb.control(''),
      SaleType: this.fb.control(''),
    });
    this.FIXEDform = this.fb.group({
      BranchCode: this.fb.control('', Validators.required),
      TotalItems: new FormControl({ value: 0, disabled: true }),
      TotalAmount: new FormControl({ value: 0, disabled: true }),
      TaxAmount: new FormControl({ value: 0, disabled: true }),
      Discount: new FormControl('', Validators.required),
      cashTenderd: new FormControl('', Validators.required),
      amountCharged: new FormControl('', Validators.required),
    });
    this.POMasterId = +localStorage.getItem('PONo')!;
    this.Detailform = this.fb.group({
      ItemCode: this.fb.control(''),
      Unit: this.fb.control(''),
      SalePrice: this.fb.control(''),
      Qty: this.fb.control(''),
      LineTotal: this.fb.control(''),
      TaxPercentage: this.fb.control(''),
      TaxAmount: this.fb.control(''),
      TotalAmountWithTax: this.fb.control(''),
      DiscountPercentage: this.fb.control(''),
      DiscountAmount: this.fb.control(''),
      NetTotal: this.fb.control(''),
    });
    this.POform = this.fb.group({
      PONo: this.fb.control('', Validators.required),
    });
    //ItemDialogue
    this.loadAllItemDialogueTable();
    
    this.formItems = this.fb.group({
      BranchCode: this.fb.control(''),
      ItemCode: this.fb.control(''),
      IsActive: this.fb.control(false),
    });
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.globalUserName = localStorage.getItem('BranchName')!;
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.routeSaleInvoiceNo = params['SaleInvoiceNo'];
    //   this.routeStoreCode = params['StoreCode'];
    // });
    this.storeProjectService.getSelectedOption().subscribe((option:any)=> {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
      this.loadSaleInvoiceMasterInfo(
        this.globalBranchCode,
        this.selectedStore,
        this.SaleInvoiceNo
      );
      this.loadStoreItem(
        this.selectedStore,
        this.globalBranchCode,
        this.itemName,
        this.UPC
      );
    });
    if(!localStorage.getItem('SaleInvoiceNo')){
      this.createSaleInvoice()
    }
    else{
      this.SaleInvoiceNo = JSON.parse(JSON.stringify(localStorage.getItem('SaleInvoiceNo')))
    }
    this.loadCustomer();
    this.loadSaleMan();
    this.loadInstrument();
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUserId = +localStorage.getItem('UserId')!;
    this.loadAllStoreItem();
    // this.tableResponse$.subscribe(() => {
    // this.calculateTotals();
    // });
    this.storeProjectService.getSelectedOption().subscribe(option => {
      if (option) {
        this.selectedStore = option.DepartmentCode;
        this.selectedProject = option.ProjectCode;
      }
    });
   


    
  }
  createSaleInvoice(){
    let val = this.createForm.value;
    const date = new Date();
    this.model = val;
    this.model.StoreCode = this.selectedStore;
    this.model.SaleTypeCode = 6;
    this.model.SaleType = 'Point of Sale';
    localStorage.setItem('saletypecode', this.model.SaleTypeCode);
    this.model.ProjectCode = this.selectedProject;
    localStorage.setItem('projectCode', this.model.ProjectCode);
    this.model.BranchCode = this.globalBranchCode;
    this.model.CreatedBy = this.globalUserCode;
    this.model.IsLocked = false;
    this.model.InstrumentTypeId = 1;
    if (this.model.SaleDate.includes('')) {
      let x = val.SaleDate == '' ? date : val.SaleDate;
      this.model.SaleDate = this.datePipe.transform(x, 'MMM-d-y');
    } else {
      this.model.SaleDate = this.selectedDate;
    }
    localStorage.setItem('SaleType',this.model.SaleType.toString());
    localStorage.setItem('SaleDate', this.model.SaleDate);
    this.apiService.post(this.model, ApiEndpoints.CreateSaleInvoiceMaster + `?`)
    .subscribe((res) => {
      this.SaleInvoiceNo = res
      this.model.SaleInvoiceNo = res;
      const SaleInvoiceNo = this.model.SaleInvoiceNo;
      if (SaleInvoiceNo != null) {
        this.model.StoreCode =  this.selectedStore,
        this.model.SaleInvoiceNo = SaleInvoiceNo,
        localStorage.setItem('SaleInvoiceNo', SaleInvoiceNo);
        // if (this.model.SaleTypeCode == 6) {
        //   this.router.navigate(['/POS/possaledetails'], {
        //     queryParams: {
        //       StoreCode: this.selectedStore,
        //       SaleInvoiceNo: SaleInvoiceNo,
        //     },
        //   });
        // } else {
        //   this.router.navigate(['/POS/sale-invoice-detail'], {
        //     queryParams: {
        //       StoreCode: this.selectedStore,
        //       SaleInvoiceNo: SaleInvoiceNo,
        //     },
        //   });
        // }
        // this.createForm.reset();
        // this.createForm.markAsUntouched();
      } else {
        this.toastService.sendMessage({
          message: 'Cannot Create Sale Invoice Number!',
          type: NotificationType.error,
        });
      }
    });
  }
  calculateTotals() {
    const totalItems = this.tableResponse$.reduce(
      (acc: number, item: any) => acc + item.Qty,
      0
    );
    const totalAmount = this.tableResponse$.reduce(
      (acc: number, item: any) => acc + item.NetTotal,
      0
    );
    const totalTaxAmount = this.tableResponse$.reduce(
      (acc: number, item: any) => acc + item.TaxAmount,
      0
    );
    this.FIXEDform.patchValue({
      TotalItems: totalItems,
      TotalAmount: totalAmount,
      TaxAmount: totalTaxAmount,
    });
  }
  createNewInvoice() {
    const storeCode = localStorage.getItem('StoreCode') || this.selectedStore;
    const projectCode = this.selectedProject;
    const saleType = localStorage.getItem('saletypecode');
    const saleDate = localStorage.getItem('SaleDate');
    if (!storeCode || !projectCode || !saleType || !saleDate) {
      console.error('One or more values are missing in localStorage.');
      return;
    }
    const newInvoice = {
      StoreCode: storeCode,
      SaleTypeCode: saleType,
      ProjectCode: projectCode,
      BranchCode: this.globalBranchCode,
      CreatedBy: this.globalUserCode,
      IsLocked: false,
      SaleDate: saleDate,
      InstrumentTypeId: 1,
    };
    this.apiService
      .post(newInvoice, ApiEndpoints.CreateSaleInvoiceMaster + `?`)
      .subscribe((res) => {
        const saleInvoiceNo = res;
        localStorage.setItem('SaleInvoiceNo',saleInvoiceNo)
        this.ngOnInit()
        if (saleInvoiceNo != null) {
          this.router.navigate(['/POS/possaledetails']);
          // this.activatedRoute.queryParams.subscribe((params) => {
          //   this.routeSaleInvoiceNo = parseInt(res.toString());
          //   this.routeStoreCode = params['StoreCode'];
          // });
          this.loadSaleInvoiceDetails(
            this.globalBranchCode,
            this.selectedStore,
            this.selectedProject,
            this.SaleInvoiceNo
          );
          this.loadStoreItem(
            this.selectedStore,
            this.globalBranchCode,
            this.itemName,
            this.UPC
          );
        } else {
          this.toastService.sendMessage({
            message: 'Cannot Create Sale Invoice Number!',
            type: NotificationType.error,
          });
        }
      });
  }

  changeCustomers(customer: any) {
    this.selectedcustomer = customer;
    this.selectedCustomers = customer.PartyCode;
    this.customerLastVisit(this.selectedCustomers);
  }
  customerLastVisit(selectedCustomer: number) {
    this.apiService
      .get(ApiEndpoints.LastVisitDate + `?CustomerId=${selectedCustomer}`)
      .subscribe((res: any) => {
        if (res[0] !== undefined) {
          this.customerLastVisitDate = res[0];
        } else {
          this.customerLastVisitDate = '';
        }
      });
  }
  changeSalesMan(e: any) {
    this.selectedSalesMan = +e.target.value;
  }
  loadCustomer() {
    this.apiService.get(ApiEndpoints.LoadAllParties).subscribe((res: any) => {
      this.customerResponse$ = res.data;
    });
  }

  // loadCustomer() {
  //   this.apicustomer.getAllCustomers().subscribe((res: any) => {
  //     this.customerResponse$ = res.data;
  //   });
  // }
  loadSaleMan() {
    this.apiService.get(ApiEndpoints.GetAllSalesMan).subscribe((res: any) => {
      this.saleResponse$ = res.data;
    });
  }
  loadInstrument() {
    this.apiService.get(ApiEndpoints.getAllInstrumentType).subscribe((res) => {
      this.instrumentResponse$ = res;
    });
  }
  loadSaleInvoiceMasterInfo(
    BranchCode: number,
    StoreCode: number,
    SaleInvoiceNo: number
  ) {
    this.apiService
      .get(
        ApiEndpoints.LoadSaleInvoiceMasterInfo +
          `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&SaleInvoiceNo=${SaleInvoiceNo}`
      )
      .subscribe((res: any) => {
        let x = res[0];
        if (x) {
          Object.assign(this.masterResponse$, x);
          const SaleDate = this.datePipe.transform(
            this.masterResponse$?.SaleDate,
            'y-MM-dd'
          );
          this.masterResponse$.SaleDate = SaleDate;
          this.IsLocked = this.masterResponse$.IsLocked;
          this.masterResponse$.CustomerId = this.customerResponse$.find(
            (x: any) => {
              return x.CustomerId === this.masterResponse$.CustomerId;
            }
          );
          this.masterResponse$.SalesManId = this.saleResponse$.find(
            (x: any) => {
              return x.SalesManId === this.masterResponse$.SalesManId;
            }
          );

          // this.masterResponse$.InstrumentTypeId = this.instrumentResponse$.find(
          //   (x: any) => {
          //     return (
          //       x.InstrumentTypeId === this.masterResponse$.InstrumentTypeId
          //     );
          //   }
          // );
          this.remarks = this.masterResponse$.Remarks;
          // this.invoiceData.push({ remarks: this.remarks });
        }
        this.loadSaleInvoiceDetails(
          this.globalBranchCode,
          this.selectedStore,
          // this.masterResponse$.ProjectCode,
          this.selectedProject,
          this.SaleInvoiceNo
        );
      });
  }
  loadStoreItem(
    StoreCode: number,
    BranchCode: number,
    ItemName: string,
    UPC: number
  ) {
    this.apiService
      .get(
        ApiEndpoints.LoadStoreItems +
          `?StoreCode=${StoreCode}&BranchCode=${BranchCode}&ItemName=${ItemName}&UPC=${UPC}`
      )
      .subscribe((res: any) => {
        this.storeItemResponse$ = res.data;
        this.filteredItems = res.data
      });
  }

  filterItem(query: string) {
      query = query.toLowerCase();
      this.filteredItems = this.storeItemResponse$
      .filter((item: any) =>
        item.UPC?.includes(query) || item.ItemName?.toLowerCase().includes(query) 
      );      
  }

  onEnterStoreItem(){
    const item = this.storeItemResponse$.find((item: any) => item.UPC === this.selectItem || item.UPC === this.selectItem?.UPC);
    if(item){
      this.changeStoreItem(item)
      this.selectItem = '';
      this.filteredItems = [];
    } 
  }

  perItemTaxAmount: number = 0;
  changeStoreItem(e: any) {
    if (e.Code) {
      this.selectedStoreItem = e.Code;
      let val = this.tableResponse$.find((obj: any) => obj.ItemCode === e.Code);
      if (val) {
        this.changeUnitPriceNQuantity('increase', e);
      } else {
        this.selectedStoreItem = e.Code;
        let x = this.storeItemResponse$.find((x: any) => {
          return this.selectedStoreItem == x?.Code;
        });
        this.perItemTaxAmount = x?.TaxAmount;
        this.detailResponse$.PRQty = x?.PRQty;
        this.detailResponse$.UnitCode = x?.UnitCode;
        this.detailResponse$.Unit = x?.Unit;
        this.detailResponse$.ItemCode = x?.Code;
        this.detailResponse$.SalePrice = x?.SalePrice;
        this.detailResponse$.NetTotal = x?.NetTotal;
        this.detailResponse$.LineTotal = x?.LineTotal;
        this.detailResponse$.TaxAmount = x?.TaxAmount;
        this.detailResponse$.TotalAmountWithTax = x?.NetTotal;
        this.saveDetail();
      }
    } else {
      this.selectedStoreItem = e.value;
      let x = this.storeItemResponse$.find((x: any) => {
        return this.selectedStoreItem == x?.Code;
      });
      this.detailResponse$.PRQty = x?.PRQty;
      this.detailResponse$.UnitCode = x?.UnitCode;
      this.detailResponse$.Unit = x?.Unit;
      this.detailResponse$.ItemCode = x?.Code;
      this.detailResponse$.SalePrice = x?.SalePrice;
      this.saveDetail();
    }
  }
  combinedArray: any;
  totalTaxAmount: number = 0;
  loadSaleInvoiceDetails(
    BranchCode: number,
    StoreCode: number,
    ProjectCode: number,
    SaleInvoiceNo: number
  ) {
    this.isLoadingData = true;
    this.apiService
      .get(
        ApiEndpoints.GetSaleInvoiceDetail +
          `?BranchCode=${BranchCode}&StoreCode=${StoreCode}&ProjectCode=${this.selectedProject}&SaleInvoiceNo=${SaleInvoiceNo}`
      )
      .subscribe((res) => {
        this.tableResponse$ = res;
        this.isLoadingData = false;
        this.invoiceData = this.tableResponse$;
        // this.totalTaxAmount = totalAmounts.TaxAmount;
        const totalAmounts = this.tableResponse$.reduce(
          (totals: any, obj: any) => {
            return {
              LineTotal: totals.LineTotal + obj.LineTotal,
              TaxAmount: totals.TaxAmount + obj.TaxAmount,
              DiscountAmount: totals.DiscountAmount + obj.DiscountAmount,
              NetTotal: totals.NetTotal + obj.NetTotal,
              Qty: totals.Qty + obj.Qty,
            };
          },
          { LineTotal: 0, TaxAmount: 0, DiscountAmount: 0, NetTotal: 0, Qty: 0 }
        );
        // this.GrossAmount = totalAmounts.LineTotal;
        // this.TaxAmount = totalAmounts.TaxAmount;
        // this.LineDiscount = totalAmounts.DiscountAmount;
        // this.NetTotal = totalAmounts.NetTotal;
        // this.QTY = totalAmounts.Qty;
        this.totalTaxAmount = totalAmounts.TaxAmount;
        this.FIXEDform.controls['TotalItems'].setValue(totalAmounts.Qty);
        this.FIXEDform.controls['TotalAmount'].setValue(
          totalAmounts.LineTotal.toFixed(2)
        );
        this.FIXEDform.controls['TaxAmount'].setValue(
          totalAmounts.TaxAmount.toFixed(2)
        );
        this.FIXEDform.controls['Discount'].setValue(
          totalAmounts.DiscountAmount
        );
        const netAmount = totalAmounts.LineTotal -totalAmounts.DiscountAmount + totalAmounts.TaxAmount
        this.FIXEDform.controls['amountCharged'].setValue(netAmount.toFixed(2))
        this.combinedArray = [
          this.invoiceData,
          this.remarks,
          this.totalTaxAmount,
        ];
      });
  }
  changeInstrumentTypeId(event: any) {
    let model = {
      CustomerId: this.selectedCustomers,
      SalesManId: localStorage.getItem('UserId'),
      InstrumentTypeId: event.target.value,
      SaleInvoiceNo: this.masterResponse$.SaleInvoiceNo,
      IsLocked: this.masterResponse$.IsLocked,
      SaleDate: this.masterResponse$.SaleDate,
      BranchCode: this.globalBranchCode,
      StoreCode: this.routeStoreCode,
      projectCode: this.masterResponse$.ProjectCode,
    };
    this.apiService
      .update(model, ApiEndpoints.UpdateSaleInvoiceMaster + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Sales Invoice Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadSaleInvoiceMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeSaleInvoiceNo
        );
      });
  }
  updateMaster() {
    let model = this.Masterform.value;
    let PreviousLockedStatus = 'UnLocked';
    model.BranchCode = this.globalBranchCode;
    model.ProjectCode = this.selectedProject;
    model.CreatedBy = this.globalUserCode;
    model.StoreCode = this.selectedStore;
    model.LockedBy = this.globalUserCode;
    model.DiscountAmount = this.DiscountAmount.value;
    model.DiscountPercentage = this.DiscountPercentage.value;
    model.InstrumentTypeId = this.masterResponse$.InstrumentTypeId;
    model.IsLocked =
      this.Masterform.get('IsLocked')?.value === null
        ? false
        : this.Masterform.get('IsLocked')?.value;
    if (model.IsLocked) {
      this.IsLocked = true;
    }
    model.CustomerId = this.selectedCustomers;
    model.SalesManId = this.selectedSalesMan;
    this.apiService
      .update(model, ApiEndpoints.UpdateSaleInvoiceMaster + `?`)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Sales Invoice Updated Successfully!',
          type: NotificationType.success,
        });
        this.loadSaleInvoiceMasterInfo(
          this.globalBranchCode,
          this.routeStoreCode,
          this.routeSaleInvoiceNo
        );
      });
    this.isUpdate = false;
  }
  updateDetail(item: any) {
    let model = this.Detailform.value;
    if (!item.BranchCode) {
      let val = this.tableResponse$.find(
        (obj: any) => obj.ItemCode === item.Code
      );
      if (val) {
        model.UnitSalePrice = val.SalePrice;
        model.SaleInvoiceSrNo = val.SaleInvoiceSrNo;
        model.TaxPercentage = val.TaxPercentage;
        model.TotalAmountWithTax = val.TotalAmountWithTax;
      }
      model.BranchCode = this.globalBranchCode;
      model.StoreCode = this.selectedStore;
      model.ProjectCode = this.selectedProject;
      model.SaleInvoiceNo = this.SaleInvoiceNo;
    } else {
      model.BranchCode = item.BranchCode;
      model.StoreCode =this.selectedStore;
      model.ProjectCode = this.selectedProject;
      model.SaleInvoiceNo = item.SaleInvoiceNo;
      model.SaleInvoiceSrNo = item.SaleInvoiceSrNo;
      model.TaxPercentage = item.TaxPercentage;
      model.TotalAmountWithTax = item.TotalAmountWithTax;
      model.UnitSalePrice = this.detailResponse$.SalePrice;
    }
    // this.detailResponse$ = { ...model };
    model.Unit = item.ItemUnit || item.Unit;
    model.Qty = item.Qty;
    model.LineTotal = item.LineTotal;

    model.TaxAmount = item.TaxAmount || item.TaxAmount;
    model.DiscountPercentage =
      item.DiscountPercentage || item.DiscountPercentage;
    model.DiscountAmount = item.DiscountAmount;
    model.NetTotal = item.NetTotal;
    model.SalePrice = item.SalePrice;

    model.ItemCode = item.ItemCode || item.Code;
    model.UnitCode = item.UnitCode;
    model.ModifiedBy = this.globalUserCode;
    this.apiService
      .update(model, ApiEndpoints.UpdateSaleInvoiceDetail + `?`)
      .subscribe((res) => {
        this.loadSaleInvoiceDetails(
          this.globalBranchCode,
          this.selectedStore,
          this.selectedProject,
          this.SaleInvoiceNo
        );
        this.detailResponse$.ItemCode = null;
        this.detailResponse$.wo_number = null;
        this.Detailform.reset();
        // this.toastService.sendMessage({
        //   message: 'Record Updated!',
        //   type: NotificationType.success,
        // });
      });
    this.isUpdate = false;
  }
  addorUpdateMaster() {
    if (this.Masterform.invalid) {
      return this.toastService.sendMessage({
        message: 'Form Invalid',
        type: NotificationType.error,
      });
    }
    this.updateMaster();
  }
  getObjonBlur(event: any) {
    let x = this.poResponse$.filter((x: any) => {
      return x.GRNQty > 0;
    });
    this.objModel = x;
    if (event.GRNQty > event.BalToRcvQty) {
      this.toastService.sendMessage({
        message: 'Quantity should be Less',
        type: NotificationType.error,
      });
    }
  }
  saveDetail() {
    let model;
    model = this.Detailform.value;
    model.BranchCode = this.globalBranchCode;
    model.StoreCode = this.selectedStore;
    // model.ProjectCode = this.masterResponse$.ProjectCode;
    model.ProjectCode = this.selectedProject;
    model.SaleInvoiceNo = this.SaleInvoiceNo;
    model.ItemCode = this.detailResponse$.ItemCode;
    model.UnitCode = this.detailResponse$.UnitCode;
    model.SalePrice = this.detailResponse$.SalePrice;
    model.Qty = '1';
    model.NetTotal = this.detailResponse$.NetTotal;
    model.LineTotal = this.detailResponse$.LineTotal;
    model.TaxAmount = this.detailResponse$.TaxAmount;
    model.TotalAmountWithTax = this.detailResponse$.NetTotal;
    model.TaxPercentage = '0';
    model.UnitSalePrice = '0';
    model.DiscountAmount = '0';
    model.DiscountPercentage = '0';
    model.CreatedBy = this.globalUserCode;
    this.apiService
      .post(model, ApiEndpoints.CreateSaleInvoiceDetail + `?`)
      .subscribe(() => {
        this.loadSaleInvoiceDetails(
          this.globalBranchCode,
          this.selectedStore,
          this.selectedProject,
          this.SaleInvoiceNo
        );
        this.detailResponse$.ItemCode = null;
        this.Detailform.reset();
        // this.toastService.sendMessage({
        //   message: 'Sale Invoice Detail Added!',
        //   type: NotificationType.success,
        // });
      });
  }
  addorUpdateDetail() {
    if (!this.isUpdate) {
      this.saveDetail();
    } else {
      this.updateDetail(this.SaleInvoiceNo);
    }
  }
  deleteSaleDetail(SaleInvoiceSrNo: number) {
    this.confirmservice.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteSaleInvoiceDetail +
              `?BranchCode=${this.globalBranchCode}&StoreCode=${this.selectedStore}&ProjectCode=${this.selectedProject}&SaleInvoiceNo=${localStorage.getItem('SaleInvoiceNo')}&SaleInvoiceSrNo=${SaleInvoiceSrNo}`
          )
          .subscribe(() => {
            this.loadSaleInvoiceDetails(
              this.globalBranchCode,
              this.selectedStore,
              this.selectedProject,
              this.SaleInvoiceNo
            );
            this.toastService.sendMessage({
              message: 'Sale Invoice Deleted Successfully!',
              type: NotificationType.deleted,
            });
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
  loadAllStoreItem() {
    this.apiService
      .get(
        ApiEndpoints.getItemStores +
          `?BranchCode=${this.globalBranchCode}&ItemCode=${0}`
      )
      .subscribe((res: any) => {
        this.storeResponse$ = res.map((x: any) => {
          return {
            StoreCode: x.StoreCode,
            StoreName: x.StoreName,
          };
        });
      });
  }
  addorUpdate() {
    if (!this.isUpdate) {
    } else {
    }
  }
  getItemStore(BranchCode: number, ItemCode: string) {
    this.apiService
      .get(
        ApiEndpoints.getItemStores +
          `?BranchCode=${BranchCode}&ItemCode=${ItemCode}`
      )
      .subscribe((res: any) => {
        const filteredOptions = res.filter((x: any) => x.Selected);
        this.selectedStores = filteredOptions.map((x: any) => {
          return {
            StoreCode: x.StoreCode,
            StoreName: x.StoreName,
          };
        });
      });
  }
  quantity: string = '';
  changeUnitPriceNQuantity(quantity: any, item: any) {
    this.quantity = quantity;
    if (this.quantity == 'increase') {
      item.Qty++;
      item.TaxAmount = item.TaxAmount + this.perItemTaxAmount;
    } else if (this.quantity == 'decrese') {
      if (item.Qty > 0) {
        item.Qty--;
        item.TaxAmount = item.TaxAmount - this.perItemTaxAmount;
      }
    }
    this.calculateQtyXPrice(item);
    this.calculateTotals();
    this.updateDetail(item);
  }
  calculateQtyXPrice(item: any) {
    item.NetTotal = item.Qty * item.SalePrice;
  }
  //Item-Dialogue-Starts

  openNewItem() {
    this.innerHeader = 'Add Item';
    this.innerBtn = 'Save';
    this.innerDialogManufacturer = true;
    this.isUpdate = false;
    this.isInnerUpdate = false;
  }
  hideDialogItem() {
    this.innerDialogManufacturer = false;
    this.isInnerUpdate = false;
    this.formItems.reset();
  }
  loadAllItemDialogueTable() {
    this.apiService
      .get(ApiEndpoints.GetPosPreferencesItems, {
        BranchCode: this.globalBranchCode,
      })
      .subscribe((res) => {
        this.ItemDialogueResponse$ = res;
      });
  }
  savedialogeitem() {
    let modelItems;
    let val = this.formItems.value;
    modelItems = val;
    modelItems.BranchCode = this.globalBranchCode;
    modelItems.AddByUserId = this.globalUserId;
    this.apiService
      .post(modelItems, ApiEndpoints.saveItemManufacturer)
      .subscribe(() => {
        this.toastService.sendMessage({
          message: 'Sales Invoice Saved Sucessfully!',
          type: NotificationType.success,
        });
        this.formItems.reset();
        this.loadAllItemDialogueTable();
        this.isInnerUpdate = false;
      });
  }
  // changeManufacturer(e: any) {
  //   this.selectedManufacturer = e.target.value;
  // }
  addorUpdateItemDialogue() {
    if (!this.isInnerUpdate) {
      this.savedialogeitem();
    } else {
    }
  }
  deletedialogeitem(ItemCode: number) {
    this.confirmService.confirm({
      message: `Are you sure that you want to delete this?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(ApiEndpoints.deleteItemManufacturer, {
            ItemManufacturerCode: ItemCode,
          })
          .subscribe((res) => {
            this.loadAllItemDialogueTable();
            if (res === 200) {
              return this.toastService.sendMessage({
                message: 'Sales Invoice Deleted Successfully!',
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
  }
  //Item-Dialogue-End

  filteredItems: any;
  selectedItem: any = [];
  select: any = [];

  filterItems(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    if (Number(query)) {
      for (let i = 0; i < this.storeItemResponse$.length; i++) {
        let item = this.storeItemResponse$[i];
        if (item.Code.indexOf(query) == 0) {
          filtered.push(item);
        }
      }
    } else {
      for (let i = 0; i < this.storeItemResponse$.length; i++) {
        let item = this.storeItemResponse$[i];
        if (item.ItemName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(item);
        }
      }
    }
    this.filteredItems = filtered;
    this.selectedItem = this.filteredItems;
  }
  selectValue(item: any) {
    this.select = item;
    this.selectItem = item.ItemName;
  }

  visible: boolean = false;
  print: boolean = false;

  showDialog() {
    this.visible = true;
  }
  addRemakrs(): void {
    let updateInvoice = {
      Remarks: this.remarks,
      SaleInvoiceNo: this.SaleInvoiceNo,
      StoreCode: this.selectedStore,
      SaleDate: localStorage.getItem('SaleDate'),
      BranchCode: this.globalBranchCode,
      ProjectCode: this.selectedProject,
      IsLocked: false,
      CreatedBy: this.globalUserCode,
      InstrumentTypeId: this.masterResponse$.InstrumentTypeId,
    };
    this.apiService
      .update(updateInvoice, ApiEndpoints.UpdateSaleInvoiceMaster + `?`)
      .subscribe((res) => {
        this.loadSaleInvoiceMasterInfo(
          this.globalBranchCode,
          this.selectedStore,
          this.SaleInvoiceNo
        );
      });
  }
  cashTenderd: any;
  amountCharged: any;
  Discount: any;
  showInvoice() {
    this.print = true;
    this.cashTenderd = this.FIXEDform.controls['cashTenderd'].value;
    this.amountCharged = this.FIXEDform.controls['TotalAmount'].value;
    this.Discount = this.FIXEDform.controls['Discount'].value;
    this.combinedArray = [
      this.invoiceData,
      this.remarks,
      this.totalTaxAmount,
      this.cashTenderd,
      this.amountCharged,
      this.Discount,
    ];
  }
  // showUserInfo(id: number) {
  //   this.ref = this.dialogService.open(CustomerDetailComponent, {
  //     data: { id: id },
  //     header: 'Customer Details',
  //     // width: '600px',
  //     width: '50%',
  //   });
  //   this.ref.onClose.subscribe(() => {});
  // }
  selectCustomerId: number = 0;
  showUserInfo(id: number) {
    this.selectCustomerId = id;
    this.mainDialog = true;
    this.customerDetail = true;
    this.editCustomer = false;
    // this.selectedRow = event;
    // this.getCustomerDetails();
  }
  timeout: any = null;
  UPC: number = 0;
  itemName: string = '';
  onKeySearch(event: any): void {
    clearTimeout(this.timeout);
    var $this = this;
    if (!isNaN(+event.target.value)) {
      this.UPC = event.target.value;
      this.itemName = '';
    } else {
      this.itemName = event.target.value;
      this.UPC = 0;
    }
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        // $this.loadStoreItem(
        //   $this.routeStoreCode,
        //   $this.globalBranchCode,
        //   $this.itemName,
        //   $this.UPC
        // );
        $this.filtersItems($this.itemName,$this.UPC )
      }
    }, 1000);
  }
  filtersItems(value: any, upc: number): void {
    this.apiservice.filterItemsbyNameandCode(value, upc).subscribe((res:any) => {
      this.filteredItems = res;
    });
  }

  hideDialog() {
    this.mainDialog = false;
  }
  customerDetail: boolean = false;
  editCustomer: boolean = false;
  editCustomerInfo(event?: any) {
    this.editCustomer = true;
    this.customerDetail = false;
    this.isUpdate = true;
    this.selectedRow = event;
  }

  onDiscountEnter(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.getNetAmount();
      }
    }, 500);
  }

  getNetAmount(){
   const netAmount = this.FIXEDform.controls['TotalAmount'].value - this.FIXEDform.controls['Discount'].value + this.totalTaxAmount
   this.FIXEDform.controls['amountCharged'].setValue(netAmount.toFixed(2))
  }

  ngOnDestroy(){
    localStorage.removeItem('SaleInvoiceNo')
  }
}
