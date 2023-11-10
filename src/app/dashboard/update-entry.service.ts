import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { EntriesService } from "src/core/services/entries.service";
import { LoaderService } from "src/core/services/loader.service";
import { IEntry } from "src/shared/interfaces";

@Injectable()
export class UpdateEntryService {

  private entries = new BehaviorSubject<IEntry[]>([])
  entries$ = this.entries.asObservable();

  constructor(
    private entriesService: EntriesService, 
    private loaderService: LoaderService) { }

  updateEntries(): void {
    this.entriesService.getAllEntries().subscribe({
      next: (entries) => {
        this.entries.next(entries);
      }
    }).add(() => {
      if (this.loaderService.getLoading())
      this.loaderService.setLoading(false);
    })
  }
}