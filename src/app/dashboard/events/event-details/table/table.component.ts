import { KeyValue } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {} from 'bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject, take } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import {
  IFullInvite,
  IInviteAction,
  IInviteGroup,
} from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { CommonModalResponse, CommonModalType } from 'src/app/core/models/enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  @Output() setInviteAction = new EventEmitter<IInviteAction>();
  @Output() removeInvites = new EventEmitter<string[]>();

  @Input() isDeadlineMet = false;
  @Input() eventType = '';
  @Input() set invites(invites: KeyValue<string, IFullInvite[]>) {
    this.originalInvites = invites;
    this.inviteGroup = {
      key: invites.key,
      value: invites.value.map((invite) => {
        return {
          ...invite,
          beingDeleted: false,
        };
      }),
    };
  }

  originalInvites: KeyValue<string, IFullInvite[]> = { key: '', value: [] };
  inviteGroup: KeyValue<string, IInviteGroup[]> = { key: '', value: [] };

  dtOptions: ADTSettings = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  constructor(
    private invitesService: InvitesService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private commonModalService: CommonModalService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      destroy: true,
      language: {
        lengthMenu: '_MENU_',
      },
      columnDefs: [{ orderable: false, targets: [0, 2, 4] }],
      order: [[1, 'asc']],
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  copyToClipBoard(id: string): void {
    const url = `${window.location.origin}/invites/${id}`;

    navigator.clipboard.writeText(url);
  }

  openEditModal(id: string): void {
    const inviteToEdit = this.originalInvites.value.find(
      (invite) => invite.id === id
    ) as IFullInvite;
    this.setInviteAction.emit({
      invite: {
        ...inviteToEdit,
      },
      isNew: false,
    });

    $('#inviteModal').modal('show');
  }

  showModal(invite: IInviteGroup): void {
    const inviteFound = this.originalInvites.value.find(
      (original) => original.id === invite.id
    ) as IFullInvite;

    this.commonModalService.setData({
      modalTitle: $localize`Eliminar invitación`,
      modalBody: $localize`¿Estás seguro de eliminar la invitación de ${inviteFound.family}?`,
      modalType: CommonModalType.Confirm,
    });

    this.commonModalService.commonModalResponse$
      .pipe(take(1))
      .subscribe((response) => {
        if (response === CommonModalResponse.Confirm) {
          this.loaderService.setLoading(true, $localize`Eliminando invitación`);
          this.invitesService
            .deleteInvite(inviteFound.id)
            .subscribe({
              next: (response: IMessageResponse) => {
                this.removeInvites.emit([inviteFound.id]);
                this.toastrService.success(response.message);
              },
            })
            .add(() => {
              this.loaderService.setLoading(false);
            });
        }
      });
  }

  selectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inviteGroup.value.forEach((invite) => {
      invite.beingDeleted = target.checked;
    });
  }

  selectInvite(event: Event, invite: IInviteGroup): void {
    const target = event.target as HTMLInputElement;
    this.inviteGroup.value.forEach((inviteFromGroup) => {
      if (inviteFromGroup.id === invite.id) {
        invite.beingDeleted = target.checked;
      }
    });
  }

  allSelected(): boolean {
    return this.inviteGroup.value.every((invite) => invite.beingDeleted);
  }

  allowDeleteInvites(): boolean {
    return !this.inviteGroup.value.some((invite) => invite.beingDeleted);
  }

  bulkDeleteInvites(): void {
    this.loaderService.setLoading(true, $localize`Eliminando invitaciones`);
    const invitesBeingDeleted = this.inviteGroup.value
      .filter((invite) => invite.beingDeleted)
      .map((invite) => invite.id);
    this.invitesService
      .bulkDeleteInvites(invitesBeingDeleted)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.removeInvites.emit(invitesBeingDeleted);
          this.toastrService.success(response.message);
        },
      })
      .add(() => this.loaderService.setLoading(false));
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });
    this.dtTrigger.next(this.dtOptions);
  }

  getAccessibilityMessage(name: string, isAll: boolean) {
    return isAll
      ? $localize`Seleccionar todos ${name}`
      : $localize`Seleccionar ${name}`;
  }
}
