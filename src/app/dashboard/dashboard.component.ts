import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { IMessage, INotifications } from 'src/shared/interfaces';
import { SocketService } from 'src/core/services/socket.service';
import { LoaderService } from 'src/core/services/loader.service';
import { CommonEntriesService } from 'src/core/services/commonEntries.service';
import { NavigationStart, Router, Scroll } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private tokenService: TokenStorageService,
    private socket: SocketService,
    private loaderService: LoaderService,
    private commonEntriesService: CommonEntriesService,
    private router: Router) {    
    }
  
  messages: Map<number, IMessage> = new Map<number, IMessage>();
  notifications: INotifications[] = [];

  username = "";
  email = "";
  route = "";
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.username = userInformation.username;
      this.email = userInformation.email;
      this.socket.joinRoom(this.username);
    }

    window.addEventListener('click', ({ target }) => {
      const toggleMenu = document.querySelector(".menu");
      const toggleNotifications = document.querySelector(".notificationMessages");

      const clickedElement = target as HTMLElement;
      if (!clickedElement.classList.contains("notifications")
        && !clickedElement.classList.contains("fa-bell")
        && !clickedElement.classList.contains("account")
        && !clickedElement.classList.contains("fa-user")){
        if(!toggleMenu?.contains(clickedElement) && (!toggleNotifications?.contains(clickedElement))) {
          if (toggleNotifications && toggleNotifications.classList.contains("active")) {
            toggleNotifications.classList.toggle("active");
          }

          if (toggleMenu && toggleMenu.classList.contains("active")) {
            toggleMenu.classList.toggle("active");
          }
        }
      }
    });

    this.loaderService.setLoading(false);

    this.commonEntriesService.messages$.subscribe({
      next: (messages) => {
        this.messages = messages;
      }
    });

    this.commonEntriesService.notifications$.subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      }
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

  toggleMessages(): void {
    const toggleMessages = document.querySelector(".messages-chat");
    if (toggleMessages) {
      toggleMessages.classList.toggle("active");
    }
  }
}
