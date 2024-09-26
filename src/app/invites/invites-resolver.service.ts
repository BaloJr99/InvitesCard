import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { IEventTypeResolved } from '../core/models/invites';
import { InvitesService } from '../core/services/invites.service';

export const invitesResolver: ResolveFn<IEventTypeResolved> = (
  route: ActivatedRouteSnapshot
): Observable<IEventTypeResolved> => {
  const invitesService = inject(InvitesService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? '';

  const inviteFound = invitesService.getInviteEventType(id).pipe(
    map((eventType) => ({ eventType: eventType })),
    catchError(() => {
      router.navigate(['/error/page-not-found']);
      return EMPTY;
    })
  );

  return inviteFound;
};
