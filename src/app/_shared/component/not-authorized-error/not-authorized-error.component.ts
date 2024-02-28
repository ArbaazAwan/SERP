import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-authorized-error',
  templateUrl: './not-authorized-error.component.html',
  styleUrls: ['./not-authorized-error.component.scss']
})
export class NotAuthorizedErrorComponent {

  @Input() showError!:boolean;

  hideErrorPopup() {
    this.showError = false;
  }

}
