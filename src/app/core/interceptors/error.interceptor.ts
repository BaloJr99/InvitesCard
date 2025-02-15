import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, of, retry, throwError } from 'rxjs';
import { ErrorModalService } from '../services/error.service';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorService: ErrorModalService,
    private loaderService: LoaderService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiPath = request.url.split('/api/')[1];
    if (!apiPath.match(/invites\/invite\/[0-9a-fA-F-]+\/event/g)) {
      this.loaderService.setLoading(true, 'Loading...');
    }

    this.errorService.setError(false, null);
    return next.handle(request).pipe(
      retry({
        count: 1,
        delay: (error: HttpErrorResponse) => {
          switch (error.status) {
            case 401:
              return throwError(() => error);
            default:
              return of(null);
          }
        },
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorService.setError(true, error);
        return throwError(() => error);
      }),
      finalize(() => {
        // Add a delay to show the loader for at least 1/2 of a second
        setTimeout(() => {
          this.loaderService.setLoading(false, '');
        }, 500);
      })
    );
  }
}
