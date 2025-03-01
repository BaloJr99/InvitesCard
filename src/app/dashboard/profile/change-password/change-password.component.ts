import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IMessageResponse } from 'src/app/core/models/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { matchPassword } from 'src/app/shared/utils/validators/matchPassword';
import { CommonModule } from '@angular/common';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../../shared/pipes/validation-error.pipe';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationPipe,
    ValidationErrorPipe,
  ],
})
export class ChangePasswordComponent {
  @Input() userId: string = '';
  @Output() showChangePasswordValue = new EventEmitter<boolean>();
  passwordResetForm: FormGroup = this.fb.group(
    {
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: matchPassword,
    }
  );

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private authService: AuthService
  ) {}

  resetPassword(): void {
    if (this.passwordResetForm.valid && this.passwordResetForm.dirty) {
      this.authService
        .resetPassword(this.userId, this.passwordResetForm.value)
        .subscribe({
          next: (response: IMessageResponse) => {
            this.toastrService.success(response.message);
          },
        });
    } else {
      this.passwordResetForm.markAllAsTouched();
    }
  }

  cancelResetPassword(): void {
    this.passwordResetForm.patchValue({
      password: '',
      confirmPassword: '',
    });

    this.showChangePasswordValue.emit(true);
  }
}
