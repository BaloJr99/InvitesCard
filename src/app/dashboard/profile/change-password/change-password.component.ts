import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IMessageResponse } from 'src/app/core/models/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { matchPassword } from 'src/app/shared/utils/validators/matchPassword';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
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
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  resetPassword(): void {
    if (this.passwordResetForm.valid && this.passwordResetForm.dirty) {
      this.loaderService.setLoading(true, $localize`Cambiando contraseña`);
      this.authService
        .resetPassword(this.userId, this.passwordResetForm.value)
        .subscribe({
          next: (response: IMessageResponse) => {
            this.toastrService.success(response.message);
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
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
