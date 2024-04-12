import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEntry, IEntryAction } from 'src/shared/interfaces';
import { } from 'bootstrap';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() entryGroup!: KeyValue<string, IEntry[]>;
  @Output() setEntryAction = new EventEmitter<IEntryAction>();

  copyToClipBoard(id: string): void {
    const url = `${window.location.origin}/entries/${id}`

    navigator.clipboard.writeText(url)
  }

  openEditModal(id: string): void {
    const entryToEdit = this.entryGroup.value.find((entry) => entry.id === id);
    if (entryToEdit) {
      this.setEntryAction.emit({
        entry: entryToEdit,
        isNew: false,
        delete: false
      });

      $("#confirmationModal").modal("show");
    }
  }

  showModal(entry: IEntry): void {
    this.setEntryAction.emit({
      entry: entry,
      isNew: false,
      delete: true
    })
  }
}
