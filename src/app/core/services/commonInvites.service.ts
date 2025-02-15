import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMessage, INotification } from '../models/common';

@Injectable()
export class CommonInvitesService {
  private notifications = new BehaviorSubject<INotification[]>([]);
  notifications$ = this.notifications.asObservable();

  private messages = new BehaviorSubject<IMessage[]>([]);
  messages$ = this.messages.asObservable();

  updateNotifications(
    notifications: INotification[],
    messages: IMessage[] | null
  ): void {
    if (this.notificationsAreDifferent(notifications)) {
      this.notifications.next(notifications);
      if (messages) {
        this.messages.next(messages);
      }
    }
  }

  notificationsAreDifferent(newNotifications: INotification[]): boolean {
    let notificationIsNewOrUpdated = false;
    const oldNotifications = this.notifications.value;

    if (oldNotifications.length !== newNotifications.length) {
      notificationIsNewOrUpdated = true;
    }

    oldNotifications.forEach((oldNotification) => {
      const newNotification = newNotifications.find(
        (newNotif) => newNotif.id === oldNotification.id
      );
      if (!newNotification) {
        notificationIsNewOrUpdated = true;
      } else {
        // Check if the values are different
        notificationIsNewOrUpdated =
          oldNotification.family !== newNotification.family ||
          oldNotification.confirmation !== newNotification.confirmation ||
          oldNotification.dateOfConfirmation !==
            newNotification.dateOfConfirmation ||
          oldNotification.isMessageRead !== newNotification.isMessageRead;
      }
    });
    return notificationIsNewOrUpdated;
  }
}
