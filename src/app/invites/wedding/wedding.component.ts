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
import { IDownloadAudio, IDownloadImage } from '../../core/models/images';
import { LoaderService } from '../../core/services/loader.service';
import { SettingsService } from '../../core/services/settings.service';
import { FilesService } from '../../core/services/files.service';
import { ImageUsage } from '../../core/models/enum';
import { IInviteSection, IUserInvite } from '../../core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { IWeddingSetting } from 'src/app/core/models/settings';
import { toLocalDate } from 'src/app/shared/utils/tools';

@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WeddingComponent implements OnInit {
  counter = 0;

  dayOfTheWeek = '';
  shortDate = '';
  longDate = '';

  inviteOpened = false;

  userInvite!: IUserInvite;
  eventSettings: IWeddingSetting = {
    sections: [],
    eventId: '',
    primaryColor: '',
    secondaryColor: '',
    weddingPrimaryColor: '',
    weddingSecondaryColor: '',
    weddingCopyMessage: '',
    receptionPlace: '',
    groomParents: '',
    brideParents: '',
    massUrl: '',
    massTime: '',
    massPlace: '',
    venueUrl: '',
    venueTime: '',
    venuePlace: '',
    civilPlace: '',
    civilTime: '',
    civilUrl: '',
    dressCodeColor: '',
    copyMessage: '',
    hotelInformation: '',
    hotelName: '',
    hotelAddress: '',
    hotelPhone: '',
    hotelUrl: '',
    cardNumber: '',
    clabeBank: '',
  };

  gallery: IDownloadImage[] = [];
  mainImage: IDownloadImage | undefined;

  downloadAudio: IDownloadAudio | undefined = undefined;
  audio = new Audio();
  playAudio = false;

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
            dateOfEvent: toLocalDate(this.localeValue, userInvite.dateOfEvent),
            maxDateOfConfirmation: toLocalDate(
              this.localeValue,
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

                this.downloadAudio =
                  downloadFiles.eventAudios.length > 0
                    ? downloadFiles.eventAudios[0]
                    : undefined;

                if (this.downloadAudio) {
                  this.audio = new Audio(this.downloadAudio.fileUrl);
                  this.audio.volume = 0.5;
                }

                this.mainImage =
                  window.innerWidth > 575
                    ? (downloadFiles.eventImages.find(
                        (image) =>
                          image.imageUsage === ImageUsage.Principal_Desktop
                      ) as IDownloadImage)
                    : (downloadFiles.eventImages.find(
                        (image) =>
                          image.imageUsage === ImageUsage.Principal_Phone
                      ) as IDownloadImage);

                this.gallery = downloadFiles.eventImages.filter(
                  (image) => image.imageUsage === ImageUsage.Gallery
                );

                this.elRef.nativeElement.style.setProperty(
                  '--custom-primary-color',
                  this.eventSettings.weddingPrimaryColor
                );
                this.elRef.nativeElement.style.setProperty(
                  '--custom-secondary-color',
                  this.eventSettings.weddingSecondaryColor
                );
                this.elRef.nativeElement.style.setProperty(
                  '--custom-light-primary-color',
                  `${this.eventSettings.weddingPrimaryColor}80`
                );
                this.elRef.nativeElement.style.setProperty(
                  '--custom-light-secondary-color',
                  `${this.eventSettings.weddingSecondaryColor}80`
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
