import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  usernameOrEmail: {
    required: $localize`Ingresar usuario`,
  },
  password: {
    required: $localize`Ingresar contraseña`,
  },
  confirmPassword: {
    required: $localize`Confirmar contraseña`,
  },
  custom: {
    passwordMatch: $localize`Las contraseñas no coinciden`,
  },
  entriesConfirmed: {
    required: $localize`Favor de seleccionar`,
  },
};

@Pipe({
  name: 'validationError',
  standalone: true,
  pure: false,
})
export class ValidationErrorPipe implements PipeTransform {
  transform(
    errors: ValidationErrors | null | undefined,
    controlName: string,
    customError?: string
  ): string {
    if (errors) {
      const errorKey = Object.keys(errors)[0];

      return ERROR_MESSAGES[controlName][errorKey];
    }

    if (!errors && customError) {
      return ERROR_MESSAGES['custom'][customError];
    }
    return '';
  }
}
