export class NotificationMessage {
  message!: string;
  type!: NotificationType;
  title?: string;
}

export enum NotificationType {
  success = 0,
  warning = 1,
  error = 2,
  info = 3,
  deleted = 4
}
