import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { IError } from 'src/app/core/models/common';
import { ErrorModalService } from 'src/app/core/services/error.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';

describe('Error Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<ErrorModalComponent>;
  let errorResponseSubject: Subject<IError>;

  beforeEach(waitForAsync(() => {
    errorResponseSubject = new Subject<IError>();

    const errorModalSpy = jasmine.createSpyObj('ErrorModalService', [''], {
      errorResponse$: errorResponseSubject.asObservable(),
    });

    TestBed.configureTestingModule({
      declarations: [ErrorModalComponent],
      providers: [{ provide: ErrorModalService, useValue: errorModalSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorModalComponent);
    fixture.detectChanges();
  }); 

  it('created a modal with 1 button in the modal-footer', () => {
    const okButton = fixture.debugElement.query(By.css('button'));

    expect(okButton)
      .withContext("Ok modal shouldn't be null")
      .not.toBeNull();
  });

  it('created a modal with a paragraph inside the modal-body', () => {
    const paragraph = fixture.debugElement.query(By.css('.modal-body p'));

    expect(paragraph).withContext("Paragraph shouldn't be null").not.toBeNull();
  });

  it('created a modal with a errorModalLabel', () => {
    const title = fixture.debugElement.query(By.css('#errorModalLabel'));

    expect(title).withContext("Title shouldn't be null").not.toBeNull();
  });
});
