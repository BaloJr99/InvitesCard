import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { InvitesService } from 'src/core/services/invites.service';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private invitesService: InvitesService) {}
  confirmedEntries = 0;
  canceledEntries = 0;
  pendingEntries = 0;
  totalEntries = 0;

  entries: { [key: string]: IEntry[] } = {};
  
  ngOnInit(): void {
    this.invitesService.getAllEntries().pipe(
      tap((entries) => {
        console.log(entries)
      })
    ).subscribe({
      next: (entry) => {
        const groupedEntries: { [key: string]: IEntry[] } = {};
        entry.forEach((value) => {
          if (groupedEntries[value.groupSelected]) {
            groupedEntries[value.groupSelected].push(value)
          } else {
            groupedEntries[value.groupSelected] = []
            groupedEntries[value.groupSelected].push(value)
          }
          
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
        })
        this.entries = groupedEntries;
      }
    })
  }
}
