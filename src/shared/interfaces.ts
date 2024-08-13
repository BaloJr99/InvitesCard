import { HttpErrorResponse } from "@angular/common/http";
import { FormControl } from "@angular/forms";
import { Roles } from "./enum";

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

export interface IInvite {
  id: string,
  family: string,
  entriesNumber: number,
  confirmation: boolean | null,
  kidsAllowed: boolean,
  dateOfEvent: string,
  maxDateOfConfirmation: string,
  eventId: string
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

export interface IFamilyGroupAction {
  familyGroup: IFamilyGroup,
  isNew: boolean,
}

export interface IFamilyGroup {
  id: string,
  familyGroup: string, 
}

export interface IMessage {
  family: string,
  message: string
}

export interface IUser {
  username: string,
  password: string,
  email: string,
  roles: IRole[]
}

export interface IRole {
  name: Roles
}

export interface IAuthUser {
  usernameOrEmail: string,
  email: string
}

export interface IUploadImages {
  image: string
  eventId: string
}

export interface IDownloadImages {
  id: string,
  imageUrl: string,
  publicId: string,
  imageUsage: string
}

export interface IDeleteImage {
  id: string,
  publicId: string
}

export interface IUpdateImage {
  id: string,
  imageUsage: string
}

export interface IUpdateImageArray {
  id: FormControl<string>,
  imageUsage: FormControl<string>
}

export interface IToken {
  token: string;
}

export interface IEntryResolved {
  entry: IInvite;
  error?: string;
}

export interface IEventResolved {
  entries: IEntry[];
  eventId: string;
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

export interface ISettings {
  eventId: string,
  primaryColor: string,
  secondaryColor: string,
  parents: string,
  godParents: string,
  firstSectionSentences: string,
  secondSectionSentences: string,
  massUrl: string,
  massTime: string,
  massAddress: string,
  receptionUrl: string,
  receptionTime: string,
  receptionPlace: string,
  receptionAddress: string,
  dressCodeColor: string
}