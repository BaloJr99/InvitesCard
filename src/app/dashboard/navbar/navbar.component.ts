import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router, Scroll } from '@angular/router';
import { INotification } from 'src/app/core/models/common';
import { Roles } from 'src/app/core/models/enum';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  email = "";
  username = "";
  @Input() notifications: INotification[] = [];

  numberOfNotifications = 0;
  route = "";
  isAdmin = false;

  constructor(
    private router: Router, 
    private tokenService: TokenStorageService) { }

  ngOnInit(): void {
    this.router.events.subscribe((events) => {
      if (events instanceof Scroll) {
        this.route = events.routerEvent.url;
      }
      
      if (events instanceof NavigationStart) {
        this.route = events.url;
      }
    });

    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.username = userInformation.username;
      this.email = userInformation.email;
      this.isAdmin = userInformation.roles.some(r => r.name == Roles.Admin);
    }
  }

  toggleMenu(): void {
    const toggleNotifications = document.querySelector(".notificationMessages");
    if (toggleNotifications && toggleNotifications.classList.contains("active")) {
      this.toggleNotifications();
    }

    const toggleMenu = document.querySelector(".menu");
    if (toggleMenu) {
      toggleMenu.classList.toggle("active");
    }
  }

  toggleNotifications(): void {
    const toggleMenu = document.querySelector(".menu");
    if (toggleMenu && toggleMenu.classList.contains("active")) {
      this.toggleMenu()
    }

    const toggleNotifications = document.querySelector(".notificationMessages");
    if (toggleNotifications) {
      toggleNotifications.classList.toggle("active");
    }
  }

  logout(): void {
    this.tokenService.signOut();
    this.router.navigate(['/auth/login']);
  }

  getTime(dateTime: string): string {
    const now = new Date();
    const dateOfNotification = new Date(dateTime.replace('Z', '').replace('T', ' '))

    const diff = now.getTime() - dateOfNotification.getTime();

    // Cálculos para sacar lo que resta hasta ese tiempo objetivo / final
    const years = now.getFullYear() - dateOfNotification.getFullYear();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    const secs = Math.floor(diff / 1000);

    // La diferencia que se asignará para mostrarlo en la pantalla
    const time = {
      years,
      days, 
      hours: hours - days * 24, 
      minutes: mins - hours * 60, 
      seconds: secs - mins * 60
    };

    if (time.years > 0) {
      return $localize `Hace ${ time.years } ${ time.years === 1 ? 'año' : 'años'}`
    } else if (time.days > 0) {
      return $localize `Hace ${ time.days } ${ time.days === 1 ? 'día' : 'días'}`
    } else if (time.hours > 0) {
      return $localize `Hace ${ time.hours } ${ time.hours === 1 ? 'hora' : 'horas'}`
    } else if (time.minutes > 0) {
      return $localize `Hace ${ time.minutes } ${ time.minutes === 1 ? 'minuto' : 'minutos'}`
    } else if (time.seconds > 0) {
      return $localize `Hace ${ time.seconds } ${ time.seconds === 1 ? 'segundo' : 'segundos'}`
    }

    return '';
  }
}
