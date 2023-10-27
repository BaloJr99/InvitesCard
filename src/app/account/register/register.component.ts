import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { AuthService } from 'src/core/services/auth.service';
import { IUser } from 'src/shared/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  registrationForm!: FormGroup;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.validationMessages = {
      username: {
        required: 'Ingresar nombre de usuario'
      },
      password: {
        required: 'Ingresar contraseña'
      },
      email: {
        required: 'Ingresar correo'
      },
      confirmPassword: {
        required: 'Confirmar contraseña'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.registrationForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.registrationForm)
    });
  }

  saveAccount(): void {
    if (this.registrationForm.valid) {
      if(this.registrationForm.dirty) {
        const user = this.registrationForm.value;
        delete user.confirmPassword;
        this.authService.createNewAccount(user as IUser).subscribe({
          next: (token) => {
            if (token) {
              this.router.navigate(['/account/login']);
            }
          }
        })
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.registrationForm, true);
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.registrationForm.reset();
  }
}
