import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IAuthUser } from "../models/users";
import { IToken } from "../models/tokens";
import { IMessageResponse } from "../models/common";

@Injectable()
export class AuthService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/auth'

  constructor(private http: HttpClient) {  }

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