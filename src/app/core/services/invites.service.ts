import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IInvite, IUserInvite } from '../models/invites';
import { IMessageResponse } from '../models/common';
import { IPartialInvite } from '../models/invites';

@Injectable()
export class InvitesService {
  
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/invites'

  constructor(private http: HttpClient) {  }

  getAllInvites(): Observable<IInvite[]> {
    return this.http.get<IInvite[]>(this.invitesBaseUrl)
  }

  getInviteById(id:string): Observable<IInvite> {
    return this.http.get<IInvite>(`${this.invitesBaseUrl}/${id}`)
  }

  getInvite(id:string): Observable<IUserInvite> {
    return this.http.get<IUserInvite>(`${this.invitesBaseUrl}/invite/${id}`)
  }

  sendConfirmation(invite: IInvite, id: string): Observable<IMessageResponse> { 
    return this.http.patch<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, invite)
  }

  createInvite(invite: IInvite): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, invite)
  }

  bulkInvites(invites: IPartialInvite[]): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}/bulkInvites`, invites)
  }

  updateInvite(invite: IInvite, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, invite)
  }

  deleteInvite(id: string): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`)
  }

  readMessage(id: string): Observable<IMessageResponse> { 
    return this.http.patch<IMessageResponse>(`${this.invitesBaseUrl}/messages/${id}`, null)
  }
}