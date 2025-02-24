import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, take, tap } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { CommonModalResponse, CommonModalType } from 'src/app/core/models/enum';
import { IDropdownEvent } from 'src/app/core/models/events';
import {
  IDeleteFile,
  IDownloadAudio,
  IDownloadImage,
  IUpdateAudioArray,
  IUpdateImage,
  IUpdateImageArray,
} from 'src/app/core/models/images';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { EventsService } from 'src/app/core/services/events.service';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { FilesService } from 'src/app/core/services/files.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.css',
  imports: [SharedModule],
})
export class FilesComponent {
  events: IDropdownEvent[] = [];
  eventSelected: IDropdownEvent | undefined = undefined;

  scaleImageUrl = '';

  filesUpdateForm = this.fb.group({
    images: this.fb.array<FormGroup<IUpdateImageArray>>([]),
    audios: this.fb.array<FormGroup<IUpdateAudioArray>>([]),
  });

  saveFilesForm: FormGroup = this.fb.group({
    photoFiles: '',
    photoFilesSource: '',
    musicFiles: '',
    musicFilesSource: '',
  });

  constructor(
    private eventsService: EventsService,
    private filesService: FilesService,
    private fileReaderService: FileReaderService,
    private commonModalService: CommonModalService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  vm$ = this.eventsService.getDropdownEvents().pipe(
    tap((events) => {
      this.events = events;
    })
  );

  searchImages(): void {
    this.eventSelected = this.events.find(
      (event) => event.id === $('#event-select').val()
    );
    this.getLatestFiles();
  }

  saveFiles(): void {
    if (this.saveFilesForm.controls['photoFilesSource'].value !== '') {
      const filesObservable: Observable<string>[] = [];

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
              this.filesService.uploadImages({
                eventId: this.eventSelected?.id ?? '',
                image: base64,
              })
            );
          });

          combineLatest(apiCalls).subscribe({
            next: (response) => {
              this.saveFilesForm.patchValue({
                photoFiles: '',
                photoFilesSource: '',
              });
              this.getLatestFiles();
              this.toastr.success(response[0].message);
            },
          });
        },
      });
    }

    if (this.saveFilesForm.controls['musicFilesSource'].value !== '') {
      const musicFile = Array.from(
        this.saveFilesForm.controls['musicFilesSource'].value as FileList
      )[0];

      const formData = new FormData();
      formData.append('music', musicFile, musicFile.name);
      formData.append('eventId', this.eventSelected?.id ?? '');

      this.filesService.uploadMusic(formData).subscribe({
        next: (response) => {
          this.saveFilesForm.patchValue({
            musicFiles: '',
            musicFilesSource: '',
          });

          this.getLatestFiles();
          this.toastr.success(response.message);
        },
      });
    }
  }

  getLatestFiles(): void {
    this.clearInformation();
    if (this.eventSelected) {
      this.filesService.getFilesByEvent(this.eventSelected.id).subscribe({
        next: (response) => {
          const images = response.eventImages;
          const audios = response.eventAudios;

          if (images.length > 0) {
            this.filesUpdateForm.setControl(
              'images',
              this.fb.array<FormGroup<IUpdateImageArray>>(
                images.map((image) =>
                  this.fb.group({
                    id: new FormControl(image.id),
                    imageUsage: new FormControl(image.imageUsage ?? ''),
                    fileUrl: new FormControl(image.fileUrl),
                    publicId: new FormControl(image.publicId),
                  } as IUpdateImageArray)
                )
              )
            );
          }

          if (audios.length > 0) {
            this.filesUpdateForm.setControl(
              'audios',
              this.fb.array<FormGroup<IUpdateAudioArray>>(
                audios.map((audio) =>
                  this.fb.group({
                    id: new FormControl(audio.id),
                    fileUrl: new FormControl(audio.fileUrl),
                    publicId: new FormControl(audio.publicId),
                  } as IUpdateAudioArray)
                )
              )
            );
          }
        },
      });
    }
  }

  showImageDeleteDialog(id: string): void {
    const imageFound = this.filesUpdateForm.controls['images'].value.find(
      (image) => image.id === id
    ) as IDownloadImage;

    this.showDeleteDialog({
      id: imageFound.id,
      publicId: imageFound.publicId,
    } as IDeleteFile);
  }

  showAudioDeleteDialog(id: string): void {
    const audioFound = this.filesUpdateForm.controls['audios'].value.find(
      (audio) => audio.id === id
    ) as IDownloadAudio;

    this.showDeleteDialog({
      id: audioFound.id,
      publicId: audioFound.publicId,
    } as IDeleteFile);
  }

  showDeleteDialog(file: IDeleteFile): void {
    this.commonModalService
      .open({
        modalTitle: $localize`Eliminando archivo`,
        modalBody: $localize`¿Está seguro que desea eliminar el archivo?`,
        modalType: CommonModalType.Confirm,
      })
      .subscribe((response) => {
        if (response === CommonModalResponse.Confirm) {
          this.filesService.deleteFile(file).subscribe({
            next: (response: IMessageResponse) => {
              this.getLatestFiles();
              this.toastr.success(response.message);
            },
          });
        }
      });
  }

  onPhotosChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const errorFiles: string[] = [];
    if (element.files) {
      Array.from(element.files).forEach((file) => {
        if (file.size > 2097152) {
          errorFiles.push(file.name);
        }
      });

      if (errorFiles.length > 0) {
        this.saveFilesForm.patchValue({
          photoFiles: '',
        });
        this.toastr.error(
          $localize`El tamaño limite es de 2MB: ${errorFiles.toString()}`
        );
      } else {
        this.saveFilesForm.patchValue({
          photoFilesSource: element.files,
        });
      }
    }
  }

  onMusicChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const errorFiles: string[] = [];

    if (element.files) {
      Array.from(element.files).forEach((file) => {
        if (file.size > 5242880) {
          errorFiles.push(file.name);
        }
      });

      if (errorFiles.length > 0) {
        this.saveFilesForm.patchValue({
          musicFiles: '',
        });
        this.toastr.error(
          $localize`El tamaño limite es de 5MB: ${errorFiles.toString()}`
        );
      } else {
        this.saveFilesForm.patchValue({
          musicFilesSource: element.files,
        });
      }
    }
  }

  clearInformation(): void {
    this.saveFilesForm.patchValue({
      photoFiles: '',
      photoFilesSource: '',
    });

    this.filesUpdateForm = this.fb.group({
      images: this.fb.array<FormGroup<IUpdateImageArray>>([]),
      audios: this.fb.array<FormGroup<IUpdateAudioArray>>([]),
    });
  }

  cancelChanges(): void {
    this.filesUpdateForm = this.fb.group({
      images: this.fb.array<FormGroup<IUpdateImageArray>>([]),
      audios: this.fb.array<FormGroup<IUpdateAudioArray>>([]),
    });
    this.searchImages();
  }

  saveChanges(): void {
    if (this.filesUpdateForm.valid && this.filesUpdateForm.dirty) {
      this.filesService
        .updateImage(
          this.filesUpdateForm.controls['images'].value as IUpdateImage[]
        )
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.filesUpdateForm.markAsUntouched();
          },
        });
    }
  }
}
