import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ISetting } from '../models/settings';
import { IMessageResponse } from '../models/common';

@Injectable()
export class SettingsService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/settings';

  constructor(private http: HttpClient) {}

  getEventSettings(eventId: string): Observable<ISetting> {
    return this.http.get<ISetting>(`${this.invitesBaseUrl}/${eventId}`);
  }

  createEventSettings(settings: ISetting): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, settings);
  }

  updateEventSettings(
    settings: ISetting,
    id: string
  ): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      settings
    );
  }
}
