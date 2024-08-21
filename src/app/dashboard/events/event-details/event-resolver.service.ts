import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { EMPTY, Observable, catchError, map } from "rxjs";
import { IEventResolved } from "src/app/core/models/events";
import { EventsService } from "src/app/core/services/events.service";

export const eventResolver: ResolveFn<IEventResolved> = (
  route: ActivatedRouteSnapshot): Observable<IEventResolved> => {
  
  const eventsService = inject(EventsService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? "";

  const eventFound = eventsService.getEventEntries(id).pipe(
    map(entries => {
      return { entries: entries, eventId: id }
    }),
    catchError(() => {
      router.navigate(['/dashboard/events'])
      return EMPTY
    })
  )

  return eventFound;
} 