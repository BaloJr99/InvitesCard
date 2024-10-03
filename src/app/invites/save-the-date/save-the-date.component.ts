import { Component, ElementRef, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ImageUsage } from 'src/app/core/models/enum';
import { IDownloadImage } from 'src/app/core/models/images';
import {
  ICalendarDays,
  ICalendarWeeks,
  IUserInvite,
} from 'src/app/core/models/invites';
import { ISaveTheDateSetting } from 'src/app/core/models/settings';
import { ImagesService } from 'src/app/core/services/images.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
  styleUrl: './save-the-date.component.css',
})
export class SaveTheDateComponent {
  counter = 0;

  userInvite!: IUserInvite;
  eventSettings: ISaveTheDateSetting = {
    eventId: '',
    primaryColor: '',
    secondaryColor: '',
    receptionPlace: '',
  };

  shortDate = '';
  // Variable to store the generated calendar HTML
  dateDictionary: ICalendarWeeks[] = [];
  downloadImages: IDownloadImage[] = [];

  deadlineMet = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private eventSettingsService: SettingsService,
    private imagesService: ImagesService,
    private invitesService: InvitesService,
    private elRef: ElementRef,
    @Inject(LOCALE_ID) private localeValue: string
  ) {
    setInterval(() => {
      this.updateBackground();
    }, 5000);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const inviteId = params['id'];

      if (!inviteId) {
        this.router.navigate(['/error/page-not-found']);
      }

      this.invitesService.getInvite(inviteId).subscribe({
        next: (userInvite) => {
          this.userInvite = userInvite;

          this.userInvite.dateOfEvent = this.userInvite.dateOfEvent.slice(
            0,
            this.userInvite.dateOfEvent.length - 1
          );

          this.generateCalendar();

          this.shortDate = new Intl.DateTimeFormat(this.localeValue, {
            month: 'long',
            year: 'numeric',
          }).format(new Date(this.userInvite.dateOfEvent));

          this.userInvite.maxDateOfConfirmation =
            this.userInvite.maxDateOfConfirmation.slice(
              0,
              this.userInvite.maxDateOfConfirmation.length - 1
            );

          this.deadlineMet =
            new Date().getTime() >
            new Date(this.userInvite.maxDateOfConfirmation).getTime();

          combineLatest([
            this.eventSettingsService.getEventSettings(this.userInvite.eventId),
            this.imagesService.getImageByEvent(this.userInvite.eventId),
          ])
            .subscribe({
              next: ([eventSettings, downloadImages]) => {
                this.eventSettings = {
                  ...JSON.parse(eventSettings.settings),
                  eventId: eventSettings.eventId,
                };
                this.downloadImages = downloadImages.filter((image) =>
                  window.innerWidth > 575
                    ? image.imageUsage === ImageUsage.Desktop
                    : image.imageUsage === ImageUsage.Phone
                );
                this.elRef.nativeElement.style.setProperty(
                  '--custom-primary-color',
                  this.eventSettings.primaryColor
                );
                this.elRef.nativeElement.style.setProperty(
                  '--custom-secondary-color',
                  this.eventSettings.secondaryColor
                );
              },
            })
            .add(() => {
              this.loaderService.setLoading(false);
            });
        },
      });
    });
  }

  updateBackground() {
    this.counter++;

    if (this.counter > this.downloadImages.length - 1) {
      this.counter = 0;
    }

    const nextBackgroundImage: HTMLElement = document.querySelector(
      `.backgroundImage${this.counter}`
    ) as HTMLElement;
    let oldBackgroundImage: HTMLElement;

    if (this.counter == 0) {
      oldBackgroundImage = document.querySelector(
        `.backgroundImage${this.downloadImages.length - 1}`
      ) as HTMLElement;
    } else {
      oldBackgroundImage = document.querySelector(
        `.backgroundImage${this.counter - 1}`
      ) as HTMLElement;
    }

    if (oldBackgroundImage) {
      oldBackgroundImage.style.visibility = 'hidden';
    }

    nextBackgroundImage.style.visibility = 'visible';
  }

  generateCalendar() {
    const date = new Date(this.userInvite.dateOfEvent);
    // Get the first day of the month
    let dayone = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    // Get the last date of the month
    let lastdate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    // Get the day of the last date of the month
    let dayend = new Date(
      date.getFullYear(),
      date.getMonth(),
      lastdate
    ).getDay();

    // Get the last date of the previous month
    let monthlastdate = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();

    let daysOfWeek: ICalendarDays[] = [];

    // Loop to add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
      daysOfWeek.push({
        day: 0,
        isDateOfEvent: false,
        show: false,
      });

      if (daysOfWeek.length % 7 == 0 && daysOfWeek.length > 0) {
        this.dateDictionary.push({
          weekNumber: this.dateDictionary.length,
          days: daysOfWeek,
        });
        daysOfWeek = [];
      }
    }

    // Loop to add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {
      daysOfWeek.push({
        day: i,
        isDateOfEvent: i == date.getDate(),
        show: true,
      });

      if (daysOfWeek.length % 7 == 0 && daysOfWeek.length > 0) {
        this.dateDictionary.push({
          weekNumber: this.dateDictionary.length,
          days: daysOfWeek,
        });
        daysOfWeek = [];
      }
    }

    // Loop to add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
      daysOfWeek.push({
        day: 0,
        isDateOfEvent: false,
        show: false,
      });

      if (daysOfWeek.length % 7 == 0 && daysOfWeek.length > 0) {
        this.dateDictionary.push({
          weekNumber: this.dateDictionary.length,
          days: daysOfWeek,
        });
        daysOfWeek = [];
      } 
    }
  }
}
