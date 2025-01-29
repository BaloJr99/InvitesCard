import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, combineLatest, map } from 'rxjs';
import { IEventResolved } from 'src/app/core/models/events';
import { EventsService } from 'src/app/core/services/events.service';

export const eventResolver: ResolveFn<IEventResolved> = (
  route: ActivatedRouteSnapshot
): Observable<IEventResolved> => {
  const eventsService = inject(EventsService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? '';
  console.log('Entro');

  const eventFound = combineLatest([
    eventsService.getEventInvites(id),
    eventsService.isDeadlineMet(id),
  ]).pipe(
    map(([invites, isDeadlineMet]) => {
      return {
        invites,
        id,
        isDeadlineMet,
      };
    }),
    catchError((error) => {
      console.log(error);
      router.navigate(['/dashboard/events']);
      return EMPTY;
    })
  );

  return eventFound;
};
