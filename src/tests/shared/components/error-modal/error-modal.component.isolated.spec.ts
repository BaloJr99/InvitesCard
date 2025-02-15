import { of } from 'rxjs';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { errorMock } from 'src/tests/mocks/mocks';

const errorMockCopy = deepCopy(errorMock);

describe('Error Modal Component (Isolated)', () => {
  let component: ErrorModalComponent;

  beforeEach(() => {
    const errorModalSpy = jasmine.createSpyObj('ErrorModalService', ['']);
    errorModalSpy.errorResponse$ = of(errorMockCopy);

    component = new ErrorModalComponent(errorModalSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
