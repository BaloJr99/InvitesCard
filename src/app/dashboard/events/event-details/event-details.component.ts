import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FamilyGroupsService } from 'src/app/core/services/familyGroups.service';
import { CommonEntriesService } from 'src/app/core/services/commonEntries.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { IStatistic } from 'src/app/core/models/events';
import { IEntry, IEntryAction } from 'src/app/core/models/entries';
import { IFamilyGroup, IFamilyGroupAction } from 'src/app/core/models/familyGroups';
import { IMessage, INotification } from 'src/app/core/models/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  @ViewChild(DialogComponent) dialogComponent!: DialogComponent;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private familyGroupsService: FamilyGroupsService,
    private commonEntriesService: CommonEntriesService,
    private socket: SocketService) {
  }

  stadistics: IStatistic = {
    confirmedEntries: 0,
    canceledEntries: 0,
    pendingEntries: 0,
    totalEntries: 0,
  };

  eventId = "";
  
  entryAction!: IEntryAction;

  entriesGrouped: { [key: string]: IEntry[] } = {};

  entries: IEntry[] = [];
  familyGroups: IFamilyGroup[] = [];
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);
    this.loaderService.setLoading(false);
    
    combineLatest([
      this.route.data,
      this.familyGroupsService.getAllFamilyGroups()
    ]).subscribe({
      next: ([data, familyGroups]) => {
        this.commonEntriesService.clearNotifications();
        this.familyGroups = familyGroups;
        this.buildEntriesDashboard(data["eventResolved"]["entries"]);
        this.eventId = data["eventResolved"]["eventId"];
      }
    }).add(() => {
      this.loaderService.setLoading(false)
    })

    this.socket.io.on("newNotification", () => {
      // this.updateEntryService.updateEntries()
    })
  }

  buildEntriesDashboard(entries: IEntry[]) {
    let counter = 0;

    this.entries = entries;
    const notifications: INotification[] = [];
    const messages: Map<number, IMessage> = new Map<number, IMessage>();

    entries.forEach((value) => {
      if (value.confirmation) {
        this.stadistics.confirmedEntries += (value.entriesConfirmed ?? 0)
        this.stadistics.canceledEntries += (value.entriesNumber - (value.entriesConfirmed ?? 0))
      } else {
        if (value.confirmation === null || value.confirmation === undefined) {
          this.stadistics.pendingEntries += value.entriesNumber
        } else {
          this.stadistics.canceledEntries += value.entriesNumber;
        }
      }
      this.stadistics.totalEntries += value.entriesNumber
      if (value.message) {
        messages.set(counter, { family: value.family, message: value.message });
        counter++;
      }

      if (value.confirmation !== null && value.confirmation !== undefined) {
        notifications.push({
          id: value.id,
          confirmation: value.confirmation,
          dateOfConfirmation: value.dateOfConfirmation ?? '',
          family: value.family,
          isMessageRead: value.isMessageRead
        })
      }
    });

    this.commonEntriesService.updateNotifications(notifications, messages);
    this.groupEntries(entries);
  }

  groupEntries(entries: IEntry[]): void {
    this.entriesGrouped = {};

    this.familyGroups.forEach((familyGroup) => {
      if (entries.some(entry => entry.familyGroupId === familyGroup.id)) {
        this.entriesGrouped[familyGroup.familyGroup] = entries.filter(entry => entry.familyGroupId === familyGroup.id);
      }
    })
  }

  fillEntryAction(entryAction: IEntryAction): void {
    this.entryAction = {
      ...entryAction,
      entry: {
        ...entryAction.entry,
        kidsAllowed: Boolean(entryAction.entry.kidsAllowed)
      }
    }
  }

  toggleMessages(): void {
    const toggleMessages = document.querySelector(".messages-chat");
    if (toggleMessages) {
      toggleMessages.classList.toggle("active");
    }
  }

  filterEntries(family: string): void {
    if (family) {
      const filteredEntries = this.entries.filter((entry) => entry.family.toLocaleLowerCase().includes(family.toLocaleLowerCase()))
      this.groupEntries(filteredEntries);
    } else {
      this.groupEntries(this.entries);
    }
  }

  updateEntries(entryAction: IEntryAction) {
    this.clearValues();
    if (entryAction.isNew) {
      this.buildEntriesDashboard(this.entries.concat(entryAction.entry));
    } else {
      if (entryAction.delete) {
        this.buildEntriesDashboard(this.entries.filter(entry => entry.id !== entryAction.entry.id));
      } else {
        this.buildEntriesDashboard(this.entries.map(originalEntry => originalEntry.id === entryAction.entry.id ? entryAction.entry : originalEntry));
      }
    }
  }

  updateFamilyGroups(familyGroupsAction: IFamilyGroupAction) {
    if (familyGroupsAction.isNew) {
      this.familyGroups.push(familyGroupsAction.familyGroup);
      this.familyGroups.sort((a, b) => a.familyGroup.toLowerCase().localeCompare(b.familyGroup.toLowerCase()));
    } else {
      this.familyGroups = this.familyGroups.map(originalFamilyGroup => 
        originalFamilyGroup.id === familyGroupsAction.familyGroup.id ? familyGroupsAction.familyGroup : originalFamilyGroup);
        this.familyGroups.sort((a, b) => a.familyGroup.toLowerCase().localeCompare(b.familyGroup.toLowerCase()));
    }
  }

  clearValues(): void {
    this.stadistics = {
      confirmedEntries: 0,
      canceledEntries: 0,
      pendingEntries: 0,
      totalEntries: 0,
    };
  }
}
