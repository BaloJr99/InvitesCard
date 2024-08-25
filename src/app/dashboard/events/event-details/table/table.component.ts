import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { } from 'bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { IInvite, IInviteAction } from 'src/app/core/models/invites';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @Input() inviteGroup!: KeyValue<string, IInvite[]>;
  @Output() setInviteAction = new EventEmitter<IInviteAction>();

  dtOptions: ADTSettings = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dtTrigger: Subject<any> = new Subject<any>();
  
  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      destroy: true,
      language: {
        lengthMenu: '_MENU_'
      }
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(false)
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  copyToClipBoard(id: string): void {
    const url = `${window.location.origin}/invites/${id}`

    navigator.clipboard.writeText(url)
  }

  openEditModal(id: string): void {
    const inviteToEdit = this.inviteGroup.value.find((invite) => invite.id === id);
    if (inviteToEdit) {
      this.setInviteAction.emit({
        invite: inviteToEdit,
        isNew: false,
        delete: false
      });

      $("#inviteModal").modal("show");
    }
  }

  showModal(invite: IInvite): void {
    this.setInviteAction.emit({
      invite: invite,
      isNew: false,
      delete: true
    })
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });
    this.dtTrigger.next(false);
  }
}
