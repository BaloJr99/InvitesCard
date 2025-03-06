import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QrCodeModalComponent } from 'src/app/shared/components/qr-code-modal/qr-code-modal.component';

describe('QR Code Modal Component (Shallow Test)', () => {
  let fixture: ComponentFixture<QrCodeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QrCodeModalComponent],
    });

    fixture = TestBed.createComponent(QrCodeModalComponent);

    fixture.componentRef.setInput('showModalValue', true);
    fixture.componentRef.setInput('urlValue', 'https://www.example.com');

    fixture.detectChanges();
  });

  it('should render a button to save the qrCode', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).withContext('There should be three buttons').toBe(3);
    expect(buttons[2].nativeElement.textContent).toBe('Descargar');
  });

  it('should render a qrCode', () => {
    const qrCode = fixture.debugElement.query(By.css('qrcode'));
    expect(qrCode).toBeTruthy();
  });

  it('should call saveAsImage when the button is clicked', () => {
    spyOn(fixture.componentInstance, 'saveAsImage');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[2].nativeElement.click();
    expect(fixture.componentInstance.saveAsImage).toHaveBeenCalled();
  });
});
