import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { InvitesService } from 'src/core/services/invites.service';
import { IEntry, IEntryResolved } from 'src/shared/interfaces';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  title = 'invites';

  audio = new Audio()
  counter = 0;
  
  entryResolved!: IEntryResolved;
  entryResolvedEmiter$ = new Subject<IEntryResolved>();

  constructor(private route: ActivatedRoute, private invitesService: InvitesService) { 
    this.audio.src = '../../assets/soundtrack.mp3'
    this.audio.load()
    setInterval(() => {
      this.updateBackground();
    }, 5000);
  }
  
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.entryResolved = this.route.snapshot.data['entry'];
      this.entryResolvedEmiter$.next(this.entryResolved)
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

  addNewEntry(newEntry: FormGroup) {
    if(this.entryResolved.entry?.at(0)?.id)
      this.invitesService.sendConfirmation(newEntry.value as IEntry, this.entryResolved.entry?.[0].id).subscribe();
  }
}
