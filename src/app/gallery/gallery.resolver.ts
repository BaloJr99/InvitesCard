import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IAlbumResolved } from '../core/models/gallery';

export const galleryResolver: ResolveFn<IAlbumResolved> = (
  route: ActivatedRouteSnapshot
): Observable<IAlbumResolved> => {
  const invitesService = inject(InvitesService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? '';

  const isEventActive = invitesService.isEventActive(id).pipe(
    catchError(() => {
      router.navigate(['/error/page-not-found']);
      return EMPTY;
    })
  );

  return isEventActive;
};
