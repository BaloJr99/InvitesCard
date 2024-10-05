import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ICommonModal } from 'src/app/core/models/common';
import { CommonModalResponse, CommonModalType } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrl: './common-modal.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CommonModalComponent implements OnInit{
  commonModalData: ICommonModal = {
    title: '',
    modalBody: '',
    modalType: CommonModalType.Confirm,
    actionFunction: () => {},
  } as ICommonModal;

  actionButton1 = '';
  actionButton2 = '';

  constructor(public commonModalService: CommonModalService) {}

  ngOnInit(): void {
    this.commonModalService.commonModalData$.subscribe({
      next: (data) => {
        this.commonModalData = data;
        if (data.modalType === CommonModalType.Confirm) {
          this.actionButton1 = $localize`Cancelar`;
          this.actionButton2 = $localize`Confirmar`;
        }
        $('#commonModal').modal('show');
      },
    });

    $('#commonModal').on('hide.bs.modal', () => {
      this.commonModalService.sendResponse(CommonModalResponse.Cancel);
    });
  }

  action(): void {
    if (this.commonModalData.modalType === CommonModalType.Confirm) {
      this.commonModalService.sendResponse(CommonModalResponse.Confirm);
    }
    $('#commonModal').modal('hide');
  }
}
