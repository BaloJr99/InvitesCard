import { Component, ViewChild } from '@angular/core';
import { InvitesService } from 'src/core/services/invites.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private invitesService: InvitesService) {}
}
