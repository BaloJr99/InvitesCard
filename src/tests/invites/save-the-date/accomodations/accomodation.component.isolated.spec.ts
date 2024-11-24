import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccomodationComponent } from 'src/app/invites/save-the-date/accomodations/accomodation.component';

describe('Accomodation Component (Isolated Test)', () => {
  let component: AccomodationComponent;

  beforeEach(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const socketSpy = jasmine.createSpyObj('SocketService', ['']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);

    component = new AccomodationComponent(
      new FormBuilder(),
      invitesSpy,
      socketSpy,
      loaderSpy,
      new ActivatedRoute()
    );
  });

  it('should create', () => {
    expect(component)
      .withContext('Component has been created successfully')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.invite)
      .withContext('Invite should be undefined')
      .toBeUndefined();
    expect(component.blockAccomodationForm)
      .withContext('Block accomodation form should be false')
      .toBeFalse();
    expect(component.accomodationForm)
      .withContext('Accomodation form should be defined')
      .toBeDefined();
    expect(component.accomodationForm.valid)
      .withContext('Accomodation form should be valid')
      .toBeTrue();
  });

  it('should have needsAccomodation in the accomodation', () => {
    const controls = component.accomodationForm.controls;

    expect(controls['needsAccomodation'].valid)
      .withContext('NeedsAccomodation should be valid')
      .toBeTrue();
    expect(controls['needsAccomodation'].hasValidator(Validators.required))
      .withContext('NeedsAccomodation should have the validator to be required')
      .toBeTrue();
  });
});
