import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { IEntry, IEntryAction } from 'src/shared/interfaces';
import { } from 'bootstrap';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  @Input() entryGroup!: KeyValue<string, IEntry[]>;
  @Output() setEntryAction = new EventEmitter<IEntryAction>();

  dtOptions: DataTables.Settings = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dtTrigger: Subject<any> = new Subject<any>();

  tableNames: { [key: string]: string } = {
    dadFamily: "Familia Papi",
    momFamily: "Familia Mami",
    fofyFriends: "Amigos Sofy",
    momFriends: "Amigos Mami",
    dadFriends: "Amigos Papi",
    community: "Comunidad"
  }

  tableName = "";
  
  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      destroy: true
    }
  }
  
  ngAfterViewInit(): void {
    this.dtTrigger.next(true)
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
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
    });
    this.dtTrigger.next(true);
  }
}
