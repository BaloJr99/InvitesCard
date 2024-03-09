import { HttpErrorResponse } from "@angular/common/http";

export interface IEntry {
  id: string,
  family: string,
  entriesNumber: number,
  entriesConfirmed: number,
  message?: string | null,
  confirmation: boolean,
  phoneNumber: string,
  groupSelected: string,
  kidsAllowed: boolean,
  dateOfConfirmation: string | null,
  isMessageRead: boolean,
  eventId: string
}

export interface IInvite {
  id: string,
  family: string,
  entriesNumber: number,
  confirmation: boolean | null,
  kidsAllowed: boolean,
  dateOfEvent: string,
  maxDateOfConfirmation: string
}

export interface IEvent {
  id: string,
  nameOfEvent: string, 
  dateOfEvent: string, 
  maxDateOfConfirmation: string
}

export interface IEventAction {
  event: IEvent,
  isNew: boolean
}

export interface IEntryAction {
  entry: IEntry,
  isNew: boolean,
  delete: boolean
}

export interface IMessage {
  family: string,
  message: string
}

export interface IUser {
  username: string,
  password: string,
  email: string
}

export interface IToken {
  token: string;
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

export interface IError {
  hasError: boolean,
  error: HttpErrorResponse | null
}

export interface IMessageResponse {
  id: string,
  message: string
}

export interface INotifications {
  id: string,
  family: string,
  confirmation: boolean,
  dateOfConfirmation: string,
  isMessageRead: boolean
}

export interface IStatistics {
  confirmedEntries: number,
  canceledEntries: number,
  pendingEntries: number,
  totalEntries: number
}