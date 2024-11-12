import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LogsModalComponent } from 'src/app/dashboard/logs/logs-modal/logs-modal.component';
import { logMock } from 'src/tests/mocks/mocks';

describe('Logs Modal Component (Isolated Test)', () => {
  let fixture: ComponentFixture<LogsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LogsModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsModalComponent);
    fixture.detectChanges();
  });

  it('should create a modal with 4 labels and one close button', () => {
    fixture.componentInstance.log = logMock;
    fixture.detectChanges();

    const labels = fixture.debugElement.queryAll(By.css('label'));
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const closeButton = buttons[1];

    expect(labels.length).withContext('should create 4 labels').toBe(4);
    expect(labels[0].nativeElement.textContent)
      .withContext('should create a label with the text "Fecha del error"')
      .toBe('Fecha del error');
    expect(labels[1].nativeElement.textContent)
      .withContext('should create a label with the text "Error"')
      .toBe('Error');
    expect(labels[2].nativeElement.textContent)
      .withContext('should create a label with the text "Excepción"')
      .toBe('Excepción');
    expect(labels[3].nativeElement.textContent)
      .withContext('should create a label with the text "Usuario"')
      .toBe('Usuario');
    expect(closeButton.nativeElement.textContent)
      .withContext('should create a button with the text "Close"')
      .toBe('Cerrar');
  });
});
