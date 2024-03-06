import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { EventsService } from "src/core/services/events.service";
import { LoaderService } from "src/core/services/loader.service";
import { IEvent } from "src/shared/interfaces";

@Injectable()
export class UpdateEventService {

  private events = new BehaviorSubject<IEvent[]>([])
  events$ = this.events.asObservable();

  constructor(
    private eventsService: EventsService, 
    private loaderService: LoaderService) { }

  updateEvents(): void {
    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.events.next(events);
      }
    }).add(() => {
      if (this.loaderService.getLoading())
      this.loaderService.setLoading(false);
    })
  }
}