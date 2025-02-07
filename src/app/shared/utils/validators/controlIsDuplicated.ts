import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const controlIsDuplicated: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const controlIsValid = control.get('controlIsValid')?.value as boolean;
  if (!controlIsValid) {
    return {
      controlIsDuplicated: true,
    };
  }
  return null;
};
