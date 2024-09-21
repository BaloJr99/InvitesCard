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
    this.notifications.next(notifications);
    if (messages) {
      this.messages.next(messages);
    }
  }

  clearNotifications() {
    this.notifications.next([]);
    this.messages.next([]);
  }
}
