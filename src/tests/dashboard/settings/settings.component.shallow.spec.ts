import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsComponent } from 'src/app/dashboard/settings/settings.component';
import { dropdownEventsMock } from 'src/tests/mocks/mocks';

describe('Settings Component (Shallow Test)', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  const selectEvent = (eventId: string) => {
    const select = fixture.debugElement.query(By.css('select'));
    select.nativeElement.value = eventId;
    select.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
    ]);

    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: EventsService, useValue: eventsSpy }],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
  }));

  beforeEach(() => {
    eventsServiceSpy.getDropdownEvents.and.returnValue(of(dropdownEventsMock));
    fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
  });

  it('should show no event selected when no event is selected', () => {
    const filesEmpty = fixture.debugElement.query(By.css('.files-empty'));
    const paragraph = filesEmpty.query(By.css('p'));

    expect(paragraph.nativeElement.textContent)
      .withContext('should have no event selected message')
      .toBe('Porfavor, seleccione un evento');
  });

  it(`shouldn't show no event selected when no event is selected`, () => {
    selectEvent(dropdownEventsMock[0].id);

    const filesEmpty = fixture.debugElement.query(By.css('.files-empty'));

    expect(fixture.componentInstance.eventSettingAction)
      .withContext('should set eventSettingAction')
      .toEqual({
        eventId: dropdownEventsMock[0].id,
        isNew: false,
        eventType: dropdownEventsMock[0].typeOfEvent,
      });

    expect(filesEmpty)
      .withContext(`shouldn't have no event selected message`)
      .toBeNull();
  });

  it('should call loadEventSettings', () => {
    spyOn(fixture.componentInstance, 'loadEventSettings');

    selectEvent(dropdownEventsMock[0].id);

    expect(fixture.componentInstance.loadEventSettings)
      .withContext('should call loadEventSettings')
      .toHaveBeenCalled();
  });
});
