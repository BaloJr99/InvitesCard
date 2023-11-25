import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { ConfirmationComponent } from "src/app/entries/confirmation/confirmation.component";
import { EntriesService } from "src/core/services/entries.service";
import { emptyConfirmationEntry, validEntryConfirmation } from "src/tests/mocks/mock";

let entriesServiceSpy = jasmine.createSpyObj('EntriesService', ['sendConfirmation']);

describe('Confirmation Component: Integrated Test', () => {
  let fixture: ComponentFixture<ConfirmationComponent>;

  const updateFormUsingEvent = (confirmation: boolean, entriesConfirmed: number | string, message: string | null) => {
    const confirmationInput = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    const entriesConfirmedDropdown = fixture.debugElement.query(By.css("select"));
    const messageTextArea = fixture.debugElement.query(By.css("textarea"));
    
    if (confirmation) {
      confirmationInput[0].nativeElement.value = confirmation;
      confirmationInput[0].nativeElement.dispatchEvent(new Event('change'));
    } else {
      confirmationInput[1].nativeElement.value = confirmation;
      confirmationInput[1].nativeElement.dispatchEvent(new Event('change'));
    }

    entriesConfirmedDropdown.nativeElement.value = entriesConfirmed;
    entriesConfirmedDropdown.nativeElement.dispatchEvent(new Event('change'));

    messageTextArea.nativeElement.value = message;
    messageTextArea.nativeElement.dispatchEvent(new Event('input'));

    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('submit');

    fixture.detectChanges();
  };

  beforeEach(() => {
    entriesServiceSpy = jasmine.createSpyObj('EntriesService', ['sendConfirmation']);
    TestBed.configureTestingModule({
      declarations: [
        ConfirmationComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: EntriesService, useValue: entriesServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(ConfirmationComponent);

    fixture.componentInstance.entry = emptyConfirmationEntry;

    fixture.detectChanges();

    fixture.componentInstance.ngOnChanges({
      entry: new SimpleChange(null, emptyConfirmationEntry, true)
    });

    fixture.detectChanges();
  });

  it('authService sendConfirmation() should called', () => {
    spyOn(fixture.componentInstance, 'showDiv');
    entriesServiceSpy.sendConfirmation.and.returnValue(of(true));

    updateFormUsingEvent(
      validEntryConfirmation.confirmation, 
      validEntryConfirmation.entriesConfirmed, 
      validEntryConfirmation.message);

    fixture.detectChanges();
    
    expect(entriesServiceSpy.sendConfirmation)
      .withContext("SendConfirmation method from EntriesService should've been called")
      .toHaveBeenCalled();

    expect(fixture.componentInstance.showDiv)
      .toHaveBeenCalled();
  });

  it('should show confirmed modal if form submitted', () => {
    entriesServiceSpy.sendConfirmation.and.returnValue(of(true));

    let confirmationForm = fixture.debugElement.query(By.css('form'));
    expect(confirmationForm)
      .withContext('Expected confirmation form to be defined')
      .toBeDefined();

    let confirmedModal = fixture.debugElement.query(By.css('.confirmedModal'));
    expect(confirmedModal)
      .withContext('Expected confirmedDiv to not be defined')
      .toBeNull();

    updateFormUsingEvent(
      validEntryConfirmation.confirmation, 
      validEntryConfirmation.entriesConfirmed, 
      validEntryConfirmation.message);

    fixture.detectChanges();

    confirmationForm = fixture.debugElement.query(By.css('form'));
    expect(confirmationForm)
      .withContext('Expected confirmation form not to be defined')
      .toBeNull();

    confirmedModal = fixture.debugElement.query(By.css('.confirmedModal'));
    expect(confirmedModal)
      .withContext('Expected confirmation div to be defined')
      .toBeDefined();
  });

  // it('should show credentials error if no user or username matches', () => {
  //   authServiceSpy.loginAccount.and.callFake(() => {
  //     return throwError(() => new HttpErrorResponse({ status: 401 }));
  //   });
  //   updateFormUsingEvent(validUser.username, validUser.password) ;
  //   fixture.detectChanges();
    
  //   const button = fixture.debugElement.query(By.css('button'))
  //   button.nativeElement.click();
    
  //   fixture.detectChanges();

  //   const authErrorMessageSpan: HTMLSpanElement = fixture.debugElement.query(By.css('#authErrorMessage')).nativeElement;
  //   expect(authErrorMessageSpan.innerHTML)
  //     .withContext("Should display wrong credentials")
  //     .toContain('Credenciales Incorrectas');
  // });
});