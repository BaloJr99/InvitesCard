import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private localeValue: string) {}

  transform(date: string): string {
    const newDate = new Date(date);
    return `${newDate.toLocaleString(this.localeValue, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
}