import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IBulkInvite,
  IConfirmation,
  IDashboardInvite,
  IUpsertInvite,
  IUserInvite,
} from '../models/invites';
import { IBulkMessageResponse, IMessageResponse } from '../models/common';

@Injectable()
export class InvitesService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/invites';

  constructor(private http: HttpClient) {}

  getAllInvites(): Observable<IDashboardInvite[]> {
    return this.http.get<IDashboardInvite[]>(this.invitesBaseUrl);
  }

  getInvite(id: string): Observable<IUserInvite> {
    return this.http.get<IUserInvite>(`${this.invitesBaseUrl}/invite/${id}`);
  }

  sendConfirmation(
    invite: IConfirmation,
    id: string
  ): Observable<IMessageResponse> {
    return this.http.patch<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      invite
    );
  }

  createInvite(invite: IUpsertInvite): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, invite);
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

  readMessage(id: string): Observable<IMessageResponse> {
    return this.http.patch<IMessageResponse>(
      `${this.invitesBaseUrl}/messages/${id}`,
      null
    );
  }
}
