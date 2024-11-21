import { ISettingAction } from 'src/app/core/models/settings';
import { SettingsComponent } from 'src/app/dashboard/settings/settings.component';

describe('Settings Component (Isolated Test)', () => {
  let component: SettingsComponent;

  beforeEach(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const eventsSpy = jasmine.createSpyObj('EventsService', ['']);

    component = new SettingsComponent(loaderSpy, eventsSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.events)
      .withContext('events should be an empty array')
      .toEqual([]);
    expect(component.eventSettingAction)
      .withContext('eventSettingAction should be an empty object')
      .toEqual({} as ISettingAction);
  });
});
