import { ActivatedRoute } from '@angular/router';
import { InvitesComponent } from 'src/app/invites/invites.component';

describe('Invites Component (Isolated Test)', () => {
  let component: InvitesComponent;

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('ComponentLoaderFactory', ['']);

    component = new InvitesComponent(new ActivatedRoute(), loaderSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values ', () => {
    expect(component.inviteResolved)
      .withContext('The inviteResolved should be undefined')
      .toBeUndefined();
  });
});
