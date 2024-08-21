import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IFullUser, IUser, IUserBasicInfo, IUserEventsInfo } from '../models/users';
import { IMessageResponse } from '../models/common';

@Injectable()
export class UsersService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/users'

  constructor(private http: HttpClient) {  }

  getAllUsers(): Observable<IUserEventsInfo[]> {
    return this.http.get<IUserEventsInfo[]>(this.invitesBaseUrl);
  }

  getUsersDropdownData(): Observable<IUserBasicInfo[]> {
    return this.http.get<IUserBasicInfo[]>(`${this.invitesBaseUrl}/basic`);
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.invitesBaseUrl}/${id}`);
  }

  createUser(users: IFullUser): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, users);
  }

  updateUser(users: IUser, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, users);
  }

  deleteUser(id: string): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`);
  }
}