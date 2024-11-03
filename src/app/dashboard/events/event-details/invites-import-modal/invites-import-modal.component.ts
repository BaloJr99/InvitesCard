import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IErrorInvite, IBulkInvite } from 'src/app/core/models/invites';
import { IInviteGroups } from 'src/app/core/models/inviteGroups';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { IBulkMessageResponse, IBulkResults } from 'src/app/core/models/common';
import { FileReaderService } from 'src/app/core/services/fileReader.service';

@Component({
  selector: 'app-invites-import-dialog',
  templateUrl: './invites-import-modal.component.html',
  styleUrls: ['./invites-import-modal.component.css'],
})
export class InvitesImportModalComponent implements OnInit {
  @Input() eventId: string = '';
  @Input() inviteGroups: IInviteGroups[] = [];
  @Output() updateBulkResults = new EventEmitter<IBulkResults>();
  invites: IBulkInvite[] = [];
  errorInvites: IErrorInvite[] = [];
  processingFile = false;

  constructor(
    private invitesService: InvitesService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private fileReaderService: FileReaderService
  ) {}

  ngOnInit(): void {
    $('#invitesImportModal').on('hidden.bs.modal', () => {
      this.invites = [];
      this.errorInvites = [];
      const input = document.getElementById('fileInput') as HTMLInputElement;
      input.value = '';
      this.processingFile = false;
    });
  }

  onFileChange = async (event: Event) => {
    const element = event.currentTarget as HTMLInputElement;

    if (element.files && element.files.length > 0) {
      try {
        this.processingFile = true;
        this.loaderService.setLoading(true, $localize`Procesando archivo`);
        this.fileReaderService.read(
          element.files.item(0) as File
        ).subscribe((content: string) => {
          this.processFile(content);
        });
      } catch (error) {
        this.loaderService.setLoading(false);
        this.processingFile = false;
        console.error(error);
      }
    } else {
      this.errorInvites = [];
      this.invites = [];
      this.processingFile = false;
    }
  };

  sendData(): void {
    this.loaderService.setLoading(true, $localize`Procesando invitaciones`);
    this.invitesService
      .bulkInvites(this.invites)
      .subscribe({
        next: (messageResponse: IBulkMessageResponse) => {
          this.toastr.success(messageResponse.message);

          this.updateBulkResults.emit({
            inviteGroupsGenerated: messageResponse.inviteGroupsGenerated,
            invitesGenerated: messageResponse.invitesGenerated,
          });

          $('#invitesImportModal').modal('hide');
        },
      })
      .add(this.loaderService.setLoading(false));
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
      progress = progress + incrementValue;
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
        const inviteGroupFound = this.inviteGroups.find(
          (f) => f.inviteGroup.toLowerCase() === columns[4].toLowerCase()
        );
        this.invites.push({
          family: columns[0],
          entriesNumber: parseInt(columns[1]),
          phoneNumber: columns[2],
          kidsAllowed: Boolean(parseInt(columns[3])),
          eventId: this.eventId,
          inviteGroupName: columns[4],
          inviteGroupId: inviteGroupFound ? inviteGroupFound.id : '',
          isNewInviteGroup: inviteGroupFound ? false : true,
        });
      }
    });

    this.loaderService.setLoading(false);
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
