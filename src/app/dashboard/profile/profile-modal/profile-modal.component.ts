import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { UsersService } from 'src/app/core/services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileModalComponent {
  private userId = new BehaviorSubject<string>('');
  userId$ = this.userId.asObservable();
  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set userIdValue(value: string) {
    this.userId.next(value);
  }
  @Input() set showModalValue(value: boolean) {
    this.showModal.next(value);
  }
  @Output() updateProfilePhoto = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  profilePhotoForm: FormGroup = this.fb.group({
    photoFiles: ['', Validators.required],
    photoFilesSource: ['', Validators.required],
  });

  vm$ = combineLatest([this.userId$, this.showModal$]).pipe(
    tap(([, showModal]) => {
      if (showModal) {
        $('#profileModal').modal('show');
        $('#profileModal').on('hidden.bs.modal', () => {
          this.clearForm();
          this.closeModal.emit();
        });
      } else {
        $('#profileModal').modal('hide');
      }
    })
  );

  clearForm(): void {
    this.profilePhotoForm.reset({
      photoFiles: '',
      photoFilesSource: '',
    });

    const container = document.getElementById(
      'image-container'
    ) as HTMLImageElement;
    const profilePhoto = document.getElementById(
      'profile-photo'
    ) as HTMLImageElement;

    profilePhoto.src = '';
    container.style.display = 'none';
  }

  constructor(
    private fb: FormBuilder,
    private fileReaderService: FileReaderService,
    private userService: UsersService,
    private toastr: ToastrService
  ) {}

  onPhotoChange(event: Event): void {
    const container = document.getElementById(
      'image-container'
    ) as HTMLImageElement;
    const profilePhoto = document.getElementById(
      'profile-photo'
    ) as HTMLImageElement;

    container.style.display = 'none';
    profilePhoto.src = '';

    const element = event.currentTarget as HTMLInputElement;
    const errorFiles: string[] = [];

    if (element.files && element.files.length > 0) {
      Array.from(element.files).forEach((file) => {
        if (file.size > 2097152) {
          errorFiles.push(file.name);
        }
      });

      if (errorFiles.length > 0) {
        this.profilePhotoForm.patchValue({
          photoFiles: '',
        });
        this.toastr.error(
          $localize`El tamaño limite es de 2MB: ${errorFiles.toString()}`
        );
      } else {
        this.profilePhotoForm.patchValue({
          photoFilesSource: element.files.item(0),
        });

        const reader = new FileReader();
        container.style.display = 'block';

        reader.onload = function (e) {
          profilePhoto.setAttribute('src', e.target?.result as string);
        };

        reader.readAsDataURL(element.files[0]);
      }
    } else {
      this.clearForm();
    }
  }

  saveProfilePhoto() {
    this.fileReaderService
      .getBase64(this.profilePhotoForm.controls['photoFilesSource'].value)
      .subscribe({
        next: (fileBase64) => {
          this.userService
            .uploadProfilePhoto({
              id: this.userId.value,
              profilePhotoSource: fileBase64,
            })
            .subscribe({
              next: (response: IMessageResponse) => {
                this.toastr.success(response.message);
                this.profilePhotoForm.patchValue({
                  photoFiles: '',
                  photoFilesSource: '',
                });

                this.updateProfilePhoto.emit(response.id);
                $('#profileModal').modal('hide');
              },
            });
        },
      });
  }
}
