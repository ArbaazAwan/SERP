import { ToastService } from './../../_shared/services/toast.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_shared/services/user.service';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { CompanyCodeService } from 'src/app/_shared/services/company-code.service';
import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/_shared/services/utility.service';
import { Brand } from 'src/app/_shared/model/model';

let GateWayApiUrl = environment.gateWayApiUrl;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  Branches: any = [];
  selectBranch!: number;
  localBranchName!: string;
  companyName!: string;
  activeBrand!: Brand;
  code: string = '';
  loading = false;
  isLoggedIn!: boolean;
  @Output() userIdEvent = new EventEmitter<number>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private companyCodeService: CompanyCodeService,
    private utilityService: UtilityService
  ) {
    this.formInit();
  }

  ngOnInit() {
    this.code = this.companyCodeService.getCookie('companyCode') || '';
    if (this.code == '') {
      this.router.navigate(['/']);
    }
    this.isLoggedIn = localStorage.getItem('UserId') !== null;
    this.allBranches();
    this.GetActiveBrand();

    // Check if the Userid is present in localStorage and user is already loggedin
    if (localStorage.getItem('UserId')) {
      this.router.navigate(['/Dashboard']);
    }
  }

  formInit() {
    this.form = this.fb.group({
      username: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
    });
  }

  changeBranch(e: any) {
    this.selectBranch = +e.target.value;
    let BranchName = this.Branches.find((x: any) => {
      return this.selectBranch === x.BranchCode;
    });
    this.localBranchName = BranchName.BranchName;
    this.companyName = this.localBranchName;
  }

  login() {
    if (this.form.invalid) {
      this.utilityService.markAllFieldsAsDirtyAndTouched(this.form);
      return;
    }

    const val = this.form.value;
    this.loading = true;
    this.userService.login(val.username, val.password).subscribe({
      next: (res: any) => {
        const userObj = res.data;
        const userBranches = res.UserBranches;
        this.toastService.sendMessage({
          message: 'Login Successful!',
          type: NotificationType.success,
        });

        this.Branches = userBranches;

        if (this.Branches.length > 0) {
          //select default branch
          this.selectBranch = this.Branches[0].BranchCode;
          localStorage.setItem(
            'BranchCode',
            this.Branches[0].BranchCode?.toString()
          );
          localStorage.setItem('BranchName', this.Branches[0]?.BranchName);
          localStorage.setItem(
            'AllowedBranches',
            JSON.stringify(this.Branches)
          );
        }

        localStorage.setItem('UserId', userObj[0].UserId);
        localStorage.setItem('Username', val.username);
        localStorage.setItem('LoginTime', this.currentFormattedTime());
        localStorage.setItem('Token', userObj[0].Token);
        const id = userObj[0].UserId;
        this.userIdEvent.emit(id);
        // localStorage.setItem('Password', userObj[0].Password);

        localStorage.setItem('BranchLogoPath', userObj[0].LogoPath);
        this.router.navigate(['/Dashboard']);
        this.loading = false;
        window.location.reload();
      },
      error: (err) => {
        this.toastService.sendMessage({
          message: err.error.Message,
          type: NotificationType.error,
        });
      },
    });
  }

  currentFormattedTime(): string {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
      hours -= 12;
    }
    const minutes = currentDate.getMinutes();
    const currentTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${amPm}`;

    return currentTime;
  }

  allBranches() {
    this.userService.getAllBranches().subscribe((res) => {
      this.Branches = res;
    });
  }

  GetActiveBrand() {
    this.userService.GetActiveBrand()
    .subscribe({
      next: (res:any) => {
        this.activeBrand = res[0];
        localStorage.setItem('activeBrand', JSON.stringify(res[0]));
      },
      error: () => {},
    });
  }

  BackToCompanyCode() {
    const cookiesToDelete = [
      'companyCode',
      'apiUrl',
      'reportingApiUrl',
      'selectedOption',
    ];
    cookiesToDelete.forEach((cookieName) => {
      this.companyCodeService.deleteCookie(cookieName);
    });
    this.router.navigate(['/']);
  }
}
