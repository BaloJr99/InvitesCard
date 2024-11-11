import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, take } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { CommonModalResponse, CommonModalType } from 'src/app/core/models/enum';
import { IDropdownEvent } from 'src/app/core/models/events';
import {
  IDownloadAudio,
  IDownloadImage,
  IUpdateImage,
  IUpdateImageArray,
} from 'src/app/core/models/images';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { EventsService } from 'src/app/core/services/events.service';
import { FilesService } from 'src/app/core/services/files.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrl: './files.component.css',
})
export class FilesComponent implements OnInit {
  isAdmin = false;

  events: IDropdownEvent[] = [];
  eventSelected: IDropdownEvent | undefined = undefined;

  images: IDownloadImage[] = [];
  audios: IDownloadAudio[] = [];
  scaleImageUrl = '';

  imageUpdateForm: FormArray<FormGroup<IUpdateImageArray>> = new FormArray<
    FormGroup<IUpdateImageArray>
  >([]);

  saveFilesForm: FormGroup = this.fb.group({
    photoFiles: '',
    photoFilesSource: '',
    musicFiles: '',
    musicFilesSource: '',
  });

  constructor(
    private loaderService: LoaderService,
    private eventsService: EventsService,
    private filesService: FilesService,
    private commonModalService: CommonModalService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando archivos`);

    this.eventsService
      .getDropdownEvents()
      .subscribe({
        next: (events) => {
          this.events = events;
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  searchImages(): void {
    this.clearInformation();
    this.eventSelected = this.events.find(
      (event) => event.id === $('#event-select').val()
    );
    this.getLatestFiles();
  }

  saveFiles(): void {
    if (this.saveFilesForm.controls['photoFilesSource'].value !== '') {
      this.loaderService.setLoading(true, $localize`Subiendo archivos`);
      const filesObservable: Observable<string>[] = [];

      Array.from(
        this.saveFilesForm.controls['photoFilesSource'].value as FileList
      ).forEach((file) => {
        const base64 = this.getBase64(file).pipe(take(1));
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

          combineLatest(apiCalls)
            .subscribe({
              next: (response) => {
                this.saveFilesForm.patchValue({
                  photoFiles: '',
                  photoFilesSource: '',
                });
                this.getLatestFiles();
                this.toastr.success(response[0].message);
              },
            })
            .add(() => {
              this.loaderService.setLoading(false);
            });
        },
      });
    }

    if (this.saveFilesForm.controls['musicFilesSource'].value !== '') {
      this.loaderService.setLoading(true, $localize`Subiendo archivos`);

      const musicFile = Array.from(
        this.saveFilesForm.controls['musicFilesSource'].value as FileList
      )[0];

      const formData = new FormData();
      formData.append('music', musicFile, musicFile.name);
      formData.append('eventId', this.eventSelected?.id ?? '');

      this.filesService
        .uploadMusic(formData)
        .subscribe({
          next: (response) => {
            this.saveFilesForm.patchValue({
              musicFiles: '',
              musicFilesSource: '',
            });

            this.getLatestFiles();
            this.toastr.success(response.message);
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  getLatestFiles(): void {
    if (this.eventSelected) {
      this.filesService
        .getFilesByEvent(this.eventSelected.id)
        .subscribe({
          next: (response) => {
            this.images = response.eventImages;
            this.audios = response.eventAudios;
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  showDeleteDialog(id: string): void {
    const imageFound = this.images.find((image) => image.id === id);
    const audioFound = this.audios.find((audio) => audio.id === id);

    if (imageFound || audioFound) {
      this.commonModalService
        .open({
          modalTitle: $localize`Eliminando archivo`,
          modalBody: $localize`¿Está seguro que desea eliminar el archivo?`,
          modalType: CommonModalType.Confirm,
        })
        .subscribe((response) => {
          if (response === CommonModalResponse.Confirm) {
            this.loaderService.setLoading(true, $localize`Eliminando archivo`);
            this.filesService
              .deleteFile(imageFound ?? (audioFound as IDownloadAudio))
              .subscribe({
                next: (response: IMessageResponse) => {
                  if (imageFound) {
                    this.images = this.images.filter(
                      (image) => image.id !== imageFound.id
                    );
                  }

                  if (audioFound) {
                    this.audios = this.audios.filter(
                      (audio) => audio.id !== audioFound.id
                    );
                  }
                  this.toastr.success(response.message);
                },
              })
              .add(() => {
                this.loaderService.setLoading(false);
              });
          }
        });
    }
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

  getBase64(file: File): Observable<string> {
    return new Observable((obs) => {
      const reader = new FileReader();
      reader.onload = () => {
        obs.next(reader.result as string);
        obs.complete();
      };
      reader.readAsDataURL(file);
    });
  }

  clearInformation(): void {
    this.saveFilesForm.patchValue({
      photoFiles: '',
      photoFilesSource: '',
    });

    this.images = [];
    this.audios = [];
  }

  cancelChanges(): void {
    this.imageUpdateForm = new FormArray<FormGroup<IUpdateImageArray>>([]);
    this.searchImages();
  }

  saveChanges(): void {
    if (
      this.imageUpdateForm.valid &&
      this.imageUpdateForm.controls.length > 0
    ) {
      this.loaderService.setLoading(true, $localize`Guardando archivos`);
      this.filesService
        .updateImage(this.imageUpdateForm.value as IUpdateImage[])
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.imageUpdateForm = new FormArray<FormGroup<IUpdateImageArray>>(
              []
            );
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  insertUpdatedImage(event: Event): void {
    const element = event.currentTarget as HTMLSelectElement;

    const elementId = element.id.split('-').pop();

    if (!this.imageUpdateForm.invalid && elementId) {
      const imageUpdated = this.images[parseInt(elementId)];

      if (element.value !== (imageUpdated.imageUsage ?? '')) {
        const findControlIfAlreadyExists =
          this.imageUpdateForm.controls.findIndex(
            (formGroup) => formGroup.value.id === imageUpdated.id
          );

        if (findControlIfAlreadyExists !== -1) {
          this.imageUpdateForm.removeAt(findControlIfAlreadyExists);
        }

        this.imageUpdateForm.push(
          this.fb.group({
            id: new FormControl(imageUpdated.id),
            imageUsage: new FormControl(element.value),
          } as IUpdateImageArray)
        );
      } else {
        const indexOfRolledbackValue = this.imageUpdateForm.controls.findIndex(
          (formGroup) => formGroup.value.id === imageUpdated.id
        );

        if (indexOfRolledbackValue !== -1) {
          this.imageUpdateForm.removeAt(indexOfRolledbackValue);
        }
      }
    }
  }
}
