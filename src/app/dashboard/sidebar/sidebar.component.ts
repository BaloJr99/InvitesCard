import { Component, Input } from '@angular/core';
import { IMessage } from 'src/shared/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() messages: Map<number, IMessage> = new Map<number, IMessage>();
}
