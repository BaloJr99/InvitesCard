import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';

describe('Error Modal Component (Isolated)', () => {
  let component: ErrorModalComponent;

  beforeEach(() => {
    const errorServiceSpy = jasmine.createSpyObj('ErrorModalService', ['']);
    component = new ErrorModalComponent(errorServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.errorMessage)
      .withContext('Error message should be empty')
      .toEqual('');

    expect(component.errorTriggered)
      .withContext('Error triggered should be false')
      .toBeFalse();
  });
});
