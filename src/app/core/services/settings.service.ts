import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IBaseSettings,
  ISaveTheDateSetting,
  ISetting,
} from '../models/settings';
import { IMessageResponse } from '../models/common';

@Injectable()
export class SettingsService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/settings';

  constructor(private http: HttpClient) {}

  getEventSettings(eventId: string): Observable<IBaseSettings> {
    return this.http.get<IBaseSettings>(`${this.invitesBaseUrl}/${eventId}`);
  }

  createEventSettings(
    settings: ISetting | ISaveTheDateSetting,
    eventType: string
  ): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${this.invitesBaseUrl}/${eventType}`,
      settings
    );
  }

  updateEventSettings(
    settings: ISetting | ISaveTheDateSetting,
    id: string,
    eventType: string
  ): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}/${eventType}`,
      settings
    );
  }
}
