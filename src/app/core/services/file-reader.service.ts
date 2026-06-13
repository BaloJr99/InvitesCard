import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  read(file: File): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reader.abort();
        observer.error('An error occurred reading the file.');
      };

      reader.onloadend = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.readAsText(file, 'UTF-8');
    });
  }

  getBase64(file: File): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reader.abort();
        observer.error('An error occurred reading the file.');
      };

      reader.onloadend = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.readAsDataURL(file);
    });
  }
}
