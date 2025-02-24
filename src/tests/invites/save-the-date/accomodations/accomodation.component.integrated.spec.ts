import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { InvitesService } from 'src/app/core/services/invites.service';
import { AccomodationComponent } from 'src/app/invites/save-the-date/accomodations/accomodation.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  messageResponseMock,
  saveTheDateSettingMock,
  saveTheDateUserInviteMock,
} from 'src/tests/mocks/mocks';

const messageResponseMockCopy = deepCopy(messageResponseMock);
const saveTheDateSettingMockCopy = deepCopy(saveTheDateSettingMock);
const saveTheDateUserInviteMockCopy = deepCopy(saveTheDateUserInviteMock);

describe('Accomodation Component (Integrated Test)', () => {
  let fixture: ComponentFixture<AccomodationComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;

  beforeEach(waitForAsync(() => {
    const invitesSpy: jasmine.SpyObj<InvitesService> = jasmine.createSpyObj(
      'InvitesService',
      ['sendConfirmation']
    );

    TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, AccomodationComponent],
    providers: [
        { provide: InvitesService, useValue: invitesSpy },
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    paramMap: convertToParamMap({
                        id: saveTheDateUserInviteMockCopy.id,
                    }),
                },
            },
        },
    ],
}).compileComponents();

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;
  }));

  beforeEach(() => {
    invitesServiceSpy.sendConfirmation.and.returnValue(
      of(messageResponseMockCopy)
    );
    fixture = TestBed.createComponent(AccomodationComponent);
    fixture.detectChanges();
  });

  it('should call sendConfirmation when sendUserResponse is called', () => {
    fixture.componentRef.setInput('inviteValue', saveTheDateUserInviteMockCopy);
    fixture.componentRef.setInput('inviteSettingsValue', saveTheDateSettingMockCopy);
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    const sendConfirmationButton = form.query(By.css('button[type="submit"]'));

    sendConfirmationButton.nativeElement.click();
    fixture.detectChanges();

    expect(invitesServiceSpy.sendConfirmation)
      .withContext('sendConfirmation should have been called')
      .toHaveBeenCalled();
  });
});
