import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEntry } from '../models/entries';
import { IInvite } from '../models/invites';
import { IMessageResponse } from '../models/common';

@Injectable()
export class EntriesService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/entries'

  constructor(private http: HttpClient) {  }

  getAllEntries(): Observable<IEntry[]> {
    return this.http.get<IEntry[]>(this.invitesBaseUrl)
  }

  getEntryById(id:string): Observable<IEntry> {
    return this.http.get<IEntry>(`${this.invitesBaseUrl}/${id}`)
  }

  getInvite(id:string): Observable<IInvite> {
    return this.http.get<IInvite>(`${this.invitesBaseUrl}/invite/${id}`)
  }

  sendConfirmation(entry: IEntry, id: string): Observable<IMessageResponse> { 
    return this.http.patch<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, entry)
  }

  createEntry(entry: IEntry): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, entry)
  }

  updateEntry(entry: IEntry, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, entry)
  }

  deleteEntry(id: string): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`)
  }

  readMessage(id: string): Observable<IMessageResponse> { 
    return this.http.patch<IMessageResponse>(`${this.invitesBaseUrl}/messages/${id}`, null)
  }
}