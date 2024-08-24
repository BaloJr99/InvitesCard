import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, merge, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { matchPassword } from 'src/app/shared/utils/validators/matchPassword';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  passwordResetForm: FormGroup;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  passwordReset = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder, 
    private authService: AuthService, 
    private loaderService: LoaderService) {
    this.validationMessages = {
      password: {
        required: $localize `Ingresar contraseña`
      },
      confirmPassword: {
        required: $localize `Confirmar contraseña`
      },
      passwordMatch: {
        matchError: $localize `Las contraseñas no coinciden`
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.passwordResetForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: matchPassword
    })
  }

  ngOnInit(): void {
    this.passwordReset = !this.route.snapshot.data['entry'];
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.passwordResetForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.passwordResetForm)
    });
  }

  resetPassword(): void {
    if (this.passwordResetForm.valid) {
      if(this.passwordResetForm.dirty) {
        this.loaderService.setLoading(true);
        this.authService.resetPassword(this.route.snapshot.paramMap.get('id') ?? '' ,this.passwordResetForm.value).subscribe({
          next: () => {
            this.passwordReset = true;
          }
        }).add(() => {
          this.loaderService.setLoading(false);
        })
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.passwordResetForm, true);
    }
  }
}
