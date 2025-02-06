import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IAuthUser } from 'src/app/core/models/users';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  loginForm: FormGroup;

  authErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenStorageService,
    private loaderService: LoaderService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginAccount(): void {
    if (this.loginForm.valid && this.loginForm.dirty) {
      const user = this.loginForm.value;
      delete user.confirmPassword;
      this.loaderService.setLoading(true, $localize`Iniciando sesión`);
      this.authService
        .loginAccount(user as IAuthUser)
        .subscribe({
          next: (authInfo) => {
            this.authErrorMessage = '';
            if (authInfo) {
              this.tokenService.saveToken(authInfo.access_token);
              this.router.navigate(['/dashboard']);
            }
          },
          error: (httpError: HttpErrorResponse) => {
            if (httpError.status === 401) {
              this.authErrorMessage = httpError.error.error;
            }
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
