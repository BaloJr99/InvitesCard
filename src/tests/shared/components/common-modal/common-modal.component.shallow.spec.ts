import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ICommonModal } from 'src/app/core/models/common';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { CommonModalComponent } from 'src/app/shared/components/common-modal/common-modal.component';

describe('Login Component (Shallow Test)', () => {
  let fixture: ComponentFixture<CommonModalComponent>;
  let commonModalDataSubject: Subject<ICommonModal>;

  beforeEach(waitForAsync(() => {
    commonModalDataSubject = new Subject<ICommonModal>();

    const commonModalSpy = jasmine.createSpyObj(
      'CommonModalService',
      [''],
      {
        commonModalData$: commonModalDataSubject.asObservable(),
      }
    );

    TestBed.configureTestingModule({
      declarations: [CommonModalComponent],
      providers: [{ provide: CommonModalService, useValue: commonModalSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalComponent);
    fixture.detectChanges();
  });

  it('created a modal with 2 action buttons in the modal-footer', () => {
    const closeModal = fixture.debugElement.query(By.css('#closeModal'));
    const actionButton = fixture.debugElement.query(By.css('#actionButton'));

    expect(closeModal)
      .withContext("Close modal shouldn't be null")
      .not.toBeNull();
    expect(actionButton)
      .withContext("Action button shouldn't be null")
      .not.toBeNull();
  });

  it('created a modal with a paragraph inside the modal-body', () => {
    const paragraph = fixture.debugElement.query(By.css('.modal-body p'));

    expect(paragraph).withContext("Paragraph shouldn't be null").not.toBeNull();
  });

  it('created a modal with a paragraph inside the modal-title', () => {
    const title = fixture.debugElement.query(By.css('.modal-title'));

    expect(title).withContext("Title shouldn't be null").not.toBeNull();
  });
});
