import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { IEventTypeResolved } from '../core/models/invites';
import { InvitesService } from '../core/services/invites.service';
import { LoaderService } from '../core/services/loader.service';
import { EventType } from '../core/models/enum';

export const invitesResolver: ResolveFn<IEventTypeResolved> = (
  route: ActivatedRouteSnapshot
): Observable<IEventTypeResolved> => {
  const invitesService = inject(InvitesService);
  const router = inject(Router);
  const loaderService = inject(LoaderService);

  loaderService.setLoading(false, $localize`Cargando invitación`, true);

  const id = route.paramMap.get('id') ?? '';
  const overrideEventType = route.queryParamMap.get('eventType') ?? '';

  const inviteFound = invitesService.getInviteEventType(id).pipe(
    map((eventType) => ({ eventType: eventType === EventType.Wedding && overrideEventType ? overrideEventType : eventType })),
    catchError(() => {
      router.navigate(['/error/page-not-found']);
      return EMPTY;
    })
  );

  return inviteFound;
};
