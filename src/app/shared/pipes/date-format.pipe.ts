import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private localeValue: string) {}

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
