import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable, catchError, finalize, of, retry, throwError } from 'rxjs';
import { ErrorModalService } from '../services/error.service';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';

export function errorInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loaderService = inject(LoaderService);
  const errorService = inject(ErrorModalService);
  const apiPath = request.url.split('/api/')[1];

  if (!apiPath.match(/invites\/invite\/[0-9a-fA-F-]+\/event/g)) {
    loaderService.setLoading(true, 'Loading...');
  }

  errorService.setError(false, null);
  return next(request).pipe(
    retry({
      count: 1,
      delay: (error: HttpErrorResponse) => {
        if (error.message.includes('ERR_CONNECTION_REFUSED')) {
          return of(null); // Retry for ERR_CONNECTION_REFUSED
        }
        return throwError(() => error);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      errorService.setError(true, error);
      return throwError(() => error);
    }),
    finalize(() => {
      // Add a delay to show the loader for at least 1/2 of a second
      setTimeout(() => {
        loaderService.setLoading(false, '');
      }, 500);
    })
  );
}
