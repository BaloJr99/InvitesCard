import { Component, OnInit } from '@angular/core';
import { EntriesService } from 'src/core/services/entries.service';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { IEntry, IMessage } from 'src/shared/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private entriesService: EntriesService,
    private tokenService: TokenStorageService) {}
  confirmedEntries = 0;
  canceledEntries = 0;
  pendingEntries = 0;
  totalEntries = 0;
  messages: Map<number, IMessage> = new Map<number, IMessage>();
  entryToModify: IEntry | null = null;
  entriesGrouped: { [key: string]: IEntry[] } = {};
  username = "";
  email = "";


  entries: IEntry[] = [];
  
  ngOnInit(): void {
    this.updateDashboard();
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.username = userInformation.username;
      this.email = userInformation.email;
    }
  }

  updateDashboard(): void {
    this.entriesService.getAllEntries().subscribe({
      next: (entry) => {
        let counter = 0;
        this.entriesGrouped = {};
        this.confirmedEntries = 0;
        this.canceledEntries = 0;
        this.pendingEntries = 0;
        this.totalEntries = 0;
        this.entries = entry;

        this.messages.clear();

        entry.forEach((value) => {
          if (value.confirmation) {
            if (value.confirmation === true || value.confirmation === 1) {
              this.confirmedEntries += (value.entriesConfirmed)
              this.canceledEntries += (value.entriesNumber - value.entriesConfirmed)
            } else {
              this.canceledEntries += value.entriesNumber;
            }
          } else {
            this.pendingEntries += value.entriesNumber
          }
          this.totalEntries += value.entriesNumber

          if (value.message) {
            this.messages.set(counter, { family: value.family, message: value.message });
            counter++;
          }

          if (this.entriesGrouped[value.groupSelected]) {
            this.entriesGrouped[value.groupSelected].push(value)
          } else {
            this.entriesGrouped[value.groupSelected] = []
            this.entriesGrouped[value.groupSelected].push(value)
          }
        })
      }
    })
  }

  getEntryToModifiy(): void {
    const entryFound = this.entries.find((entry) => entry.id === $("#entryId").val())
    if (entryFound) {
      entryFound.kidsAllowed = Boolean(entryFound.kidsAllowed)
      this.entryToModify = entryFound;
    }
  }

  toggleMessages(): void {
    const toggleMessages = document.querySelector(".messages-chat");
    if (toggleMessages) {
      toggleMessages.classList.toggle("active");
    }
  }
}
