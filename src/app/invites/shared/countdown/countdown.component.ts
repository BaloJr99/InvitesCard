import { Component, Input } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { ITimer } from 'src/app/core/models/invites';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css'],
  standalone: false,
})
export class CountdownComponent {
  time$ = new BehaviorSubject<ITimer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  @Input() set dateOfEventValue(value: string) {
    if (value) {
      interval(1000).subscribe(() => {
        this.finishDate = new Date(value);
        this.updateTime();
      });
    }
  }

  finishDate: Date = new Date();

  eventWasMet = false;

  updateTime() {
    const now = new Date();
    const diff = this.finishDate.getTime() - now.getTime();

    // Cálculos para sacar lo que resta hasta ese tiempo objetivo / final
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let mins = Math.floor(diff / (1000 * 60));
    let secs = Math.floor(diff / 1000);

    days = days > 0 ? days : 0;
    hours = hours > 0 ? hours : 0;
    mins = mins > 0 ? mins : 0;
    secs = secs > 0 ? secs : 0;

    // La diferencia que se asignará para mostrarlo en la pantalla
    const time = {
      days,
      hours: hours - days * 24,
      minutes: mins - hours * 60,
      seconds: secs - mins * 60,
    };

    this.eventWasMet =
      time.days === 0 &&
      time.hours === 0 &&
      time.minutes === 0 &&
      time.seconds === 0;
    this.time$.next(time);
  }
}
