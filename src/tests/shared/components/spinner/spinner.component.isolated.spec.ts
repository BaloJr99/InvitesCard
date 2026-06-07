import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ISpinner } from 'src/app/core/models/common';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

describe('Spinner Component (Isolated Test)', () => {
  let component: SpinnerComponent;
  let loadingSubject = new Subject<ISpinner>();
  const loaderSpy = jasmine.createSpyObj('LoaderService', [], {
    loading$: loadingSubject.asObservable(),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoaderService, useValue: loaderSpy }],
    });
    component = TestBed.createComponent(SpinnerComponent).componentInstance;
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });
});
