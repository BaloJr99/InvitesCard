import { QrCodeModalComponent } from 'src/app/shared/components/qr-code-modal/qr-code-modal.component';

describe('QR Code Modal Component (Isolated Test)', () => {
  let component: QrCodeModalComponent;

  beforeEach(() => {
    component = new QrCodeModalComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
