import { IFamilyGroup, IMessageResponse } from '../../shared/interfaces'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class FamilyGroupsService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/familyGroups'

  constructor(private http: HttpClient) {  }

  getAllFamilyGroups(): Observable<IFamilyGroup[]> {
    return this.http.get<IFamilyGroup[]>(this.invitesBaseUrl)
  }

  getFamilyGroupById(id: string): Observable<IFamilyGroup> {
    return this.http.get<IFamilyGroup>(`${this.invitesBaseUrl}/${id}`)
  }

  createFamilyGroup(familyGroup: IFamilyGroup): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, familyGroup)
  }

  updateFamilyGroup(familyGroup: IFamilyGroup, id: string): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(`${this.invitesBaseUrl}/${id}`, familyGroup)
  }
}