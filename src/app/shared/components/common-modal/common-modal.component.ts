import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICommonModal } from 'src/app/core/models/common';
import { CommonModalType } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrl: './common-modal.component.css',
  imports: [NgClass],
})
export class CommonModalComponent {
  @Input() set options(value: ICommonModal) {
    this.commonModalData = value;
    if (value.modalType === CommonModalType.Confirm) {
      this.actionButton1 = $localize`Cancelar`;
      this.actionButton2 = $localize`Confirmar`;
    }

    if (value.modalType === CommonModalType.YesNo) {
      this.actionButton1 = $localize`No`;
      this.actionButton2 = $localize`Sí`;
    }
    $('#commonModal').modal('show');
  }

  @Output() closeModal = new EventEmitter();
  @Output() confirmModal = new EventEmitter();

  commonModalData: ICommonModal = {
    modalTitle: '',
    modalBody: '',
    modalType: CommonModalType.None,
  };

  actionButton1 = '';
  actionButton2 = '';

  constructor(public commonModalService: CommonModalService) {}

  confirmAction(): void {
    this.confirmModal.emit();
  }

  closeAction(): void {
    this.closeModal.emit();
  }
}
