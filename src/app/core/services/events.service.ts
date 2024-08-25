import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEvent, IFullEvent } from '../models/events';
import { IMessageResponse } from '../models/common';
import { IInvite } from '../models/invites';

@Injectable()
export class EventsService {
  
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/events'

  constructor(
    private http: HttpClient
  ) {  }

  getEvents(isAdmin: boolean): Observable<IEvent[]> {
    if (isAdmin) {
      return this.http.get<IEvent[]>(this.invitesBaseUrl)
    }
    return this.http.get<IEvent[]>(`${this.invitesBaseUrl}/users`)
  }

  getEventInvites(eventId: string): Observable<IInvite[]> {
    return this.http.get<IInvite[]>(`${this.invitesBaseUrl}/invites/${eventId}`)
  }

  getEventById(id: string): Observable<IFullEvent> {
    return this.http.get<IFullEvent>(`${this.invitesBaseUrl}/${id}`)
  }

  createEvent(event: IFullEvent): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, event)
  }

  updateEvent(event: IFullEvent, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, event)
  }

  deleteEvent(id: string): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`)
  }
}