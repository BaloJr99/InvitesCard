import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ISpinner } from 'src/app/core/models/common';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { showInviteLoaderMock, showSpinnerMock } from 'src/tests/mocks/mocks';

describe('Spinner Component (Integrated Test)', () => {
  let fixture: ComponentFixture<SpinnerComponent>;
  let loadingSubject: Subject<ISpinner>;

  beforeEach(waitForAsync(() => {
    loadingSubject = new Subject<ISpinner>();
    const loaderSpy = jasmine.createSpyObj('LoaderService', [''], {
      loading$: loadingSubject.asObservable(),
    });

    TestBed.configureTestingModule({
      declarations: [SpinnerComponent],
      providers: [{ provide: LoaderService, useValue: loaderSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();
  });

  it("shouldn't show all spinners and message should be blank", () => {
    loadingSubject.next({
      isLoading: false,
      message: '',
      showInviteLoader: false,
    });
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.css('.cssload-speeding-wheel')
    );
    const inviteLoader = fixture.debugElement.query(By.css('iframe'));
    const span = fixture.debugElement.query(By.css('span'));

    expect(spinner)
      .withContext("Shouldn't show cssload-speeding-wheel")
      .toBeNull();

    expect(inviteLoader).withContext("Shouldn't show iframe").toBeNull();

    expect(span.nativeElement.textContent)
      .withContext("Shouldn't show message")
      .toBe('');
  });

  it('should show cssload-speeding-wheel if showSpinner is true with message', () => {
    loadingSubject.next(showSpinnerMock);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.css('.cssload-speeding-wheel')
    );
    const span = fixture.debugElement.query(By.css('span'));

    expect(spinner)
      .withContext('Should show cssload-speeding-wheel')
      .toBeDefined();

    expect(spinner)
      .withContext('Should show cssload-speeding-wheel')
      .not.toBeNull();

    expect(span.nativeElement.textContent)
      .withContext('Should show message')
      .toEqual(showSpinnerMock.message);
  });

  it('should show invite loader iframe if showInviteLoader is true', () => {
    loadingSubject.next(showInviteLoaderMock);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('iframe'));
    const span = fixture.debugElement.query(By.css('span'));
    expect(spinner)
      .withContext('Should show invite loader iframe')
      .toBeDefined();

    expect(spinner)
      .withContext('Should show invite loader iframe')
      .not.toBeNull();

    expect(span.nativeElement.textContent)
      .withContext('Should show message')
      .toEqual(showInviteLoaderMock.message);
  });
});
