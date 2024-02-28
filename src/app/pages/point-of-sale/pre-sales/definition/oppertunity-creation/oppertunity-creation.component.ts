import { Component, OnInit } from '@angular/core';
import { DatePipe, formatNumber } from '@angular/common';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { DateFormatPipe } from 'src/app/_shared/pipe/date-format.pipe';

@Component({
  selector: 'app-oppertunity-creation',
  templateUrl: './oppertunity-creation.component.html',
  styleUrls: ['./oppertunity-creation.component.scss'],
  providers: [DateFormatPipe, DatePipe],
})
export class OppertunityCreationComponent implements OnInit {
  header!: string;
  submitted!: boolean;
  loadingerror = false;
  saveorUpdate!: string;
  selectedStatus!: number;
  displayHeader = 'd-none';
  statusResponse: any = [];
  isSticky: boolean = false;
  isUpdate: boolean = false;
  PotentialAmount: number = 0;
  oppertunityForm!: FormGroup;
  opportunityCode: number = 0;
  productDialogStatus!: boolean;
  leadOpportunityList: any = [];
  isLoadingData: boolean = false;
  grossProfitPercentage: number = 0;
  headerStatus: string = 'Add new Status';
  componentName: string = "Opportunity Creation";
  private datePipe = new DatePipe('en-US');
  selectedFormatKey!: number;

  get formatDateForInput(): string {
    return this.dateFormatPipe.transform(this.selectedFormatKey);
  }
  get f() {
    return this.oppertunityForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private dateFormatPipe: DateFormatPipe
  ) { }

