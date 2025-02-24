import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IInviteGroups } from '../models/inviteGroups';
import { IMessageResponse } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class InviteGroupsService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/inviteGroups';

  constructor(private http: HttpClient) {}

  getAllInviteGroups(eventId: string): Observable<IInviteGroups[]> {
    return this.http.get<IInviteGroups[]>(`${this.invitesBaseUrl}/${eventId}`);
  }

  createInviteGroup(inviteGroup: IInviteGroups): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${this.invitesBaseUrl}`,
      inviteGroup
    );
  }

  updateInviteGroup(
    inviteGroup: IInviteGroups,
    id: string
  ): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      inviteGroup
    );
  }

  checkInviteGroup(eventId: string, inviteGroup: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.invitesBaseUrl}/check-invite-group/${eventId}/${inviteGroup}`
    );
  }
}
