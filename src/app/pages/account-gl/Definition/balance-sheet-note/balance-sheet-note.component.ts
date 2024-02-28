import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-balance-sheet-note',
  templateUrl: './balance-sheet-note.component.html',
  styleUrls: ['./balance-sheet-note.component.scss']
})
export class BalanceSheetNoteComponent implements OnInit {

  form!: FormGroup;
  isLoadingData: boolean = false;
  selectedBalanceSheetCat: any;
  selectedBalanceSheetSubCat: any;
  BalanceSheetCat$: any = [];
  BalanceSheetSubCat$: any = [];
  BalanceSheetNote$: any = [];
  isUpdate!: boolean;
  MaxBalanceSheetNoteId: any;
  loadingerror = false;
  ModulelistResp$: any = [];
  UserId:any;
  componentName: string = "Balance Sheet Note";

  BalanceSheetNoteResp$: any = [];
  isSticky: boolean = false;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private confirmService: ConfirmationService,
    private toastService: ToastService
  ) {}

  onMainContainerScroll(event: Event) {
    const mainContainer = event.target as HTMLElement;
    const scrollPosition = mainContainer.scrollTop;
     if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      BalanceSheetCode: this.fb.control('', Validators.required),
      BalanceSheetSubCode: this.fb.control('', Validators.required),
      BalanceSheetNoteCode: this.fb.control('', Validators.required),
      Name: this.fb.control('', Validators.required),
    });

    //=====================Get User Rights =================
    const UserId  = localStorage.getItem('UserId');

    if (UserId !== null) {
      this.UserId = +UserId;
    }
    const ModuleId = 1;
    const FormId = 22;
    this.apiService.get(ApiEndpoints.GetUserFormRights +'?UserId=' + UserId + '&ModuleId=' + ModuleId +'&FormId='+FormId)
      .subscribe((res: any) => {
        this.ModulelistResp$ = res;
      });


    this.loadAllBalanceSheetCat();
    this.loadAllBalanceSheetNote();
  }

  changeBalanceSheetCat(e: any) {
    this.selectedBalanceSheetCat = +e.value;
    this.loadAllBalanceSheetSubCat(this.selectedBalanceSheetCat);
  }
  loadAllBalanceSheetCat() {
    this.apiService
      .get(ApiEndpoints.getAllBalanceSheetCategory)
      .subscribe((res: any) => {
        this.BalanceSheetCat$ = res;
      });
  }

  changeBalanceSheetSubCat(e: any) {
    this.selectedBalanceSheetSubCat = +e.value;
    this.loadMaxBalanceSheetNoteId(
      this.selectedBalanceSheetCat,
      this.selectedBalanceSheetSubCat
    );
  }
  loadAllBalanceSheetSubCat(BalanceSheetCode: number) {
    this.apiService
      .get(ApiEndpoints.getAllBalanceSheetSubCategory + '?BalanceSheetCode=' + BalanceSheetCode)
      .subscribe((res: any) => {
        this.BalanceSheetSubCat$ = res;
      });
  }
  loadAllBalanceSheetNote() {
    this.isLoadingData = true;
    this.apiService
      .get(ApiEndpoints.GetAllBalanceSheetNote)
      .subscribe((res: any) => {
        this.BalanceSheetNote$ = res;
        this.isLoadingData = false;
      });
  }

  loadMaxBalanceSheetNoteId(BalanceSheetCat: number, BalanceSheetSubCat: number) {
    this.apiService
      .get(
        ApiEndpoints.GetMaxBalanceSheetNote +
          '?BalanceSheetCode=' +
          BalanceSheetCat +
          '&BalanceSheetSubCode=' +
          BalanceSheetSubCat
      )
      .subscribe((res) => {
        const x = Object.entries(res)
          .map((x) => x[1])
          .pop();
        this.MaxBalanceSheetNoteId = +x.BalanceSheetNoteCode;
      });
  }

  save() {
    let model = this.form.value;
    model.BalanceSheetCode = this.selectedBalanceSheetCat;
    model.BalanceSheetSubCode = this.selectedBalanceSheetSubCat;
    model.BalanceSheetNoteCode = this.MaxBalanceSheetNoteId;
    model.Name = this.BalanceSheetNoteResp$.Name;
    model.UserId = +localStorage.getItem('UserId')!;
    this.apiService
      .post(model, ApiEndpoints.postBalanceSheetNote)
      .subscribe(() => {
        this.loadAllBalanceSheetNote();
        this.toastService.sendMessage({
          message: 'Balance Sheet Note Saved Successfully!',
          type: NotificationType.success,
        });

        this.refresh();
      });
    this.form.markAsUntouched();
  }

  getSelectedRow(data: any) {
    this.isUpdate = true;
    this.BalanceSheetNoteResp$ = { ...data };
    if (typeof data.BalanceSheetCode === 'string') {
      this.BalanceSheetNoteResp$.BalanceSheetCode = data.BalanceSheetCode.trim();
    }
    if (typeof data.BalanceSheetSubCode === 'string') {
      this.BalanceSheetNoteResp$.BalanceSheetSubCode = data.BalanceSheetSubCode.trim();
    }
  }

  update() {
    let model = this.form.value;
    model.BalanceSheetCode = this.selectedBalanceSheetCat;
    if (isNaN(model.BalanceSheetCode)) {
      model.BalanceSheetCode = this.BalanceSheetNoteResp$.BalanceSheetCode;
    }
    model.BalanceSheetSubCode = this.selectedBalanceSheetSubCat;
    if (isNaN(model.BalanceSheetSubCode)) {
      model.BalanceSheetSubCode = this.BalanceSheetNoteResp$.BalanceSheetSubCode;
    }
    model.BalanceSheetNoteCode = this.BalanceSheetNoteResp$.BalanceSheetNoteCode;
    model.Name = this.BalanceSheetNoteResp$.Name;
    this.apiService
      .update(model, ApiEndpoints.putBalanceSheetNote)
      .subscribe(() => {
        this.loadAllBalanceSheetNote();
        this.toastService.sendMessage({
          message: 'Balance Sheet Note Updated Successfully!',
          type: NotificationType.success,
        });
      });
    this.isUpdate = false;
    this.form.reset();
    this.refresh();
  }

  delete(BalanceSheetCode: number, BalanceSheetSubCatCode: number, BalanceSheetNoteCode: number) {
    // if (this.ModulelistResp$[0]?.Delete === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.confirmService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(
            ApiEndpoints.DeleteBalanceSheetNote +
              '?BalanceSheetCode=' +
              BalanceSheetCode +
              '&BalanceSheetSubCode=' +
              BalanceSheetSubCatCode +
              '&BalanceSheetNoteCode=' +
              BalanceSheetNoteCode
          )
          .subscribe(() => {
            this.toastService.sendMessage({
              message: 'Balance Sheet Note Deleted Successfully!',
              type: NotificationType.deleted,
            });
            this.loadAllBalanceSheetNote();
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

  add() {
    // if (this.ModulelistResp$[0]?.Add === false) {
    //   this.loadingerror = true;
    //   return;
    // }

    this.save();
  }

  updateAllow() {
    // if (this.ModulelistResp$[0]?.Edit === false) {
    //   this.loadingerror = true;
    //   return;
    // }
    this.update();
  }

 hideErrorPopup() {
    this.loadingerror = false;
  }
  refresh() {
    this.isUpdate = false;
    this.BalanceSheetNoteResp$.BalanceSheetCode = null;
    this.BalanceSheetNoteResp$.BalanceSheetSubCode = null;
    this.form.reset();
  }

}
