import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { IEventInformation, IStatistic } from 'src/app/core/models/events';
import {
  IInviteGroups,
  IInviteGroupsAction,
} from 'src/app/core/models/inviteGroups';
import {
  IBulkResults,
  IEmitAction,
  IMessage,
  IMessageResponse,
  INotification,
  ITable,
} from 'src/app/core/models/common';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import {
  IConfirmation,
  IFullInvite,
  IInviteAction,
} from 'src/app/core/models/invites';
import { EventsService } from 'src/app/core/services/events.service';
import {
  ButtonAction,
  CommonModalResponse,
  CommonModalType,
  EventType,
  SelectAction,
} from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private inviteGroupsService: InviteGroupsService,
    private invitesService: InvitesService,
    private eventsService: EventsService,
    private commonInvitesService: CommonInvitesService,
    private socket: SocketService,
    private toastrService: ToastrService,
    private commonModalService: CommonModalService,
    @Inject(LOCALE_ID) private localeValue: string
  ) {}

  statistics: IStatistic[] = [];

  eventId = '';
  copyEventInformation: IEventInformation = {
    typeOfEvent: EventType.None,
    settings: '',
  };

  inviteAction!: IInviteAction;
  invitesGrouped: { [key: string]: IFullInvite[] } = {};
  originalInvites: IFullInvite[] = [];
  filteredInvites: IFullInvite[] = [];
  inviteGroups: IInviteGroups[] = [];
  selectedIds: { [key: string]: string[] } = {};

  tables: ITable[] = [];

  filterByFamily = '';
  filterByInviteViewed: boolean | undefined = undefined;
  filterByNeedsAccomodation: boolean | undefined = undefined;

  isDeadlineMet = false;

  ngOnInit(): void {
    this.loaderService.setLoading(
      true,
      $localize`Cargando los detalles del evento`
    );
    this.loaderService.setLoading(false);

    this.isDeadlineMet = Boolean(
      this.route.snapshot.data['eventResolved']['isDeadlineMet']
    );
    this.originalInvites = this.route.snapshot.data['eventResolved']['invites'];
    this.filteredInvites = this.originalInvites;
    this.eventId = this.route.snapshot.data['eventResolved']['id'];
    this.commonInvitesService.clearNotifications();

    combineLatest([
      this.inviteGroupsService.getAllInviteGroups(this.eventId),
      this.eventsService.getEventInformation(this.eventId, ['copyMessage']),
    ])
      .subscribe({
        next: ([inviteGroups, eventInformation]) => {
          this.inviteGroups = inviteGroups;
          this.copyEventInformation = eventInformation;
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
            const index = this.originalInvites.findIndex(
              (i) => i.id === notification.id
            );
            (this.originalInvites.at(index) as IFullInvite).isMessageRead =
              true;
          });
      },
    });

    this.socket.io.on('newNotification', (confirmation: IConfirmation) => {
      this.originalInvites = this.originalInvites.map((invite) => {
        if (invite.id === confirmation.id) {
          return {
            ...invite,
            confirmation: confirmation.confirmation,
            dateOfConfirmation: confirmation.dateOfConfirmation,
            entriesConfirmed: confirmation.entriesConfirmed,
            message: confirmation.message,
            inviteViewed: true,
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
      this.copyEventInformation.typeOfEvent === EventType.Xv ||
      this.copyEventInformation.typeOfEvent === EventType.Wedding
    ) {
      this.statistics = [
        {
          name: $localize`Invitaciones Confirmadas`,
          value: 0,
          color: '#43CD63',
        },
        {
          name: $localize`Invitaciones Pendientes`,
          value: 0,
          color: '#FACF4F',
        },
        {
          name: $localize`Invitaciones Canceladas`,
          value: 0,
          color: '#FF5D6D',
        },
        {
          name: $localize`Total de Invitaciones`,
          value: 0,
          color: '#54A6FF',
        },
      ];

      this.filteredInvites.forEach((value) => {
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
      this.groupEntries(this.filteredInvites);
    } else if (
      this.copyEventInformation.typeOfEvent === EventType.SaveTheDate
    ) {
      this.statistics = [
        {
          name: $localize`Invitaciones Respondidas`,
          value: 0,
          color: '#43CD63',
        },
        {
          name: $localize`Invitaciones Pendientes`,
          value: 0,
          color: '#FACF4F',
        },
        {
          name: $localize`Invitaciones Hospedaje`,
          value: 0,
          color: '#FF5D6D',
        },
        {
          name: $localize`Total de Invitaciones`,
          value: 0,
          color: '#54A6FF',
        },
      ];

      this.filteredInvites.forEach((value) => {
        if (value.needsAccomodation !== null) {
          this.statistics[0].value += 1;
          this.statistics[2].value += value.needsAccomodation ? 1 : 0;
        } else {
          this.statistics[1].value += 1;
        }
        this.statistics[3].value += 1;
      });

      this.groupEntries(this.filteredInvites);
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

    this.tables = Object.keys(this.invitesGrouped).map((key, index) => {
      return this.getTableConfiguration(this.invitesGrouped[key], index, key);
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
    this.originalInvites = this.originalInvites.filter(
      (invite) => !invitesIds.includes(invite.id)
    );

    this.filterInvites();
  }

  toggleMessages(): void {
    const toggleMessages = document.querySelector('.messages-chat');
    if (toggleMessages) {
      toggleMessages.classList.toggle('active');
    }
  }

  filterEntries(family: string): void {
    if (family) {
      const filteredEntries = this.originalInvites.filter((invite) =>
        invite.family.toLocaleLowerCase().includes(family.toLocaleLowerCase())
      );
      this.groupEntries(filteredEntries);
    } else {
      this.groupEntries(this.originalInvites);
    }
  }

  updateInvites(inviteAction: IInviteAction) {
    if (inviteAction.isNew) {
      this.originalInvites = this.originalInvites.concat({
        ...inviteAction.invite,
        entriesConfirmed: null,
        message: null,
        confirmation: null,
        dateOfConfirmation: null,
        isMessageRead: false,
        needsAccomodation: null,
        inviteViewed: false,
      });

      this.filterInvites();
    } else {
      this.originalInvites = this.originalInvites.map((originalInvite) => {
        if (originalInvite.id === inviteAction.invite.id) {
          return {
            ...inviteAction.invite,
            entriesConfirmed: originalInvite.entriesConfirmed,
            message: originalInvite.message,
            confirmation: originalInvite.confirmation,
            dateOfConfirmation: originalInvite.dateOfConfirmation,
            isMessageRead: originalInvite.isMessageRead,
            needsAccomodation: originalInvite.needsAccomodation,
            inviteViewed: originalInvite.inviteViewed,
          };
        }
        return originalInvite;
      });

      this.filterInvites();
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
      this.originalInvites = this.originalInvites.concat({
        ...invite,
        entriesConfirmed: null,
        message: null,
        confirmation: null,
        dateOfConfirmation: null,
        isMessageRead: false,
        needsAccomodation: null,
        inviteViewed: false,
      });

      this.filterInvites();
    });
  }

  filter(event: Event, filterType: string) {
    if (filterType === 'family') {
      const target = event.target as HTMLInputElement;
      this.filterByFamily = target.value.trim().toLocaleLowerCase();
    }

    if (filterType === 'inviteViewed') {
      const target = event.target as HTMLSelectElement;

      if (target.value === 'all') {
        this.filterByInviteViewed = undefined;
      } else {
        this.filterByInviteViewed = target.value === 'true' ? true : false;
      }
    }

    if (filterType === 'needsAccomodation') {
      const target = event.target as HTMLSelectElement;

      if (target.value === 'all') {
        this.filterByNeedsAccomodation = undefined;
      } else {
        this.filterByNeedsAccomodation = target.value === 'true' ? true : false;
      }
    }

    this.filterInvites();
  }

  filterInvites() {
    const invitesThatMatch = this.originalInvites.filter(
      (invite) =>
        (invite.family.toLocaleLowerCase().includes(this.filterByFamily) ||
          invite.phoneNumber
            .toLocaleLowerCase()
            .includes(this.filterByFamily)) &&
        (this.filterByInviteViewed === undefined
          ? true
          : this.filterByInviteViewed
          ? invite.inviteViewed
          : !invite.inviteViewed) &&
        (this.filterByNeedsAccomodation === undefined
          ? true
          : this.filterByNeedsAccomodation
          ? invite.needsAccomodation
          : invite.needsAccomodation == false)
    );

    this.filteredInvites = invitesThatMatch;
    this.buildInvitesDashboard();
  }

  actionResponse(action: IEmitAction): void {
    const data = action.data as { [key: string]: string };
    if (action.action === ButtonAction.Copy) {
      this.copyToClipBoard(data['Actions']);
    } else if (action.action === SelectAction.SelectAll) {
      const tableIndex = parseInt(data['tableIndex']);
      const checked = Boolean(JSON.parse(data['checked']));
      const inviteGroup = Object.keys(this.invitesGrouped)[tableIndex];
      this.selectAll(inviteGroup, tableIndex, checked);
    } else if (action.action === SelectAction.SelectRecord) {
      const tableIndex = parseInt(data['tableIndex']);
      const rowIndex = parseInt(data['rowIndex']);
      const checked = Boolean(JSON.parse(data['checked']));
      const inviteId = this.tables[tableIndex].data[rowIndex][''];
      const inviteGroup = Object.keys(this.invitesGrouped)[tableIndex];
      this.selectInvite(inviteGroup, tableIndex, checked, inviteId);
    } else if (action.action === ButtonAction.Edit) {
      this.openEditModal(data['Actions']);
    } else if (action.action === ButtonAction.Delete) {
      this.showModal(data['Actions']);
    }
  }

  getTableConfiguration(
    invitesGroup: IFullInvite[],
    tableIndex: number,
    groupIndex: string
  ): ITable {
    const headers = this.getHeaders();

    return {
      headers: headers,
      data: invitesGroup.map((invite) => {
        return this.getInviteRow(invite, headers, groupIndex);
      }),
      buttons: [
        {
          isDisabled: this.isDeadlineMet,
          accessibleText: $localize`Editar invitación`,
          action: ButtonAction.Edit,
          innerHtml: '<i class="fa-solid fa-pencil" aria-hidden="true"></i>',
          styles: 'background-color: #FFC107;',
        },
        {
          isDisabled: this.isDeadlineMet,
          accessibleText: $localize`Eliminar invitación`,
          action: ButtonAction.Delete,
          innerHtml: '<i class="fa-solid fa-trash" aria-hidden="true"></i>',
          styles: 'background-color: #DC3545; color: #FFFFFF;',
        },
        {
          isDisabled: false,
          accessibleText: $localize`Copiar invitación`,
          action: ButtonAction.Copy,
          innerHtml: '<i class="fa-solid fa-copy" aria-hidden="true"></i>',
          styles: 'background-color: #198754; color: #FFFFFF;',
        },
      ],
      useCheckbox: true,
      tableIndex,
    };
  }

  getHeaders(): string[] {
    if (this.copyEventInformation.typeOfEvent === EventType.Xv) {
      return [
        '',
        $localize`Familia`,
        $localize`Numero de pases`,
        $localize`Vista`,
        $localize`Acciones`,
      ];
    }

    return [
      '',
      $localize`Familia`,
      $localize`Necesita Hotel`,
      $localize`Vista`,
      $localize`Acciones`,
    ];
  }

  getInviteRow(
    invite: IFullInvite,
    headers: string[],
    groupIndex: string
  ): { [key: string]: string } {
    const row: { [key: string]: string } = {};

    headers.forEach((header) => {
      switch (header) {
        case $localize`Familia`:
          row[header] = invite.family;
          break;
        case $localize`Numero de pases`:
          row[header] =
            invite.entriesConfirmed === null ||
            invite.entriesConfirmed === undefined
              ? '0'
              : `${invite.entriesConfirmed} / ${invite.entriesNumber}`;
          break;
        case $localize`Vista`:
          row[header] = invite.inviteViewed
            ? '<i class="fa-solid fa-eye" aria-hidden="true"></i>'
            : '';
          break;
        case $localize`Necesita Hotel`:
          if (invite.needsAccomodation === false) {
            row[header] =
              '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>';
            break;
          } else if (invite.needsAccomodation === true) {
            row[header] =
              '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
            break;
          } else {
            row[header] = '';
            break;
          }
        default:
          row[header] = invite.id;
          break;
      }
    });

    if (!this.selectedIds[groupIndex]) {
      row['beingDeleted'] = 'false';
    } else {
      row['beingDeleted'] = this.selectedIds[groupIndex].includes(invite.id)
        ? 'true'
        : 'false';
    }

    return row;
  }

  copyToClipBoard(id: string): void {
    const url = `${window.location.origin}/invites/${id}`;

    const inviteFound = this.originalInvites.find(
      (f) => f.id === id
    ) as IFullInvite;

    const settings = JSON.parse(this.copyEventInformation.settings);

    if (!settings.copyMessage) {
      navigator.clipboard.writeText(url);
    } else {
      let message = settings.copyMessage;

      if (message.includes('[family]')) {
        message = message.replace('[family]', inviteFound.family);
      }

      if (message.includes('[invite_url]')) {
        message = message.replace('[invite_url]', url);
      }

      navigator.clipboard.writeText(message.trim());
    }
  }

  openEditModal(id: string): void {
    const inviteToEdit = this.originalInvites.find(
      (invite) => invite.id === id
    ) as IFullInvite;

    this.inviteAction = {
      invite: {
        ...inviteToEdit,
      },
      isNew: false,
    };

    $('#inviteModal').modal('show');
  }

  showModal(id: string): void {
    const inviteFound = this.originalInvites.find(
      (original) => original.id === id
    ) as IFullInvite;

    this.commonModalService
      .open({
        modalTitle: $localize`Eliminar invitación`,
        modalBody: $localize`¿Estás seguro de eliminar la invitación de ${inviteFound.family}?`,
        modalType: CommonModalType.Confirm,
      })
      .subscribe((response) => {
        if (response === CommonModalResponse.Confirm) {
          this.loaderService.setLoading(true, $localize`Eliminando invitación`);
          this.invitesService
            .deleteInvite(inviteFound.id)
            .subscribe({
              next: (response: IMessageResponse) => {
                this.removeInvites([inviteFound.id]);
                this.toastrService.success(response.message);
              },
            })
            .add(() => {
              this.loaderService.setLoading(false);
            });
        }
      });
  }

  selectAll(groupIndex: string, tableIndex: number, checked: boolean): void {
    if (checked) {
      this.selectedIds[groupIndex] = this.invitesGrouped[groupIndex].map(
        (invite) => invite.id
      );
    } else {
      this.selectedIds[groupIndex] = [];
    }

    this.tables[tableIndex] = this.getTableConfiguration(
      this.invitesGrouped[groupIndex],
      tableIndex,
      groupIndex
    );
  }

  selectInvite(
    groupIndex: string,
    tableIndex: number,
    checked: boolean,
    inviteId: string
  ): void {
    if (checked) {
      const inviteFound = this.invitesGrouped[groupIndex].find(
        (invite) => invite.id === inviteId
      ) as IFullInvite;

      if (!this.selectedIds[groupIndex]) {
        this.selectedIds[groupIndex] = [inviteFound.id];
      } else {
        this.selectedIds[groupIndex] = [
          ...this.selectedIds[groupIndex],
          inviteFound.id,
        ];
      }
    } else {
      this.selectedIds[groupIndex] = [
        ...this.selectedIds[groupIndex].filter((id) => id !== inviteId),
      ];
    }

    this.tables[tableIndex] = this.getTableConfiguration(
      this.invitesGrouped[groupIndex],
      tableIndex,
      groupIndex
    );
  }

  allowDeleteInvites(groupIndex: string): boolean {
    if (!this.selectedIds[groupIndex]) {
      return false;
    }
    return this.invitesGrouped[groupIndex].some((invite) =>
      this.selectedIds[groupIndex].includes(invite.id)
    );
  }

  bulkDeleteInvites(groupIndex: string): void {
    this.loaderService.setLoading(true, $localize`Eliminando invitaciones`);

    this.invitesService
      .bulkDeleteInvites(this.selectedIds[groupIndex])
      .subscribe({
        next: (response: IMessageResponse) => {
          this.removeInvites(this.selectedIds[groupIndex]);
          this.toastrService.success(response.message);
        },
      })
      .add(() => this.loaderService.setLoading(false));
  }
}
