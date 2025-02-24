import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, switchMap } from 'rxjs';
import {
  CommonModalResponse,
  CommonModalType,
  ImageUsage,
} from 'src/app/core/models/enum';
import { IDownloadImage } from 'src/app/core/models/images';
import {
  ICalendarDays,
  ISaveTheDateUserInvite,
} from 'src/app/core/models/invites';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { toLocalDate } from 'src/app/shared/utils/tools';
import { CommonModule } from '@angular/common';
import { AccomodationComponent } from './accomodations/accomodation.component';

@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
  styleUrl: './save-the-date.component.css',
  imports: [AccomodationComponent, CommonModule],
})
export class SaveTheDateComponent {
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.visibilityState === 'hidden' && this.playAudio) {
      this.audio.pause();
    } else if (document.visibilityState === 'visible' && this.playAudio) {
      this.audio.play();
    }
  }

  counter = 0;

  // Variable to store the generated calendar HTML
  downloadImages: IDownloadImage[] = [];
  audio = new Audio();
  playAudio = false;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private filesService: FilesService,
    private invitesService: InvitesService,
    private elRef: ElementRef,
    private commonModalService: CommonModalService,
    @Inject(LOCALE_ID) private localeValue: string
  ) {}

  vm$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => this.invitesService.getInvite(id)),
    mergeMap((invite) =>
      combineLatest([
        this.settingsService.getEventSettings(invite.eventId),
        this.filesService.getFilesByEvent(invite.eventId),
      ]).pipe(
        map(([eventSettings, downloadedFiles]) => {
          return {
            invite,
            eventSettings,
            downloadedFiles,
          };
        })
      )
    ),
    map(({ invite, eventSettings, downloadedFiles }) => {
      const userInvite = {
        ...invite,
        dateOfEvent: toLocalDate(invite.dateOfEvent),
      } as ISaveTheDateUserInvite;

      const dateDictionary = this.generateCalendar(userInvite.dateOfEvent);

      const shortDate = new Intl.DateTimeFormat(this.localeValue, {
        month: 'long',
        year: 'numeric',
      }).format(new Date(userInvite.dateOfEvent));

      userInvite.maxDateOfConfirmation = userInvite.maxDateOfConfirmation.slice(
        0,
        userInvite.maxDateOfConfirmation.length - 1
      );

      const deadlineMet =
        new Date().getTime() >
        new Date(userInvite.maxDateOfConfirmation).getTime();

      const parsedEventSettings = {
        ...JSON.parse(eventSettings.settings),
        eventId: eventSettings.eventId,
      };

      const downloadAudio =
        downloadedFiles.eventAudios.length > 0
          ? downloadedFiles.eventAudios[0]
          : undefined;

      if (downloadAudio) this.audio = new Audio(downloadAudio.fileUrl);

      this.commonModalService
        .open({
          modalTitle: $localize`Nuestra canción`,
          modalBody: $localize`¿Desea reproducir el audio?`,
          modalType: CommonModalType.YesNo,
        })
        .subscribe((response) => {
          if (response === CommonModalResponse.Confirm) {
            this.reproduceAudio();
          }
        });

      this.downloadImages = downloadedFiles.eventImages.filter((image) =>
        window.innerWidth > 575
          ? image.imageUsage === ImageUsage.Desktop ||
            image.imageUsage === ImageUsage.Both
          : image.imageUsage === ImageUsage.Phone ||
            image.imageUsage === ImageUsage.Both
      );

      if (this.downloadImages.length > 0) {
        setInterval(() => {
          this.updateBackground();
        }, 5000);
      }

      this.elRef.nativeElement.style.setProperty(
        '--custom-primary-color',
        parsedEventSettings.primaryColor
      );

      this.elRef.nativeElement.style.setProperty(
        '--custom-secondary-color',
        parsedEventSettings.secondaryColor
      );

      return {
        shortDate,
        parsedEventSettings,
        userInvite,
        dateDictionary,
        deadlineMet,
      };
    })
  );

  updateBackground() {
    if (this.downloadImages.length > 0) {
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
  }

  generateCalendar(dateOfEvent: string) {
    const dateDictionary = [];

    const date = new Date(dateOfEvent);
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
        dateDictionary.push({
          weekNumber: dateDictionary.length,
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
        dateDictionary.push({
          weekNumber: dateDictionary.length,
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
        dateDictionary.push({
          weekNumber: dateDictionary.length,
          days: daysOfWeek,
        });
        daysOfWeek = [];
      }
    }

    return dateDictionary;
  }

  reproduceAudio() {
    this.playAudio = true;
    this.audio.play();
  }
}
