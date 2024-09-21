import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css'],
})
export class ProfileModalComponent implements OnInit {
  @Input() userId: string = '';
  @Output() updateProfilePhoto = new EventEmitter<string>();
  showImage = false;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private userService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    $('#profileModal').on('hidden.bs.modal', () => {
      this.profilePhotoForm.patchValue({
        photoFiles: '',
        photoFilesSource: '',
      });

      this.showImage = false;
    });
  }

  profilePhotoForm: FormGroup = this.fb.group({
    photoFiles: ['', Validators.required],
    photoFilesSource: ['', Validators.required],
  });

  onPhotoChange(event: Event): void {
    const container = document.getElementById(
      'image-container'
    ) as HTMLImageElement;
    const profilePhoto = document.getElementById(
      'profile-photo'
    ) as HTMLImageElement;

    this.showImage = false;
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

        this.showImage = true;

        const reader = new FileReader();
        container.style.display = 'block';

        reader.onload = function (e) {
          profilePhoto.setAttribute('src', e.target?.result as string);
        };

        reader.readAsDataURL(element.files[0]);
      }
    }
  }

  saveProfilePhoto() {
    this.loaderService.setLoading(true, $localize`Extrayendo imagenes`);
    this.getBase64(this.profilePhotoForm.controls['photoFilesSource'].value)
      .pipe(take(1))
      .subscribe({
        next: (fileBase64) => {
          this.loaderService.setLoading(true, $localize`Subiendo imagenes`);
          this.userService
            .uploadProfilePhoto({
              id: this.userId,
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
            })
            .add(() => {
              this.loaderService.setLoading(false);
            });
        },
      });
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
}
