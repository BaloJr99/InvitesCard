import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IBulkInvite,
  IConfirmation,
  IDashboardInvite,
  ISaveTheDateConfirmation,
  ISaveTheDateUserInvite,
  IUpsertInvite,
  IUserInvite,
} from '../models/invites';
import { IBulkMessageResponse, IMessageResponse } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class InvitesService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/invites';

  constructor(private http: HttpClient) {}

  getAllInvites(): Observable<IDashboardInvite[]> {
    return this.http.get<IDashboardInvite[]>(this.invitesBaseUrl);
  }

  getInvite(id: string): Observable<IUserInvite | ISaveTheDateUserInvite> {
    return this.http.get<IUserInvite | ISaveTheDateUserInvite>(
      `${this.invitesBaseUrl}/invite/${id}`
    );
  }

  createInvite(invite: IUpsertInvite): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, invite);
  }

  updateInvite(
    invite: IUpsertInvite,
    id: string
  ): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      invite
    );
  }

  deleteInvite(id: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`);
  }

  sendConfirmation(
    invite: IConfirmation | ISaveTheDateConfirmation,
    id: string,
    eventType: string
  ): Observable<IMessageResponse> {
    return this.http.patch<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}/${eventType}`,
      invite
    );
  }

  readMessage(id: string): Observable<IMessageResponse> {
    return this.http.patch<IMessageResponse>(
      `${this.invitesBaseUrl}/messages/${id}`,
      null
    );
  }

  bulkInvites(invites: IBulkInvite[]): Observable<IBulkMessageResponse> {
    return this.http.post<IBulkMessageResponse>(
      `${this.invitesBaseUrl}/bulkInvites`,
      invites
    );
  }

  bulkDeleteInvites(invitesIds: string[]): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(
      `${this.invitesBaseUrl}/bulkInvites`,
      {
        body: invitesIds,
      }
    );
  }

  getInviteEventType(id: string): Observable<string> {
    return this.http.get<string>(`${this.invitesBaseUrl}/invite/${id}/event`);
  }
}
