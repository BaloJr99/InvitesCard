import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEventType } from '../models/event-types';

@Injectable({
  providedIn: 'root',
})
export class EventTypesService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/eventtypes';

  getEventTypes(): Observable<IEventType[]> {
    return this.http.get<IEventType[]>(`${this.invitesBaseUrl}`);
  }
}
