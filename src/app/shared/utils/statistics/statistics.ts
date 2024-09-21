import { IStatistic } from "src/app/core/models/events";
import { IDashboardInvite } from "src/app/core/models/invites";

export const createStatistics = (invites: IDashboardInvite[]): IStatistic => {
  const stadistics = {
    confirmedEntries: 0,
    canceledEntries: 0,
    pendingEntries: 0,
    totalEntries: 0,
  };

  invites.forEach((value) => {
    if (value.confirmation) {
      stadistics.confirmedEntries += (value.entriesConfirmed ?? 0)
      stadistics.canceledEntries += (value.entriesNumber - (value.entriesConfirmed ?? 0))
    } else {
      if (value.confirmation === null || value.confirmation === undefined) {
        stadistics.pendingEntries += value.entriesNumber
      } else {
        stadistics.canceledEntries += value.entriesNumber;
      }
    }
    stadistics.totalEntries += value.entriesNumber;
  });

  return stadistics;
}