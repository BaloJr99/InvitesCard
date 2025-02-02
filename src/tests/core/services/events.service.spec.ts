import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import {
  dashboardEventsMock,
  dropdownEventsMock,
  eventInformationMock,
  fullEventsMock,
  messageResponseMock,
  newInviteMock,
} from 'src/tests/mocks/mocks';

const dashboardEventsMockCopy = deepCopy(dashboardEventsMock);
const dropdownEventsMockCopy = deepCopy(dropdownEventsMock);
const eventInformationMockCopy = deepCopy(eventInformationMock);
const fullEventsMockCopy = deepCopy(fullEventsMock);
const messageResponseMockCopy = deepCopy(messageResponseMock);
const newInviteMockCopy = deepCopy(newInviteMock);

describe('EventsService', () => {
  let eventsService: EventsService;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EventsService', [
      'getEvents',
      'getDropdownEvents',
      'getEventSettings',
      'getEventInvites',
      'isDeadlineMet',
      'getEventById',
      'createEvent',
      'updateEvent',
      'deleteEvent',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: EventsService, useValue: spy }],
    });

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;
  });

  it('should be created', () => {
    eventsService = TestBed.inject(EventsService);
    expect(eventsService)
      .withContext('Expected Events Service to have been created')
      .toBeTruthy();
  });

  it('should call getEvents', () => {
    eventsServiceSpy.getEvents.and.returnValue(of(dashboardEventsMockCopy));

    eventsServiceSpy.getEvents().subscribe((response) => {
      expect(response).toBe(dashboardEventsMockCopy);
    });

    expect(eventsServiceSpy.getEvents)
      .withContext('Expected getEvents to have been called')
      .toHaveBeenCalledTimes(1);
  });

  it('should call getDropdownEvents', () => {
    eventsServiceSpy.getDropdownEvents.and.returnValue(of(dropdownEventsMockCopy));

    eventsServiceSpy.getDropdownEvents().subscribe((response) => {
      expect(response).toBe(dropdownEventsMockCopy);
    });

    expect(eventsServiceSpy.getDropdownEvents)
      .withContext('Expected getDropdownEvents to have been called')
      .toHaveBeenCalledTimes(1);
  });

  it('should call getEventSettings', () => {
    eventsServiceSpy.getEventSettings.and.returnValue(of(eventInformationMockCopy));

    eventsServiceSpy
      .getEventSettings(fullEventsMockCopy.id, [])
      .subscribe((response) => {
        expect(response).toBe(eventInformationMockCopy);
      });

    expect(eventsServiceSpy.getEventSettings).toHaveBeenCalledOnceWith(
      fullEventsMockCopy.id,
      []
    );
  });

  it('shoud call getEventInvites', () => {
    eventsServiceSpy.getEventInvites.and.returnValue(
      of([{ ...newInviteMockCopy }])
    );

    eventsServiceSpy
      .getEventInvites(fullEventsMockCopy.id)
      .subscribe((response) => {
        expect(response).toEqual([{ ...newInviteMockCopy }]);
        expect(response.length).toBe(1);
        expect(response[0].eventId).toEqual(fullEventsMockCopy.id);
      });

    expect(eventsServiceSpy.getEventInvites).toHaveBeenCalledOnceWith(
      fullEventsMockCopy.id
    );
  });

  it('should call isDeadlineMet', () => {
    eventsServiceSpy.isDeadlineMet.and.returnValue(of(true));

    eventsServiceSpy.isDeadlineMet(fullEventsMockCopy.id).subscribe((response) => {
      expect(response).toBeTrue();
    });

    expect(eventsServiceSpy.isDeadlineMet).toHaveBeenCalledOnceWith(
      fullEventsMockCopy.id
    );
  });

  it('should call getEventById', () => {
    eventsServiceSpy.getEventById.and.returnValue(of(fullEventsMockCopy));

    eventsServiceSpy.getEventById(fullEventsMockCopy.id).subscribe((response) => {
      expect(response).toBe(fullEventsMockCopy);
      expect(response.id).toEqual(fullEventsMockCopy.id);
    });

    expect(eventsServiceSpy.getEventById).toHaveBeenCalledOnceWith(
      fullEventsMockCopy.id
    );
  });

  it('should call createEvent', () => {
    eventsServiceSpy.createEvent.and.returnValue(of(messageResponseMockCopy));

    eventsServiceSpy.createEvent(fullEventsMockCopy).subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(eventsServiceSpy.createEvent).toHaveBeenCalledOnceWith(
      fullEventsMockCopy
    );
  });

  it('should call updateEvent', () => {
    eventsServiceSpy.updateEvent.and.returnValue(of(messageResponseMockCopy));

    eventsServiceSpy
      .updateEvent(fullEventsMockCopy, fullEventsMockCopy.id, true, false)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMockCopy);
      });

    expect(eventsServiceSpy.updateEvent).toHaveBeenCalledOnceWith(
      fullEventsMockCopy,
      fullEventsMockCopy.id,
      true,
      false
    );
  });

  it('should call deleteEvent', () => {
    eventsServiceSpy.deleteEvent.and.returnValue(of(messageResponseMockCopy));

    eventsServiceSpy.deleteEvent(fullEventsMockCopy.id).subscribe((response) => {
      expect(response).toBe(messageResponseMockCopy);
    });

    expect(eventsServiceSpy.deleteEvent).toHaveBeenCalledOnceWith(
      fullEventsMockCopy.id
    );
  });
});
