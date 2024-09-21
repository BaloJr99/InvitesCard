import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { IInviteResolved } from '../core/models/invites';
import { InvitesService } from '../core/services/invites.service';

export const invitesResolver: ResolveFn<IInviteResolved> = (
  route: ActivatedRouteSnapshot
): Observable<IInviteResolved> => {
  const invitesService = inject(InvitesService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? '';

  const inviteFound = invitesService.getInvite(id).pipe(
    map((invite) => ({ invite: invite })),
    catchError(() => {
      router.navigate(['/error/page-not-found']);
      return EMPTY;
    })
  );

  return inviteFound;
};
