import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { UtilityService } from 'src/app/_shared/services/utility.service';

@Component({
  selector: 'app-company-config',
  templateUrl: './company-config.component.html',
  styleUrls: ['./company-config.component.scss'],
})
export class CompanyConfigComponent implements OnInit {
  tableResponse: any = [];
  form!: FormGroup;
  isUpdate: boolean = false;
  Language: any = [];
  selectedLanguage!: number;
  componentName: string = 'Company Config';

  dateFormats: string[] = [];
  selectedDateFormat!: any;
  selectedFormatKey: number = 1;
  currentDate: Date = new Date();
  date: Date | undefined;
  private reverseDateFormatMapping: { [format: string]: number } = {};

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
    private utilitiesService: UtilityService
  ) {
    for (const key in this.dateFormatMapping) {
      if (this.dateFormatMapping.hasOwnProperty(key)) {
        const format = this.dateFormatMapping[key];
        this.reverseDateFormatMapping[format] = parseInt(key, 10);
      }
    }
    this.formInit();
  }

  ngOnInit(): void {
    this.dateFormats = this.getDateFormats();
    this.LoadAllCompanyConfig();
    this.loadAllLanguage();
  }

  formInit() {
    this.form = this.fb.group({
      CompanyCode: [{ value: '', disabled: true }, Validators.required],
      CompanyName: ['', Validators.required],
      ShortName: ['', Validators.required],
      Address: ['', Validators.required],
      PhoneNo: ['', Validators.required],
      EmailAddress: ['', Validators.required],
      STRegistrationNo: [''],
      NTN: [''],
      TitleOfTax: [''],
      LanguageId: ['', Validators.required],
      GST: [''],
      IsActive: [false, Validators.required],
      AttendifyCompanyId: ['', Validators.required],
      DateFormatCode: ['', Validators.required],
    });
  }

  changeLanguage(e: any) {
    this.selectedLanguage = +e.target.value;
  }

  loadAllLanguage() {
    this.apiService.get(ApiEndpoints.getAllLanguages).subscribe((res) => {
      this.Language = res;
    });
  }

  LoadAllCompanyConfig() {
    this.apiService
      .get(ApiEndpoints.getAllCompanyConfig)
      .subscribe((res: any) => {
        this.tableResponse = res;
        localStorage.setItem(
          'AttendifyCompanyId',
          this.tableResponse[0].AttendifyCompanyId
        );
      });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    data = { ...data };
    data.ShortName = data.ShortName?.trim();
    data.Address = data.Address?.trim();
    this.selectedDateFormat = this.dateFormatMapping[data.DateFormatCode];
    this.form.patchValue({ ...data });
  }

  update() {
    let formValue = this.form.getRawValue();
    if (typeof formValue.LanguageId === 'object') {
      formValue.LanguageId = +this.selectedLanguage!;
    }
    formValue.ShortName = formValue.ShortName.trim();
    formValue.Address = formValue.Address.trim();
    formValue.AttendifyCompanyId = formValue.AttendifyCompanyId.trim();
    formValue.DateFormatCode = +this.selectedFormatKey;
    this.apiService
      .update(formValue, ApiEndpoints.updateCompanyConfig)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'Company Config Updated Successfully!',
          type: NotificationType.success,
        });
        this.LoadAllCompanyConfig();
      });
    this.isUpdate = false;
    this.form.reset();
  }

  delete(CompanyCode: number) {
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.deleteCompanyConfig + '?CompanyCode=' + CompanyCode
          )
          .subscribe((res) => {
            this.toastService.sendMessage({
              message: 'Company Config Deleted Successfully!',
              type: NotificationType.warning,
            });
            this.LoadAllCompanyConfig();
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

  addorUpdate() {
    if (this.form.invalid) {
      this.toastService.sendMessage({
        type: NotificationType.error,
        message: 'Please verify all fields',
        title: 'Invalid Form',
      });
      this.utilitiesService.markAllFieldsAsDirtyAndTouched(this.form);
      return;
    }
    if (!this.isUpdate) {
      //this.save();
    } else {
      this.update();
    }
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
    this.LoadAllCompanyConfig();
  }

  //Date format Working Starts from here----------------------------------------------------------------

  dateFormatMapping: { [key: number]: string } = {
    1: 'dd-MMM-yyyy',
    2: 'dd/mm/yy',
    3: 'M.D.yy',
    4: 'DD/MM/yy',
    5: 'M-dd-yy',
    6: 'dd-M-yy',
  };

  dateChange() {
    this.selectedFormatKey = this.getFormatKey(this.form.value.DateFormatCode);
  }

  getDateFormats(): string[] {
    return Object.values(this.dateFormatMapping);
  }

  getFormatKey(format: string): number {
    return this.reverseDateFormatMapping[format];
  }
}
