import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IMessage, INotification } from "src/shared/interfaces";

@Injectable()
export class CommonEntriesService {

  private notifications = new BehaviorSubject<INotification[]>([])
  notifications$ = this.notifications.asObservable();

  private messages = new BehaviorSubject<Map<number, IMessage>>(new Map<number, IMessage>())
  messages$ = this.messages.asObservable();

  updateNotifications(notifications: INotification[], messages: Map<number, IMessage>): void {
    this.notifications.next(notifications);
    this.messages.next(messages);
  }
  
  clearNotifications() {
    this.notifications.next([]);
    this.messages.next(new Map<number, IMessage>());
  }
}