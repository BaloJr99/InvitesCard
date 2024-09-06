import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FamilyGroupsService } from 'src/app/core/services/familyGroups.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { IStatistic } from 'src/app/core/models/events';
import { IFamilyGroup, IFamilyGroupAction } from 'src/app/core/models/familyGroups';
import { IMessage, INotification } from 'src/app/core/models/common';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { IConfirmation, IInvite, IInviteAction } from 'src/app/core/models/invites';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class InviteDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private familyGroupsService: FamilyGroupsService,
    private commonInvitesService: CommonInvitesService,
    private socket: SocketService,
    @Inject(LOCALE_ID) private localeValue: string) {
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

  isDeadlineMet = false;
  
  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize `Cargando los detalles del evento`);
    this.loaderService.setLoading(false);
    
    this.route.data.pipe(
      filter(response => {
        if (response) {
          this.isDeadlineMet = Boolean(response["eventResolved"]["isDeadlineMet"]);
          this.invites = response["eventResolved"]["invites"];
          this.eventId = response["eventResolved"]["eventId"];
          this.commonInvitesService.clearNotifications();
          return true
        }
        return false;
      }),
      switchMap(data => this.familyGroupsService.getAllFamilyGroups(data["eventResolved"]["eventId"]))
    ).subscribe({
      next: (familyGroups) => {
        this.familyGroups = familyGroups;
        this.buildInvitesDashboard();
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    })

    this.commonInvitesService.notifications$.subscribe({
      next: (notifications) => {
        notifications.filter(n => n.isMessageRead).forEach((notification) => {
          const index = this.invites.findIndex(i => i.id === notification.id);
          (this.invites.at(index) as IInvite).isMessageRead = true;
        });
      }
    });

    this.socket.io.on("newNotification", (confirmation: IConfirmation) => {
      this.invites = this.invites.map(invite => {
        if (invite.id === confirmation.id) {
          return {
            ...invite,
            confirmation: confirmation.confirmation,
            dateOfConfirmation: confirmation.dateOfConfirmation,
            entriesConfirmed: confirmation.entriesConfirmed,
            message: confirmation.message,
            inviteViewed: new Date().toISOString()
          }
        }
        return invite;
      });

      this.buildInvitesDashboard();
    })
  }

  buildInvitesDashboard() {
    const notifications: INotification[] = [];
    const messages: IMessage[] = [];

    this.invites.forEach((value) => {
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
        messages.push({ 
          family: value.family, 
          message: value.message,
          date: new Date(value.dateOfConfirmation as string).toLocaleDateString(this.localeValue, { day: 'numeric', month: 'long', year: 'numeric' }),
          time: new Date(value.dateOfConfirmation as string).toLocaleTimeString(this.localeValue, { hour: '2-digit', minute: '2-digit' }),
        });
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
    this.groupEntries(this.invites);
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

  removeInvites(invitesIds: string[]): void {
    this.invites = this.invites.filter(invite => !invitesIds.includes(invite.id));
    this.buildInvitesDashboard();
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
      this.invites = this.invites.concat(inviteAction.invite);
      this.buildInvitesDashboard();
    } else {
      if (inviteAction.delete) {
        this.invites = this.invites.filter(invite => invite.id !== inviteAction.invite.id);
        this.buildInvitesDashboard();
      } else {
        this.invites = this.invites.map(originalInvite => originalInvite.id === inviteAction.invite.id ? inviteAction.invite : originalInvite);
        this.buildInvitesDashboard();
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
