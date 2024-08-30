import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IDropdownEvent, IDashboardEvent, IFullEvent } from '../models/events';
import { IMessageResponse } from '../models/common';
import { IEventInvite } from '../models/invites';

@Injectable()
export class EventsService {
  
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/events'

  constructor(
    private http: HttpClient
  ) {  }

  getEvents(): Observable<IDashboardEvent[]> {
    return this.http.get<IDashboardEvent[]>(this.invitesBaseUrl)
  }

  getDropdownEvents(): Observable<IDropdownEvent[]> {
    return this.http.get<IDropdownEvent[]>(`${this.invitesBaseUrl}/dropdown`)
  }

  getEventInvites(eventId: string): Observable<IEventInvite[]> {
    return this.http.get<IEventInvite[]>(`${this.invitesBaseUrl}/invites/${eventId}`)
  }

  isDeadlineMet(eventId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.invitesBaseUrl}/invites/${eventId}/deadlineMet`)
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