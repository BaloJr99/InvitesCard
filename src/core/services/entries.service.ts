import { IEntry, IMessageResponse } from '../../shared/interfaces'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class EntriesService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/entries'

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

  createEntry(entry: IEntry): Observable<IEntry> { 
    return this.http.post<IEntry>(`${this.invitesBaseUrl}`, entry)
  }

  updateEntry(entry: IEntry, id: string): Observable<IEntry> { 
    return this.http.put<IEntry>(`${this.invitesBaseUrl}/${id}`, entry)
  }

  deleteEntry(id: string): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`)
  }
}