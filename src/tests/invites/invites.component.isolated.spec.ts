import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DesignType, EventType } from 'src/app/core/models/enum';
import {
  IEventTypeResolved,
} from 'src/app/core/models/invites';
import { InvitesComponent } from 'src/app/invites/invites.component';

describe('Invites Component (Isolated Test)', () => {
  let component: InvitesComponent;
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
      ],
    });

    component = TestBed.createComponent(InvitesComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values ', () => {
    expect(component.inviteResolved)
      .withContext('The inviteResolved should be undefined')
      .toEqual({
        eventInformation: {
          designName: DesignType.None,
          typeOfEvent: EventType.None,
        },
      } as IEventTypeResolved);
  });
});
