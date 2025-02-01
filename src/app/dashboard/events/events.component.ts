import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Roles } from 'src/app/core/models/enum';
import { IDashboardEvent, IEventAction } from 'src/app/core/models/events';
import { EventsService } from 'src/app/core/services/events.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { toLocalDate } from 'src/app/shared/utils/tools';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  isAdmin = false;

  constructor(
    private eventsService: EventsService,
    private loaderService: LoaderService,
    private tokenService: TokenStorageService,
    @Inject(LOCALE_ID) private localeValue: string
  ) {}

  events: IDashboardEvent[] = [];
  eventAction!: IEventAction;

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando eventos`);

    this.eventsService
      .getEvents()
      .subscribe({
        next: (events) => {
          this.events = events.map((event) => {
            return {
              ...event,
              dateOfEvent: toLocalDate(
                this.localeValue,
                event.dateOfEvent
              ),
            };
          });
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });

    const userInformation = this.tokenService.getTokenValues();
    this.isAdmin = userInformation
      ? userInformation.roles.some((r) => r.name == Roles.Admin)
      : false;
  }

  updateEvents(eventAction: IEventAction) {
    if (eventAction.isNew) {
      this.events.push({
        ...eventAction.event,
        allowCreateInvites: 0,
      });
      this.events.sort((a, b) =>
        a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase())
      );
    } else {
      this.events = this.events.map((originalEvent) => {
        if (originalEvent.id === eventAction.event.id) {
          return {
            ...eventAction.event,
            allowCreateInvites: originalEvent.allowCreateInvites,
          };
        }
        return originalEvent;
      });
      this.events.sort((a, b) =>
        a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase())
      );
    }
  }

  editEvent(eventId: string): void {
    this.eventsService
      .getEventById(eventId)
      .pipe(
        map((event) => {
          return {
            ...event,
            dateOfEvent: toLocalDate(this.localeValue, event.dateOfEvent),
            maxDateOfConfirmation: toLocalDate(
              this.localeValue,
              event.maxDateOfConfirmation
            ),
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
        },
      });
  }

  getAccessibilityMessage(eventName: string) {
    return $localize`Editar ${eventName}`;
  }
}
