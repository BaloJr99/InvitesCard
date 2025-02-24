import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IDropdownEvent,
  IDashboardEvent,
  IFullEvent,
  IEventSettings,
} from '../models/events';
import { IMessageResponse } from '../models/common';
import { IFullInvite } from '../models/invites';

@Injectable({
  providedIn: 'root',
})
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

  getEventSettings(
    eventId: string,
    eventSettings: string[]
  ): Observable<IEventSettings> {
    return this.http.get<IEventSettings>(
      `${this.invitesBaseUrl}/${eventId}/eventInformation`,
      {
        params: {
          eventSettings,
        },
      }
    );
  }

  getEventInvites(eventId: string): Observable<IFullInvite[]> {
    return this.http
      .get<IFullInvite[]>(`${this.invitesBaseUrl}/invites/${eventId}`)
      .pipe(
        map((invites) => {
          return invites.map((invite) => {
            invite.kidsAllowed = Boolean(invite.kidsAllowed);
            return invite;
          });
        })
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

  updateEvent(
    event: IFullEvent,
    id: string,
    override: boolean,
    overrideViewed: boolean
  ): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      event,
      {
        params: {
          override,
          overrideViewed,
        },
      }
    );
  }

  deleteEvent(id: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`);
  }
}
