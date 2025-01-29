import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { EventsComponent } from 'src/app/dashboard/events/events.component';
import { DateFormatPipe } from 'src/app/shared/pipes/date-format.pipe';
import { dashboardEventsMock } from 'src/tests/mocks/mocks';
import { By } from '@angular/platform-browser';

describe('Events Component (Integrated Test)', () => {
  let fixture: ComponentFixture<EventsComponent>;

  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', ['getEvents']);
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', [
      'getTokenValues',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [EventsComponent],
      imports: [DateFormatPipe, RouterLink],
      providers: [
        { provide: EventsService, useValue: eventsSpy },
        { provide: TokenStorageService, useValue: tokenSpy },
        { provide: ToastrService, useValue: toastrSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(
      EventsService
    ) as jasmine.SpyObj<EventsService>;

    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    eventsServiceSpy.getEvents.and.returnValue(of([]));

    fixture = TestBed.createComponent(EventsComponent);
    fixture.detectChanges();
  });

  it("should call getEvents and getTokenValues on init", () => {
    expect(tokenStorageServiceSpy.getTokenValues)
      .withContext('getTokenValues should have been called')
      .toHaveBeenCalled();

    expect(eventsServiceSpy.getEvents)
      .withContext("getEvents should have been called")
      .toHaveBeenCalled();
  });

  it('can get RouterLinks from template', () => {
    fixture.componentInstance.events = [...dashboardEventsMock];
    fixture.detectChanges();

    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const routerLinks = linkDes.map((de) => de.injector.get(RouterLink));

    expect(routerLinks[1].href).toBe(
      `/dashboard/events/${dashboardEventsMock[0].id}`
    );
    expect(routerLinks[2].href).toBe(
      `/dashboard/events/${dashboardEventsMock[1].id}`
    );
  });

  it('should route to event details page', fakeAsync(() => {
    fixture.componentInstance.events = [...dashboardEventsMock];
    fixture.detectChanges();

    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    const firstEventLink = linkDes[1];
    router.resetConfig([{ path: '**', children: [] }]);

    firstEventLink.triggerEventHandler('click', { button: 0 });

    tick();

    fixture.detectChanges();

    expect(router.url)
      .withContext('Should redirect to event details page')
      .toBe(`/dashboard/events/${dashboardEventsMock[0].id}`);
  }));
});
