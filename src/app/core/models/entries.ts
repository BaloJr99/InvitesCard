import { IInvite } from "./invites";

export interface IEntry {
  id: string,
  family: string,
  entriesNumber: number,
  entriesConfirmed: number,
  message?: string | null,
  confirmation: boolean,
  phoneNumber: string,
  kidsAllowed: boolean,
  dateOfConfirmation: string | null,
  isMessageRead: boolean,
  eventId: string,
  familyGroupId: string
}

export interface IEntryAction {
  entry: IEntry,
  isNew: boolean,
  delete: boolean
}

export interface IEntryResolved {
  entry: IInvite;
  error?: string;
}

export interface ITimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}