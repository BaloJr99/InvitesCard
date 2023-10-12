import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  diffTime = Math.abs(new Date().valueOf() - new Date('2023-11-18:19:00:00').valueOf());
  
  ngOnInit(): void {
    setInterval(() => {
      this.updateDate();
    }, 1000);
  }

  updateDate(): void {
    this.days = this.diffTime / (24 * 60 * 60 * 1000);
    this.hours = (this.days % 1) * 24;
    this.minutes = (this.hours % 1) * 60;
    this.seconds = (this.minutes % 1) * 60;
    [ this.days, this.hours, this.minutes, this.seconds ] = 
      [
        Math.floor(this.days), 
        Math.floor(this.hours), 
        Math.floor(this.minutes), 
        Math.floor(this.seconds)
      ];

    this.diffTime = Math.abs(new Date().valueOf() - new Date('2023-11-18:19:00:00').valueOf());
  }
  
}
