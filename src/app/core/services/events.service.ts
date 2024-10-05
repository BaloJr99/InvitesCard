import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IDropdownEvent, IDashboardEvent, IFullEvent } from '../models/events';
import { IMessageResponse } from '../models/common';
import { IFullInvite } from '../models/invites';
import { param } from 'jquery';

@Injectable()
export class EventsService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<IDashboardEvent[]> {
    return this.http.get<IDashboardEvent[]>(this.invitesBaseUrl);
  }

  getDropdownEvents(): Observable<IDropdownEvent[]> {
    return this.http.get<IDropdownEvent[]>(`${this.invitesBaseUrl}/dropdown`);
  }

  getEventType(eventId: string): Observable<string> {
    return this.http.get<string>(`${this.invitesBaseUrl}/${eventId}/eventType`);
  }

  getEventInvites(eventId: string): Observable<IFullInvite[]> {
    return this.http.get<IFullInvite[]>(
      `${this.invitesBaseUrl}/invites/${eventId}`
    );
  }

  isDeadlineMet(eventId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.invitesBaseUrl}/invites/${eventId}/deadlineMet`
    );
  }

  getEventById(id: string): Observable<IFullEvent> {
    return this.http.get<IFullEvent>(`${this.invitesBaseUrl}/${id}`);
  }

  createEvent(event: IFullEvent): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, event);
  }

  updateEvent(event: IFullEvent, id: string, override: boolean): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      event,
      {
        params: {
          override,
        }
      }
    );
  }

  deleteEvent(id: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`);
  }
}
