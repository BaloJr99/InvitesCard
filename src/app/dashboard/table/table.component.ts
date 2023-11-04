import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { IEntry } from 'src/shared/interfaces';
import { } from 'bootstrap';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @Input() entryGroup!: KeyValue<string, IEntry[]>;
  @Output() entryToDelete = new EventEmitter<IEntry | null>();
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
    const entry = this.entryGroup.value.find((entry) => entry.id === id)
    if (entry) {
      $("#entryId").val(entry.id)
      $("#confirmationModal").modal("show");
    }
  }

  showModal(id: string): void {
    this.entryToDelete.emit(this.entryGroup.value.find((entry) => entry.id === id) ?? null)
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
    });
    this.dtTrigger.next(true);
  }
}
