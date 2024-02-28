import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { EmployeequalificationsService } from 'src/app/_shared/services/employeequalifications.service';
import { SetgetdataService } from 'src/app/_shared/services/setgetdata.service';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UploadedFile } from 'src/app/pages/inventory/new-chartofitem/new-chartofitem.component';
import { Column } from 'src/app/_shared/model/model';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { DocumentUploadService } from 'src/app/_shared/services/document-upload.service';
import { ExtractFileNamePipe } from 'src/app/_shared/pipe/extract-file-name.pipe';

@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  styleUrls: ['./qualifications.component.scss'],
  providers: [ExtractFileNamePipe],
})
export class QualificationsComponent implements OnInit {
  @Input() generalForm!: FormGroup;
  form!: FormGroup;
  qualificationList: any = [];
  isLoadingTable: boolean = false;
  globalFilterFields: string[] = [];
  isUpdate!: boolean;
  selectedQualification!: number;
  qualificationLevelList: any = [];
  data!: any;
  fileName!: string;
  documents: any;
  fs: any;
  cmbDocument: any;
  path: any;
  fileUpload!: HTMLInputElement;
  selectedFiles: File[] = [];
  uploadedImages: UploadedFile[] = [];
  isLoadingData: boolean = false;
  cols: Column[] = [];
  isToastShown: boolean = false;
  globalUserCode!: number;
  isNotAuthorized: boolean = false;
  ModulelistResp$: any = [];
  duplicateData:any;
  get formValue() {
    return this.form.getRawValue();
  }
  get EmployeeCode() {
    return +(this.generalForm.get('BasicInfoForm') as FormGroup).get(
      'EmployeeCode'
    )?.value;
  }
  get EmployeeName() {
    return (this.generalForm.get('BasicInfoForm') as FormGroup).get(
      'EmployeeName'
    )?.value;
  }

  get QualificationsFormArray () {
    return (this.generalForm.get('Qualifications') as FormArray)
  }

  constructor(
    private empQService: EmployeequalificationsService,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
    private dataService: SetgetdataService,
    private utilityService: UtilityService,
    private _documentUploadService: DocumentUploadService,
    private _fb: FormBuilder
  ) {
    this.dataService.data$.subscribe((data: any) => {
      this.data = data;
    });
  }

  ngOnInit(): void {
    this.globalUserCode = +localStorage.getItem('UserId')!;
    this.cols = [
      { header: 'Qualification Level', field: 'LevelName' },
      { header: 'Degree', field: 'DegreeTitle' },
      { header: 'Institution', field: 'InstitutionName' },
      { header: 'Subject', field: 'Subject' },
      { header: 'document', field: 'DocumentsPath' },
      { header: 'Action', field: 'action' },
    ];
    this.getAllEmployeeQualifications(this.EmployeeCode);
    this.getAllQualificationLevel();
    this.populateTable();
    this.formInit();

  }

  populateTable(): void {
    this.qualificationList = this.QualificationsFormArray
  }

  getAllEmployeeQualifications(EmployeeCode: number) {
    this.isLoadingTable = true;
    this.apiService
      .get(ApiEndpoints.EmployeeQualification + '?EmployeeCode=' + EmployeeCode)
      .subscribe({
        
        next: (res: any) => {
          debugger
          this.qualificationList = res.data;
        },
        error: (err: any) => {},
        complete: () => {
          this.isLoadingTable = false;
        },
      });
  }

  getAllQualificationLevel() {
    this.isLoadingData = true;
    this.apiService.get(ApiEndpoints.QualificationLevel).subscribe({
      next: (res: any) => {
        debugger
        this.qualificationLevelList = res.data;
        this.isLoadingData = false;
      },
      error: (err) => {
        this.isLoadingData = false;
      },
    });
  }

  addorUpdate() {
    if (this.isUpdate) this.updateQualification();
    else this.saveQualification();
  }

  qualification(data:any){
debugger

  }
  saveQualification() {
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      if (!this.isToastShown) {
        this.toastService.sendMessage({
          message: 'Invalid form fields please check the form!',
          type: NotificationType.error,
        });
        this.isToastShown = true;
        setTimeout(() => {
          this.isToastShown = false;
        }, 5000);
      }
      return;
    }
    let model = this.form.getRawValue();
    model.EmployeeCode = this.EmployeeCode;
    model.CreatedBy = this.globalUserCode;
debugger
       // Check for duplicate designation name
       const existingPayHead = this.utilityService.hasDuplicateValue(model.QualificationLevelCode,"QualificationLevelCode", this.qualificationList);
       if (existingPayHead) {
         this.toastService.sendMessage({
           message: 'Qualification with the same name already exists!',
           type: NotificationType.error,
         });
         this.duplicateData = existingPayHead;
         return;
       }

