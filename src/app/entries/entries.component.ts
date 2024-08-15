import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ImagesService } from 'src/core/services/images.service';
import { LoaderService } from 'src/core/services/loader.service';
import { SettingsService } from 'src/core/services/settings.service';
import { IDownloadImages, IEntryResolved, ISettings } from 'src/shared/interfaces';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  title = 'invites';

  audio = new Audio()
  counter = 0;
    
  dayOfTheWeek = "";
  shortDate = "";
  longDate = "";
  
  entryResolved!: IEntryResolved;
  eventSettings: ISettings = {
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
    dressCodeColor: ''
  };

  downloadImages: IDownloadImages[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private loaderService: LoaderService,
    private eventSettingsService: SettingsService,
    private imagesService: ImagesService,
    private elRef: ElementRef) { 
    setInterval(() => {
      this.updateBackground();
    }, 5000);
  }
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);
    this.route.data.subscribe(() => {
      this.entryResolved = this.route.snapshot.data['entry'];
      if (!this.entryResolved.entry) {
        this.router.navigate(['/error/page-not-found'])
      }

      this.dayOfTheWeek = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', {  weekday: 'long' })
      this.shortDate = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', { day: 'numeric', month: 'long' })
      this.longDate = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', {  day: 'numeric', month: 'long', year: 'numeric' })

      combineLatest([
        this.eventSettingsService.getEventSettings(this.entryResolved.entry.eventId),
        this.imagesService.getImageByEvent(this.entryResolved.entry.eventId)
      ]).subscribe({
        next: ([eventSettings, downloadImages]) => {
          this.eventSettings = eventSettings;
          this.downloadImages = downloadImages;
          this.elRef.nativeElement.style.setProperty('--custom-primary-color', eventSettings.primaryColor);
          this.elRef.nativeElement.style.setProperty('--custom-secondary-color', eventSettings.secondaryColor);
        }
      }).add(() => {
        this.loaderService.setLoading(false);
      });
    })
  }

  goToForm(): void {
    document.getElementById("scrollToForm")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    })
  }

  updateBackground(){
    this.counter++;
    
    if (this.counter > this.downloadImages.length - 1) {
      this.counter = 0;
    }

    const nextBackgroundImage:HTMLElement = document.querySelector(`.backgroundImage${this.counter}`) as HTMLElement;
    let oldBackgroundImage:HTMLElement;

    if (this.counter == 0) {
      oldBackgroundImage = document.querySelector(`.backgroundImage${this.downloadImages.length - 1}`) as HTMLElement
    } else {
      oldBackgroundImage = document.querySelector(`.backgroundImage${this.counter - 1}`) as HTMLElement
    }

    if (oldBackgroundImage) {
      oldBackgroundImage.style.visibility = "hidden";
    }

    nextBackgroundImage.style.visibility = "visible";
  }
}
