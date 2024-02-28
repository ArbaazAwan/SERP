import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { SetgetdataService } from 'src/app/_shared/services/setgetdata.service';

@Component({
  selector: 'app-personalinfo',
  templateUrl: './personalinfo.component.html',
  styleUrls: ['./personalinfo.component.scss'],
})
export class PersonalinfoComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() bloodGroups: any = [];
  @Input() nationalities: any = [];
  @Input() religions: any = [];
  @Input() maritalStatuses: any = [];
  @Input() employeeTypes: any = [];
  @Input() disabilityNatures: any = [];
  @Input() isUpdate: boolean = false;

  personalInfo: any = [];
  isDisabled = false;
  MaxPersonalInfo: any = [];
  data: any;
  datePipe = new DatePipe('en-US');
  ModulelistResp$: any = [];
  UserId: any;

  constructor(
    private apiService: ApiProviderService,
    private dataService: SetgetdataService
  ) {
    this.dataService.data$.subscribe((data) => {
      this.data = data;
    });
  }

  ngOnInit(): void {
    this.getUserRights();
    this.form.get('Disability')?.valueChanges.subscribe((value: boolean) => {
      const disabilityNatureControl = this.form.get('DisabilityNatureCode');
      if (value) {
        disabilityNatureControl?.enable();
      } else {
        disabilityNatureControl?.setValue(null);
        disabilityNatureControl?.disable();
      }
    });

  }


  getUserRights() {
    const UserId = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 4;
    const FormId = 2;
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

  ChangeNatureofDisability() {
    this.isDisabled = !this.isDisabled;
  }

  Resetform() {
    this.form.reset();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.personalInfo = { ...data };
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
  }
}
