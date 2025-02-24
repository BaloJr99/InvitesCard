import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILog } from '../models/logs';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/logs';

  constructor(private http: HttpClient) {}

  getLogs(): Observable<ILog[]> {
    return this.http.get<ILog[]>(this.invitesBaseUrl);
  }
}
