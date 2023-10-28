import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @Input() entryGroup!: KeyValue<string, IEntry[]>;
  dtOptions: DataTables.Settings = {};
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
    });
    this.dtTrigger.next(true);
  }
}
