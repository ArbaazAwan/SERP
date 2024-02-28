import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationType } from 'src/app/_shared/model/toast-message';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UserService } from 'src/app/_shared/services/user.service';
import { passwordMatchValidator } from './passwordMatchValidators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  isSticky: boolean = false;
  componentName: string = "Change Password";
  changePasswordform = new FormGroup({
    oldpassword: new FormControl('', Validators.required),
    newpassword: new FormControl('', Validators.required),
    confirmpassword: new FormControl('', Validators.required),
  }, [passwordMatchValidator("newpassword", "confirmpassword")]);

  getControl(name: any): AbstractControl | null {
    return this.changePasswordform.get(name)

  }

  constructor(private fb: FormBuilder, private user: UserService, private toastService: ToastService) { }

  ngOnInit(): void {


  }
  get oldpassword() {
    return this.changePasswordform.get('oldpassword')
  }
  get confirmpassword() {
    return this.changePasswordform.get('confirmpassword')

  }
  checkOldPassword() {
    const username = localStorage.getItem('Username')!
    const oldpassword = this.changePasswordform.get('oldpassword')?.value
    const newpassword = this.changePasswordform.get('newpassword')?.value

    this.user.ChangePassword(username, oldpassword, newpassword).subscribe(
      {
        next: (value) => {
          if (value === 'Incorrect old password.') {
            this.toastService.sendMessage({
              message: 'Invalid Old Password',
              type: NotificationType.error,
            });
          } else {
            this.toastService.sendMessage({
              message: 'Password Updated Successfully!',
              type: NotificationType.success,
            });
            this.changePasswordform.reset()
          }
        },
        error: (err) => {
          console.error(err);

        },
        complete: () => {

        }
      }

    );


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


}
