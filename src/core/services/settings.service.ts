import { ISettings, IMessageResponse } from '../../shared/interfaces'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SettingsService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/settings'

  constructor(private http: HttpClient) {  }

  getEventSettings(eventId: string): Observable<ISettings> {
    return this.http.get<ISettings>(`${this.invitesBaseUrl}/${eventId}`)
  }

  createEventSettings(settings: ISettings): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, settings)
  }

  updateEventSettings(settings: ISettings, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, settings)
  }
}