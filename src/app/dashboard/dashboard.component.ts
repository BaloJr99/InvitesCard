import { Component, OnInit } from '@angular/core';
import { EntriesService } from 'src/core/services/entries.service';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private entriesService: EntriesService) {}
  confirmedEntries = 0;
  canceledEntries = 0;
  pendingEntries = 0;
  totalEntries = 0;
  messages: string[] = ["No hay mensajes"];
  entriesGrouped: { [key: string]: IEntry[] } = {};

  entries: IEntry[] = [];
  
  ngOnInit(): void {
    this.updateDashboard();
  }

  updateDashboard(): void {
    this.entriesService.getAllEntries().subscribe({
      next: (entry) => {
        this.entriesGrouped = {};
        this.confirmedEntries = 0;
        this.canceledEntries = 0;
        this.pendingEntries = 0;
        this.totalEntries = 0;
        this.entries = entry;

        if(this.entries.some((entry) => entry.message)) {
          this.messages = []
        }

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
            this.messages.push(value.message);
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

  toggleMessages(): void {
    const toggleMessages = document.querySelector(".messages-chat");
    if (toggleMessages) {
      toggleMessages.classList.toggle("active");
    }
  }
}
