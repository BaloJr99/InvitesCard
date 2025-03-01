import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable, catchError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

export const passwordResetResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const id = route.paramMap.get('id') ?? '';

  const isUserResettingPassword = authService.isUserResettingPassword(id).pipe(
    catchError(() => {
      router.navigate(['/error/page-not-found']);
      return EMPTY;
    })
  );

  return isUserResettingPassword;
};
