import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { IAlbumImage, IAlbumResolved } from 'src/app/core/models/gallery';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-album',
  imports: [SharedModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css',
})
export class AlbumComponent {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private galleryService: GalleryService,
    private fileReaderService: FileReaderService,
    private toastrService: ToastrService
  ) {}

  private albumResolved = {} as IAlbumResolved;
  private uploadProgress = new Subject<string>();
  uploadProgress$ = this.uploadProgress.asObservable();

  private albumImages = new BehaviorSubject<IAlbumImage[]>([]);
  albumImages$ = this.albumImages.asObservable();

  saveFilesForm: FormGroup = this.fb.group({
    photoFiles: '',
    photoFilesSource: '',
  });

  private refreshImages = new BehaviorSubject<boolean>(true);
  refreshImages$ = this.refreshImages.asObservable();

  vm$ = this.route.data.pipe(
    map((data) => {
      this.albumResolved = data['albumResolved'];

      // Get parent id from the route
      const nameOfEvent = this.route.snapshot.params['id'];
      const albumId = this.route.snapshot.params['albumId'];

      return {
        isActive: this.albumResolved.isActive,
        albumId,
        nameOfEvent,
      };
    }),
    switchMap((albumImagesResolved) =>
      this.refreshImages$.pipe(
        map(() => {
          return albumImagesResolved;
        }),
        switchMap((albumImagesResolved) =>
          this.galleryService.getAlbumImages(albumImagesResolved.albumId).pipe(
            tap((albumImages) => {
              this.albumImages.next(albumImages);
            }),
            map(() => {
              return {
                isActive: albumImagesResolved.isActive,
                nameOfEvent: albumImagesResolved.nameOfEvent,
              };
            })
          )
        )
      )
    )
  );

  onPhotosChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.saveFilesForm.patchValue({
      photoFilesSource: element.files,
    });
  }

  saveFiles(): void {
    if (this.saveFilesForm.controls['photoFilesSource'].value !== '') {
      const filesObservable: Observable<string>[] = [];
      const totalFiles = (
        this.saveFilesForm.controls['photoFilesSource'].value as FileList
      ).length;
      let uploadedFiles = 0;

      Array.from(
        this.saveFilesForm.controls['photoFilesSource'].value as FileList
      ).forEach((file) => {
        const base64 = this.fileReaderService.getBase64(file).pipe(take(1));
        filesObservable.push(base64);
      });

      combineLatest(filesObservable).subscribe({
        next: (filesBase64) => {
          const apiCalls: Observable<IMessageResponse>[] = [];

          filesBase64.forEach((base64) => {
            apiCalls.push(
              this.galleryService
                .uploadImages({
                  albumId: this.route.snapshot.params['albumId'],
                  image: base64,
                })
                .pipe(
                  tap(() => {
                    uploadedFiles++;
                    let progress = Math.ceil(
                      (uploadedFiles / totalFiles) * 100
                    );
                    progress = progress > 100 ? 100 : progress;
                    this.uploadProgress.next(`${progress}%`);
                  })
                )
            );
          });

          combineLatest(apiCalls).subscribe({
            next: (response) => {
              this.saveFilesForm.patchValue({
                photoFiles: '',
                photoFilesSource: '',
              });
              this.refreshImages.next(true);
              this.toastrService.success(response[0].message);
            },
          });
        },
      });
    }
  }
}
