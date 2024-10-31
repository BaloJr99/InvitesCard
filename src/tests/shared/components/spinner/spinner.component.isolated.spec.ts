import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

describe('Spinner Component (Isolated Test)', () => {
  let component: SpinnerComponent;

  beforeAll(() => {
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['']);
    const changeDetectorRefSpy = jasmine.createSpyObj('ChangeDetectorRef', [
      '',
    ]);

    component = new SpinnerComponent(loaderSpy, changeDetectorRefSpy);
  });

  it('should create', () => {
    expect(component)
      .withContext('Component should have been created')
      .toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.showSpinner)
      .withContext('ShowSpinner should be false')
      .toBeFalse();

    expect(component.showInviteLoader)
      .withContext('ShowInviteLoader should be false')
      .toBeFalse();

    expect(component.text).withContext('Text should be empty').toBe('');
  });
});
