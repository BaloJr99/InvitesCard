import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, filter, switchMap } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { IStatistic } from 'src/app/core/models/events';
import {
  IInviteGroups,
  IInviteGroupsAction,
} from 'src/app/core/models/inviteGroups';
import {
  IBulkResults,
  IMessage,
  INotification,
} from 'src/app/core/models/common';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import {
  IConfirmation,
  IFullInvite,
  IInviteAction,
} from 'src/app/core/models/invites';
import { EventsService } from 'src/app/core/services/events.service';
import { EventType } from 'src/app/core/models/enum';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class InviteDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private inviteGroupsService: InviteGroupsService,
    private eventsService: EventsService,
    private commonInvitesService: CommonInvitesService,
    private socket: SocketService,
    @Inject(LOCALE_ID) private localeValue: string
  ) {}

  statistics: IStatistic[] = [];

  eventId = '';
  eventType = '';

  inviteAction!: IInviteAction;
  invitesGrouped: { [key: string]: IFullInvite[] } = {};
  invites: IFullInvite[] = [];
  inviteGroups: IInviteGroups[] = [];

  isDeadlineMet = false;

  ngOnInit(): void {
    this.loaderService.setLoading(
      true,
      $localize`Cargando los detalles del evento`
    );
    this.loaderService.setLoading(false);

    this.route.data
      .pipe(
        filter((response) => {
          if (response) {
            this.isDeadlineMet = Boolean(
              response['eventResolved']['isDeadlineMet']
            );
            this.invites = response['eventResolved']['invites'];
            this.eventId = response['eventResolved']['id'];
            this.commonInvitesService.clearNotifications();
            return true;
          }
          return false;
        }),
        switchMap((data) =>
          combineLatest([
            this.inviteGroupsService.getAllInviteGroups(
              data['eventResolved']['id']
            ),
            this.eventsService.getEventType(data['eventResolved']['id']),
          ])
        )
      )
      .subscribe({
        next: ([inviteGroups, eventType]) => {
          this.inviteGroups = inviteGroups;
          this.eventType = eventType;
          this.buildInvitesDashboard();
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });

    this.commonInvitesService.notifications$.subscribe({
      next: (notifications) => {
        notifications
          .filter((n) => n.isMessageRead)
          .forEach((notification) => {
            const index = this.invites.findIndex(
              (i) => i.id === notification.id
            );
            (this.invites.at(index) as IFullInvite).isMessageRead = true;
          });
      },
    });

    this.socket.io.on('newNotification', (confirmation: IConfirmation) => {
      this.invites = this.invites.map((invite) => {
        if (invite.id === confirmation.id) {
          return {
            ...invite,
            confirmation: confirmation.confirmation,
            dateOfConfirmation: confirmation.dateOfConfirmation,
            entriesConfirmed: confirmation.entriesConfirmed,
            message: confirmation.message,
            inviteViewed: new Date().toISOString(),
          };
        }
        return invite;
      });

      this.buildInvitesDashboard();
    });
  }

  buildInvitesDashboard() {
    const notifications: INotification[] = [];
    const messages: IMessage[] = [];

    this.statistics = [];

    if (
      this.eventType === EventType.Xv ||
      this.eventType === EventType.Wedding
    ) {
      this.statistics = [
        {
          name: $localize`Confirmados`,
          value: 0,
          color: '#4CAF50',
        },
        {
          name: $localize`Pendientes`,
          value: 0,
          color: '#FFC107',
        },
        {
          name: $localize`Cancelados`,
          value: 0,
          color: '#F44336',
        },
        {
          name: $localize`Total`,
          value: 0,
          color: '#2196F3',
        },
      ];

      this.invites.forEach((value) => {
        if (value.confirmation) {
          this.statistics[0].value += value.entriesConfirmed ?? 0;
          this.statistics[2].value +=
            value.entriesNumber - (value.entriesConfirmed ?? 0);
        } else {
          if (value.confirmation === null || value.confirmation === undefined) {
            this.statistics[1].value += value.entriesNumber;
          } else {
            this.statistics[2].value += value.entriesNumber;
          }
        }
        this.statistics[3].value += value.entriesNumber;
        if (value.message) {
          messages.push({
            family: value.family,
            message: value.message,
            date: new Date(
              value.dateOfConfirmation as string
            ).toLocaleDateString(this.localeValue, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            time: new Date(
              value.dateOfConfirmation as string
            ).toLocaleTimeString(this.localeValue, {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        }

        if (value.confirmation !== null && value.confirmation !== undefined) {
          notifications.push({
            id: value.id,
            confirmation: value.confirmation,
            dateOfConfirmation: value.dateOfConfirmation ?? '',
            family: value.family,
            isMessageRead: value.isMessageRead,
          });
        }
      });

      this.commonInvitesService.updateNotifications(notifications, messages);
      this.groupEntries(this.invites);
    } else if (this.eventType === EventType.SaveTheDate) {
      this.statistics = [
        {
          name: $localize`Respondidos`,
          value: 0,
          color: '#4CAF50',
        },
        {
          name: $localize`Pendientes`,
          value: 0,
          color: '#F44336',
        },
        {
          name: $localize`Hospedaje`,
          value: 0,
          color: '#FFC107',
        },
        {
          name: $localize`Total`,
          value: 0,
          color: '#2196F3',
        },
      ];

      this.invites.forEach((value) => {
        if (value.needsAccomodation !== null) {
          this.statistics[0].value += 1;
          this.statistics[2].value += value.needsAccomodation ? 1 : 0;
        } else {
          this.statistics[1].value += 1;
        }
        this.statistics[3].value += 1;
      });

      this.groupEntries(this.invites);
    }
  }

  groupEntries(invites: IFullInvite[]): void {
    this.invitesGrouped = {};

    this.inviteGroups.forEach((inviteGroup) => {
      if (invites.some((invite) => invite.inviteGroupId === inviteGroup.id)) {
        this.invitesGrouped[inviteGroup.inviteGroup] = invites.filter(
          (invite) => invite.inviteGroupId === inviteGroup.id
        );
      }
    });
  }

  fillInviteAction(inviteAction: IInviteAction): void {
    this.inviteAction = {
      ...inviteAction,
      invite: {
        ...inviteAction.invite,
        kidsAllowed: Boolean(inviteAction.invite.kidsAllowed),
      },
    };
  }

  removeInvites(invitesIds: string[]): void {
    this.invites = this.invites.filter(
      (invite) => !invitesIds.includes(invite.id)
    );
    this.buildInvitesDashboard();
  }

  toggleMessages(): void {
    const toggleMessages = document.querySelector('.messages-chat');
    if (toggleMessages) {
      toggleMessages.classList.toggle('active');
    }
  }

  filterEntries(family: string): void {
    if (family) {
      const filteredEntries = this.invites.filter((invite) =>
        invite.family.toLocaleLowerCase().includes(family.toLocaleLowerCase())
      );
      this.groupEntries(filteredEntries);
    } else {
      this.groupEntries(this.invites);
    }
  }

  updateInvites(inviteAction: IInviteAction) {
    if (inviteAction.isNew) {
      this.invites = this.invites.concat({
        ...inviteAction.invite,
        entriesConfirmed: null,
        message: null,
        confirmation: null,
        dateOfConfirmation: null,
        isMessageRead: false,
      });
      this.buildInvitesDashboard();
    } else {
      if (inviteAction.delete) {
        this.invites = this.invites.filter(
          (invite) => invite.id !== inviteAction.invite.id
        );
        this.buildInvitesDashboard();
      } else {
        this.invites = this.invites.map((originalInvite) => {
          if (originalInvite.id === inviteAction.invite.id) {
            return {
              ...inviteAction.invite,
              entriesConfirmed: null,
              message: null,
              confirmation: null,
              dateOfConfirmation: null,
              isMessageRead: false,
            };
          }
          return originalInvite;
        });
        this.buildInvitesDashboard();
      }
    }
  }

  updateInviteGroups(inviteGroupsAction: IInviteGroupsAction) {
    if (inviteGroupsAction.isNew) {
      this.inviteGroups.push(inviteGroupsAction.inviteGroup);
      this.inviteGroups.sort((a, b) =>
        a.inviteGroup.toLowerCase().localeCompare(b.inviteGroup.toLowerCase())
      );
    } else {
      this.inviteGroups = this.inviteGroups.map((originalInviteGroup) =>
        originalInviteGroup.id === inviteGroupsAction.inviteGroup.id
          ? inviteGroupsAction.inviteGroup
          : originalInviteGroup
      );
      this.inviteGroups.sort((a, b) =>
        a.inviteGroup.toLowerCase().localeCompare(b.inviteGroup.toLowerCase())
      );
    }
  }

  updateBulkResults(bulkResults: IBulkResults): void {
    bulkResults.inviteGroupsGenerated.forEach((inviteGroup) => {
      this.inviteGroups.push(inviteGroup);
      this.inviteGroups.sort((a, b) =>
        a.inviteGroup.toLowerCase().localeCompare(b.inviteGroup.toLowerCase())
      );
    });

    bulkResults.invitesGenerated.forEach((invite) => {
      this.invites = this.invites.concat({
        ...invite,
        entriesConfirmed: null,
        message: null,
        confirmation: null,
        dateOfConfirmation: null,
        isMessageRead: false,
      });
      this.buildInvitesDashboard();
    });
  }
}
