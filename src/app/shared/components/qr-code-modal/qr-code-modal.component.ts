import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FixMeLater,
  QRCodeComponent,
} from 'angularx-qrcode';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-qr-code',
  imports: [QRCodeComponent, CommonModule],
  templateUrl: './qr-code-modal.component.html',
  styleUrl: './qr-code-modal.component.css',
})
export class QrCodeModalComponent {
  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set showModalValue(value: boolean) {
    this.showModal.next(value);
  }

  private url = new BehaviorSubject<string>('');
  url$ = this.url.asObservable();

  @Input() set urlValue(value: string) {
    this.url.next(value);
  }

  @Output() closeModal = new EventEmitter<void>();

  vm$ = combineLatest([this.showModal$, this.url$]).pipe(
    map(([showModal, url]) => {
      if (showModal) {
        $('#qrCodeModal').modal('show');
        $('#qrCodeModal').on('hidden.bs.modal', () => {
          this.closeModal.emit();
        });
      } else {
        $('#qrCodeModal').modal('hide');
      }

      return {
        showModal,
        url,
      };
    })
  );

  saveAsImage(parent: FixMeLater) {
    let parentElement = null;

    // fetches base 64 data from canvas
    parentElement = parent.qrcElement.nativeElement
      .querySelector('canvas')
      .toDataURL('image/png');

    // converts base 64 encoded image to blobData
    const blobData = this.convertBase64ToBlob(parentElement);
    // saves as image
    const blob = new Blob([blobData], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // name of the file
    link.download = 'QRCode.png';
    link.click();

    this.closeModal.emit();
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(';base64,');
    // hold the content type
    const imageType = parts[0].split(':')[1];
    // decode base64 string
    const decodedData = window.atob(parts[1]);
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }
}
