import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/core/services/events.service';
import { LoaderService } from 'src/core/services/loader.service';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { Roles } from 'src/shared/enum';
import { IEvent, IEventAction } from 'src/shared/interfaces';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  showNewEvent = false;
  
  constructor(
    private eventsService: EventsService,
    private loaderService: LoaderService, 
    private tokenService: TokenStorageService) {
      
    }
    
  events: IEvent[] = [];
  eventAction!: IEventAction;
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);

    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
      }
    }).add(() => this.loaderService.setLoading(false));

    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.showNewEvent = userInformation.roles.some(r => r.name == Roles.Admin);
    }
  }

  updateEvents(eventAction: IEventAction) {
    if (eventAction.isNew) {
      this.events.push(eventAction.event);
      this.events.sort((a, b) => a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase()));
    } else {
      this.events = this.events.map(originalEvent => originalEvent.id === eventAction.event.id ? eventAction.event : originalEvent);
      this.events.sort((a, b) => a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase()));
    }
  }

  editEvent(event: IEvent): void {
    this.eventAction = {
      event,
      isNew: false
    }
  }
}
