import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IMessageResponse } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/environment';

  constructor(private http: HttpClient) {}

  cleanEnvironment(): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}/reset`, {});
  }
}
