import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { IUser, IUserProfile } from 'src/app/core/models/users';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsersService } from 'src/app/core/services/users.service';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: false,
})
export class ProfileComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private user = new BehaviorSubject<IUserProfile>({} as IUserProfile);
  user$ = this.user.asObservable();

  showChangePassword = false;
  showProfileModal = false;

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
    private tokenService: TokenStorageService
  ) {
    this.userInformation = this.tokenService.getTokenValues() as IUser;
  }

  vm$ = this.user$.pipe(
    map((user) => {
      let isMyProfile = true;

      isMyProfile = this.userInformation.id === user.id;

      this.createProfileForm.patchValue(user);

      return { user, isMyProfile };
    })
  );

  ngOnInit(): void {
    this.user.next(this.route.snapshot.data['userProfile']);
  }

  saveProfile() {
    if (this.createProfileForm.valid && this.createProfileForm.dirty) {
      this.usernameDuplicated(
        this.createProfileForm.controls['username'].value as string
      ).subscribe((isDuplicated) => {
        if (!isDuplicated) {
          this.updateProfile();
        }
      });
    } else {
      this.createProfileForm.markAllAsTouched();
    }
  }

  updateProfile() {
    this.usersService.updateProfile(this.createProfileForm.value).subscribe({
      next: (response: IMessageResponse) => {
        this.toastr.success(response.message);
        this.user.next(this.createProfileForm.value);
      },
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
    this.createProfileForm.patchValue(this.user.value);
  }

  updateUserProfilePhoto(profileUrl: string) {
    const oldUserData = this.user.value;
    oldUserData.profilePhoto = profileUrl;

    this.showProfileModal = false;
    this.user.next(oldUserData);
  }

  changePassword() {
    const userProfile = this.user.value;
    if (this.userInformation.id !== userProfile.id) {
      this.authService.sendResetPasswordToUser(userProfile.id).subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
        },
      });
    } else {
      this.showChangePassword = true;
    }
  }

  showChangePasswordValue(value: boolean) {
    this.showChangePassword = !value;
  }

  openProfileModal() {
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  usernameDuplicated(newUsername: string): Observable<boolean> {
    if (newUsername === this.user.value.username) {
      this.createProfileForm.patchValue({ controlIsValid: true });
      this.createProfileForm.updateValueAndValidity();
      return of(false);
    } else {
      return this.usersService.checkUsername(newUsername).pipe(
        map((response: boolean) => {
          this.createProfileForm.patchValue({
            controlIsValid: !response,
          });
          this.createProfileForm.updateValueAndValidity();
          return response;
        })
      );
    }
  }

  removeValidation() {
    this.createProfileForm.patchValue({ controlIsValid: true });
  }
}
