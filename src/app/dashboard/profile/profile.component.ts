import { Component, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { IUserProfile } from 'src/app/core/models/users';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UsersService } from 'src/app/core/services/users.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  errorMessage = '';
  user!: IUserProfile;
  
  createProfileForm!: FormGroup;
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private route: ActivatedRoute, 
    private usersService: UsersService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService) { 
    this.validationMessages = {
      username: {
        required: $localize `El nombre de usuario es requerido`,
      },
      firstName: {
        required: $localize `El nombre es requerido`,
      },
      lastName: {
        required: $localize `El apellido es requerido`,
      },
      phoneNumber: {
        required: $localize `El número de teléfono es requerido`,
      },
      email: {
        required: $localize `El correo electrónico es requerido`,
      },
      gender:{
        required: $localize `El género es requerido`,
      } 
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createProfileForm = this.fb.group({
      id: ['', Validators.required],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      profilePhoto: ['']
    });

    this.route.data.subscribe(() => {
      this.user = this.route.snapshot.data['userProfile'];
      this.createProfileForm.patchValue(
        this.user
      );

      this.createProfileForm.markAsUntouched();
    });
  }

  saveProfile() {
    if (this.createProfileForm.valid && this.createProfileForm.dirty) {
      this.updateProfile();
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createProfileForm, true);
    }
  }

  updateProfile() {
    this.loaderService.setLoading(true, $localize `Actualizando perfil`);
    this.usersService.updateProfile(this.createProfileForm.value).subscribe({
      next: (response: IMessageResponse) => {
        this.toastr.success(response.message);
        this.user = this.createProfileForm.value;
        this.createProfileForm.markAsUntouched();
      }
    }).add(() => {
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
      profilePhoto: ''
    });

    this.displayMessage = {};
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createProfileForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createProfileForm);
    });
  }

  cancelChanges() {
    this.clearInputs();
    this.createProfileForm.patchValue(this.user);
  }
}
