import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { EventType, Roles } from 'src/app/core/models/enum';
import { IDashboardEvent, IEventAction } from 'src/app/core/models/events';
import { EventsService } from 'src/app/core/services/events.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { toLocalDate } from 'src/app/shared/utils/tools';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventModalComponent } from './event-modal/event-modal.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [CommonModule, EventModalComponent, DateFormatPipe, RouterModule],
})
export class EventsComponent {
  constructor(
    private eventsService: EventsService,
    private tokenService: TokenStorageService
  ) {}

  private baseEvent = {
    id: '',
    nameOfEvent: '',
    dateOfEvent: '',
    maxDateOfConfirmation: '',
    nameOfCelebrated: '',
    userId: '',
    typeOfEvent: EventType.None,
  };

  private events = new BehaviorSubject<IDashboardEvent[]>([]);
  events$ = this.events.asObservable();

  eventAction: IEventAction = {
    event: {
      ...this.baseEvent,
    },
    isNew: true,
  } as IEventAction;

  showEventModal = false;

  vm$ = combineLatest([
    this.eventsService.getEvents().pipe(
      map((events) => {
        const formattedEvents = events.map((event) => {
          return {
            ...event,
            dateOfEvent: toLocalDate(event.dateOfEvent),
          };
        });
        this.events.next(formattedEvents);
        return events;
      })
    ),
    this.events$,
  ]).pipe(
    map(([, events]) => {
      const userInformation = this.tokenService.getTokenValues();
      return {
        events,
        isAdmin: userInformation
          ? userInformation.roles.some((r) => r.name == Roles.Admin)
          : false,
      };
    })
  );

  updateEvents(eventAction: IEventAction) {
    const eventsCopy = this.events.value;
    if (eventAction.isNew) {
      eventsCopy.push(eventAction.event);
    } else {
      const eventIndex = eventsCopy.findIndex(
        (event) => event.id === eventAction.event.id
      );
      eventsCopy[eventIndex] = eventAction.event;
    }

    eventsCopy.sort((a, b) =>
      a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase())
    );

    this.eventAction = {
      event: { ...this.baseEvent },
      isNew: true,
    };

    this.closeEventModal();
    this.events.next(eventsCopy);
  }

  closeEventModal() {
    this.showEventModal = false;
  }

  openEventModal(eventId: string): void {
    if (eventId !== '') {
      this.eventsService
        .getEventById(eventId)
        .pipe(
          map((event) => {
            return {
              ...event,
              dateOfEvent: toLocalDate(event.dateOfEvent),
              maxDateOfConfirmation: toLocalDate(event.maxDateOfConfirmation),
              userId: event.userId,
            };
          })
        )
        .subscribe({
          next: (event) => {
            this.eventAction = {
              event,
              isNew: false,
            };

            this.showEventModal = true;
          },
        });
    } else {
      this.eventAction = {
        event: {
          ...this.baseEvent,
        },
        isNew: true,
      };

      this.showEventModal = true;
    }
  }

  getAccessibilityMessage(eventName: string) {
    return $localize`Editar ${eventName}`;
  }
}
