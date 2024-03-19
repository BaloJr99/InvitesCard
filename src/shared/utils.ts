import { IEntry, IStatistics } from "./interfaces"

export const createStatistics = (entries: IEntry[]): IStatistics => {
  const stadistics = {
    confirmedEntries: 0,
    canceledEntries: 0,
    pendingEntries: 0,
    totalEntries: 0,
  };

  entries.forEach((value) => {
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