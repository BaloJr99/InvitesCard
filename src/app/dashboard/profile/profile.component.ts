import {
  Component,
  ElementRef,
  OnInit,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IMessageResponse } from 'src/app/core/models/common';
import { IUser, IUserProfile } from 'src/app/core/models/users';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsersService } from 'src/app/core/services/users.service';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  user!: IUserProfile;
  isMyProfile = true;
  showChangePassword = false;
  private userInformation: IUser;

  createProfileForm: FormGroup = this.fb.group(
    {
      id: ['', Validators.required],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      profilePhoto: [''],
      controlIsValid: [true],
    },
    {
      validators: controlIsDuplicated,
    }
  );

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private tokenService: TokenStorageService
  ) {
    this.userInformation = this.tokenService.getTokenValues() as IUser;
  }

  ngOnInit(): void {
    this.user = this.route.snapshot.data['userProfile'];
    this.createProfileForm.patchValue(this.user);

    this.isMyProfile = this.userInformation.id === this.user.id;

    this.createProfileForm.markAsUntouched();
    this.loaderService.setLoading(false);
  }

  saveProfile() {
    if (this.createProfileForm.valid && this.createProfileForm.dirty) {
      this.updateProfile();
    } else {
      this.createProfileForm.markAllAsTouched();
    }
  }

  updateProfile() {
    this.loaderService.setLoading(true, $localize`Actualizando perfil`);
    this.usersService
      .updateProfile(this.createProfileForm.value)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
          this.user = this.createProfileForm.value;
          this.createProfileForm.markAsUntouched();
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  clearInputs(): void {
    this.createProfileForm.reset({
      id: '',
      username: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      gender: '',
      profilePhoto: '',
      controlIsValid: true,
    });
  }

  cancelChanges() {
    this.clearInputs();
    this.createProfileForm.patchValue(this.user);
  }

  checkUsername(event: Event) {
    const username = (event.target as HTMLInputElement).value;
    if (username === this.user.username) {
      this.createProfileForm.patchValue({ controlIsValid: true });
      return;
    }

    if (username === '') {
      this.createProfileForm.patchValue({ controlIsValid: false });
      return;
    }

    this.usersService.checkUsername(username).subscribe({
      next: (response: boolean) => {
        this.createProfileForm.patchValue({ controlIsValid: !response });
        this.createProfileForm.updateValueAndValidity();
      },
    });
  }

  updateUserProfilePhoto(profileUrl: string) {
    this.user.profilePhoto = profileUrl;
    this.createProfileForm.patchValue({ profilePhoto: profileUrl });
  }

  changePassword() {
    if (this.userInformation.id !== this.user.id) {
      this.loaderService.setLoading(
        true,
        $localize`Enviando correo electrónico`
      );
      this.authService
        .sendResetPasswordToUser(this.user.id)
        .subscribe({
          next: (response: IMessageResponse) => {
            this.toastr.success(response.message);
          },
        })
        .add(() => this.loaderService.setLoading(false));
    } else {
      this.showChangePassword = true;
    }
  }

  showChangePasswordValue(value: boolean) {
    this.showChangePassword = !value;
  }
}
