import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEventTypeResolved } from '../core/models/invites';
import { EventType } from '../core/models/enum';

import { SweetXvComponent } from './sweet-xv/sweet-xv.component';
import { SaveTheDateComponent } from './save-the-date/save-the-date.component';
import { WeddingComponent } from './wedding/wedding.component';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  imports: [
    SweetXvComponent,
    SaveTheDateComponent,
    WeddingComponent
],
})
export class InvitesComponent implements OnInit {
  private route = inject(ActivatedRoute);

  inviteResolved: IEventTypeResolved = {
    eventType: EventType.None,
  };

  ngOnInit(): void {
    this.inviteResolved = this.route.snapshot.data['invite'];
  }
}
