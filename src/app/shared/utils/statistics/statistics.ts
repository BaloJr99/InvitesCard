import { IStatistic } from 'src/app/core/models/events';
import { IDashboardInvite } from 'src/app/core/models/invites';

export const createStatistics = (invites: IDashboardInvite[]): IStatistic[] => {
  const stadistics: IStatistic[] = [
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
    }
  ];

  invites.forEach((value) => {
    if (value.confirmation) {
      stadistics[0].value += value.entriesConfirmed ?? 0;
      stadistics[2].value +=
        value.entriesNumber - (value.entriesConfirmed ?? 0);
    } else {
      if (value.confirmation === null || value.confirmation === undefined) {
        stadistics[1].value += value.entriesNumber;
      } else {
        stadistics[2].value += value.entriesNumber;
      }
    }
    stadistics[3].value += value.entriesNumber;
  });

  return stadistics;
};
