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
})
export class InvitesComponent implements OnInit {
  inviteResolved: IEventTypeResolved | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(() => {
      this.inviteResolved = this.route.snapshot.data['invite'];
      this.loaderService.setLoading(false);
    });
  }
}
