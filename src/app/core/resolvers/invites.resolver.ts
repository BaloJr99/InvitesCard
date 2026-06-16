import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { IEventTypeResolved, IInviteEventInformation } from '../models/invites';
import { InvitesService } from '../services/invites.service';
import { LoaderService } from '../services/loader.service';
import { EventType } from '../models/enum';

export const invitesResolver: ResolveFn<IEventTypeResolved> = (
  route: ActivatedRouteSnapshot,
): Observable<IEventTypeResolved> => {
  const invitesService = inject(InvitesService);
  const router = inject(Router);
  const loaderService = inject(LoaderService);

  loaderService.setLoading(false, $localize`Cargando invitación`, true);

  const id = route.paramMap.get('id') ?? '';
  const overrideEventType = route.queryParamMap.get('eventType') ?? '';

  const inviteFound = invitesService.getInviteEventInformation(id).pipe(
    map(
      (eventInformation) =>
        ({
          eventInformation: {
            ...eventInformation,
            typeOfEvent:
              eventInformation.typeOfEvent === EventType.Wedding &&
              overrideEventType
                ? overrideEventType
                : eventInformation.typeOfEvent,
          } as IInviteEventInformation,
        }) as IEventTypeResolved,
    ),
    catchError(() => {
      router.navigate(['/error/page-not-found']);
      return EMPTY;
    }),
  );

  return inviteFound;
};
