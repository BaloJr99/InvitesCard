import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const usernameDuplicated: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const usernameIsValid = control.get('usernameIsValid')?.value as boolean

  if (!usernameIsValid) {
    return {
      usernameDuplicatedError: true
    }
  }
  return null
}