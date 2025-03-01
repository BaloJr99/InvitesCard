import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, map, Observable, of, tap } from 'rxjs';
import { IAlbumAction, IUpsertAlbum } from 'src/app/core/models/gallery';
import { IMessageResponse } from 'src/app/core/models/common';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { ValidationErrorPipe } from 'src/app/shared/pipes/validation-error.pipe';
import { ValidationPipe } from 'src/app/shared/pipes/validation.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';

@Component({
  selector: 'app-album-modal',
  imports: [SharedModule, ValidationErrorPipe, ValidationPipe],
  templateUrl: './album-modal.component.html',
  styleUrl: './album-modal.component.css',
})
export class AlbumModalComponent {
  private baseAlbum = {
    id: '',
    nameOfAlbum: '',
    eventId: '',
  } as IUpsertAlbum;

  private albumAction = new BehaviorSubject<IAlbumAction>({
    album: { ...this.baseAlbum },
    isNew: true,
  } as IAlbumAction);
  albumAction$ = this.albumAction.asObservable();

  @Input() set albumActionValue(value: IAlbumAction) {
    this.albumAction.next(value);
  }

  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set showModalValue(value: boolean) {
    this.showModal.next(value);
  }

  @Output() updateAlbums: EventEmitter<IAlbumAction> = new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  createAlbumForm = this.fb.group(
    {
      id: '',
      nameOfAlbum: ['', Validators.required],
      eventId: ['', Validators.required],
      controlIsValid: true,
    },
    { validators: controlIsDuplicated }
  );

  constructor(
    private galleryService: GalleryService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  vm$ = combineLatest([this.showModal$, this.albumAction$]).pipe(
    tap(([showModal, albumAction]) => {
      this.createAlbumForm.patchValue({
        ...albumAction.album,
        controlIsValid: true,
      });

      if (showModal) {
        $('#albumModal').modal('show');
        $('#albumModal').on('hidden.bs.modal', () => {
          this.closeModal.emit();
        });
      } else {
        this.clearInputs();
        $('#albumModal').modal('hide');
      }
    })
  );

  saveAlbum(): void {
    if (this.createAlbumForm.valid && this.createAlbumForm.dirty) {
      this.albumDuplicated(
        this.createAlbumForm.controls['nameOfAlbum'].value as string
      ).subscribe({
        next: (isDuplicated: boolean) => {
          if (!isDuplicated) {
            if (this.createAlbumForm.controls['id'].value !== '') {
              this.updateAlbum();
            } else {
              this.createAlbum();
            }
          }
        },
      });
    } else {
      this.createAlbumForm.markAllAsTouched();
    }
  }

  createAlbum() {
    this.galleryService
      .createAlbum(this.createAlbumForm.value as IUpsertAlbum)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateAlbums.emit({
            album: {
              ...(this.createAlbumForm.value as IUpsertAlbum),
              id: response.id,
            },
            isNew: true,
          });
          this.toastr.success(response.message);
        },
      });
  }

  updateAlbum() {
    this.galleryService
      .updateAlbum(
        this.createAlbumForm.value as IUpsertAlbum,
        this.createAlbumForm.controls['id'].value as string
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateAlbums.emit({
            album: {
              ...(this.createAlbumForm.value as IUpsertAlbum),
            },
            isNew: false,
          });
          this.toastr.success(response.message);
        },
      });
  }

  albumDuplicated(newAlbum: string): Observable<boolean> {
    if (newAlbum === this.albumAction.value.album.nameOfAlbum) {
      this.createAlbumForm.patchValue({ controlIsValid: true });
      this.createAlbumForm.updateValueAndValidity();
      return of(false);
    } else {
      return this.galleryService
        .checkAlbum(this.albumAction.value.album.eventId, newAlbum)
        .pipe(
          map((response: boolean) => {
            this.createAlbumForm.patchValue({
              controlIsValid: !response,
            });
            this.createAlbumForm.updateValueAndValidity();
            return response;
          })
        );
    }
  }

  removeValidation(): void {
    this.createAlbumForm.patchValue({ controlIsValid: true });
  }

  clearInputs(): void {
    this.createAlbumForm.reset({
      id: '',
      nameOfAlbum: '',
      eventId: '',
      controlIsValid: true,
    });
  }
}
