import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validation',
  pure: false,
})
export class ValidationPipe implements PipeTransform {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  transform(formControl: AbstractControl<any, any> | null): boolean {
    return formControl ? formControl?.invalid && (formControl.dirty || formControl.touched) : false;
  }
}
