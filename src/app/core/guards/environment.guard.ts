import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';

export const environmentGuard: CanActivateFn = () => {
  if (!environment.production) {
    return true;
  }

  return inject(Router).navigate(['/dashboard/home']);
};
