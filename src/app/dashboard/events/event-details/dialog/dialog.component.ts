import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IInviteAction } from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnChanges {
  @Input() inviteAction!: IInviteAction;
  @Output() updateInvites: EventEmitter<IInviteAction> = new EventEmitter();

  constructor(
    private invitesService: InvitesService,
    private toastr: ToastrService,
    private loaderService: LoaderService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes["inviteAction"] && changes["inviteAction"].currentValue) {
      if (changes["inviteAction"].currentValue.delete) {
        this.showModal();
      }
    }
  }

  showModal(): void {
    $("#warningDialog").modal("show");
  }

  hideModal(): void {
    $("#warningDialog").modal("hide");
  }

  deleteEntry(): void {
    this.loaderService.setLoading(true);
    this.invitesService.deleteInvite(this.inviteAction.invite.id).subscribe({
      next: () => {
        this.hideModal();
        this.updateInvites.emit(this.inviteAction);
        this.toastr.success($localize `Se ha eliminado la invitación`);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }
}
