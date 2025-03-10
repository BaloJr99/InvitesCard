import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUser } from '../models/users';

const TOKEN_KEY = 'x-access-token';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor(private jwtService: JwtHelperService) {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public getTokenValues(): IUser | null {
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      const userInformation = this.jwtService.decodeToken(token) as IUser;
      return userInformation;
    }
    return null;
  }
}
