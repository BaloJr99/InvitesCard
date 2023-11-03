import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntriesService } from 'src/core/services/entries.service';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnChanges {
  @Input() entry: IEntry | null = null;

  constructor(private entriesService: EntriesService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entry"].currentValue) {
      this.showModal();
    }
  }

  showModal(): void {
    $("#warningDialog").modal("show");
  }

  hideModal(): void {
    $("#warningDialog").modal("hide");
  }

  deleteEntry(): void {
    if (this.entry) {
      this.entriesService.deleteEntry(this.entry.id).subscribe({
        next: (response) => {
          this.hideModal();
          console.log(response.message);
        }
      });
    }
  }
}
