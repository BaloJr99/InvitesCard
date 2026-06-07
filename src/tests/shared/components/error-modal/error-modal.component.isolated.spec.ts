import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ErrorModalService } from 'src/app/core/services/error.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { deepCopy } from 'src/app/shared/utils/tools';
import { errorMock } from 'src/tests/mocks/mocks';

const errorMockCopy = deepCopy(errorMock);

describe('Error Modal Component (Isolated)', () => {
  let component: ErrorModalComponent;
  const errorModalSpy = jasmine.createSpyObj('ErrorModalService', ['']);

  beforeEach(() => {
    errorModalSpy.errorResponse$ = of(errorMockCopy);

    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorModalService, useValue: errorModalSpy },
      ],
    });

    component = TestBed.createComponent(ErrorModalComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
