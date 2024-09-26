import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../core/services/loader.service';
import { IEventTypeResolved } from '../core/models/invites';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css'],
})
export class InvitesComponent implements OnInit {
  inviteResolved: IEventTypeResolved | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando invitación`);
    this.route.data.subscribe(() => {
      this.inviteResolved = this.route.snapshot.data['invite'];
    });
  }
}
