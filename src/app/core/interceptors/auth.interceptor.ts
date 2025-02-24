import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let authReq = req;

    const token = this.tokenStorageService.getToken();

    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !authReq.url.includes('auth/signin') &&
          error.status === 401
        ) {
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      // Call the refresh token endpoint to get a new access token
      return this.authService.refreshToken().pipe(
        switchMap((token) => {
          this.isRefreshing = false;
          this.tokenStorageService.saveToken(token.access_token);
          // Retry the original request with the new access token
          return next.handle(this.addTokenHeader(request, token.access_token));
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.tokenStorageService.signOut();
          this.router.navigate(['/auth/login']);
          return throwError(() => new Error('Unauthorized'));
        })
      );
    }

    this.isRefreshing = false;
    this.tokenStorageService.signOut();
    this.router.navigate(['/auth/login']);
    return throwError(() => new Error('Unauthorized'));
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string) {
    return request.clone({
      headers: request.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`),
      withCredentials: true,
    });
  }
}
