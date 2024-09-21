import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ISetting } from '../core/models/settings';
import { IDownloadImage } from '../core/models/images';
import { LoaderService } from '../core/services/loader.service';
import { SettingsService } from '../core/services/settings.service';
import { ImagesService } from '../core/services/images.service';
import { ImageUsage } from '../core/models/enum';
import { IInviteResolved } from '../core/models/invites';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css'],
})
export class InvitesComponent implements OnInit {
  title = 'invites';

  audio = new Audio();
  counter = 0;

  dayOfTheWeek = '';
  shortDate = '';
  longDate = '';

  inviteResolved!: IInviteResolved;
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
    private elRef: ElementRef,
    @Inject(LOCALE_ID) private localeValue: string
  ) {
    setInterval(() => {
      this.updateBackground();
    }, 5000);
  }

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando invitación`);
    this.route.data.subscribe(() => {
      this.inviteResolved = this.route.snapshot.data['invite'];
      if (!this.inviteResolved.invite) {
        this.router.navigate(['/error/page-not-found']);
      }

      this.deadlineMet =
        new Date().getTime() >
        new Date(this.inviteResolved.invite.maxDateOfConfirmation).getTime();

      this.dayOfTheWeek = new Date(
        this.inviteResolved.invite.dateOfEvent
      ).toLocaleString(this.localeValue, { weekday: 'long' });
      this.shortDate = new Date(
        this.inviteResolved.invite.dateOfEvent
      ).toLocaleString(this.localeValue, { day: 'numeric', month: 'long' });
      this.longDate = new Date(
        this.inviteResolved.invite.dateOfEvent
      ).toLocaleString(this.localeValue, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      combineLatest([
        this.eventSettingsService.getEventSettings(
          this.inviteResolved.invite.eventId
        ),
        this.imagesService.getImageByEvent(this.inviteResolved.invite.eventId),
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
