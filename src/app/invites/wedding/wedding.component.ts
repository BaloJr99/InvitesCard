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
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WeddingComponent {
  counter = 0;

  audio = new Audio();
  playAudio = false;

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
        dateOfEvent: toLocalDate(invite.dateOfEvent),
        maxDateOfConfirmation: toLocalDate(invite.maxDateOfConfirmation),
      } as IUserInvite;

      const deadlineMet =
        new Date().getTime() > new Date(invite.maxDateOfConfirmation).getTime();

      const dayOfTheWeek = new Intl.DateTimeFormat(this.localeValue, {
        weekday: 'long',
      }).format(new Date(invite.dateOfEvent));

      const shortDate = new Intl.DateTimeFormat(this.localeValue, {
        day: 'numeric',
        month: 'long',
      }).format(new Date(invite.dateOfEvent));

      const fullEventSettings = JSON.parse(eventSettings.settings);
      this.sections = fullEventSettings.sections;

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

      if (parsedEventSettings.venueTime) {
        const dateOfVenueTime = parsedEventSettings.venueTime.split(' ')[0];
        const timeOfVenueTime = parsedEventSettings.venueTime.split(' ')[1];
        parsedEventSettings.venueTime = toLocalDate(
          `${dateOfVenueTime}T${timeOfVenueTime}.000Z`
        )
          .split('T')[1]
          .substring(0, 5);
      }

      if (parsedEventSettings.civilTime) {
        const dateOfCivilTime = parsedEventSettings.civilTime.split(' ')[0];
        const timeOfCivilTime = parsedEventSettings.civilTime.split(' ')[1];
        parsedEventSettings.civilTime = toLocalDate(
          `${dateOfCivilTime}T${timeOfCivilTime}.000Z`
        )
          .split('T')[1]
          .substring(0, 5);
      }

      const downloadAudio =
        downloadedFiles.eventAudios.length > 0
          ? downloadedFiles.eventAudios[0]
          : undefined;

      if (downloadAudio) {
        this.audio = new Audio(downloadAudio.fileUrl);
        this.audio.volume = 0.5;
      }

      const mainImage =
        window.innerWidth > 575
          ? (downloadedFiles.eventImages.find(
              (image) => image.imageUsage === ImageUsage.Principal_Desktop
            ) as IDownloadImage)
          : (downloadedFiles.eventImages.find(
              (image) => image.imageUsage === ImageUsage.Principal_Phone
            ) as IDownloadImage);

      const gallery = downloadedFiles.eventImages.filter(
        (image) => image.imageUsage === ImageUsage.Gallery
      );

      this.elRef.nativeElement.style.setProperty(
        '--custom-primary-color',
        parsedEventSettings.weddingPrimaryColor
      );
      this.elRef.nativeElement.style.setProperty(
        '--custom-secondary-color',
        parsedEventSettings.weddingSecondaryColor
      );
      this.elRef.nativeElement.style.setProperty(
        '--custom-light-primary-color',
        `${parsedEventSettings.weddingPrimaryColor}80`
      );
      this.elRef.nativeElement.style.setProperty(
        '--custom-light-secondary-color',
        `${parsedEventSettings.weddingSecondaryColor}80`
      );

      return {
        dayOfTheWeek,
        shortDate,
        parsedEventSettings,
        userInvite,
        deadlineMet,
        mainImage,
        gallery,
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

  sectionEnabled(sectionId: string): boolean {
    if (this.sections && this.sections.length > 0) {
      const sectionFound = this.sections.find(
        (s) => s.sectionId === sectionId
      ) as IInviteSection;
      if (sectionFound) {
        return sectionFound.selected;
      }
      return false;
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

  copyText(text: string) {
    navigator.clipboard.writeText(text.replaceAll('-', ''));
  }

  reproduceAudio() {
    this.playAudio = !this.playAudio;
    if (this.playAudio) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }
}
