import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { IEmployeeApplicantView } from 'src/app/_shared/model/HR-Payroll';
import { Column } from 'src/app/_shared/model/model';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { FileuploadService } from 'src/app/_shared/services/file-upload.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-basicinfo',
  templateUrl: './basicinfo.component.html',
  styleUrls: ['./basicinfo.component.scss'],
})
export class BasicinfoComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() cities: any[] = [];
  @Input() provinces: any[] = [];
  @Input() departmentDivisions: any = [];
  @Input() departments: any = [];
  @Input() designations: any = [];
  @Input() genders: any = [];
  @Input() employeeTypes: any = [];
  @Input() timeZones: any = [];
  MaxPersonalInfo: any;
  personalInfo: any;
  isUpdate: boolean = false;
  loading: boolean = false;
  file: any;
  isImage: boolean = false;
  isEmpCodeUniques: boolean = true;
  selectedFile: any;
 

  get formValue(): any {
    return this.form.getRawValue();
  }

  constructor(
    private _apiService: ApiProviderService,
    private _toastService: ToastService,
    private _fileUploadService: FileuploadService
  ) {}

  ngOnInit(): void {
    if (this.formValue.EmployeeCode){
      this.getEmployeePicture(this.formValue.EmployeeCode);
    }
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    this.patchImage(selectedFile);
  }

  patchImage(selectedFile: any) {
    if (selectedFile) {
      this.selectedFile = selectedFile;
      if (selectedFile.type.startsWith('image/')) {
        this.isImage = true;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          this.file = reader.result;
        };
      } else {
        this.isImage = false;
        this.file = null;
      }
    }
  }

  getEmployeePicture(EmployeeCode: number | null) {
    this._fileUploadService
      .viewDocument(ApiEndpoints.EmployeePicture + `/${EmployeeCode}`)
      .subscribe({
        next: (file: Blob) => {
          this.patchImage(file);
        },
        error: (err: any) => {
          this._toastService.sendMessage({
            message: 'No Image Found',
            type: NotificationType.info,
          });
        },
      });
  }

  clearFile(): void {
    this.file = null;
    // Clear the input field to allow selecting the same file again
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  
}
