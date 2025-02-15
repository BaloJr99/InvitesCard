import { ActivatedRoute } from '@angular/router';
import { EventType } from 'src/app/core/models/enum';
import { InvitesComponent } from 'src/app/invites/invites.component';

describe('Invites Component (Isolated Test)', () => {
  let component: InvitesComponent;

  beforeEach(() => {
    component = new InvitesComponent(new ActivatedRoute());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values ', () => {
    expect(component.inviteResolved)
      .withContext('The inviteResolved should be undefined')
      .toEqual({
        eventType: EventType.None,
      });
  });
});
