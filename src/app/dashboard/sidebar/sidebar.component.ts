import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEvent } from 'src/shared/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() events: IEvent[] = [];

  @Output() getEventInformation: EventEmitter<string> = new EventEmitter();

  getEventEntries(id: string) {
    this.events.map((event) => {
      if (event.id === id) {
        event.selected = true;
      } else {
        event.selected = false;
      }
    });

    this.getEventInformation.emit(id);
  }
}
