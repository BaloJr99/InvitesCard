import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IDeleteFile,
  IDownloadFiles,
  IUpdateImage,
  IUploadImage,
} from '../models/images';
import { IMessageResponse } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/files';

  constructor(private http: HttpClient) {}

  uploadImages(images: IUploadImage): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(this.invitesBaseUrl, images);
  }

  uploadMusic(music: FormData): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(this.invitesBaseUrl, music);
  }

  getFilesByEvent(id: string): Observable<IDownloadFiles> {
    return this.http.get<IDownloadFiles>(`${this.invitesBaseUrl}/${id}`);
  }

  deleteFile(deleteFile: IDeleteFile): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(this.invitesBaseUrl, {
      body: deleteFile,
    });
  }

  updateImage(updateImage: IUpdateImage[]): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(this.invitesBaseUrl, updateImage);
  }
}
