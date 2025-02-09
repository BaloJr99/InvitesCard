import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Roles } from 'src/app/core/models/enum';
import { IUserProfile } from 'src/app/core/models/users';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsersService } from 'src/app/core/services/users.service';

export const profileResolver: ResolveFn<IUserProfile> = (
  route: ActivatedRouteSnapshot
): Observable<IUserProfile> => {
  const usersService = inject(UsersService);
  const tokenService = inject(TokenStorageService);
  const router = inject(Router);
  const loaderService = inject(LoaderService);

  loaderService.setLoading(true, 'Loading Profile');

  const userInformation = tokenService.getTokenValues();

  if (!userInformation) {
    loaderService.setLoading(false);
    router.navigate(['/auth/login']);
    return EMPTY;
  }

  const id = route.paramMap.get('id');
  if (
    !id ||
    (
      !userInformation.roles.some((r) => r.name === Roles.Admin) &&
      userInformation.id !== id
    )
  ) {
    router.navigate([`/dashboard/profile/${userInformation.id}`]);
    return EMPTY;
  }

  const userFound = usersService.getUserProfile(id);

  return userFound;
};
