import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEvent, IFullEvent } from '../models/events';
import { IEntry } from '../models/entries';
import { IMessageResponse } from '../models/common';

@Injectable()
export class EventsService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/events'

  constructor(
    private http: HttpClient
  ) {  }

  getEvents(isAdmin: boolean): Observable<IEvent[]> {
    if (isAdmin) {
      return this.http.get<IEvent[]>(this.invitesBaseUrl)
    }
    return this.http.get<IEvent[]>(`${this.invitesBaseUrl}/users`)
  }

  getEventEntries(eventId: string): Observable<IEntry[]> {
    return this.http.get<IEntry[]>(`${this.invitesBaseUrl}/entries/${eventId}`)
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