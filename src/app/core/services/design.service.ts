import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IDesign } from "../models/designs";

@Injectable({
  providedIn: 'root',
})
export class DesignsService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/designs';

  getDesigns(): Observable<IDesign[]> {
    return this.http.get<IDesign[]>(`${this.invitesBaseUrl}`);
  }
}
