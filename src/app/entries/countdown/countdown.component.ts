import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  time!: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };

  finishDate: Date = new Date();

  subscription!: Subscription;

  ngOnInit(): void {
    this.time = {
      days: 0, hours: 0, minutes: 0, seconds: 0
    };

    this.finishDate = new Date('2023-11-18:19:00:00')
    
    this.subscription = interval(1000).subscribe(() => {
      this.updateTime();
    })
  }

  updateTime() {
    
    const now = new Date();
    const diff = this.finishDate.getTime() - now.getTime();
    console.log(diff)

    // Cálculos para sacar lo que resta hasta ese tiempo objetivo / final
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    const secs = Math.floor(diff / 1000);
    
    // La diferencia que se asignará para mostrarlo en la pantalla
    this.time.days = days;
    this.time.hours = hours - days * 24;
    this.time.minutes = mins - hours * 60;
    this.time.seconds = secs - mins * 60;
  }
  
}
