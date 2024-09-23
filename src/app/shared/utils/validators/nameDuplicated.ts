import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const roleNameDuplicated: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const roleNameIsValid = control.get('nameIsValid')?.value as boolean;
  if (!roleNameIsValid) {
    return {
      roleNameDuplicatedError: true,
    };
  }
  return null;
};
