import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ISetting } from '../../core/models/settings';
import { IDownloadImage } from '../../core/models/images';
import { LoaderService } from '../../core/services/loader.service';
import { SettingsService } from '../../core/services/settings.service';
import { ImagesService } from '../../core/services/images.service';
import { ImageUsage } from '../../core/models/enum';
import { IUserInvite } from '../../core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';

@Component({
  selector: 'app-sweet-xv',
  templateUrl: './sweet-xv.component.html',
  styleUrls: ['./sweet-xv.component.css'],
})
export class SweetXvComponent implements OnInit {
  counter = 0;

  dayOfTheWeek = '';
  shortDate = '';
  longDate = '';

  userInvite!: IUserInvite;
  eventSettings: ISetting = {
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
    this.loaderService.setLoading(true, $localize`Cargando invitación`);
    this.route.params.subscribe((params) => {
      const inviteId = params['id'];

      if (!inviteId) {
        this.router.navigate(['/error/page-not-found']);
      }

      this.invitesService.getInvite(inviteId).subscribe({
        next: (userInvite) => {
          this.userInvite = userInvite;

          this.userInvite.dateOfEvent = `${this.userInvite.dateOfEvent}T00:00:00`;
          this.userInvite.maxDateOfConfirmation = `${this.userInvite.maxDateOfConfirmation}T00:00:00`;

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
            this.eventSettingsService.getEventSettings(this.userInvite.eventId),
            this.imagesService.getImageByEvent(this.userInvite.eventId),
          ])
            .subscribe({
              next: ([eventSettings, downloadImages]) => {
                this.eventSettings = eventSettings;
                this.downloadImages = downloadImages.filter((image) =>
                  window.innerWidth > 575
                    ? image.imageUsage === ImageUsage.Desktop
                    : image.imageUsage === ImageUsage.Phone
                );
                this.elRef.nativeElement.style.setProperty(
                  '--custom-primary-color',
                  eventSettings.primaryColor
                );
                this.elRef.nativeElement.style.setProperty(
                  '--custom-secondary-color',
                  eventSettings.secondaryColor
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
}
