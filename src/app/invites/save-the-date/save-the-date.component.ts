import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import {
  CommonModalResponse,
  CommonModalType,
  ImageUsage,
} from 'src/app/core/models/enum';
import { IDownloadAudio, IDownloadImage } from 'src/app/core/models/images';
import {
  ICalendarDays,
  ICalendarWeeks,
  ISaveTheDateUserInvite,
} from 'src/app/core/models/invites';
import { ISaveTheDateSetting } from 'src/app/core/models/settings';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
  styleUrl: './save-the-date.component.css',
})
export class SaveTheDateComponent implements OnInit {
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.visibilityState === 'hidden' && this.downloadAudio) {
      this.audio.pause();
    } else if (document.visibilityState === 'visible' && this.downloadAudio) {
      this.audio.play();
    }
  }

  counter = 0;

  userInvite!: ISaveTheDateUserInvite;
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
  downloadAudio: IDownloadAudio | undefined = undefined;
  audio = new Audio();

  deadlineMet = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private eventSettingsService: SettingsService,
    private filesService: FilesService,
    private invitesService: InvitesService,
    private elRef: ElementRef,
    private commonModalService: CommonModalService,
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
          this.userInvite = userInvite as ISaveTheDateUserInvite;

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
            this.filesService.getFilesByEvent(this.userInvite.eventId),
          ])
            .subscribe({
              next: ([eventSettings, downloadFiles]) => {
                this.eventSettings = {
                  ...JSON.parse(eventSettings.settings),
                  eventId: eventSettings.eventId,
                };

                this.downloadAudio =
                  downloadFiles.eventAudios.length > 0
                    ? downloadFiles.eventAudios[0]
                    : undefined;
                if (this.downloadAudio) {
                  this.audio = new Audio(this.downloadAudio.fileUrl);

                  this.commonModalService.setData({
                    modalTitle: $localize`Nuestra canción`,
                    modalBody: $localize`¿Desea reproducir el audio?`,
                    modalType: CommonModalType.YesNo,
                  });

                  this.commonModalService.commonModalResponse$.subscribe(
                    (response) => {
                      if (response === CommonModalResponse.Confirm) {
                        this.reproduceAudio();
                      }
                    }
                  );
                }

                this.downloadImages = downloadFiles.eventImages.filter(
                  (image) =>
                    window.innerWidth > 575
                      ? image.imageUsage === ImageUsage.Desktop ||
                        image.imageUsage === null
                      : image.imageUsage === ImageUsage.Phone ||
                        image.imageUsage === null
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
    const dayone = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    // Get the last date of the month
    const lastdate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    // Get the day of the last date of the month
    const dayend = new Date(
      date.getFullYear(),
      date.getMonth(),
      lastdate
    ).getDay();

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

  reproduceAudio() {
    this.audio.play();
  }
}