  ngOnInit(): void {
    this.loadAllCompanyConfig();
    this.oppertunityForm = this.fb.group({
      OpportunityName: this.fb.control('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]),
      Period: this.fb.control('', Validators.required),
      Duration: this.fb.control('', Validators.required),
      StartDate: this.fb.control('', Validators.required),
      ClosingDate: this.fb.control('', Validators.required),
      PotentialAmount: this.fb.control('', [Validators.required]),
      GrossProfitPercentage: this.fb.control('', Validators.required),
      TotalAmount: this.fb.control('', Validators.required),
      StatusCode: this.fb.control('', Validators.required),
    });
    this.loadAllLeadStatus()
    this.getAllLeadOpportunities()
  }

  getLeadOpportunityById(lead: any): void {
    
    this.isUpdate = true
    this.oppertunityForm.controls['OpportunityName'].setValue(lead.OpportunityName)
    this.oppertunityForm.controls['Period'].setValue(lead.Period)
    this.oppertunityForm.controls['Duration'].setValue(lead.Duration)
    lead.StartDate = this.parseAndFormatDate(lead.StartDate)
    this.oppertunityForm.controls['StartDate'].setValue(lead.StartDate)
    lead.ClosingDate = this.parseAndFormatDate(lead.ClosingDate)
    this.oppertunityForm.controls['ClosingDate'].setValue(lead.ClosingDate)
    this.oppertunityForm.controls['PotentialAmount'].setValue(lead.PotentialAmount)
    this.oppertunityForm.controls['GrossProfitPercentage'].setValue(lead.GrossProfitPercentage)
    this.oppertunityForm.controls['TotalAmount'].setValue(lead.TotalAmount)
    this.oppertunityForm.controls['StatusCode'].setValue(parseInt(lead.StatusCode))
    this.opportunityCode = lead.OpportunityCode
  }

  getLabel(): string {
    switch (this.oppertunityForm.controls['Period'].value) {
      case 'Month':
        return 'Month';
      case 'Week':
        return 'Week';
      case 'Days':
        return 'Days';
      default:
        return 'Days';
    }
  }

  getAllLeadOpportunities(): void {
    this.isLoadingData = true
    this.apiService.get(ApiEndpoints.GetLeadOpportunityList + `?BranchCode=${localStorage.getItem('BranchCode')}&OpportunityCode=0`).subscribe((res: any) => {
      this.leadOpportunityList = res.data
      this.isLoadingData = false
    })
  }

  loadAllCompanyConfig() {
    this.apiService
      .get(ApiEndpoints.getAllCompanyConfig)
      .subscribe((res: any) => {
        this.selectedFormatKey = res[0].DateFormatCode;
      });
  }

  loadAllLeadStatus() {
    this.apiService
      .get(ApiEndpoints.GetAllLeadsStatus)
      .subscribe((res: any) => {
        this.statusResponse = res.data;
      });
  }

  openNewStatus() {
    this.header = 'Add Status';
    this.saveorUpdate = 'Save';
    this.submitted = false;
    this.productDialogStatus = true;
    this.isUpdate = false;
    this.oppertunityForm.reset();
  }

  createLeadOpportunity(): void {
    this.apiService.get(ApiEndpoints.GetMaxOpportunityCode).subscribe((res: any) => {
      let model = this.oppertunityForm.value;
      model.OpportunityCode = res[0].OpportunityCode;
      model.CreatedBy = localStorage.getItem('UserId');
      model.BranchCode = localStorage.getItem('BranchCode')
      model.StartDate = this.datePipe.transform(
        model.StartDate,
        'yyyy-MM-dd'
      );
      model.ClosingDate = this.datePipe.transform(
        model.ClosingDate,
        'yyyy-MM-dd'
      );
      this.apiService
        .post(model, ApiEndpoints.CreateLeadOpportunity)
        .subscribe((res) => {
          this.toastService.sendMessage({
            message: 'Leads Opportunity Created Successfully!',
            type: NotificationType.success,
          });
          this.oppertunityForm.reset();
          this.getAllLeadOpportunities()
        });

      this.oppertunityForm.markAsUntouched();
    })
  }

  updateLeadOppotunity(): void {
    let model = this.oppertunityForm.value;
    model.ModifiedBy = localStorage.getItem('UserId')
    model.BranchCode = localStorage.getItem('BranchCode')
    model.OpportunityCode = this.opportunityCode;
    model.StartDate = this.datePipe.transform(
      model.StartDate,
      'yyyy-MM-dd'
    );
    model.ClosingDate = this.datePipe.transform(
      model.ClosingDate,
      'yyyy-MM-dd'
    );
    this.apiService
      .update(model, ApiEndpoints.UpdateLeadOpportunity)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Leads Opportunity Updated Successfully!',
          type: NotificationType.success,
        });
        this.oppertunityForm.reset();
        this.getAllLeadOpportunities()
        this.isUpdate = false
      });
  }

  deleteLeadOpportunity(OpportunityCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.delete(ApiEndpoints.DeleteLeadOpportunity + `?BranchCode=${localStorage.getItem('BranchCode')}&OpportunityCode=${OpportunityCode}`)
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Leads Opportunity Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.getAllLeadOpportunities()
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

  changeStatus(e: any) {
    this.selectedStatus = +e.value;
  }

  hideDialogStatus() {
    this.loadAllLeadStatus();
    this.productDialogStatus = false;
    this.submitted = false;
    this.oppertunityForm.reset();
    this.isUpdate = false;
  }

  hideErrorPopup() {
    this.loadingerror = false;
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

  parseAndFormatDate(dateString: Date): Date {
    
    let targetFormat = 'yyyy-MM-dd';
    const parsedDate: string | null = this.datePipe.transform(
      dateString,
      targetFormat
    );
    if (parsedDate !== null)
      return new Date(parsedDate);
    else {
      console.error(`Failed to parse date: ${dateString}`);
      return new Date();
    }
  }

  calculateClosingDate() {
    
    const period = this.oppertunityForm.controls['Period'].value
    const duration = this.oppertunityForm.controls['Duration'].value
    const startDate = new Date(this.oppertunityForm.controls['StartDate'].value);
    if (period && duration && startDate) {
      if (period === 'Days') {
        const closingDate = new Date(startDate);
        closingDate.setDate(startDate.getDate() + Number(duration));
        let date=this.parseAndFormatDate(closingDate);
        this.oppertunityForm.controls['ClosingDate'].setValue(date)
      } else if (period === 'Week') {
        const closingDate = new Date(startDate);
        closingDate.setDate(startDate.getDate() + Number(duration) * 7);
        let date=this.parseAndFormatDate(closingDate);
        this.oppertunityForm.controls['ClosingDate'].setValue(date)
      } else if (period === 'Month') {
        
        const closingDate = new Date(startDate);
        closingDate.setMonth(startDate.getMonth() + Number(duration));
        let date=this.parseAndFormatDate(closingDate);
        this.oppertunityForm.controls['ClosingDate'].setValue(date)
      }
    }
  }

  // calculateTotalAmount() {
  //   const potentialAmountValue = this.oppertunityForm.controls['PotentialAmount'].value;
  //   const grossProfitPercentageValue = this.oppertunityForm.controls['GrossProfitPercentage'].value;
  //   this.PotentialAmount = parseFloat(potentialAmountValue.replace(/,/g, '')) || 0;
  //   this.grossProfitPercentage = parseFloat(grossProfitPercentageValue.replace(/,/g, '')) || 0;
  //   if (this.PotentialAmount !== 0 && this.grossProfitPercentage !== 0) {
  //     const calculatedTotalAmount = (this.PotentialAmount * this.grossProfitPercentage) / 100;
  //     if (!isNaN(calculatedTotalAmount) && isFinite(calculatedTotalAmount)) {
  //       const totalAmountFormatted = formatNumber(calculatedTotalAmount, 'en-US', '1.0-0');
  //       this.oppertunityForm.controls['TotalAmount'].setValue(totalAmountFormatted);
  //     } else {
  //       this.oppertunityForm.controls['TotalAmount'].setValue('Invalid Calculation');
  //     }
  //   } else {
  //     this.oppertunityForm.controls['TotalAmount'].setValue(0);
  //   }
  // }

  calculateTotalAmount() {
    debugger
    const potentialAmountValue = this.oppertunityForm.controls['PotentialAmount'].value;
    const grossProfitPercentageValue = this.oppertunityForm.controls['GrossProfitPercentage'].value;

    let validatedPotentialAmountValue = potentialAmountValue.replace(/[^0-9.]/g, ''); 
if( validatedPotentialAmountValue == '.'){
  this.oppertunityForm.get('PotentialAmount')!.setValue('');
}

    if (validatedPotentialAmountValue.charAt(0) === '.') {
        validatedPotentialAmountValue = validatedPotentialAmountValue.substring(1); 
    }

    let validatedGrossProfitPercentageValue = grossProfitPercentageValue.replace(/[^0-9.]/g, ''); 
    if( validatedGrossProfitPercentageValue == '.'){
      this.oppertunityForm.get('GrossProfitPercentage')!.setValue('');
    }
    if (validatedGrossProfitPercentageValue.charAt(0) === '.') {
        validatedGrossProfitPercentageValue = validatedGrossProfitPercentageValue.substring(1); 
    }

    const potentialAmount = parseFloat(validatedPotentialAmountValue) || 0;
    const grossProfitPercentage = parseFloat(validatedGrossProfitPercentageValue) || 0;

    if (potentialAmount !== 0 && grossProfitPercentage !== 0) {
        const calculatedTotalAmount = (potentialAmount * grossProfitPercentage) / 100;
        if (!isNaN(calculatedTotalAmount) && isFinite(calculatedTotalAmount)) {
            const totalAmountFormatted = formatNumber(calculatedTotalAmount, 'en-US', '1.0-0');
            this.oppertunityForm.controls['TotalAmount'].setValue(totalAmountFormatted);
        } else {
            this.oppertunityForm.controls['TotalAmount'].setValue('Invalid Calculation');
        }
    } else {
        this.oppertunityForm.controls['TotalAmount'].setValue(0);
    }
}





  refresh() {
    this.isUpdate = false;
    this.oppertunityForm.reset();
    this.getAllLeadOpportunities();
    // this.allFinancialYear();
  }




}
