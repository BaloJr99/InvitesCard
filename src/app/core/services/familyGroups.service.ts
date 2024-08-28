import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IFamilyGroup } from '../models/familyGroups';
import { IMessageResponse } from '../models/common';

@Injectable()
export class FamilyGroupsService {
  
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/familyGroups'

  constructor(private http: HttpClient) {  }

  getAllFamilyGroups(eventId: string): Observable<IFamilyGroup[]> {
    return this.http.get<IFamilyGroup[]>(`${this.invitesBaseUrl}/${eventId}`)
  }

  createFamilyGroup(familyGroup: IFamilyGroup): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, familyGroup)
  }

  updateFamilyGroup(familyGroup: IFamilyGroup, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, familyGroup)
  }
}