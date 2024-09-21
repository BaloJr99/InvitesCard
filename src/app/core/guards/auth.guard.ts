import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  return inject(TokenStorageService).getToken()
    ? true
    : inject(Router).navigate(['/error/not-authorized']);
};
