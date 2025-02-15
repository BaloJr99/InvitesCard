import { Subject } from 'rxjs';
import { ISpinner } from 'src/app/core/models/common';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

describe('Spinner Component (Isolated Test)', () => {
  let component: SpinnerComponent;
  let loadingSubject: Subject<ISpinner>;

  beforeEach(() => {
    loadingSubject = new Subject<ISpinner>();
    const loaderSpy = jasmine.createSpyObj('LoaderService', [''], {
      loading$: loadingSubject.asObservable(),
    });
    component = new SpinnerComponent(loaderSpy);
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });
});