    this._documentUploadService
      .saveQualification(model, this.selectedFiles)
      .subscribe({
        next: () => {
          this.toastService.sendMessage({
            message: 'Qualification Saved Successfully!',
            type: NotificationType.success,
          });
          this.getAllEmployeeQualifications(this.EmployeeCode);
          this.form.reset();
        },
        error: (err) => {
          this.toastService.sendMessage({
            message: 'Error Occured while saving Qualification',
            type: NotificationType.error,
          });
        },
      });
    this.form.markAsUntouched();
  }

  updateQualification() {
    let model = this.form.getRawValue();
    model.ModifiedBy = this.globalUserCode;

    debugger
       // Check for duplicate designation name
       const existingPayHead = this.utilityService.hasDuplicateValue(model ,"QualificationLevelCode", this.qualificationList,true,"QualificationCode");
       if (existingPayHead) {
         this.toastService.sendMessage({
           message: 'Qualification with the same name already exists!',
           type: NotificationType.error,
         });
         this.duplicateData = existingPayHead;
         return;
       }

    this._documentUploadService
      .updateQualification(model, this.selectedFiles)
      .subscribe({
        next: (res) => {
          if (!res) {
            this.toastService.sendMessage({
              message: 'Could Update Employee Qualification',
              type: NotificationType.error,
            });
            return;
          }
          this.toastService.sendMessage({
            message: 'Qualifications Updated Successfully!',
            type: NotificationType.success,
          });
          this.getAllEmployeeQualifications(this.EmployeeCode);
        },
        error: (error: any) => {
          this.toastService.sendMessage({
            message: 'Could Update Employee Qualification',
            type: NotificationType.error,
          });
        },
      });
    this.isUpdate = false;
    this.form.reset();
  }

  onDelete(QualificationCode: number) {
    if (this.ModulelistResp$[0]?.Delete === false) {
      this.isNotAuthorized = true;
      return;
    }

    this.confirmService.confirm({
      message: `Are you sure that you want to delete this Qualification?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecuirement(QualificationCode);
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

  deleteRecuirement(QualificationCode: number) {
    this.apiService
      .delete(
        ApiEndpoints.EmployeeQualification +
          '?QualificationCode=' +
          QualificationCode
      )
      .subscribe({
        next: (res: any) => {
          this.toastService.sendMessage({
            message: 'Deleted the Qualification',
            type: NotificationType.success,
          });
          this.getAllEmployeeQualifications(this.EmployeeCode);
        },
        error: (err: any) => {
          this.toastService.sendMessage({
            message: 'Error Occure While Deleting Qualification',
            type: NotificationType.error,
          });
        },
      });
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.form.patchValue({ ...data });
  }

  changeQualification(e: any) {
    this.selectedQualification = +e.target.value;
  }

  refresh() {
    this.isUpdate = false;
    this.form.reset();
  }

  selectFile(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadedImages = [];
      this.selectedFiles = [];
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const uploadedFile: UploadedFile = {
            file: files[i],
            url: e.target.result,
          };
          this.uploadedImages.push(uploadedFile);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  downloadImage(Documents: string): void {
    this.empQService.downloadImage(Documents).subscribe((res: any) => {
      const filenameFromResponse = res['name'] || 'image.jpg';
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = filenameFromResponse;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  downloadDocuments(data: any) {
    let EmployeeCode = this.EmployeeCode;
    let QualificationCode = data.QualificationCode;
    this.empQService
      .downloadQualificationDocuments(EmployeeCode, QualificationCode)
      .subscribe({
        next: (response: Blob) => {
          const fileUrl = URL.createObjectURL(response);
          window.open(fileUrl);
        },
        error: (error) => {
          console.error('Error fetching document:', error);
        },
      });
  }

  formInit() {
    this.form = this._fb.group({
      QualificationCode: [null],
      EmployeeCode: [null],
      QualificationLevelCode: [null, Validators.required],
      DegreeTitle: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      InstitutionName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      BoardOrUniversityName: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      Subject: [
        null,
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      PassingYear: [null],
      DivisionOrGrade: [null],
      DocumentsPath: [null],
      CreatedBy: [null],
      CreatedOn: [null],
      ModifiedBy: [null],
      ModifiedOn: [null],
    });
  }
}
