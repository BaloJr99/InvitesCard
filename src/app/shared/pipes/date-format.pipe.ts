import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(date: string): string {
    const newDate = new Date(date);
    return `${newDate.toLocaleString('es-mx', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
}