import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { matchPassword } from 'src/app/shared/utils/validators/matchPassword';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css',
  standalone: false,
})
export class PasswordResetComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  passwordResetForm: FormGroup;
  passwordReset = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
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
          this.route.snapshot.paramMap.get('id') ?? '',
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
}
