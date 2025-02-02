import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ISweetXvSetting } from '../../core/models/settings';
import { IDownloadImage } from '../../core/models/images';
import { LoaderService } from '../../core/services/loader.service';
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
export class SweetXvComponent implements OnInit {
  counter = 0;

  dayOfTheWeek = '';
  shortDate = '';
  longDate = '';

  userInvite!: IUserInvite;
  eventSettings: ISweetXvSetting = {
    sections: [],
    eventId: '',
    primaryColor: '',
    secondaryColor: '',
    parents: '',
    godParents: '',
    firstSectionSentences: '',
    secondSectionSentences: '',
    massUrl: '',
    massTime: '',
    massAddress: '',
    receptionUrl: '',
    receptionTime: '',
    receptionPlace: '',
    receptionAddress: '',
    dressCodeColor: '',
  };

  downloadImages: IDownloadImage[] = [];

  deadlineMet = false;

  sections: IInviteSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private settingsService: SettingsService,
    private filesService: FilesService,
    private invitesService: InvitesService,
    private elRef: ElementRef,
    @Inject(LOCALE_ID) private localeValue: string
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const inviteId = params['id'];

      if (!inviteId) {
        this.router.navigate(['/error/page-not-found']);
      }

      this.invitesService.getInvite(inviteId).subscribe({
        next: (userInvite) => {
          this.userInvite = {
            ...userInvite,
            maxDateOfConfirmation: toLocalDate(
              userInvite.maxDateOfConfirmation
            ),
          } as IUserInvite;

          this.deadlineMet =
            new Date().getTime() >
            new Date(this.userInvite.maxDateOfConfirmation).getTime();

          this.dayOfTheWeek = new Intl.DateTimeFormat(this.localeValue, {
            weekday: 'long',
          }).format(new Date(this.userInvite.dateOfEvent));

          this.shortDate = new Intl.DateTimeFormat(this.localeValue, {
            day: 'numeric',
            month: 'long',
          }).format(new Date(this.userInvite.dateOfEvent));

          this.longDate = new Intl.DateTimeFormat(this.localeValue, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(this.userInvite.dateOfEvent));

          combineLatest([
            this.settingsService.getEventSettings(this.userInvite.eventId),
            this.filesService.getFilesByEvent(this.userInvite.eventId),
          ])
            .subscribe({
              next: ([eventSettings, downloadFiles]) => {
                const eventSettingsParsed = JSON.parse(eventSettings.settings);
                this.sections = eventSettingsParsed.sections;

                this.eventSettings = {
                  ...JSON.parse(eventSettings.settings),
                  eventId: eventSettings.eventId,
                };

                if (this.eventSettings.massTime) {
                  const dateOfMassTime =
                    this.eventSettings.massTime.split(' ')[0];
                  const timeOfMassTime =
                    this.eventSettings.massTime.split(' ')[1];
                  this.eventSettings.massTime = toLocalDate(
                    `${dateOfMassTime}T${timeOfMassTime}.000Z`
                  )
                    .split('T')[1]
                    .substring(0, 5);
                }

                if (this.eventSettings.receptionTime) {
                  const dateOfReceptionTime =
                    this.eventSettings.receptionTime.split(' ')[0];
                  const timeOfReceptionTime =
                    this.eventSettings.receptionTime.split(' ')[1];
                  this.eventSettings.receptionTime = toLocalDate(
                    `${dateOfReceptionTime}T${timeOfReceptionTime}.000Z`
                  )
                    .split('T')[1]
                    .substring(0, 5);
                }

                this.downloadImages = downloadFiles.eventImages.filter(
                  (image) =>
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
