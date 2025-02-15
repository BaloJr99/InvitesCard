import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IErrorInvite, IBulkInvite } from 'src/app/core/models/invites';
import { IInviteGroups } from 'src/app/core/models/inviteGroups';
import { InvitesService } from 'src/app/core/services/invites.service';
import { IBulkMessageResponse, IBulkResults } from 'src/app/core/models/common';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-invites-import-dialog',
  templateUrl: './invites-import-modal.component.html',
  styleUrls: ['./invites-import-modal.component.css'],
})
export class InvitesImportModalComponent {
  private eventId = new BehaviorSubject<string>('');
  eventId$ = this.eventId.asObservable();
  private inviteGroups = new BehaviorSubject<IInviteGroups[]>([]);
  inviteGroups$ = this.inviteGroups.asObservable();
  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set eventIdValue(eventId: string) {
    this.eventId.next(eventId);
  }
  @Input() set inviteGroupsValue(inviteGroups: IInviteGroups[]) {
    this.inviteGroups.next(inviteGroups);
  }
  @Input() set showModalValue(show: boolean) {
    this.showModal.next(show);
  }

  @Output() updateBulkResults = new EventEmitter<IBulkResults>();
  @Output() closeModal = new EventEmitter<void>();

  invites: IBulkInvite[] = [];
  errorInvites: IErrorInvite[] = [];
  processingFile = false;

  constructor(
    private invitesService: InvitesService,
    private toastr: ToastrService,
    private fileReaderService: FileReaderService
  ) {}

  vm$ = combineLatest([
    this.eventId$,
    this.inviteGroups$,
    this.showModal$,
  ]).pipe(
    map(([eventId, inviteGroups, showModal]) => {
      // Reset values
      this.errorInvites = [];
      this.invites = [];
      this.processingFile = false;

      if (showModal) {
        $('#invitesImportModal').modal('show');
        const input = document.getElementById('fileInput') as HTMLInputElement;
        input.value = '';
        $('#invitesImportModal').on('hidden.bs.modal', () => {
          this.closeModal.emit();
        });
      } else {
        $('#invitesImportModal').modal('hide');
      }
      return { eventId, inviteGroups };
    })
  );

  onFileChange = async (event: Event) => {
    const element = event.currentTarget as HTMLInputElement;

    if (element.files && element.files.length > 0) {
      try {
        this.processingFile = true;
        this.fileReaderService
          .read(element.files.item(0) as File)
          .subscribe((content: string) => {
            this.processFile(content);
          });
      } catch {
        this.processingFile = false;
      }
    } else {
      this.errorInvites = [];
      this.invites = [];
      this.processingFile = false;
    }
  };

  sendData(): void {
    this.invitesService.bulkInvites(this.invites).subscribe({
      next: (messageResponse: IBulkMessageResponse) => {
        this.toastr.success(messageResponse.message);

        this.updateBulkResults.emit({
          inviteGroupsGenerated: messageResponse.inviteGroupsGenerated,
          invitesGenerated: messageResponse.invitesGenerated,
        });
        this.closeModal.emit();
      },
    });
  }

  processFile(content: string) {
    const progressBar = document.getElementById('bar') as HTMLDivElement;
    const rows = content
      .split('\r\n')
      .filter((value, index) => value.trim() !== '' && index !== 0);
    const incrementValue = 100 / rows.length;
    let progress = 0;
    this.invites = [];

    rows.map((row) => {
      progress = Math.ceil(progress + incrementValue);
      if (progress > 100) progress = 100;
      progressBar.style.width = progress + '%';
      progressBar.innerText = progress + '%';
      const columns = row.split(',');

      if (
        columns.some((value, index) => {
          // Evaluate Family
          if (index === 0 && value === '') return true;
          // Evaluate Entries Number Column
          if (index === 1 && isNaN(parseInt(value))) return true;
          // Evaluate Phone Number
          if (index === 2 && !value.match('[0-9]{10}')) return true;
          // Evaluate Invite Group
          if (index === 4 && value === '') return true;
          return false;
        })
      ) {
        this.errorInvites.push({
          family:
            columns[0] === '' ? $localize`ERROR: Campo cacío` : columns[0],
          entriesNumber: isNaN(parseInt(columns[1]))
            ? $localize`ERROR: Campo no númerico`
            : columns[1],
          phoneNumber: !columns[2].match('[0-9]{10}')
            ? $localize`ERROR: Tel inválido`
            : columns[2],
          kidsAllowed: Boolean(parseInt(columns[3])),
          inviteGroupId:
            columns[0] === '' ? $localize`ERROR: Campo vacío` : columns[4],
        });
      } else {
        const inviteGroupFound = this.inviteGroups.value.find(
          (f) => f.inviteGroup.toLowerCase() === columns[4].toLowerCase()
        );
        this.invites.push({
          family: columns[0],
          entriesNumber: parseInt(columns[1]),
          phoneNumber: columns[2],
          kidsAllowed: Boolean(parseInt(columns[3])),
          eventId: this.eventId.value,
          inviteGroupName: columns[4],
          inviteGroupId: inviteGroupFound ? inviteGroupFound.id : '',
          isNewInviteGroup: inviteGroupFound ? false : true,
        });
      }
    });
  }

  downloadTemplate() {
    const csv = $localize`Familia,Numero de pases,Telefóno,Niños permitidos,Grupo\n`;
    const blob = new Blob([csv], {
      type: 'text/csv; charset=utf-8',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', $localize`plantillaInvitaciones.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
