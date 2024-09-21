import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IRole } from '../models/roles';
import { IMessageResponse } from '../models/common';

@Injectable()
export class RolesService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/roles';

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(this.invitesBaseUrl);
  }

  getRoleById(id: string): Observable<IRole> {
    return this.http.get<IRole>(`${this.invitesBaseUrl}/${id}`);
  }

  updateRole(role: IRole, id: string): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      role
    );
  }

  deleteRole(id: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`);
  }
}
