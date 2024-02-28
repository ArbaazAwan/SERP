import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { BankAccountModel } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-bank-cash-account',
  templateUrl: './bank-cash-account.component.html',
  styleUrls: ['./bank-cash-account.component.scss'],
})
export class BankCashAccountComponent implements OnInit {
  //--------------Component Name-------------------
  componentName: string = 'Bank Cash Account';

  //--------------Form Name-------------------
  bankCashAccountForm!: FormGroup;

  //--------------List Variables---------------------
  currencyList: any;
  accountsList: any;

  //--------------Global Branch and Global User ---------
  globalBranchCode!: number;
  globalUser!: number;

  //--------------Other Useable Variables--------------------
  checkIsPrimary: boolean = false;
  isUpdate: boolean = false;
  isLoadingData: boolean = false;
  allBankCashAccounts: any;
  AccountId: number = 0;
  isSticky: boolean = false;

  //--------------Constructor--------------------------------
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService
  ) {}

  //------------------------ONInit Method--------------------------------
  ngOnInit(): void {
    this.globalBranchCode = +localStorage.getItem('BranchCode')!;
    this.globalUser = +localStorage.getItem('UserId')!;
    this.formInIt();
    this.loadAllCurrency();
    this.loadAllAccounts();
    this.get();
  }

  //-----------------------------Form Initialized --------------------------------
  formInIt() {
    this.bankCashAccountForm = this.fb.group({
      AccountName1: ['', Validators.required],
      AccountName2: [''],
      AccountNumber: ['', Validators.required],
      GLAccount: [''],
      Swift: [''],
      Address: ['', Validators.required],
      CurrencyCode: ['', Validators.required],
      IsActive: [true, Validators.required],
    });
  }

  //----------------------------------------------------------------CRUD Methods STARTS HERE----------------------------------------------------------------

  //--------------------------------GET LISTS METHODS--------------------------------

  loadAllCurrency() {
    this.apiService
      .get(ApiEndpoints.getAllCurrency + '?BranchCode=' + this.globalBranchCode)

      .subscribe((res: any) => {
        
        this.currencyList = res;
      });
  }

  loadAllAccounts() {
    this.apiService
      .get(
        ApiEndpoints.GetAllChartOfAccounts +
          '?BranchCode=' +
          this.globalBranchCode
      )
      .subscribe((res: any) => {
        
        this.accountsList = res;
      });
  }

  get() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.GetAllAccounts + '?BranchCode=' + this.globalBranchCode)
      .subscribe(
        (response: any) => {
          
          this.allBankCashAccounts = response;
          this.isLoadingData = false;
        },
        (error) => {
          this.toastService.sendMessage({
            message: 'Not Data Found',
            type: NotificationType.error,
          });
          console.error('Not Data Found:', error);
          // Handle error as needed
        }
      );
  }

  //----------------------------------SAVE METHOD--------------------------------
  saveBankAccount(): void {
    
    let model: BankAccountModel = this.bankCashAccountForm.value;
    model.BranchCode = this.globalBranchCode;
    model.CreatedBy = this.globalUser;
    this.apiService.post(model, ApiEndpoints.SaveBankAccount).subscribe(
      (response) => {
        this.toastService.sendMessage({
          message: 'Successfully saved bank account',
          type: NotificationType.success,
        });
        console.log('Successfully saved bank account:', response);
        this.bankCashAccountForm.reset();
        this.get();
      },
      (error) => {
        this.toastService.sendMessage({
          message: 'Error saved bank account',
          type: NotificationType.error,
        });
        console.error('Error saving bank account:', error);
        // Handle error as needed
      }
    );
  }

  //----------------------------Update Methods ----------------------------
  update() {
    
    let model: BankAccountModel = this.bankCashAccountForm.value;
    model.BranchCode = this.globalBranchCode;
    model.ModifiedBy = this.globalUser;
    model.AccountId = this.AccountId;
    this.apiService.update(model, ApiEndpoints.UpdateBankAccount).subscribe(
      (response) => {
        this.toastService.sendMessage({
          message: 'Bank account updated!',
          type: NotificationType.success,
        });
        console.log('Successfully update bank account:', response);
        this.refresh();
        this.get();
      },
      (error) => {
        this.toastService.sendMessage({
          message: 'Error updating bank account',
          type: NotificationType.error,
        });
        console.error('Error updating bank account:', error);
      }
    );
  }

  //----------------------------Delete Methods ----------------------------
  Delete(AccountId: any) {
    
    this.apiService
      .delete(ApiEndpoints.DeleteBankAccount + '?AccountId=' + AccountId)
      .subscribe(
        (response: any) => {
          
          this.toastService.sendMessage({
            message: 'Account Deleted Successfully!',
            type: NotificationType.deleted,
          });
          this.refresh();
          this.get();
        },
        (error) => {
          this.toastService.sendMessage({
            message: 'Error Deleted!!',
            type: NotificationType.error,
          });
        }
      );
  }
  //----------------------------------------------------------------CRUD Methods ENDS HERE----------------------------------------------------------------

  //-------------------------------Refresh Form Method -------------------------------
  refresh() {
    this.bankCashAccountForm.reset();
    this.isUpdate = false;
  }

  //-------------------------------Get Seletected Row Method -------------------------------
  getSelectedRow(data: any) {
    
    this.bankCashAccountForm.patchValue({ ...data });
    this.bankCashAccountForm.patchValue({
      CurrencyCode: +data.CurrencyCode,
    });
    this.AccountId = +data.AccountId;
    this.isUpdate = true;
  }

  //------------------------------------FOR STICK NAV BAR METHOD--------------------------------
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
