import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router, Scroll, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { INotification } from 'src/app/core/models/common';
import { Roles } from 'src/app/core/models/enum';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  private notifications = new BehaviorSubject<INotification[]>([]);
  notifications$ = this.notifications.asObservable();
  private route = new BehaviorSubject<string>('');
  route$ = this.route.asObservable();

  @Input() set notificationsValue(value: INotification[]) {
    this.notifications.next(value);
  }

  constructor(
    private router: Router,
    private invitesService: InvitesService,
    private tokenService: TokenStorageService,
    private commonService: CommonInvitesService
  ) {}

  vm$ = combineLatest([this.notifications$, this.route$]).pipe(
    map(([notifications, route]) => {
      const userInformation = this.tokenService.getTokenValues();

      const numberOfNotifications = notifications.reduce(
        (sum, { isMessageRead }) => sum + (isMessageRead ? 0 : 1),
        0
      );

      return {
        route,
        username: userInformation?.username || '',
        email: userInformation?.email || '',
        profilePhoto: userInformation?.profilePhoto,
        isAdmin:
          userInformation?.roles.some((r) => r.name == Roles.Admin) || false,
        numberOfNotifications,
        notifications,
      };
    })
  );

  ngOnInit(): void {
    this.route.next(this.router.url);
    this.router.events.subscribe((events) => {
      if (events instanceof Scroll) {
        this.route.next(events.routerEvent.url);
      }

      if (events instanceof NavigationStart) {
        this.route.next(events.url);
      }
    });
  }

  toggleMenu(): void {
    const toggleNotifications = document.querySelector('.notificationMessages');
    if (
      toggleNotifications &&
      toggleNotifications.classList.contains('active')
    ) {
      this.toggleNotifications();
    }

    const toggleMenu = document.querySelector('.menu');
    if (toggleMenu) {
      toggleMenu.classList.toggle('active');
    }
  }

  toggleNotifications(): void {
    const toggleMenu = document.querySelector('.menu');
    if (toggleMenu && toggleMenu.classList.contains('active')) {
      this.toggleMenu();
    }

    const toggleNotifications = document.querySelector('.notificationMessages');
    if (toggleNotifications) {
      toggleNotifications.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      toggleNotifications.classList.toggle('active');
    }
  }

  logout(): void {
    this.tokenService.signOut();
    this.router.navigate(['/auth/login']);
  }

  maskAsRead(id: string): void {
    const oldNotifications = this.notifications.value;
    const notificationIndex = oldNotifications.findIndex(
      (notification) => notification.id === id
    );

    this.invitesService.readMessage(id).subscribe({
      next: () => {
        oldNotifications[notificationIndex].isMessageRead = true;

        this.commonService.updateNotifications(oldNotifications, null);
        this.notifications.next(oldNotifications);
      },
    });
  }

  getTime(dateTime: string): string {
    const now = new Date();
    const dateOfNotification = new Date(dateTime);

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
      seconds: secs - mins * 60,
    };

    let timeSpan = '';
    let timeSpanValue = 0;
    if (time.years > 0) {
      timeSpan = time.years === 1 ? $localize`año` : $localize`años`;
      timeSpanValue = time.years;
    } else if (time.days > 0) {
      timeSpan = time.days === 1 ? $localize`día` : $localize`días`;
      timeSpanValue = time.days;
    } else if (time.hours > 0) {
      timeSpan = time.hours === 1 ? $localize`hora` : $localize`horas`;
      timeSpanValue = time.hours;
    } else if (time.minutes > 0) {
      timeSpan = time.minutes === 1 ? $localize`minuto` : $localize`minutos`;
      timeSpanValue = time.minutes;
    } else if (time.seconds > 0) {
      timeSpan = time.seconds === 1 ? $localize`segundo` : $localize`segundos`;
      timeSpanValue = time.seconds;
    }

    return $localize`Hace ${timeSpanValue} ${timeSpan}`;
  }

  getAccessibilityMessage(numberOfNotifications: number) {
    return $localize`Tienes ${numberOfNotifications} notificaciones sin leer`;
  }
}
