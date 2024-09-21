import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = () => {
  return inject(TokenStorageService).getToken()
    ? inject(Router).navigate(['/dashboard'])
    : true;
};
