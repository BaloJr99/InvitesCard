import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IMessage, INotifications } from "src/shared/interfaces";

@Injectable()
export class CommonEntriesService {

  private notifications = new BehaviorSubject<INotifications[]>([])
  notifications$ = this.notifications.asObservable();

  private messages = new BehaviorSubject<Map<number, IMessage>>(new Map<number, IMessage>())
  messages$ = this.messages.asObservable();

  updateNotifications(notifications: INotifications[], messages: Map<number, IMessage>): void {
    this.notifications.next(notifications);
    this.messages.next(messages);
  }
  
  clearNotifications() {
    this.notifications.next([]);
    this.messages.next(new Map<number, IMessage>());
  }
}