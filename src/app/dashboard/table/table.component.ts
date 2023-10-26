import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() entries: IEntry[] = [];
  entriesGrouped: { [key: string]: IEntry[] } = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      "destroy": true
    }

    $('#fofyFriends, #dadFriends, #momFriends, #momFamily, #dadFamily, #community').DataTable()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  copyToClipBoard(id: string): void {
    const url = `${window.location.origin}/entries/${id}`

    navigator.clipboard.writeText(url)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(Object.keys(changes["entries"].currentValue).length > 0) {
      const entriesChanged: IEntry[] = changes["entries"].currentValue;
      const groupedEntries: { [key: string]: IEntry[] } = {};
      entriesChanged.forEach((value) => {
        if (groupedEntries[value.groupSelected]) {
          groupedEntries[value.groupSelected].push(value)
        } else {
          groupedEntries[value.groupSelected] = []
          groupedEntries[value.groupSelected].push(value)
        }
      })
      this.entriesGrouped = groupedEntries;
    }
  }
}
