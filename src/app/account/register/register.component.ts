import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { AuthService } from 'src/core/services/auth.service';
import { LoaderService } from 'src/core/services/loader.service';
import { IUser } from 'src/shared/interfaces';
import { matchPassword } from './matchPassword.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  registrationForm: FormGroup;
  registrationErrorMessage = "";

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private loaderService: LoaderService) {
    this.validationMessages = {
      username: {
        required: 'Ingresar nombre de usuario'
      },
      password: {
        required: 'Ingresar contraseña'
      },
      email: {
        required: 'Ingresar correo'
      },
      confirmPassword: {
        required: 'Confirmar contraseña'
      },
      passwordMatch: {
        matchError: 'Las contraseñas no coinciden'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: matchPassword
    })
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.registrationForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.registrationForm)
    });
  }

  saveAccount(): void {
    if (this.registrationForm.valid) {
      if(this.registrationForm.dirty) {
        const user = this.registrationForm.value;
        delete user.confirmPassword;
        this.loaderService.setLoading(true);
        this.authService.createNewAccount(user as IUser).subscribe({
          next: (token) => {
            if (token) {
              this.router.navigate(['/account/login']);
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 409) {
              this.registrationErrorMessage = error.error.message;
            }
          }
        }).add(() => {
          this.loaderService.setLoading(false);
        })
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.registrationForm, true);
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.registrationForm.reset();
  }
}
