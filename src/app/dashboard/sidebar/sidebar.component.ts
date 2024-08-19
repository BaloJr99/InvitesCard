import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { Roles } from 'src/shared/enum';
import { IEvent } from 'src/shared/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() events: IEvent[] = [];
  @Input() eventSelected!: IEvent;

  isAdmin = false;

  @Output() getEventInformation: EventEmitter<IEvent> = new EventEmitter();

  constructor(private tokenService: TokenStorageService) { }

  ngOnInit(): void {
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.isAdmin = userInformation.roles.some(r => r.name == Roles.Admin);
    }
  }

  getEventEntries(id: string | undefined) {
    if (id) {
      this.getEventInformation.emit(this.events.find(event => event.id === id));
    } else {
      this.getEventInformation.emit(this.events.find(event => event.id === $("#selectEventInput").val()));
    }
  }
}
