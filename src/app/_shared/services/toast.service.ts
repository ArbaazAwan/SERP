import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationMessage, NotificationType } from '../model/toast-message';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private notificationSubject: Subject<NotificationMessage> =
    new Subject<NotificationMessage>();

  sendMessage(message: NotificationMessage) {
    this.notificationSubject.next(message);
  }

  constructor(private toastrService: ToastrService) {
    this.listenForMessages();
  }

  listenForMessages() {
    this.notificationSubject.subscribe(
      (message) => {
        switch (message.type) {
          case NotificationType.success:
            this.toastrService.success(message.message, message.title ? message.title :  "Success");
            break;
          case NotificationType.error:
            this.toastrService.error(message.message, message.title ? message.title : "Error");
            break;
          case NotificationType.warning:
            this.toastrService.warning(message.message, message.title ? message.title :  "Warning");
            break;
          case NotificationType.info:
            this.toastrService.info(message.message, message.title ? message.title :  "Info");
            break;
          default:
          case NotificationType.deleted:
            this.toastrService.error(message.message, message.title ? message.title :  "Deleted");
            break;
        }
      },
      (err) => {
        console.log('Error when processing toastr message');
      }
    );
  }
}
