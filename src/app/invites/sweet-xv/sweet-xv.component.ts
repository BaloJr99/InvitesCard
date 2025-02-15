import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, switchMap } from 'rxjs';
import { IDownloadImage } from '../../core/models/images';
import { SettingsService } from '../../core/services/settings.service';
import { FilesService } from '../../core/services/files.service';
import { ImageUsage } from '../../core/models/enum';
import { IInviteSection, IUserInvite } from '../../core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { toLocalDate } from 'src/app/shared/utils/tools';

@Component({
  selector: 'app-sweet-xv',
  templateUrl: './sweet-xv.component.html',
  styleUrls: ['./sweet-xv.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SweetXvComponent {
  counter = 0;

  downloadImages: IDownloadImage[] = [];
  sections: IInviteSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private filesService: FilesService,
    private invitesService: InvitesService,
    private elRef: ElementRef,
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
        maxDateOfConfirmation: toLocalDate(invite.maxDateOfConfirmation),
      } as IUserInvite;

      const deadlineMet =
        new Date().getTime() >
        new Date(userInvite.maxDateOfConfirmation).getTime();

      const dayOfTheWeek = new Intl.DateTimeFormat(this.localeValue, {
        weekday: 'long',
      }).format(new Date(userInvite.dateOfEvent));

      const shortDate = new Intl.DateTimeFormat(this.localeValue, {
        day: 'numeric',
        month: 'long',
      }).format(new Date(userInvite.dateOfEvent));

      const longDate = new Intl.DateTimeFormat(this.localeValue, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(userInvite.dateOfEvent));

      const eventSettingsParsed = JSON.parse(eventSettings.settings);
      this.sections = eventSettingsParsed.sections;

      const parsedEventSettings = {
        ...JSON.parse(eventSettings.settings),
        eventId: eventSettings.eventId,
      };

      if (parsedEventSettings.massTime) {
        const dateOfMassTime = parsedEventSettings.massTime.split(' ')[0];
        const timeOfMassTime = parsedEventSettings.massTime.split(' ')[1];
        parsedEventSettings.massTime = toLocalDate(
          `${dateOfMassTime}T${timeOfMassTime}.000Z`
        )
          .split('T')[1]
          .substring(0, 5);
      }

      if (parsedEventSettings.receptionTime) {
        const dateOfReceptionTime =
          parsedEventSettings.receptionTime.split(' ')[0];
        const timeOfReceptionTime =
          parsedEventSettings.receptionTime.split(' ')[1];
        parsedEventSettings.receptionTime = toLocalDate(
          `${dateOfReceptionTime}T${timeOfReceptionTime}.000Z`
        )
          .split('T')[1]
          .substring(0, 5);
      }

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
        dayOfTheWeek,
        shortDate,
        longDate,
        parsedEventSettings,
        userInvite,
        deadlineMet,
      };
    })
  );

  goToForm(): void {
    document.getElementById('scrollToForm')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
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

  sectionEnabled(sectionId: string): boolean {
    if (this.sections && this.sections.length > 0) {
      const sectionFound = this.sections.find(
        (s) => s.sectionId === sectionId
      ) as IInviteSection;
      return sectionFound.selected;
    }
    return false;
  }

  getSectionOrder(sectionId: string) {
    if (this.sections && this.sections.length > 0) {
      const sectionFound = this.sections.find(
        (s) => s.sectionId === sectionId
      ) as IInviteSection;
      return sectionFound.order;
    }
    return 0;
  }
}
