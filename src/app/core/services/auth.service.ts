import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuthUser } from '../models/users';
import { IToken } from '../models/tokens';
import { IMessageResponse } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/auth';

  constructor(private http: HttpClient) {}

  loginAccount(user: IAuthUser): Observable<IToken> {
    return this.http.post<IToken>(`${this.invitesBaseUrl}/signin`, user, {
      withCredentials: true,
    });
  }

  sendResetPassword(usernameOrEmail: string): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${this.invitesBaseUrl}/forgotPassword`,
      usernameOrEmail
    );
  }

  sendResetPasswordToUser(id: string): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${this.invitesBaseUrl}/forgotPasswordToUser`,
      {
        id,
      }
    );
  }

  isUserResettingPassword(userId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.invitesBaseUrl}/forgotPassword/${userId}`
    );
  }

  resetPassword(
    userId: string,
    password: string
  ): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${this.invitesBaseUrl}/resetPassword/${userId}`,
      password
    );
  }

  refreshToken(): Observable<IToken> {
    return this.http.get<IToken>(`${this.invitesBaseUrl}/refreshToken`, {
      withCredentials: true,
    });
  }
}
