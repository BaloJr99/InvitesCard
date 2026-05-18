import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { matchPassword } from 'src/app/shared/utils/validators/matchPassword';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../../shared/pipes/validation-error.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css',
  imports: [SharedModule, ValidationPipe, ValidationErrorPipe],
})
export class PasswordResetComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  passwordResetForm: FormGroup;
  passwordReset = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.passwordResetForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: matchPassword,
      }
    );
  }

  ngOnInit(): void {
    this.passwordReset = !this.route.snapshot.data['reset'];
  }

  resetPassword(): void {
    if (this.passwordResetForm.valid && this.passwordResetForm.dirty) {
      this.authService
        .resetPassword(
          this.route.snapshot.params['id'],
          this.passwordResetForm.value
        )
        .subscribe({
          next: () => {
            this.passwordReset = true;
          },
        });
    } else {
      this.passwordResetForm.markAllAsTouched();
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

  toggleConfirmShowPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
    const password = document.getElementById('confirmPassword') as HTMLInputElement;
    if (this.showConfirmPassword) {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }
}
