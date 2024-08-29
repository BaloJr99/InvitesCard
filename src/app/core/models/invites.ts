export interface IUserInvite {
  id: string,
  family: string,
  entriesNumber: number,
  confirmation: boolean | null,
  kidsAllowed: boolean,
  dateOfEvent: string,
  maxDateOfConfirmation: string,
  nameOfCelebrated: string,
  typeOfEvent: string,
  eventId: string
}

export interface IEventInvite extends IInvite{
  isDeadlineMet: boolean
}

export interface IInvite {
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

export interface IPartialInvite {
  family: string,
  entriesNumber: number,
  phoneNumber: string,
  familyGroupId: string,
  kidsAllowed: boolean,
  eventId: string
}

export interface IErrorInvite {
  family: string,
  entriesNumber: string,
  phoneNumber: string,
  familyGroupId: string,
  kidsAllowed: boolean,
}

export interface IInviteAction {
  invite: IInvite,
  isNew: boolean,
  delete: boolean
}

export interface IInviteResolved {
  invite: IUserInvite;
  error?: string;
}

export interface ITimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}