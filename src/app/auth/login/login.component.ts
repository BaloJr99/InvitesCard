import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IAuthUser } from 'src/app/core/models/users';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../shared/pipes/validation-error.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [SharedModule, ValidationPipe, ValidationErrorPipe],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private tokenService = inject(TokenStorageService);

  loginForm: FormGroup;

  authErrorMessage = '';
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginAccount(): void {
    if (this.loginForm.valid && this.loginForm.dirty) {
      const user = this.loginForm.value;
      delete user.confirmPassword;
      this.authService.loginAccount(user as IAuthUser).subscribe({
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
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    const password = document.getElementById('password') as HTMLInputElement;
    if (this.showPassword) {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }
}
