import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnChanges {
  @Input() entries: IEntry[] = [];
  messages: string[] = ["No hay mensajes"];

  ngOnChanges(changes: SimpleChanges): void {
    if(Object.keys(changes["entries"].currentValue).length > 0) {
      const result = this.entries.reduce((acc:string[], { message }) => (message ? acc.push(message) : "", acc), [])
      this.messages = result;
    }
  }
}
