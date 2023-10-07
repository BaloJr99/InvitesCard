import { IEntry } from '../../shared/interfaces'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InvitesService {
  baseUrl = 'https://sydney-lyrebird-djqm.1.sg-1.fl0.io'
  invitesBaseUrl = this.baseUrl + '/entries'

  entries: IEntry[] = []

  constructor(private http: HttpClient) {  }

  getAllEntries(): Observable<IEntry[]> {
    return this.http.get<IEntry[]>(this.invitesBaseUrl)
  }
}