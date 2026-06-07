import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { ISettingAction } from 'src/app/core/models/settings';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsComponent } from 'src/app/dashboard/settings/settings.component';

describe('Settings Component (Isolated Test)', () => {
  let component: SettingsComponent;
  const eventsSpy = jasmine.createSpyObj('EventsService', [
    'getDropdownEvents',
  ]);

  beforeEach(() => {
    eventsSpy.getDropdownEvents.and.returnValue(of([]));
    TestBed.configureTestingModule({
      providers: [{ provide: EventsService, useValue: eventsSpy }],
    });

    component = TestBed.createComponent(SettingsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.eventSettingAction)
      .withContext('eventSettingAction should be an empty object')
      .toEqual({
        eventId: '',
        isNew: true,
        eventType: EventType.None,
      } as ISettingAction);
  });
});
