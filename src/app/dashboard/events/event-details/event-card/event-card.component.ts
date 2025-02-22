import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
  standalone: false,
})
export class EventCardComponent {
  @Input() number = 0;
  @Input() displayText = '';
  @Input() backgroundColor = '#ffffff';
}
