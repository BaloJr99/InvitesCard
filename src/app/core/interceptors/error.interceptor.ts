import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ErrorModalService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorModalService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.errorService.setError(false, null)
    return next.handle(request)
    .pipe(
      retry({ count: 1, delay: 1000 }),
      catchError((error: HttpErrorResponse) => {
        this.errorService.setError(true, error);
        return throwError(() => error);
      })
    )
  }
}
