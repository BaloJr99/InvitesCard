import { AfterViewInit, Component, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { fromEvent, merge, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  forgotPasswordForm: FormGroup;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  errorMessage = "";
  emailSent = false;

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private loaderService: LoaderService) {
    this.validationMessages = {
      usernameOrEmail: {
        required: $localize `Ingresar email o usuario`
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.forgotPasswordForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
    })
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.forgotPasswordForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.forgotPasswordForm)
    });
  }

  sendResetPassword(): void {
    if (this.forgotPasswordForm.valid) {
      if(this.forgotPasswordForm.dirty) {
        this.loaderService.setLoading(true);
        this.authService.sendResetPassword(this.forgotPasswordForm.value).subscribe({
          next: (messageResponse) => {
            this.errorMessage = messageResponse.message;
            this.emailSent = true;
          }
        }).add(() => {
          this.loaderService.setLoading(false);
        })
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.forgotPasswordForm, true);
    }
  }
}
