import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { IEntryResolved } from 'src/shared/interfaces';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  title = 'invites';

  audio = new Audio()
  
  entryResolved!: IEntryResolved;
  entryResolvedEmiter$ = new Subject<IEntryResolved>();

  constructor(private route: ActivatedRoute) { 
    this.audio.src = '../../assets/soundtrack.mp3'
    this.audio.load()
  }
  
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.entryResolved = this.route.snapshot.data['entry'];
      this.entryResolvedEmiter$.next(this.entryResolved)
    })

    const audioButton = (document.querySelector('.audioButton') as HTMLButtonElement).click()
  }

  playAudio() {
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
}
