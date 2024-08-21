import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IDeleteImage, IDownloadImage, IUpdateImage, IUploadImage } from '../models/images';
import { IMessageResponse } from '../models/common';

@Injectable()
export class ImagesService {
  
  baseUrl = environment.apiUrl;
  invitesBaseUrl = this.baseUrl + '/images'

  constructor(private http: HttpClient) {  }

  uploadImages(images: IUploadImage): Observable<IMessageResponse> { 
    return this.http.post<IMessageResponse>(this.invitesBaseUrl, images)
  }

  getImageByEvent(id: string): Observable<IDownloadImage[]> {
    return this.http.get<IDownloadImage[]>(`${this.invitesBaseUrl}/${id}`)
  }

  deleteImage(deleteImage: IDeleteImage): Observable<IMessageResponse> { 
    return this.http.delete<IMessageResponse>(this.invitesBaseUrl, { body: deleteImage })
  }

  updateImage(updateImage: IUpdateImage[]): Observable<IMessageResponse> { 
    return this.http.put<IMessageResponse>(this.invitesBaseUrl, updateImage)
  }
}