import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map, mergeMap } from 'rxjs';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { SocketService } from 'src/app/core/services/socket.service';
import {
  IEventResolved,
  IEventSettings,
  IFullEvent,
  IStatistic,
} from 'src/app/core/models/events';
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
  ITableHeaders,
} from 'src/app/core/models/common';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import {
  IConfirmation,
  IFullInvite,
  IInviteAction,
  IInvitesFilters,
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
  standalone: false,
})
export class EventDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private inviteGroupsService: InviteGroupsService,
    private invitesService: InvitesService,
    private eventsService: EventsService,
    private commonInvitesService: CommonInvitesService,
    private socket: SocketService,
    private toastrService: ToastrService,
    private commonModalService: CommonModalService,
    @Inject(LOCALE_ID) private localeValue: string
  ) {}

  showInviteModal = false;
  showImportInvitesModal = false;

  copyEventSettings: IEventSettings = {
    typeOfEvent: EventType.None,
    settings: '',
  };

  eventInformation: IFullEvent = {} as IFullEvent;
  invitesGrouped: { [key: string]: IFullInvite[] } = {};
  inviteGroups: IInviteGroups[] = [];
  selectedIds: { [key: string]: string[] } = {};
  tables: ITable[] = [];

  private inviteFilters = new BehaviorSubject<IInvitesFilters>({
    filterByFamily: '',
    filterByAnswered: undefined,
    filterByInviteViewed: undefined,
    filterByNeedsAccomodation: undefined,
  });
  inviteFilters$ = this.inviteFilters.asObservable();

  private eventResolved = new BehaviorSubject<IEventResolved>(
    {} as IEventResolved
  );
  eventResolved$ = this.eventResolved.asObservable();
  private originalInvites = new BehaviorSubject<IFullInvite[]>([]);
  originalInvites$ = this.originalInvites.asObservable();

  private filteredInvites: IFullInvite[] = [];

  inviteAction = {
    invite: {
      id: '',
      family: '',
      entriesNumber: 1,
      phoneNumber: '',
      inviteGroupId: '',
      kidsAllowed: true,
      eventId: '',
    },
    isNew: false,
  };

  eventDetails$ = this.eventResolved$.pipe(
    mergeMap((eventResolved) =>
      combineLatest([
        this.inviteGroupsService.getAllInviteGroups(eventResolved.id),
        this.eventsService.getEventById(eventResolved.id),
        this.eventsService.getEventSettings(eventResolved.id, [
          'copyMessage',
          'weddingCopyMessage',
        ]),
      ]).pipe(
        map(([inviteGroups, eventInformation, eventSettings]) => {
          this.originalInvites.next(eventResolved.invites);
          this.copyEventSettings = eventSettings;
          this.eventInformation = eventInformation;
          this.inviteGroups = inviteGroups;

          return {
            eventId: eventResolved.id,
            invites: eventResolved.invites,
            isDeadlineMet: eventResolved.isDeadlineMet,
            eventSettings,
          };
        })
      )
    )
  );

  vm$ = combineLatest([
    this.eventDetails$,
    this.originalInvites$,
    this.commonInvitesService.notifications$,
    this.inviteFilters$,
  ]).pipe(
    map(
      ([eventDetails, originalInvites, commonNotification, inviteFilters]) => {
        const statistics: IStatistic[] = [];
        const notifications: INotification[] = [];
        const messages: IMessage[] = [];
        const newOriginalInvites: IFullInvite[] = [];

        const readNotifications = commonNotification.filter(
          (n) => n.isMessageRead
        );

        readNotifications.forEach((notification) => {
          const originalInvite = originalInvites.find(
            (invite) => invite.id === notification.id
          );

          if (originalInvite && originalInvite.isMessageRead === false) {
            newOriginalInvites.push({
              ...originalInvite,
              isMessageRead: true,
            });
          }
        });

        if (newOriginalInvites.length > 0) {
          this.originalInvites.next(newOriginalInvites);
        }

        this.filteredInvites = originalInvites.filter(
          (invite) =>
            invite.family
              .toLocaleLowerCase()
              .includes(inviteFilters.filterByFamily.toLocaleLowerCase()) &&
            (inviteFilters.filterByInviteViewed === undefined
              ? true
              : inviteFilters.filterByInviteViewed
              ? invite.inviteViewed
              : !invite.inviteViewed) &&
            (inviteFilters.filterByAnswered === undefined
              ? true
              : inviteFilters.filterByAnswered
              ? invite.confirmation !== null &&
                invite.confirmation !== undefined
              : invite.confirmation === null ||
                invite.confirmation === undefined) &&
            (inviteFilters.filterByNeedsAccomodation === undefined
              ? true
              : inviteFilters.filterByNeedsAccomodation
              ? invite.needsAccomodation
              : invite.needsAccomodation == false)
        );

        if (
          eventDetails.eventSettings.typeOfEvent === EventType.Xv ||
          eventDetails.eventSettings.typeOfEvent === EventType.Wedding
        ) {
          statistics.push(
            {
              name: $localize`Pases Confirmados`,
              value: 0,
              color: '#43CD63',
            },
            {
              name: $localize`Pases Pendientes`,
              value: 0,
              color: '#FACF4F',
            },
            {
              name: $localize`Pases Cancelados`,
              value: 0,
              color: '#FF5D6D',
            },
            {
              name: $localize`Total de Pases`,
              value: 0,
              color: '#54A6FF',
            }
          );

          this.filteredInvites.forEach((value) => {
            if (value.confirmation) {
              statistics[0].value += value.entriesConfirmed ?? 0;
              statistics[2].value +=
                value.entriesNumber - (value.entriesConfirmed ?? 0);
            } else {
              if (
                value.confirmation === null ||
                value.confirmation === undefined
              ) {
                statistics[1].value += value.entriesNumber;
              } else {
                statistics[2].value += value.entriesNumber;
              }
            }
            statistics[3].value += value.entriesNumber;
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

            if (
              value.confirmation !== null &&
              value.confirmation !== undefined
            ) {
              notifications.push({
                id: value.id,
                confirmation: value.confirmation,
                dateOfConfirmation: value.dateOfConfirmation ?? '',
                family: value.family,
                isMessageRead: value.isMessageRead,
              });
            }
          });

          this.commonInvitesService.updateNotifications(
            notifications,
            messages
          );
          this.groupEntries(this.filteredInvites);
        } else if (
          eventDetails.eventSettings.typeOfEvent === EventType.SaveTheDate
        ) {
          statistics.push(
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
            }
          );

          this.filteredInvites.forEach((value) => {
            if (value.needsAccomodation !== null) {
              statistics[0].value += 1;
              statistics[2].value += value.needsAccomodation ? 1 : 0;
            } else {
              statistics[1].value += 1;
            }
            statistics[3].value += 1;
          });
        }

        this.groupEntries(this.filteredInvites);

        this.tables = Object.keys(this.invitesGrouped).map((key, index) => {
          return this.getTableConfiguration(
            this.invitesGrouped[key],
            index,
            key
          );
        });

        return {
          ...eventDetails,
          statistics,
        };
      }
    )
  );

  ngOnInit(): void {
    this.eventResolved.next({
      id: this.route.snapshot.data['eventResolved']['id'],
      invites: this.route.snapshot.data['eventResolved']['invites'],
      isDeadlineMet: this.route.snapshot.data['eventResolved']['isDeadlineMet'],
    });

    this.socket.io.on('newNotification', (confirmation: IConfirmation) => {
      const refactorConfirmation = {
        ...confirmation,
        dateOfConfirmation: `${
          (confirmation.dateOfConfirmation as string).split(' ')[0]
        }T${(confirmation.dateOfConfirmation as string).split(' ')[1]}`.concat(
          '.000Z'
        ),
      };

      const originalInvitesCopy = this.originalInvites.value;
      // Find the invite and update the confirmation
      const indexOfInvite = originalInvitesCopy.findIndex(
        (invite) => invite.id === confirmation.id
      );
      originalInvitesCopy[indexOfInvite] = {
        ...originalInvitesCopy[indexOfInvite],
        confirmation: confirmation.confirmation,
        dateOfConfirmation: refactorConfirmation.dateOfConfirmation,
        entriesConfirmed: confirmation.entriesConfirmed,
        message: confirmation.message,
        inviteViewed: true,
      };

      this.originalInvites.next(originalInvitesCopy);
    });
  }

  groupEntries(invites: IFullInvite[]) {
    this.invitesGrouped = {};

    this.inviteGroups.forEach((inviteGroup) => {
      if (invites.some((invite) => invite.inviteGroupId === inviteGroup.id)) {
        this.invitesGrouped[inviteGroup.inviteGroup] = invites.filter(
          (invite) => invite.inviteGroupId === inviteGroup.id
        );
      }
    });
  }

  removeInvites(invitesIds: string[]): void {
    let originalInvitesCopy = this.originalInvites.value;
    originalInvitesCopy = originalInvitesCopy.filter(
      (invite) => !invitesIds.includes(invite.id)
    );

    this.originalInvites.next(originalInvitesCopy);
  }

  toggleMessages(): void {
    const toggleMessages = document.querySelector('.messages-chat');
    if (toggleMessages) {
      toggleMessages.classList.toggle('active');
    }
  }

  updateInvites(inviteAction: IInviteAction) {
    const originalInvitesCopy = this.originalInvites.value;
    if (inviteAction.isNew) {
      originalInvitesCopy.push({
        ...inviteAction.invite,
        entriesConfirmed: null,
        message: null,
        confirmation: null,
        dateOfConfirmation: null,
        isMessageRead: false,
        needsAccomodation: null,
        inviteViewed: false,
      });
    } else {
      const indexOfInvite = this.originalInvites.value.findIndex(
        (invite) => invite.id === inviteAction.invite.id
      );
      const originalInvite = originalInvitesCopy[indexOfInvite];

      originalInvitesCopy[indexOfInvite] = {
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

    this.originalInvites.next(originalInvitesCopy);
  }

  updateInviteGroups(inviteGroupsAction: IInviteGroupsAction) {
    if (inviteGroupsAction.isNew) {
      this.inviteGroups.push(inviteGroupsAction.inviteGroup);
    } else {
      const indexOfInviteGroup = this.inviteGroups.findIndex(
        (inviteGroup) => inviteGroup.id === inviteGroupsAction.inviteGroup.id
      );
      this.inviteGroups[indexOfInviteGroup] = inviteGroupsAction.inviteGroup;
    }
    this.inviteGroups.sort((a, b) =>
      a.inviteGroup.toLowerCase().localeCompare(b.inviteGroup.toLowerCase())
    );
  }

  updateBulkResults(bulkResults: IBulkResults): void {
    bulkResults.inviteGroupsGenerated.forEach((inviteGroup) => {
      this.inviteGroups.push(inviteGroup);
      this.inviteGroups.sort((a, b) =>
        a.inviteGroup.toLowerCase().localeCompare(b.inviteGroup.toLowerCase())
      );
    });

    const newInvites = this.originalInvites.value;
    bulkResults.invitesGenerated.forEach((invite) => {
      newInvites.push({
        ...invite,
        entriesConfirmed: null,
        message: null,
        confirmation: null,
        dateOfConfirmation: null,
        isMessageRead: false,
        needsAccomodation: null,
        inviteViewed: false,
      });
    });

    this.originalInvites.next(newInvites);
  }

  filter() {
    const familyFilter = document.getElementById(
      'filterByFamily'
    ) as HTMLInputElement;
    const inviteViewedFilter = document.getElementById(
      'filterByInviteViewed'
    ) as HTMLSelectElement;
    const answeredFilter = document.getElementById(
      'filterByAnswered'
    ) as HTMLSelectElement;
    const needsAccomodationFilter = document.getElementById(
      'filterByNeedsAccomodation'
    ) as HTMLSelectElement;

    const familyFilterValue = familyFilter.value.trim().toLocaleLowerCase();
    const inviteViewedFilterValue = inviteViewedFilter.value;
    const answeredFilterValue = answeredFilter.value;
    const needsAccomodationFilterValue = needsAccomodationFilter.value;

    this.inviteFilters.next({
      filterByFamily: familyFilterValue,
      filterByAnswered:
        answeredFilterValue === 'all'
          ? undefined
          : answeredFilterValue === 'true',
      filterByInviteViewed:
        inviteViewedFilterValue === 'all'
          ? undefined
          : inviteViewedFilterValue === 'true',
      filterByNeedsAccomodation:
        needsAccomodationFilterValue === 'all'
          ? undefined
          : needsAccomodationFilterValue === 'true',
    });
  }

  clearFilter() {
    const familyFilter = document.getElementById(
      'filterByFamily'
    ) as HTMLInputElement;
    const inviteViewedFilter = document.getElementById(
      'filterByInviteViewed'
    ) as HTMLSelectElement;
    const answeredFilter = document.getElementById(
      'filterByAnswered'
    ) as HTMLSelectElement;
    const needsAccomodationFilter = document.getElementById(
      'filterByNeedsAccomodation'
    ) as HTMLSelectElement;

    familyFilter.value = '';
    inviteViewedFilter.value = 'all';
    answeredFilter.value = 'all';
    needsAccomodationFilter.value = 'all';

    this.inviteFilters.next({
      filterByFamily: '',
      filterByAnswered: undefined,
      filterByInviteViewed: undefined,
      filterByNeedsAccomodation: undefined,
    });
  }

  actionResponse(action: IEmitAction): void {
    const data = action.data as { [key: string]: string };
    if (action.action === ButtonAction.Copy) {
      this.copyToClipBoard(data[$localize`Acciones`]);
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
      this.openInviteModal(data[$localize`Acciones`]);
    } else if (action.action === ButtonAction.Delete) {
      this.showModal(data[$localize`Acciones`]);
    }
  }

  getTableConfiguration(
    invitesGroup: IFullInvite[],
    tableIndex: number,
    groupIndex: string
  ): ITable {
    const headers = this.getHeaders();
    const isDeadlineMet = this.eventResolved.value.isDeadlineMet;

    return {
      tableId: groupIndex.replaceAll(' ', ''),
      headers: headers,
      data: invitesGroup.map((invite) => {
        return this.getInviteRow(invite, headers, groupIndex);
      }),
      buttons: [
        {
          isDisabled: isDeadlineMet,
          accessibleText: $localize`Editar invitación`,
          action: ButtonAction.Edit,
          innerHtml: '<i class="fa-solid fa-pencil" aria-hidden="true"></i>',
          class: 'btn-warning',
        },
        {
          isDisabled: isDeadlineMet,
          accessibleText: $localize`Eliminar invitación`,
          action: ButtonAction.Delete,
          innerHtml: '<i class="fa-solid fa-trash" aria-hidden="true"></i>',
          class: 'btn-danger',
        },
        {
          isDisabled: false,
          accessibleText: $localize`Copiar invitación`,
          action: ButtonAction.Copy,
          innerHtml: '<i class="fa-solid fa-copy" aria-hidden="true"></i>',
          class: 'btn-success',
        },
      ],
      useCheckbox: true,
      checkboxHeader: $localize`Familia`,
      tableIndex,
    };
  }

  getHeaders(): ITableHeaders[] {
    let tableHeaders = [
      {
        text: '',
      },
      {
        text: $localize`Familia`,
        sortable: true,
      },
    ];

    if (
      this.copyEventSettings.typeOfEvent === EventType.Xv ||
      this.copyEventSettings.typeOfEvent === EventType.Wedding
    ) {
      tableHeaders = tableHeaders.concat([
        {
          text: $localize`Numero de pases`,
          sortable: true,
        },
        {
          text: $localize`Contestada`,
          sortable: true,
        },
      ]);
    } else {
      tableHeaders = tableHeaders.concat([
        {
          text: $localize`Necesita Hotel`,
          sortable: true,
        },
      ]);
    }

    return tableHeaders.concat([
      {
        text: $localize`Vista`,
        sortable: true,
      },
      {
        text: $localize`Acciones`,
      },
    ]);
  }

  getInviteRow(
    invite: IFullInvite,
    headers: ITableHeaders[],
    groupIndex: string
  ): { [key: string]: string } {
    const row: { [key: string]: string } = {};
    const inviteNeedsAccomodation = !!invite.needsAccomodation;

    headers.forEach(({ text }) => {
      switch (text) {
        case $localize`Familia`:
          row[text] = invite.family;
          break;
        case $localize`Numero de pases`:
          row[text] =
            invite.entriesConfirmed === null ||
            invite.entriesConfirmed === undefined
              ? `0 / ${invite.entriesNumber}`
              : `${invite.entriesConfirmed} / ${invite.entriesNumber}`;
          break;
        case $localize`Vista`:
          row[text] = invite.inviteViewed
            ? '<i class="fa-solid fa-eye" aria-hidden="true"></i>'
            : '';
          break;
        case $localize`Contestada`:
          row[text] =
            invite.entriesConfirmed === null ||
            invite.entriesConfirmed === undefined
              ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
              : '<i class="fa-solid fa-check" aria-hidden="true"></i>';
          break;
        case $localize`Necesita Hotel`:
          if (invite.needsAccomodation === null) {
            row[text] = '';
            break;
          } else if (!inviteNeedsAccomodation) {
            row[text] =
              '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>';
            break;
          } else {
            row[text] =
              '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
            break;
          }
        default:
          row[text] = invite.id;
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

    const inviteFound = this.originalInvites.value.find(
      (f) => f.id === id
    ) as IFullInvite;

    const settings = JSON.parse(this.copyEventSettings.settings);

    if (!settings.copyMessage && !settings.weddingCopyMessage) {
      navigator.clipboard.writeText(url);
    } else {
      let message =
        this.copyEventSettings.typeOfEvent === EventType.Wedding
          ? settings.weddingCopyMessage
          : settings.copyMessage;

      if (message.includes('[family]')) {
        message = message.replace('[family]', inviteFound.family);
      }

      if (message.includes('[invite_url]')) {
        message = message.replace('[invite_url]', url);
      }

      if (message.includes('[max_deadline]')) {
        message = message.replace(
          '[max_deadline]',
          new Date(
            this.eventInformation.maxDateOfConfirmation
          ).toLocaleDateString(this.localeValue, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        );
      }

      navigator.clipboard.writeText(message.trim());
    }
  }

  openInviteModal(id: string): void {
    if (id !== '') {
      const inviteToEdit = this.originalInvites.value.find(
        (invite) => invite.id === id
      ) as IFullInvite;

      this.inviteAction = {
        invite: {
          ...inviteToEdit,
        },
        isNew: false,
      };
    } else {
      this.inviteAction = {
        invite: {
          family: $localize`Familia`,
          entriesNumber: 1,
          phoneNumber: '878',
          inviteGroupId: '',
          kidsAllowed: true,
          eventId: this.eventResolved.value.id,
          id: '',
        },
        isNew: true,
      };
    }
    this.showInviteModal = true;
  }

  openImportInvitesModal() {
    this.showImportInvitesModal = true;
  }

  showModal(id: string): void {
    const inviteFound = this.originalInvites.value.find(
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
          this.invitesService.deleteInvite(inviteFound.id).subscribe({
            next: (response: IMessageResponse) => {
              this.removeInvites([inviteFound.id]);
              this.toastrService.success(response.message);
            },
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
    this.invitesService
      .bulkDeleteInvites(this.selectedIds[groupIndex])
      .subscribe({
        next: (response: IMessageResponse) => {
          this.removeInvites(this.selectedIds[groupIndex]);
          this.toastrService.success(response.message);
        },
      });
  }

  findTableConfiguration(groupIndex: string): ITable {
    return this.tables.find(
      (table) => table.tableId === groupIndex.replaceAll(' ', '')
    ) as ITable;
  }

  closeInviteModal() {
    this.showInviteModal = false;
  }

  closeImportInvitesModal() {
    this.showImportInvitesModal = false;
  }
}
