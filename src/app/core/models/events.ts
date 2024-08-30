import { IInvite } from "./invites"
import { IUserBasicInfo } from "./users"

export interface IDashboardEvent {
  id: string,
  nameOfEvent: string,
  dateOfEvent: string,
  allowCreateInvites: number
}

export interface IDropdownEvent {
  id: string,
  nameOfEvent: string,
}

export interface IFullEvent {
  id: string,
  nameOfEvent: string, 
  dateOfEvent: string, 
  maxDateOfConfirmation: string,
  nameOfCelebrated: string,
  typeOfEvent: string,
  userId: string
}

export interface IEventAction {
  event: IFullEvent,
  users: IUserBasicInfo[] | undefined,
  isNew: boolean
}

export interface IStatistic {
  confirmedEntries: number,
  canceledEntries: number,
  pendingEntries: number,
  totalEntries: number
}

export interface IEventResolved {
  invites: IInvite[];
  isDeadlineMet: boolean;
  eventId: string;
}