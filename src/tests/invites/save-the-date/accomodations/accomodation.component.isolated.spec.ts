import { TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { InvitesService } from 'src/app/core/services/invites.service';
import { AccomodationComponent } from 'src/app/invites/save-the-date/accomodations/accomodation.component';

describe('Accomodation Component (Isolated Test)', () => {
  let component: AccomodationComponent;
  const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: InvitesService, useValue: invitesSpy },
      ],
    });

    component = TestBed.createComponent(AccomodationComponent).componentInstance;
  });

  it('should create', () => {
    expect(component)
      .withContext('Component has been created successfully')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
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
