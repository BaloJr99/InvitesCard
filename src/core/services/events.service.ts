import { IEntry, IEvent, IMessageResponse } from '../../shared/interfaces'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class EventsService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/events'

  constructor(private http: HttpClient) {  }

  getAllEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(this.invitesBaseUrl)
  }

  getEventEntries(eventId: string): Observable<IEntry[]> {
    return this.http.get<IEntry[]>(`${this.invitesBaseUrl}/entries/${eventId}`)
  }

  getEventById(id: string): Observable<IEvent> {
    return this.http.get<IEvent>(`${this.invitesBaseUrl}/${id}`)
  }

  createEvent(event: IEvent): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, event)
  }

  updateEvent(event: IEvent, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, event)
  }

  deleteEvent(id: string): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`)
  }
}