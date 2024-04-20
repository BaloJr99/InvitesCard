import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoaderService } from 'src/core/services/loader.service';
import { IEntryResolved } from 'src/shared/interfaces';

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
  time = "";
  
  entryResolved!: IEntryResolved;
  entryResolvedEmiter$ = new Subject<IEntryResolved>();

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private loaderService: LoaderService,
    private meta: Meta) { 
    setInterval(() => {
      this.updateBackground();
    }, 5000);
  }
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);
    this.route.data.subscribe(() => {
      this.entryResolved = this.route.snapshot.data['entry'];
      this.meta.updateTag({property: 'og:title', content: 'YOUR_TITLE'});
      this.meta.updateTag({property: 'og:image', content: 'YOUR_IMAGE'});
      this.meta.updateTag({property: 'og:url', content: 'YOUR_URL'})
      if (!this.entryResolved.entry) {
        this.router.navigate(['/error/page-not-found'])
      }

      this.dayOfTheWeek = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', {  weekday: 'long' })
      this.shortDate = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', { day: 'numeric', month: 'long' })
      this.longDate = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', {  day: 'numeric', month: 'long', year: 'numeric' })
      this.time = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', {  hour: 'numeric', minute: 'numeric' })

      this.entryResolvedEmiter$.next(this.entryResolved)
      this.loaderService.setLoading(false);
    }).add(() => {
      this.loaderService.setLoading(false);
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
    if (this.counter > 14) {
      this.counter = 1;
    }

    const actualBackgroundImage:HTMLElement = document.querySelector(`.backgroundImage${this.counter}`) as HTMLElement;
    let oldBackgroundImage:HTMLElement;

    if (this.counter == 1) {
      
      oldBackgroundImage = document.querySelector(`.backgroundImage14`) as HTMLElement
    } else {
      oldBackgroundImage = document.querySelector(`.backgroundImage${this.counter - 1}`) as HTMLElement
    }

    actualBackgroundImage.style.visibility = "visible";
    oldBackgroundImage.style.visibility = "hidden";
  }
}
