import { of } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { ISettingAction } from 'src/app/core/models/settings';
import { SettingsComponent } from 'src/app/dashboard/settings/settings.component';

describe('Settings Component (Isolated Test)', () => {
  let component: SettingsComponent;

  beforeEach(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
    ]);
    eventsSpy.getDropdownEvents.and.returnValue(of([]));

    component = new SettingsComponent(eventsSpy);
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
