import {
  Component,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  forgotPasswordForm: FormGroup;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {
    this.forgotPasswordForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
    });
  }

  sendResetPassword(): void {
    if (this.forgotPasswordForm.valid && this.forgotPasswordForm.dirty) {
      this.loaderService.setLoading(true, $localize`Enviando correo`);
      this.authService
        .sendResetPassword(this.forgotPasswordForm.value)
        .subscribe({
          next: () => {
            this.emailSent = true;
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
