import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  usernameOrEmail: {
    required: $localize`El usuario es requerido`,
  },
  password: {
    required: $localize`La contraseña es requerida`,
  },
  confirmPassword: {
    required: $localize`Repetir contraseña`,
  },
  custom: {
    passwordMatch: $localize`Las contraseñas no coinciden`,
    controlIsDuplicated: $localize`Ya existe un registro con este nombre`,
  },
  entriesConfirmed: {
    required: $localize`El número de pases es requerido`,
  },
  family: {
    required: $localize`La familia es requerida`,
  },
  entriesNumber: {
    required: $localize`El número de pases es requerido`,
  },
  phoneNumber: {
    required: $localize`El número de telefono es requerido`,
    pattern: $localize`Numero de telefono invalido`,
  },
  inviteGroupId: {
    required: $localize`El grupo es requerido`,
  },
  inviteGroup: {
    required: $localize`El nombre del grupo es requerido`,
  },
  nameOfEvent: {
    required: $localize`El nombre del evento es requerido`,
  },
  dateOfEvent: {
    required: $localize`La fecha del evento es requerida`,
  },
  maxDateOfConfirmation: {
    required: $localize`La fecha de limite de confirmación es requerida`,
  },
  nameOfCelebrated: {
    required: $localize`El nombre del festejado es requerido`,
  },
  typeOfEvent: {
    required: $localize`El tipo de evento es requerido`,
  },
  userId: {
    required: $localize`El usuario es requerido`,
  },
  username: {
    required: $localize`El nombre de usuario es requerido`,
  },
  firstName: {
    required: $localize`El nombre es requerido`,
  },
  lastName: {
    required: $localize`El apellido es requerido`,
  },
  email: {
    required: $localize`El correo electrónico es requerido`,
  },
  gender: {
    required: $localize`El género es requerido`,
  },
  primaryColor: {
    required: $localize`El color primario es requerido`,
  },
  secondaryColor: {
    required: $localize`El color secundario es requerido`,
  },
  receptionPlace: {
    required: $localize`El lugar del evento es requerido`,
  },
  copyMessage: {
    required: $localize`El mensaje es requerido`,
  },
  hotelName: {
    required: $localize`El nombre del hotel es requerido`,
  },
  hotelInformation: {
    required: $localize`La información del hotel es requerida`,
  },
  roles: {
    required: $localize`Seleccionar un rol`,
  },
  name: {
    required: $localize`El nombre del rol es requerido`,
  },
  firstSectionSentences: {
    required: $localize`La información de la primera sección es requerida`,
  },
  parents: {
    required: $localize`El nombre de los padres es requerido`,
  },
  godParents: {
    required: $localize`El nombre de los padrinos es requerido`,
  },
  secondSectionSentences: {
    required: $localize`La información de la segunda sección es requerida`,
  },
  massUrl: {
    required: $localize`La url de la misa es requerida`,
  },
  massTime: {
    required: $localize`La hora de la misa es requerida`,
  },
  massAddress: {
    required: $localize`La dirección de la misa es requerida`,
  },
  receptionUrl: {
    required: $localize`La url de la recepción es requerida`,
  },
  receptionTime: {
    required: $localize`La hora de la recepción es requerida`,
  },
  receptionAddress: {
    required: $localize`La dirección de la recepción es requerida`,
  },
  dressCodeColor: {
    required: $localize`El código de vestimenta es requerido`,
  },
  weddingCopyMessage: {
    required: $localize`El mensaje es requerido`,
  },
  weddingPrimaryColor: {
    required: $localize`El color primario es requerido`,
  },
  weddingSecondaryColor: {
    required: $localize`El color secundario es requerido`,
  },
  groomParents: {
    required: $localize`Los nombres de los padres del novio son requeridos`,
  },
  brideParents: {
    required: $localize`Los nombres de los padres de la novia son requeridos`,
  },
  massPlace: {
    required: $localize`El lugar de la misa es requerido`,
  },
  venueUrl: {
    required: $localize`La url de la ubicación de recepción es requerida`,
  },
  venueTime: {
    required: $localize`La hora de la recepción es requerida`,
  },
  venuePlace: {
    required: $localize`El lugar del evento es requerido`,
  },
  civilUrl: {
    required: $localize`La url de la ubicación civil es requerida`,
  },
  civilTime: {
    required: $localize`La hora de la ceremonia civil es requerida`,
  },
  civilPlace: {
    required: $localize`El lugar de la ceremonia civil es requerido`,
  },
  hotelUrl: {
    required: $localize`La url del hotel es requerida`,
  },
  hotelAddress: {
    required: $localize`La dirección del hotel es requerida`,
  },
  hotelPhone: {
    required: $localize`El teléfono del hotel es requerido`,
    pattern: $localize`Número de teléfono inválido`,
  },
  cardNumber: {
    required: $localize`El número de tarjeta es requerido`,
    pattern: $localize`El número de tarjeta debe tener el formato XXXX-XXXX-XXXX-XXXX`,
  },
  clabeBank: {
    required: $localize`La CLABE es requerida`,
    pattern: $localize`La CLABE debe tener 18 dígitos`,
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
