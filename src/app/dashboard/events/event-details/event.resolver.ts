import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, combineLatest, map } from 'rxjs';
import { IEventResolved } from 'src/app/core/models/events';
import { EventsService } from 'src/app/core/services/events.service';
import { toLocalDate } from 'src/app/shared/utils/tools';

export const eventResolver: ResolveFn<IEventResolved> = (
  route: ActivatedRouteSnapshot
): Observable<IEventResolved> => {
  const eventsService = inject(EventsService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? '';

  const eventFound = combineLatest([
    eventsService.getEventInvites(id).pipe(
      map((invites) => {
        return invites.map((invite) => {
          const newDateOfConfirmation = invite.dateOfConfirmation
            ? toLocalDate(invite.dateOfConfirmation)
            : null;
          return {
            ...invite,
            dateOfConfirmation: newDateOfConfirmation,
            isMessageRead: Boolean(invite.isMessageRead),
          };
        });
      })
    ),
    eventsService.isDeadlineMet(id),
  ]).pipe(
    map(([invites, isDeadlineMet]) => {
      return {
        invites,
        id,
        isDeadlineMet,
      };
    }),
    catchError(() => {
      router.navigate(['/dashboard/events']);
      return EMPTY;
    })
  );

  return eventFound;
};
