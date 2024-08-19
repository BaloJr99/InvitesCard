import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { EventsService } from 'src/core/services/events.service';
import { LoaderService } from 'src/core/services/loader.service';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { UsersService } from 'src/core/services/users.service';
import { Roles } from 'src/shared/enum';
import { IEvent, IEventAction } from 'src/shared/interfaces';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  isAdmin = false;
  
  constructor(
    private eventsService: EventsService,
    private usersService: UsersService,
    private loaderService: LoaderService, 
    private tokenService: TokenStorageService) {
      
    }
    
  events: IEvent[] = [];
  eventAction!: IEventAction;
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);

    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.isAdmin = userInformation.roles.some(r => r.name == Roles.Admin);

      this.eventsService.getEvents(this.isAdmin).subscribe({
        next: (events) => {
          this.events = events.map((event) => {
            return {
              ...event,
              dateOfEvent: this.convertDate(event.dateOfEvent)
            }
          });
        }
      }).add(() => {
        this.loaderService.setLoading(false)
      });
    }
  }

  updateEvents(eventAction: IEventAction) {
    if (eventAction.isNew) {
      this.events.push({
        ...eventAction.event,
        allowCreateEntries: 0
      });
      this.events.sort((a, b) => a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase()));
    } else {
      this.events = this.events.map(originalEvent => {
        if (originalEvent.id === eventAction.event.id) {
          return {
            ...eventAction.event,
            allowCreateEntries: originalEvent.allowCreateEntries
          }
        }
        return originalEvent;
      });
      this.events.sort((a, b) => a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase()));
    }
  }

  editEvent(eventId: string): void {
    forkJoin([
      this.eventsService.getEventById(eventId).pipe(
        map((event) => {
          return {
            ...event,
            dateOfEvent: this.convertDate(event.dateOfEvent),
            maxDateOfConfirmation: this.convertDate(event.maxDateOfConfirmation),
            userId: event.userId
          }
        })
      ),
      this.usersService.getUsersDropdownData()
    ]).subscribe({
      next: ([event, users]) => {
        this.eventAction = {
          event, 
          users,
          isNew: false
        }
      }
    })
  }

  convertDate(date: string): string {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 16);
  }
}
