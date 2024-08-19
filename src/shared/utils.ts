import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { IEntry, IStatistic } from "./interfaces"

export const createStatistics = (entries: IEntry[]): IStatistic => {
  const stadistics = {
    confirmedEntries: 0,
    canceledEntries: 0,
    pendingEntries: 0,
    totalEntries: 0,
  };

  entries.forEach((value) => {
    if (value.confirmation) {
      stadistics.confirmedEntries += (value.entriesConfirmed ?? 0)
      stadistics.canceledEntries += (value.entriesNumber - (value.entriesConfirmed ?? 0))
    } else {
      if (value.confirmation === null || value.confirmation === undefined) {
        stadistics.pendingEntries += value.entriesNumber
      } else {
        stadistics.canceledEntries += value.entriesNumber;
      }
    }
    stadistics.totalEntries += value.entriesNumber;
  });

  return stadistics;
}

export const matchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword')

  if (password && confirmPassword && password.value != confirmPassword.value) {
    return {
      passwordMatchError: true
    }
  }
  return null
}