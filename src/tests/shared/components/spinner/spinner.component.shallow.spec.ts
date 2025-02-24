import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ISpinner } from 'src/app/core/models/common';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

describe('Spinner Component (Shallow Test)', () => {
  let fixture: ComponentFixture<SpinnerComponent>;
  let loadingSubject: Subject<ISpinner>;

  beforeEach(waitForAsync(() => {
    loadingSubject = new Subject<ISpinner>();
    const loaderSpy = jasmine.createSpyObj('LoaderService', [''], {
      loading$: loadingSubject.asObservable(),
    });

    TestBed.configureTestingModule({
    imports: [SpinnerComponent],
    providers: [{ provide: LoaderService, useValue: loaderSpy }],
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();
  });

  it('created a span to render the text', () => {
    loadingSubject.next({
      isLoading: false,
      message: '',
      showInviteLoader: false,
    });
    fixture.detectChanges();

    const spanMessage = fixture.debugElement.query(By.css('span'));

    expect(spanMessage)
      .withContext("Span message shouldn't be null")
      .not.toBeNull();
  });
});
