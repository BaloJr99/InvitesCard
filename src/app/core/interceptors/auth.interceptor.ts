import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  Observable,
  switchMap,
  throwError,
  Subject,
  filter,
  take,
  finalize,
} from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject: Subject<string | null> = new Subject<
  string | null
>();

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  let authReq = req;

  const authService = inject(AuthService);
  const router = inject(Router);
  const tokenStorageService = inject(TokenStorageService);

  const token = tokenStorageService.getToken();

  if (token != null) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      withCredentials: true,
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        !authReq.url.includes('auth/signin') &&
        error.status === 401
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          // Call the refresh token endpoint to get a new access token
          return authService.refreshToken().pipe(
            switchMap((token) => {
              isRefreshing = false;
              tokenStorageService.saveToken(token.access_token);
              refreshTokenSubject.next(token.access_token);
              // Retry the original request with the new access token
              return next(
                req.clone({
                  headers: req.headers.set(
                    'Authorization',
                    `Bearer ${token.access_token}`
                  ),
                  withCredentials: true,
                })
              );
            }),
            catchError(() => {
              isRefreshing = false;
              tokenStorageService.signOut();
              router.navigate(['/auth/login']);
              return throwError(() => new Error('Unauthorized'));
            }),
            finalize(() => {
              isRefreshing = false;
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((token) => {
              // Retry the original request with the new access token
              return next(
                req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${token}`),
                  withCredentials: true,
                })
              );
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
}
