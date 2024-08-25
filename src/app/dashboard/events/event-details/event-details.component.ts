import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FamilyGroupsService } from 'src/app/core/services/familyGroups.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { IStatistic } from 'src/app/core/models/events';
import { IFamilyGroup, IFamilyGroupAction } from 'src/app/core/models/familyGroups';
import { IMessage, INotification } from 'src/app/core/models/common';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { IInvite, IInviteAction } from 'src/app/core/models/invites';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class InviteDetailsComponent implements OnInit {
  @ViewChild(DialogComponent) dialogComponent!: DialogComponent;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private familyGroupsService: FamilyGroupsService,
    private commonInvitesService: CommonInvitesService,
    private socket: SocketService) {
  }

  stadistics: IStatistic = {
    confirmedEntries: 0,
    canceledEntries: 0,
    pendingEntries: 0,
    totalEntries: 0,
  };

  eventId = "";
  
  inviteAction!: IInviteAction;

  invitesGrouped: { [key: string]: IInvite[] } = {};

  invites: IInvite[] = [];
  familyGroups: IFamilyGroup[] = [];
  
  ngOnInit(): void {
    this.loaderService.setLoading(true);
    this.loaderService.setLoading(false);
    
    combineLatest([
      this.route.data,
      this.familyGroupsService.getAllFamilyGroups()
    ]).subscribe({
      next: ([data, familyGroups]) => {
        this.commonInvitesService.clearNotifications();
        this.familyGroups = familyGroups;
        this.buildInvitesDashboard(data["eventResolved"]["invites"]);
        this.eventId = data["eventResolved"]["eventId"];
      }
    }).add(() => {
      this.loaderService.setLoading(false)
    })

    this.socket.io.on("newNotification", () => {
      // this.updateEntryService.updateEntries()
    })
  }

  buildInvitesDashboard(invites: IInvite[]) {
    let counter = 0;

    this.invites = invites;
    const notifications: INotification[] = [];
    const messages: Map<number, IMessage> = new Map<number, IMessage>();

    invites.forEach((value) => {
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

    this.commonInvitesService.updateNotifications(notifications, messages);
    this.groupEntries(invites);
  }

  groupEntries(invites: IInvite[]): void {
    this.invitesGrouped = {};

    this.familyGroups.forEach((familyGroup) => {
      if (invites.some(invite => invite.familyGroupId === familyGroup.id)) {
        this.invitesGrouped[familyGroup.familyGroup] = invites.filter(invite => invite.familyGroupId === familyGroup.id);
      }
    })
  }

  fillInviteAction(inviteAction: IInviteAction): void {
    this.inviteAction = {
      ...inviteAction,
      invite: {
        ...inviteAction.invite,
        kidsAllowed: Boolean(inviteAction.invite.kidsAllowed)
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
      const filteredEntries = this.invites.filter((invite) => invite.family.toLocaleLowerCase().includes(family.toLocaleLowerCase()))
      this.groupEntries(filteredEntries);
    } else {
      this.groupEntries(this.invites);
    }
  }

  updateInvites(inviteAction: IInviteAction) {
    this.clearValues();
    if (inviteAction.isNew) {
      this.buildInvitesDashboard(this.invites.concat(inviteAction.invite));
    } else {
      if (inviteAction.delete) {
        this.buildInvitesDashboard(this.invites.filter(invite => invite.id !== inviteAction.invite.id));
      } else {
        this.buildInvitesDashboard(this.invites.map(originalInvite => originalInvite.id === inviteAction.invite.id ? inviteAction.invite : originalInvite));
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
