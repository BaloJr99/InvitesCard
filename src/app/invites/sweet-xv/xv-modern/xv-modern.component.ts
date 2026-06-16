import {
  Component,
  ElementRef,
  HostListener,
  LOCALE_ID,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { CountdownComponent } from '../../shared/countdown/countdown.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { FilesService } from 'src/app/core/services/files.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { IInviteSection, IUserInvite } from 'src/app/core/models/invites';
import { toLocalDate } from 'src/app/shared/utils/tools';
import {
  CommonModalResponse,
  CommonModalType,
  ImageUsage,
} from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/common-modal.service';

@Component({
  selector: 'app-xv-modern',
  templateUrl: './xv-modern.component.html',
  styleUrls: ['./xv-modern.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, CountdownComponent, SafePipe],
})
export class SweetXvModernComponent {
  private route = inject(ActivatedRoute);
  private settingsService = inject(SettingsService);
  private filesService = inject(FilesService);
  private invitesService = inject(InvitesService);
  private commonModalService = inject(CommonModalService);
  private elRef = inject(ElementRef);
  private localeValue = inject(LOCALE_ID);

  counter = 0;
  selectedSection = 'envelope';

  audio = new Audio();
  playAudio = false;
  sections: IInviteSection[] = [];

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
        }),
      ),
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
          `${dateOfMassTime}T${timeOfMassTime}.000Z`,
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
          `${dateOfReceptionTime}T${timeOfReceptionTime}.000Z`,
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
      }

      const backgroundImage = downloadedFiles.eventImages.find((image) =>
        window.innerWidth > 575
          ? image.imageUsage === ImageUsage.Desktop ||
            image.imageUsage === ImageUsage.Both
          : image.imageUsage === ImageUsage.Phone ||
            image.imageUsage === ImageUsage.Both,
      );

      const sectionBackgroundImage = downloadedFiles.eventImages.find(
        (image) =>
          window.innerWidth > 575
            ? undefined
            : image.imageUsage === ImageUsage.SectionBackground,
      );

      const decoration1 = downloadedFiles.eventImages.filter(
        (image) => image.imageUsage == ImageUsage.Decoration_1,
      )?.[0];

      const decoration2 = downloadedFiles.eventImages.filter(
        (image) => image.imageUsage == ImageUsage.Decoration_2,
      )?.[0];

      const enabledSectionIds = this.sections
        .filter((section) => section.selected)
        .sort((a, b) => a.order - b.order)
        .map((section) => section.sectionId);

      const sectionDecorationStyles = enabledSectionIds.reduce(
        (map, sectionId, index) => {
          if (index > 0 && index % 2 === 1) {
            map[sectionId] = {
              decoration1: decoration1
                ? this.buildDecorationStyle(decoration1.fileUrl, 'left')
                : null,
              decoration2: decoration2
                ? this.buildDecorationStyle(decoration2.fileUrl, 'right')
                : null,
            };
          }
          return map;
        },
        {} as Record<
          string,
          {
            decoration1: {
              fileUrl: string;
              style: Record<string, string>;
            } | null;
            decoration2: {
              fileUrl: string;
              style: Record<string, string>;
            } | null;
          }
        >,
      );

      this.elRef.nativeElement.style.setProperty(
        '--custom-primary-color',
        parsedEventSettings.primaryColor,
      );
      this.elRef.nativeElement.style.setProperty(
        '--custom-secondary-color',
        parsedEventSettings.secondaryColor,
      );

      return {
        dayOfTheWeek,
        shortDate,
        longDate,
        parsedEventSettings,
        userInvite,
        deadlineMet,
        sectionDecorationStyles,
        backgroundImage,
        sectionBackgroundImage,
      };
    }),
  );

  scrollToSection(sectionId: string): void {
    this.selectedSection = sectionId;
    this.scrollToElement(sectionId);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const menuHeight = 70;
    const sections = ['envelope', 'invitation'];

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (!element) {
        continue;
      }
      const rect = element.getBoundingClientRect();
      if (rect.top <= menuHeight && rect.bottom > menuHeight) {
        this.selectedSection = sectionId;
        return;
      }
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (!element) {
      return;
    }
    const offset = 70;
    const targetPosition =
      window.scrollY + element.getBoundingClientRect().top - offset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }

  sectionEnabled(sectionId: string): boolean {
    if (this.sections && this.sections.length > 0) {
      const sectionFound = this.sections.find(
        (s) => s.sectionId === sectionId,
      ) as IInviteSection;
      return sectionFound.selected;
    }
    return false;
  }

  getSectionOrder(sectionId: string) {
    if (this.sections && this.sections.length > 0) {
      const sectionFound = this.sections.find(
        (s) => s.sectionId === sectionId,
      ) as IInviteSection;
      return sectionFound.order;
    }
    return 0;
  }

  private buildDecorationStyle(
    fileUrl: string,
    half: 'left' | 'right',
  ): { fileUrl: string; style: Record<string, string> } {
    const top = this.getRandomInt(8, 38);
    const horizontal = this.getRandomInt(6, 18);
    const rotation = this.getRandomInt(-22, 22);

    return {
      fileUrl,
      style: {
        top: `${top}%`,
        [half]: `${horizontal}%`,
        transform: `rotate(${rotation}deg)`,
      },
    };
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  reproduceAudio() {
    this.playAudio = true;
    this.audio.play();
  }
}
