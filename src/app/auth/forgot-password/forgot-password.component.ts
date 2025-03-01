import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../shared/pipes/validation-error.pipe';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  imports: [SharedModule, ValidationPipe, ValidationErrorPipe],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  emailSent = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
    });
  }

  sendResetPassword(): void {
    if (this.forgotPasswordForm.valid && this.forgotPasswordForm.dirty) {
      this.authService
        .sendResetPassword(this.forgotPasswordForm.value)
        .subscribe({
          next: () => {
            this.emailSent = true;
          },
        });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
