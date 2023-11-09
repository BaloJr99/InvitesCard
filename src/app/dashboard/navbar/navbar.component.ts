import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EntriesService } from 'src/core/services/entries.service';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { INotifications } from 'src/shared/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnChanges {

  @Input() email = "";
  @Input() username = "";
  @Output() searchEntries = new EventEmitter<string>();
  @Input() notifications: INotifications[] = [];
  numberOfNotifications = 0;

  searchForm!: FormGroup;

  constructor(
    private router: Router, 
    private tokenService: TokenStorageService, 
    private fb: FormBuilder,
    private entriesService: EntriesService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: ""
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["notifications"].currentValue.length > 0) {
      const notifications:INotifications[] = changes["notifications"].currentValue
      this.numberOfNotifications = notifications.reduce(( sum, { isMessageRead } ) => sum + ( isMessageRead ? 0 : 1) , 0)
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
    this.router.navigate(['/account/login']);
  }

  search(): void {
    this.searchEntries.emit(this.searchForm.get("searchInput")?.value)
    this.searchForm.reset();
  }

  maskAsRead(id: string): void {
    this.entriesService.readMessage(id).subscribe({
      next: () => {
        this.notifications = this.notifications.map((notification) => 
        notification.id === id ? { ...notification, isMessageRead: true } : notification)

        this.numberOfNotifications = this.notifications.reduce(( sum, { isMessageRead } ) => sum + ( isMessageRead ? 0 : 1) , 0)
      }
    });
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
      return `Hace ${ time.years } ${ time.years === 1 ? 'año' : 'años'}`
    } else if (time.days > 0) {
      return `Hace ${ time.days } ${ time.days === 1 ? 'día' : 'días'}`
    } else if (time.hours > 0) {
      return `Hace ${ time.hours } ${ time.hours === 1 ? 'hora' : 'horas'}`
    } else if (time.minutes > 0) {
      return `Hace ${ time.minutes } ${ time.minutes === 1 ? 'minuto' : 'minutos'}`
    } else if (time.seconds > 0) {
      return `Hace ${ time.seconds } ${ time.seconds === 1 ? 'segundo' : 'segundos'}`
    }

    return '';
  }
}
