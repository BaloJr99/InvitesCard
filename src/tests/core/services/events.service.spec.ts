import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import {
  dashboardEventsMock,
  dropdownEventsMock,
  eventInformationMock,
  fullEventsMock,
  fullInviteMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

describe('EventsService', () => {
  let eventsService: EventsService;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EventsService', [
      'getEvents',
      'getDropdownEvents',
      'getEventInformation',
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
    eventsServiceSpy.getEvents.and.returnValue(of(dashboardEventsMock));

    eventsServiceSpy.getEvents().subscribe((response) => {
      expect(response).toBe(dashboardEventsMock);
    });

    expect(eventsServiceSpy.getEvents)
      .withContext('Expected getEvents to have been called')
      .toHaveBeenCalledTimes(1);
  });

  it('should call getDropdownEvents', () => {
    eventsServiceSpy.getDropdownEvents.and.returnValue(of(dropdownEventsMock));

    eventsServiceSpy.getDropdownEvents().subscribe((response) => {
      expect(response).toBe(dropdownEventsMock);
    });

    expect(eventsServiceSpy.getDropdownEvents)
      .withContext('Expected getDropdownEvents to have been called')
      .toHaveBeenCalledTimes(1);
  });

  it('should call getEventInformation', () => {
    eventsServiceSpy.getEventInformation.and.returnValue(
      of(eventInformationMock)
    );

    eventsServiceSpy
      .getEventInformation(fullEventsMock.id, [])
      .subscribe((response) => {
        expect(response).toBe(eventInformationMock);
      });

    expect(eventsServiceSpy.getEventInformation).toHaveBeenCalledOnceWith(
      fullEventsMock.id,
      []
    );
  });

  it('shoud call getEventInvites', () => {
    eventsServiceSpy.getEventInvites.and.returnValue(
      of([{ ...fullInviteMock }])
    );

    eventsServiceSpy
      .getEventInvites(fullEventsMock.id)
      .subscribe((response) => {
        expect(response).toEqual([{ ...fullInviteMock }]);
        expect(response.length).toBe(1);
        expect(response[0].eventId).toEqual(fullEventsMock.id);
      });

    expect(eventsServiceSpy.getEventInvites).toHaveBeenCalledOnceWith(
      fullEventsMock.id
    );
  });

  it('should call isDeadlineMet', () => {
    eventsServiceSpy.isDeadlineMet.and.returnValue(of(true));

    eventsServiceSpy.isDeadlineMet(fullEventsMock.id).subscribe((response) => {
      expect(response).toBeTrue();
    });

    expect(eventsServiceSpy.isDeadlineMet).toHaveBeenCalledOnceWith(
      fullEventsMock.id
    );
  });

  it('should call getEventById', () => {
    eventsServiceSpy.getEventById.and.returnValue(of(fullEventsMock));

    eventsServiceSpy.getEventById(fullEventsMock.id).subscribe((response) => {
      expect(response).toBe(fullEventsMock);
      expect(response.id).toEqual(fullEventsMock.id);
    });

    expect(eventsServiceSpy.getEventById).toHaveBeenCalledOnceWith(
      fullEventsMock.id
    );
  });

  it('should call createEvent', () => {
    eventsServiceSpy.createEvent.and.returnValue(of(messageResponseMock));

    eventsServiceSpy.createEvent(fullEventsMock).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(eventsServiceSpy.createEvent).toHaveBeenCalledOnceWith(
      fullEventsMock
    );
  });

  it('should call updateEvent', () => {
    eventsServiceSpy.updateEvent.and.returnValue(of(messageResponseMock));

    eventsServiceSpy
      .updateEvent(fullEventsMock, fullEventsMock.id, true)
      .subscribe((response) => {
        expect(response).toBe(messageResponseMock);
      });

    expect(eventsServiceSpy.updateEvent).toHaveBeenCalledOnceWith(
      fullEventsMock,
      fullEventsMock.id,
      true
    );
  });

  it('should call deleteEvent', () => {
    eventsServiceSpy.deleteEvent.and.returnValue(of(messageResponseMock));

    eventsServiceSpy.deleteEvent(fullEventsMock.id).subscribe((response) => {
      expect(response).toBe(messageResponseMock);
    });

    expect(eventsServiceSpy.deleteEvent).toHaveBeenCalledOnceWith(
      fullEventsMock.id
    );
  });
});
