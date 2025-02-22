import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { IFilter } from 'src/app/core/models/common';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  standalone: false,
})
export class FilterComponent {
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      if (this.filterIsVisible) {
        this.onFilterClick();
      }
    }
  }

  @Input() text = '';
  @Input() index = 0;
  filterIsVisible = false;

  @Output() filter: EventEmitter<IFilter> = new EventEmitter();

  onFilterClick(): void {
    this.filterIsVisible = !this.filterIsVisible;

    if (this.filterIsVisible) {
      const filterDialog = document.querySelector(
        `#filter-dialog-${this.index}`
      ) as HTMLElement;

      filterDialog.classList.add('show');
    } else {
      const filterDialog = document.querySelector(
        `#filter-dialog-${this.index}`
      ) as HTMLElement;

      filterDialog.classList.remove('show');
    }
  }

  clearFilter(): void {
    this.filter.emit({
      value: '',
      filter: this.text,
    });
    this.onFilterClick();
  }

  applyFilter(): void {
    const filterDialog = document.querySelector(
      `#filter-input-${this.index}`
    ) as HTMLInputElement;

    this.filter.emit({
      value: filterDialog.value,
      filter: this.text,
    });
    this.onFilterClick();
  }
}
