import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMessageResponse } from '../models/common';
import {
  IAlbum,
  IAlbumImage,
  IUploadAlbumImage,
  IUpsertAlbum,
} from '../models/gallery';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private http = inject(HttpClient);
  private datePipe = inject(DatePipe);

  private baseUrl = environment.apiUrl;
  private invitesBaseUrl = this.baseUrl + '/gallery';

  getAlbums(eventId: string): Observable<IAlbum[]> {
    return this.http.get<IAlbum[]>(`${this.invitesBaseUrl}/${eventId}`).pipe(
      map((albums) => {
        return albums.map((album) => {
          const newAlbum = album;
          if (newAlbum.thumbnail != '') {
            const fileUrl = album.thumbnail.split('upload/');
            const cloudinaryUrl =
              fileUrl[0] + 'upload/c_thumb,w_300/' + fileUrl[1];
            newAlbum.thumbnail = cloudinaryUrl;
          }

          newAlbum.dateOfAlbum = this.datePipe.transform(
            newAlbum.dateOfAlbum,
            'shortDate',
          ) as string;
          return newAlbum;
        });
      }),
    );
  }

  getAlbumImages(albumId: string): Observable<IAlbumImage[]> {
    return this.http
      .get<IAlbumImage[]>(`${this.invitesBaseUrl}/images/${albumId}`)
      .pipe(
        map((images) => {
          return images.map((image) => {
            const fileUrl = image.fileUrl.split('upload/');
            const cloudinaryUrl =
              fileUrl[0] + 'upload/c_thumb,w_300/' + fileUrl[1];
            return {
              ...image,
              fileUrl: cloudinaryUrl,
            } as IAlbumImage;
          });
        }),
      );
  }

  createAlbum(album: IUpsertAlbum): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(`${this.invitesBaseUrl}`, album);
  }

  updateAlbum(album: IUpsertAlbum, id: string): Observable<IMessageResponse> {
    return this.http.put<IMessageResponse>(
      `${this.invitesBaseUrl}/${id}`,
      album,
    );
  }

  checkAlbum(eventId: string, nameOfAlbum: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.invitesBaseUrl}/check-album/${eventId}/${nameOfAlbum}`,
    );
  }

  deleteAlbum(id: string): Observable<IMessageResponse> {
    return this.http.delete<IMessageResponse>(`${this.invitesBaseUrl}/${id}`);
  }

  uploadImages(images: IUploadAlbumImage): Observable<IMessageResponse> {
    return this.http.post<IMessageResponse>(
      `${this.invitesBaseUrl}/images`,
      images,
    );
  }
}
