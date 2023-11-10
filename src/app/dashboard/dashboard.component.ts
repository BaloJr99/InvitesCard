import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { IEntry, IMessage, INotifications } from 'src/shared/interfaces';
import { UpdateEntryService } from './update-entry.service';
import { DialogComponent } from './dialog/dialog.component';
import { SocketService } from 'src/core/services/socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DialogComponent) dialogComponent!: DialogComponent;
  constructor(
    private tokenService: TokenStorageService,
    private updateEntryService: UpdateEntryService,
    private socket: SocketService) {

  }

  confirmedEntries = 0;
  canceledEntries = 0;
  pendingEntries = 0;
  totalEntries = 0;

  messages: Map<number, IMessage> = new Map<number, IMessage>();
  
  entryToModify: IEntry | null = null;
  entryToDelete: IEntry | null = null;
  
  entriesGrouped: { [key: string]: IEntry[] } = {};
  username = "";
  email = "";

  entries: IEntry[] = [];
  notifications: INotifications[] = [];
  
  ngOnInit(): void {
    this.updateDashboard();
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.username = userInformation.username;
      this.email = userInformation.email;
      this.socket.joinRoom(this.username);
    }

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
      this.updateEntryService.updateEntries()
    })
  }

  updateDashboard(): void {
    this.updateEntryService.entries$.subscribe({
      next: (entries) => {
        let counter = 0;
        this.confirmedEntries = 0;
        this.canceledEntries = 0;
        this.pendingEntries = 0;
        this.totalEntries = 0;
        this.entries = entries;
        const newNotifications: INotifications[] = [];

        this.messages.clear();

        entries.forEach((value) => {
          if (value.confirmation) {
            this.confirmedEntries += (value.entriesConfirmed)
            this.canceledEntries += (value.entriesNumber - value.entriesConfirmed)
          } else {
            if (value.confirmation === null) {
              this.pendingEntries += value.entriesNumber
            } else {
              this.canceledEntries += value.entriesNumber;
            }
          }
          this.totalEntries += value.entriesNumber

          if (value.message) {
            this.messages.set(counter, { family: value.family, message: value.message });
            counter++;
          }

          if (value.confirmation !== null) {
            newNotifications.push({
              id: value.id,
              confirmation: value.confirmation,
              dateOfConfirmation: value.dateOfConfirmation,
              family: value.family,
              isMessageRead: value.isMessageRead
            })
          }
        })
        this.notifications = newNotifications;
        this.groupEntries(entries);
      }
    })
    this.updateEntryService.updateEntries();
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

  filterEntries(family: string): void {
    if (family) {
      const filteredEntries = this.entries.filter((entry) => entry.family.toLocaleLowerCase().includes(family.toLocaleLowerCase()))
      this.groupEntries(filteredEntries);
    } else {
      this.groupEntries(this.entries);
    }
  }

  showModal(entry: IEntry | null): void {
    this.entryToDelete = entry;
  }
}
