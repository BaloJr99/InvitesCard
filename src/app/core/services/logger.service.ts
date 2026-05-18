import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILog } from '../models/logs';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/logs';

  getLogs(): Observable<ILog[]> {
    return this.http.get<ILog[]>(this.invitesBaseUrl);
  }
}
