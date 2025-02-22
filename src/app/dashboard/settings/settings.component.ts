import { Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { IDropdownEvent } from 'src/app/core/models/events';
import { ISettingAction } from 'src/app/core/models/settings';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SettingsComponent {
  private events = new BehaviorSubject<IDropdownEvent[]>([]);
  events$ = this.events.asObservable();

  eventSettingAction: ISettingAction = {
    eventId: '',
    isNew: true,
    eventType: EventType.None,
  };

  constructor(private eventsService: EventsService) {}

  vm$ = this.eventsService.getDropdownEvents().pipe(
    map((events) => {
      this.events.next(events);
      return {
        events,
      };
    })
  );

  loadEventSettings() {
    const eventFound = this.events.value.find(
      (event) => event.id === $('#event-select').val()
    ) as IDropdownEvent;

    if (eventFound) {
      this.eventSettingAction = {
        eventId: eventFound.id,
        isNew: undefined,
        eventType: eventFound.typeOfEvent,
      };
    } else {
      this.eventSettingAction = {
        eventId: '',
        isNew: undefined,
        eventType: EventType.None,
      };
    }
  }

  showSelectEvent(): boolean {
    return this.eventSettingAction.eventType === EventType.None;
  }
}
