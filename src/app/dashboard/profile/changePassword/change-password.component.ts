import {
  AfterViewInit,
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
import { fromEvent, merge, Observable } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { matchPassword } from 'src/app/shared/utils/validators/matchPassword';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  @Input() userId: string = '';
  @Output() showChangePasswordValue = new EventEmitter<boolean>();
  passwordResetForm: FormGroup;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {
    this.validationMessages = {
      password: {
        required: $localize`Ingresar contraseña`,
      },
      confirmPassword: {
        required: $localize`Confirmar contraseña`,
      },
      passwordMatch: {
        matchError: $localize`Las contraseñas no coinciden`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

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

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.passwordResetForm.valueChanges, ...controlBlurs).subscribe(
      () => {
        this.displayMessage = this.genericValidator.processMessages(
          this.passwordResetForm
        );
      }
    );
  }

  resetPassword(): void {
    if (this.passwordResetForm.valid) {
      if (this.passwordResetForm.dirty) {
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
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(
        this.passwordResetForm,
        true
      );
    }
  }

  cancelResetPassword(): void {
    this.passwordResetForm.patchValue({
      password: '',
      confirmPassword: '',
    });

    this.displayMessage = {};

    this.showChangePasswordValue.emit(true);
  }
}
