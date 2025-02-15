import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Scroll } from '@angular/router';
import { TokenStorageService } from '../core/services/token-storage.service';
import { SocketService } from '../core/services/socket.service';
import { IMessage } from '../core/models/common';
import { CommonInvitesService } from '../core/services/commonInvites.service';
import { toLocalDate } from '../shared/utils/tools';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private route = new BehaviorSubject<string>('');
  route$ = this.route.asObservable();

  constructor(
    private tokenService: TokenStorageService,
    private socket: SocketService,
    private commonInvitesService: CommonInvitesService,
    private router: Router
  ) {}

  vm$ = combineLatest([
    this.route$,
    this.commonInvitesService.messages$,
    this.commonInvitesService.notifications$,
  ]).pipe(
    map(([route, messages, notifications]) => {
      const messagesGrouped: { key: string; value: IMessage[] }[] = [];

      const uniqueDates = [
        ...new Set(messages.map((message) => message.date)),
      ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      uniqueDates.forEach((date) => {
        messagesGrouped.push({
          key: date,
          value: messages
            .filter((message) => message.date === date)
            .sort((a, b) => b.time.localeCompare(a.time)),
        });
      });

      const sortedNotifications = notifications.sort(
        (a, b) =>
          new Date(toLocalDate(b.dateOfConfirmation)).getTime() -
          new Date(toLocalDate(a.dateOfConfirmation)).getTime()
      );

      return {
        messagesGrouped,
        route,
        notifications: sortedNotifications,
      };
    })
  );

  ngOnInit(): void {
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.socket.joinRoom(userInformation.username);
    }

    this.router.events.subscribe((events) => {
      if (events instanceof Scroll) {
        this.route.next(events.routerEvent.url);
      }

      if (events instanceof NavigationStart) {
        this.route.next(events.url);
      }
    });

    window.addEventListener('click', ({ target }) => {
      const toggleMenu = document.querySelector('.menu');
      const toggleNotifications = document.querySelector(
        '.notificationMessages'
      );

      const clickedElement = target as HTMLElement;
      if (
        !clickedElement.classList.contains('notifications') &&
        !clickedElement.classList.contains('fa-bell') &&
        !clickedElement.classList.contains('account') &&
        !clickedElement.classList.contains('fa-user')
      ) {
        if (
          !toggleMenu?.contains(clickedElement) &&
          !toggleNotifications?.contains(clickedElement)
        ) {
          if (
            toggleNotifications &&
            toggleNotifications.classList.contains('active')
          ) {
            toggleNotifications.classList.toggle('active');
          }

          if (toggleMenu && toggleMenu.classList.contains('active')) {
            toggleMenu.classList.toggle('active');
          }
        }
      }
    });
  }

  toggleMessages(): void {
    const toggleMessages = document.querySelector('.messages-chat');
    const messageContainer = document.querySelector('.messages-container');
    if (toggleMessages) {
      toggleMessages.classList.toggle('active');
    }

    if (messageContainer) {
      messageContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}
