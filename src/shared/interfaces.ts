import { HttpErrorResponse } from "@angular/common/http";

export interface IEntry {
  id: string,
  family: string,
  entriesNumber: number,
  entriesConfirmed: number,
  message?: string,
  confirmation: boolean,
  phoneNumber: string,
  groupSelected: string,
  kidsAllowed: boolean,
  dateOfConfirmation: string,
  isMessageRead: boolean
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
  entry: IEntry;
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
  message: string
}

export interface INotifications {
  id: string,
  family: string,
  confirmation: boolean,
  dateOfConfirmation: string,
  isMessageRead: boolean
}