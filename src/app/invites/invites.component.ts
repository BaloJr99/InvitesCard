import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEventTypeResolved } from '../core/models/invites';
import { EventType } from '../core/models/enum';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  standalone: false,
})
export class InvitesComponent implements OnInit {
  inviteResolved: IEventTypeResolved = {
    eventType: EventType.None,
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.inviteResolved = this.route.snapshot.data['invite'];
  }
}
