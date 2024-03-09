import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { IEntry, IEntryAction, IEvent, IEventAction, IMessage, INotifications, IStatistics } from 'src/shared/interfaces';
import { DialogComponent } from './dialog/dialog.component';
import { SocketService } from 'src/core/services/socket.service';
import { LoaderService } from 'src/core/services/loader.service';
import { EventsService } from 'src/core/services/events.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DialogComponent) dialogComponent!: DialogComponent;

  constructor(
    private tokenService: TokenStorageService,
    private eventsService: EventsService,
    private socket: SocketService,
    private loaderService: LoaderService) {
      
    }

  stadistics: IStatistics = {
    confirmedEntries: 0,
    canceledEntries: 0,
    pendingEntries: 0,
    totalEntries: 0,
  };
  
  messages: Map<number, IMessage> = new Map<number, IMessage>();
  events: IEvent[] = [];
  eventSelected!: IEvent;
  eventAction!: IEventAction;
  
  entryAction!: IEntryAction;

  entriesGrouped: { [key: string]: IEntry[] } = {};
  username = "";
  email = "";

  entries: IEntry[] = [];
  notifications: INotifications[] = [];
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.username = userInformation.username;
      this.email = userInformation.email;
      this.socket.joinRoom(this.username);
    }

    this.eventsService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        if (events && events.length > 0) {
          this.getEventEntries(events[0]);
        }
      }
    }).add(() => this.loaderService.setLoading(false));

    window.addEventListener('click', ({ target }) => {
      const toggleMenu = document.querySelector(".menu");
      const toggleNotifications = document.querySelector(".notificationMessages");

      const clickedElement = target as HTMLElement;
      if (!clickedElement.classList.contains("notifications")
        && !clickedElement.classList.contains("fa-bell")
        && !clickedElement.classList.contains("account")
        && !clickedElement.classList.contains("fa-user")){
        if(!toggleMenu?.contains(clickedElement) && (!toggleNotifications?.contains(clickedElement))) {
          if (toggleNotifications && toggleNotifications.classList.contains("active")) {
            toggleNotifications.classList.toggle("active");
          }

          if (toggleMenu && toggleMenu.classList.contains("active")) {
            toggleMenu.classList.toggle("active");
          }
        }
      }
    });

    this.socket.io.on("newNotification", () => {
      // this.updateEntryService.updateEntries()
    })
  }

  buildEntriesDashboard(entries: IEntry[]) {
    let counter = 0;

    this.entries = entries;
    const newNotifications: INotifications[] = [];

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
        this.messages.set(counter, { family: value.family, message: value.message });
        counter++;
      }

      if (value.confirmation !== null && value.confirmation !== undefined) {
        newNotifications.push({
          id: value.id,
          confirmation: value.confirmation,
          dateOfConfirmation: value.dateOfConfirmation ?? '',
          family: value.family,
          isMessageRead: value.isMessageRead
        })
      }
    })
    this.notifications = newNotifications;
    this.groupEntries(entries);
  }

  groupEntries(entries: IEntry[]): void {
    this.entriesGrouped = {};

    entries.forEach((entry) => {
      if (this.entriesGrouped[entry.groupSelected]) {
        this.entriesGrouped[entry.groupSelected].push(entry)
      } else {
        this.entriesGrouped[entry.groupSelected] = []
        this.entriesGrouped[entry.groupSelected].push(entry)
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

  getEventEntries(event: IEvent): void {
    this.eventSelected = event;
    this.eventsService.getEventEntries(event.id).subscribe({
      next: (entries) => {
        this.clearValues();
        this.buildEntriesDashboard(entries);
      }
    }).add(() => {
      if (this.loaderService.getLoading()) {
        this.loaderService.setLoading(false);
      }
    })
  }

  fillEventAction(): void {
    this.eventAction = {
      event: this.eventSelected,
      isNew: false
    }
  }

  updateEvents(eventAction: IEventAction) {
    if (eventAction.isNew) {
      this.eventSelected = eventAction.event;
      this.events.push(eventAction.event);
      this.events.sort((a, b) => a.nameOfEvent.toLowerCase().localeCompare(b.nameOfEvent.toLowerCase()));
      this.clearValues();
    } else {
      this.events = this.events.map(originalEvent => originalEvent.id === eventAction.event.id ? eventAction.event : originalEvent);
    }
  }

  updateEntries(entryAction: IEntryAction) {
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

  clearValues(): void {
    this.stadistics = {
      confirmedEntries: 0,
      canceledEntries: 0,
      pendingEntries: 0,
      totalEntries: 0,
    };

    this.messages.clear();
    this.entriesGrouped = {};
    this.notifications = [];
  }
}
