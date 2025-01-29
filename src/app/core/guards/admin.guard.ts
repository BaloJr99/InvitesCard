import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { inject } from '@angular/core';
import { Roles } from '../models/enum';

export const adminGuard: CanActivateFn = () => {
  const tokenService = inject(TokenStorageService);
  const userInformation = tokenService.getTokenValues();

  if (
    userInformation &&
    userInformation.roles.some((r) => r.name === Roles.Admin)
  ) {
    return true;
  }

  return inject(Router).navigate(['/dashboard/home']);
};
