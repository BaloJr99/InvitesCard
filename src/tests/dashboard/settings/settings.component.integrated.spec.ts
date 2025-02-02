import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { SaveTheDateSettingsComponent } from 'src/app/dashboard/settings/save-the-date-settings/save-the-date-settings.component';
import { SettingsComponent } from 'src/app/dashboard/settings/settings.component';
import { SweetXvSettingsComponent } from 'src/app/dashboard/settings/sweet-xv-settings/sweet-xv-settings.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { dropdownEventsMock } from 'src/tests/mocks/mocks';

const dropdownEventsMockCopy = deepCopy(dropdownEventsMock);

describe('Settings Component (Shallow Test)', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  const selectEvent = (eventId: string) => {
    const select = fixture.debugElement.query(By.css('select'));
    select.nativeElement.value = eventId;
    select.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
      'getEventById',
    ]);
    const settingsSpy = jasmine.createSpyObj('SettingsService', [
      'getEventSettings',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [
        SaveTheDateSettingsComponent,
        SweetXvSettingsComponent,
        SettingsComponent,
      ],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
    settingsServiceSpy = TestBed.inject(
      SettingsService
    ) as jasmine.SpyObj<SettingsService>;
  }));

  beforeEach(() => {
    settingsServiceSpy.getEventSettings.and.returnValue(of());
    eventsServiceSpy.getDropdownEvents.and.returnValue(of(dropdownEventsMockCopy));
    fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
  });

  it('should call getDropdownEvents on init', () => {
    expect(eventsServiceSpy.getDropdownEvents)
      .withContext('should call getDropdownEvents on init')
      .toHaveBeenCalled();
  });

  it('should display save-the-date-settings when event type is save the date', () => {
    selectEvent(dropdownEventsMockCopy[0].id);

    const saveTheDateSettings = fixture.debugElement.query(
      By.directive(SaveTheDateSettingsComponent)
    );

    expect(saveTheDateSettings)
      .withContext(
        'should display save-the-date-settings when event type is save the date'
      )
      .not.toBeNull();
  });

  it('should display sweet-xv-settings when event type is sweet xv', () => {
    selectEvent(dropdownEventsMockCopy[1].id);

    const sweetXvSettings = fixture.debugElement.query(
      By.directive(SweetXvSettingsComponent)
    );

    expect(sweetXvSettings)
      .withContext(
        'should display sweet-xv-settings when event type is sweet xv'
      )
      .not.toBeNull();
  });
});
