import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { EntriesService } from 'src/core/services/entries.service';
import { IEntryAction } from 'src/shared/interfaces';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/core/services/loader.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnChanges {
  @Input() entryAction!: IEntryAction;
  @Output() updateEntries: EventEmitter<IEntryAction> = new EventEmitter();

  constructor(
    private entriesService: EntriesService,
    private toastr: ToastrService,
    private loaderService: LoaderService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entryAction"] && changes["entryAction"].currentValue) {
      if (changes["entryAction"].currentValue.delete) {
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
    this.entriesService.deleteEntry(this.entryAction.entry.id).subscribe({
      next: () => {
        this.hideModal();
        this.updateEntries.emit(this.entryAction);
        this.toastr.success("Se ha eliminado la invitación");
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }
}
