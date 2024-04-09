import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IAuthUser, IToken, IUser } from "src/shared/interfaces";

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
}