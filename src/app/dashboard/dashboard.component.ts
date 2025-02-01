import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NavigationStart, Router, Scroll } from '@angular/router';
import { TokenStorageService } from '../core/services/token-storage.service';
import { SocketService } from '../core/services/socket.service';
import { LoaderService } from '../core/services/loader.service';
import { IMessage, INotification } from '../core/models/common';
import { CommonInvitesService } from '../core/services/commonInvites.service';
import { KeyValue } from '@angular/common';
import { toLocalDate } from '../shared/utils/tools';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private tokenService: TokenStorageService,
    private socket: SocketService,
    private loaderService: LoaderService,
    private commonInvitesService: CommonInvitesService,
    private router: Router,
    @Inject(LOCALE_ID) private localeValue: string
  ) {}

  notifications: INotification[] = [];

  messagesGrouped: KeyValue<string, IMessage[]>[] = [];

  route = '';

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando dashboard`);
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.socket.joinRoom(userInformation.username);
    }

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

    this.loaderService.setLoading(false);

    this.commonInvitesService.messages$.subscribe({
      next: (messages) => {
        this.groupMessages(Object.values(messages));
      },
    });

    this.commonInvitesService.notifications$.subscribe({
      next: (notifications) => {
        this.notifications = notifications.sort(
          (a, b) =>
            new Date(
              toLocalDate(this.localeValue, b.dateOfConfirmation)
            ).getTime() -
            new Date(
              toLocalDate(this.localeValue, a.dateOfConfirmation)
            ).getTime()
        );
      },
    });

    this.router.events.subscribe((events) => {
      if (events instanceof Scroll) {
        this.route = events.routerEvent.url;
      }

      if (events instanceof NavigationStart) {
        this.route = events.url;
      }
    });
  }

  groupMessages(messages: IMessage[]): void {
    this.messagesGrouped = [];

    const uniqueDates = [
      ...new Set(messages.map((message) => message.date)),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    uniqueDates.forEach((date) => {
      this.messagesGrouped.push({
        key: date,
        value: messages
          .filter((message) => message.date === date)
          .sort((a, b) => b.time.localeCompare(a.time)),
      });
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
