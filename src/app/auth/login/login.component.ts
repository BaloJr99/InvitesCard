import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { IAuthUser } from 'src/app/core/models/users';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef}) formInputElements!: ElementRef[];
  loginForm: FormGroup;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  authErrorMessage = "";

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private tokenService: TokenStorageService,
    private loaderService: LoaderService) {
    this.validationMessages = {
      usernameOrEmail: {
        required: $localize `Ingresar email o usuario`
      },
      password: {
        required: $localize `Ingresar contraseña`
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.loginForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.loginForm)
    });
  }

  loginAccount(): void {
    if (this.loginForm.valid) {
      if(this.loginForm.dirty) {
        const user = this.loginForm.value;
        delete user.confirmPassword;
        this.loaderService.setLoading(true, $localize `Iniciando sesión`);
        this.authService.loginAccount(user as IAuthUser).subscribe({
          next: (authInfo) => {
            this.authErrorMessage = "";
            if (authInfo) {
              this.tokenService.saveToken(authInfo.token);
              this.router.navigate(['/dashboard']);
            }
          },
          error: (httpError: HttpErrorResponse) => {
            if (httpError.status === 401) {
              this.authErrorMessage = httpError.error.error;
            }
          }
        }).add(() => {
          this.loaderService.setLoading(false);
        })
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.loginForm, true);
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.loginForm.reset();
  }
}
