import { ISetting, IMessageResponse } from '../../shared/interfaces'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SettingsService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/settings'

  constructor(private http: HttpClient) {  }

  getEventSettings(eventId: string): Observable<ISetting> {
    return this.http.get<ISetting>(`${this.invitesBaseUrl}/${eventId}`)
  }

  createEventSettings(settings: ISetting): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, settings)
  }

  updateEventSettings(settings: ISetting, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, settings)
  }
}