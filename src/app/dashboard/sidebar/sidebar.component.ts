import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEvent } from 'src/shared/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() events: IEvent[] = [];
  @Input() eventSelected!: IEvent;

  @Output() getEventInformation: EventEmitter<IEvent> = new EventEmitter();

  getEventEntries(id: string | undefined) {
    if (id) {
      this.getEventInformation.emit(this.events.find(event => event.id === id));
    } else {
      this.getEventInformation.emit(this.events.find(event => event.id === $("#selectEventInput").val()));
    }
  }
}
