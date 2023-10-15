import { IEntry } from '../../shared/interfaces'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class InvitesService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/entries'

  entries: IEntry[] = []

  constructor(private http: HttpClient) {  }

  getAllEntries(): Observable<IEntry[]> {
    return this.http.get<IEntry[]>(this.invitesBaseUrl)
  }

  getEntrieById(id:string): Observable<IEntry[]> {
    return this.http.get<IEntry[]>(`${this.invitesBaseUrl}/${id}`)
  }

  sendConfirmation(entry: IEntry, id: string): Observable<IEntry[]> { 
    
    return this.http.patch<IEntry[]>(`${this.invitesBaseUrl}/${id}`, entry)
  }
}