import { IFullInvite } from './invites';

export interface IFullEvent {
  id: string;
  nameOfEvent: string;
  dateOfEvent: string;
  allowCreateInvites: number;
  maxDateOfConfirmation: string;
  nameOfCelebrated: string;
  typeOfEvent: string;
  userId: string;
}

export type IDashboardEvent = Pick<
  IFullEvent,
  'id' | 'nameOfEvent' | 'dateOfEvent' | 'allowCreateInvites'
>;

export type IDropdownEvent = Pick<IFullEvent, 'id' | 'nameOfEvent' | 'typeOfEvent'>;

export type IEvent = Omit<IFullEvent, 'allowCreateInvites'>;

export interface IEventAction {
  event: IFullEvent;
  isNew: boolean;
}

export interface IStatistic {
  confirmedEntries: number;
  canceledEntries: number;
  pendingEntries: number;
  totalEntries: number;
}

export interface IEventResolved {
  invites: IFullInvite[];
  isDeadlineMet: boolean;
  id: string;
}
