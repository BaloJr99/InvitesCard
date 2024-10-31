import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ICommonModal } from 'src/app/core/models/common';
import { CommonModalResponse, CommonModalType } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { CommonModalComponent } from 'src/app/shared/components/common-modal/common-modal.component';
import { commonModalMock } from 'src/tests/mocks/mocks';

describe('Common Modal Component (Integrated Test)', () => {
  let fixture: ComponentFixture<CommonModalComponent>;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;
  let commonModalDataSubject: Subject<ICommonModal>;

  beforeEach(waitForAsync(() => {
    commonModalDataSubject = new Subject<ICommonModal>();

    const commonModalSpy = jasmine.createSpyObj(
      'CommonModalService',
      ['sendResponse'],
      {
        commonModalData$: commonModalDataSubject.asObservable(),
      }
    );

    TestBed.configureTestingModule({
      declarations: [CommonModalComponent],
      providers: [{ provide: CommonModalService, useValue: commonModalSpy }],
    }).compileComponents();

    commonModalServiceSpy = TestBed.inject(
      CommonModalService
    ) as jasmine.SpyObj<CommonModalService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalComponent);
    fixture.detectChanges();
  });

  it('authService sendResponse() should called', () => {
    const button = fixture.debugElement.query(By.css('#actionButton'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(commonModalServiceSpy.sendResponse)
      .withContext(
        "SendResponse method from CommonModalService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('should call sendResponse() with Confirm if actionButton was clicked', () => {
    const actionButton = fixture.debugElement.query(By.css('#actionButton'));
    actionButton.nativeElement.click();
    fixture.detectChanges();

    expect(commonModalServiceSpy.sendResponse)
      .withContext(
        "SendResponse method from CommonModalService should've been called with correct value"
      )
      .toHaveBeenCalledWith(CommonModalResponse.Confirm);
  });

  it('should display cancel and confirm buttons if CommonModalType is Confirm', () => {
    commonModalDataSubject.next(commonModalMock);
    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(By.css('#closeModal'));
    const actionButton = fixture.debugElement.query(By.css('#actionButton'));

    expect(cancelButton)
      .withContext('Cancel button should be displayed')
      .toBeDefined();

    expect(cancelButton.nativeElement.textContent).toBe('Cancelar');

    expect(cancelButton)
      .withContext('Cancel button should be displayed')
      .toBeDefined();

    expect(actionButton)
      .withContext('Action button should be displayed')
      .toBeDefined();

    expect(actionButton.nativeElement.textContent).toBe('Confirmar');

    expect(actionButton)
      .withContext('Action button should be displayed')
      .toBeDefined();
  });

  it('should display yes and no buttons if CommonModalType is YesNo', () => {
    commonModalDataSubject.next({
      ...commonModalMock,
      modalType: CommonModalType.YesNo,
    });
    fixture.detectChanges();

    const noButton = fixture.debugElement.query(By.css('#closeModal'));
    const yesButton = fixture.debugElement.query(By.css('#actionButton'));

    expect(noButton)
      .withContext('No button should be displayed')
      .toBeDefined();

    expect(noButton.nativeElement.textContent).toBe('No');

    expect(noButton)
      .withContext('No button should be displayed')
      .toBeDefined();

    expect(yesButton)
      .withContext('Yes button should be displayed')
      .toBeDefined();

    expect(yesButton.nativeElement.textContent).toBe('Sí');

    expect(yesButton)
      .withContext('Yes button should be displayed')
      .toBeDefined();
  });
});
