import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() entries: { [key: string]: IEntry[] } = {};
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
}
