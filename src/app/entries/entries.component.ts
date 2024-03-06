import { Component, OnInit } from '@angular/core';
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

  constructor(private route: ActivatedRoute, 
      private router: Router,
      private loaderService: LoaderService) { 
    this.audio.src = '../../assets/soundtrack.mp3'
    this.audio.load()
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
      this.time = new Date(this.entryResolved.entry.dateOfEvent.replace('Z', '').replace('T', ' ')).toLocaleString('es-mx', {  hour: 'numeric', minute: 'numeric' })

      this.entryResolvedEmiter$.next(this.entryResolved)
      this.loaderService.setLoading(false);
    }).add(() => {
      this.loaderService.setLoading(false);
    })
  }

  playAudio(): void {
    const playButton = (document.querySelector('.audioButton i.fa-play') as HTMLElement)
    const pauseButton = (document.querySelector('.audioButton i.fa-pause') as HTMLElement)
    if (this.audio.paused) {
      this.audio.play()
      playButton.style.display = 'none'
      pauseButton.style.display = 'inline-block'
    } else {
      this.audio.pause()
      playButton.style.display = 'inline-block'
      pauseButton.style.display = 'none'
    }
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
