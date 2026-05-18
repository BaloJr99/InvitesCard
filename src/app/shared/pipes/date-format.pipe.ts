import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  private localeValue = inject(LOCALE_ID);

  transform(date: string): string {
    const newDate = new Date(date);
    const formatter = new Intl.DateTimeFormat(this.localeValue, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return formatter.format(newDate);
  }
}
