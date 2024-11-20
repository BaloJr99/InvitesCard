import {
  AfterViewInit,
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
import { fromEvent, merge, Observable } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { IUser, IUserProfile } from 'src/app/core/models/users';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { UsersService } from 'src/app/core/services/users.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, AfterViewInit {
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

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private tokenService: TokenStorageService
  ) {
    this.validationMessages = {
      username: {
        required: $localize`El nombre de usuario es requerido`,
      },
      firstName: {
        required: $localize`El nombre es requerido`,
      },
      lastName: {
        required: $localize`El apellido es requerido`,
      },
      phoneNumber: {
        required: $localize`El número de teléfono es requerido`,
      },
      email: {
        required: $localize`El correo electrónico es requerido`,
      },
      gender: {
        required: $localize`El género es requerido`,
      },
      controlValueDuplicated: {
        duplicated: $localize`Ya existe un usuario con este nombre de usuario`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
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
      this.displayMessage = this.genericValidator.processMessages(
        this.createProfileForm,
        true
      );
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

    this.displayMessage = {};
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createProfileForm.valueChanges, ...controlBlurs).subscribe(
      () => {
        this.displayMessage = this.genericValidator.processMessages(
          this.createProfileForm
        );
      }
    );
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
        this.displayMessage = this.genericValidator.processMessages(
          this.createProfileForm
        );
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
