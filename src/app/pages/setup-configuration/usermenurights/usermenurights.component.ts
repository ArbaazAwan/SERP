import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiEndpoints } from 'src/app/_shared/api/api-endpoints';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ApiProviderService } from 'src/app/_shared/services/api-provider.service';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-usermenurights',
  templateUrl: './usermenurights.component.html',
  styleUrls: ['./usermenurights.component.scss'],
})
export class UsermenurightsComponent implements OnInit {
  form!: FormGroup;
  userMenurights: any = [];
  MenuOptions$: any = [];
  selectedMenuOptions!: number;
  User$: any = [];
  selectedUser!: number;
  GridManuOptions$: any = [];
  menuId: any;
  //currentPage = 1; // Current page index
  //itemsPerPage = 10;

  // getPaginatedData(): any[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   return this.GridManuOptions$.slice(startIndex, endIndex);
  // }
  // getTotalPages(): number {
  //   return Math.ceil(this.GridManuOptions$.length / this.itemsPerPage);
  // }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiProviderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      MenuId: this.fb.control('', Validators.required),
      MenuAutoId: this.fb.control('', Validators.required),
      UserId: this.fb.control('', Validators.required),
      BranchCode: this.fb.control('', Validators.required),
      CanView: this.fb.control('', Validators.required),
      CanAdd: this.fb.control('', Validators.required),
      CanUpdate: this.fb.control('', Validators.required),
      CanDelete: this.fb.control('', Validators.required),
      SpecialRight1: this.fb.control('', Validators.required),
      SpecialRight2: this.fb.control('', Validators.required),
      SpecialRight3: this.fb.control('', Validators.required),
    });
    this.loadMenuOptions();
    this.loadUser();
  }

  changeMenuOptions(e: any) {
    this.selectedMenuOptions = +e.value;
  }

  loadMenuOptions() {
    this.apiService.get(ApiEndpoints.GetMenuOptions)
    .subscribe((res) => {
      this.MenuOptions$ = res;
    });
  }
  changeUser(e: any) {
    this.selectedUser = +e.value;
  }

  loadUser() {
    this.apiService.get(ApiEndpoints.getAllUsers)
    .subscribe((res) => {
      this.User$ = res;
    });
  }
  loadUserMenuRights() {
    this.apiService.get(ApiEndpoints.GetUserMenuRights + 
      `?UserId=${this.selectedUser}&MenuId=${this.selectedMenuOptions}`)
      .subscribe((res) => {
        this.GridManuOptions$ = res;
      });
  }

  save() {

    let model = this.form.value;
    // let model = { ...this.form.value };
    // delete model.CanView;
    // delete model.CanAdd;
    // delete model.CanUpdate;
    // delete model.CanDelete;
    // delete model.SpecialRight1;
    // delete model.SpecialRight2;
    // delete model.SpecialRight3;

    // Rest of your code to save the data without the checkbox values
    // ...

    // Loop through the GridManuOptions$ array and save the data for each item
    // this.GridManuOptions$.forEach((item: any) => {
    // Create a new object for each item, excluding the checkbox properties
    // const data = {
    //   ...model,
    //   BranchCode: +localStorage.getItem('BranchCode')!,
    //   MenuAutoId: item.MenuId,
    //   UserId: this.selectedUser,
    //   CanView: false,
    //   CanAdd: false,
    //   CanUpdate: false,
    //   CanDelete: false,
    //   SpecialRight1: false,
    //   SpecialRight2: false,
    //   SpecialRight3: false,
    // };
    this.GridManuOptions$.forEach((item: any) => {
      this.menuId = item.MenuId;
    });
    for (let i = 0; i < this.GridManuOptions$.length; i++) {
      let menuId = this.GridManuOptions$[i].MenuId;
      model.BranchCode = +localStorage.getItem('BranchCode')!;

      model.MenuAutoId = menuId;

      model.UserId = this.selectedUser;
      if (model.CanView === '') {
        model.CanView = false;
      } else {
        model.CanView = true;
      }
      if (model.CanAdd === '') {
        model.CanAdd = false;
      } else {
        model.CanAdd = true;
      }
      if (model.CanUpdate === '') {
        model.CanUpdate = false;
      } else {
        model.CanUpdate = true;
      }
      if (model.CanDelete === '') {
        model.CanDelete = false;
      } else {
        model.CanDelete = true;
      }
      if (model.SpecialRight1 === '') {
        model.SpecialRight1 = false;
      } else {
        model.SpecialRight1 = true;
      }
      if (model.SpecialRight2 === '') {
        model.SpecialRight2 = false;
      } else {
        model.SpecialRight2 = true;
      }
      if (model.SpecialRight3 === '') {
        model.SpecialRight3 = false;
      } else {
        model.SpecialRight3 = true;
      }
      // model.CanView =
      //   this.form.get('CanView')?.value === ''
      //     ? false
      //     : this.form.get('CanView')?.value;
      // model.CanAdd =
      //   this.form.get('CanAdd')?.value === ''
      //     ? false
      //     : this.form.get('CanAdd')?.value;
      // model.CanUpdate =
      //   this.form.get('CanUpdate')?.value === ''
      //     ? false
      //     : this.form.get('CanUpdate')?.value;
      // model.CanDelete =
      //   this.form.get('CanDelete')?.value === ''
      //     ? false
      //     : this.form.get('CanDelete')?.value;
      // model.SpecialRight1 =
      //   this.form.get('SpecialRight1')?.value === ''
      //     ? false
      //     : this.form.get('SpecialRight1')?.value;
      // model.SpecialRight2 =
      //   this.form.get('SpecialRight2')?.value === ''
      //     ? false
      //     : this.form.get('SpecialRight2')?.value;
      // model.SpecialRight3 =
      //   this.form.get('SpecialRight3')?.value === ''
      //     ? false
      //     : this.form.get('SpecialRight3')?.value;
      this.apiService.post(model, ApiEndpoints.SaveMenuRights + `?`)
      .subscribe((res) => {
        this.toastService.sendMessage({
          message: 'User Menu Rights Saved Successfully!',
          type: NotificationType.success,
        });
        this.refresh();
      });
    }
    this.form.markAsUntouched();
  }

  refresh() {
    this.MenuOptions$.UserId = null;
    this.MenuOptions$.MenuId = null;
    this.form.reset();
  }
}
