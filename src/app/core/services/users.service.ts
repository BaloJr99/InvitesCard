import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ISearchUser, IUpsertUser, IUserDropdownData, IUserEventsInfo, IUserProfile, IUserProfilePhoto } from '../models/users';
import { IMessageResponse } from '../models/common';

@Injectable()
export class UsersService {
  
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/users'

  constructor(private http: HttpClient) {  }

  getAllUsers(): Observable<IUserEventsInfo[]> {
    return this.http.get<IUserEventsInfo[]>(this.invitesBaseUrl);
  }

  getUsersDropdownData(): Observable<IUserDropdownData[]> {
    return this.http.get<IUserDropdownData[]>(`${this.invitesBaseUrl}/basic`);
  }

  getUserById(id: string): Observable<ISearchUser> {
    return this.http.get<ISearchUser>(`${this.invitesBaseUrl}/${id}`);
  }

  createUser(users: IUpsertUser): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, users);
  }

  updateUser(users: IUpsertUser, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, users);
  }

  deleteUser(id: string): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`);
  }

  updateProfile(profile: IUserProfile): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/profile`, profile);
  }
  
  getUserProfile(id: string): Observable<IUserProfile> {
    return this.http.get<IUserProfile>(`${this.invitesBaseUrl}/profile/${id}`);
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.invitesBaseUrl}/profile/check-username/${username}`);
  }

  uploadProfilePhoto(userProfilePhoto: IUserProfilePhoto): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/profile/photo`, userProfilePhoto);
  }
}