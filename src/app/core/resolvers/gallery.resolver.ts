import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { IAlbumResolved } from '../models/gallery';
import { EventsService } from '../services/events.service';

export const galleryResolver: ResolveFn<IAlbumResolved> = (
  route: ActivatedRouteSnapshot
): Observable<IAlbumResolved> => {
  const eventsService = inject(EventsService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? '';

  const isEventActive = eventsService.isEventActive(id).pipe(
    catchError(() => {
      router.navigate(['/error/page-not-found']);
      return EMPTY;
    })
  );

  return isEventActive;
};
