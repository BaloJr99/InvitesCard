import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IAuthUser, IUser } from "../models/users";
import { IToken } from "../models/tokens";
import { IMessageResponse } from "../models/common";

@Injectable()
export class AuthService {
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/auth'

  constructor(private http: HttpClient) {  }

  createNewAccount(user: IUser): Observable<unknown> { 
    return this.http.post<string>(`${this.invitesBaseUrl}/signup`, user)
  }

  loginAccount(user: IAuthUser): Observable<IToken> { 
    return this.http.post<IToken>(`${this.invitesBaseUrl}/signin`, user)
  }

  sendResetPassword(usernameOrEmail: string): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}/forgotPassword`, usernameOrEmail)
  }

  isUserResettingPassword(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.invitesBaseUrl}/forgotPassword/${userId}`)
  }

  resetPassword(userId: string, password: string): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}/resetPassword/${userId}`, password)
  }
}