import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IEntry, IEntryAction } from 'src/shared/interfaces';
import { } from 'bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @Input() entryGroup!: KeyValue<string, IEntry[]>;
  @Output() setEntryAction = new EventEmitter<IEntryAction>();

  dtOptions: ADTSettings = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dtTrigger: Subject<any> = new Subject<any>();ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      destroy: true,
      language: {
        lengthMenu: '_MENU_'
      }
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(false)
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });
    this.dtTrigger.next(false);
  }
}
