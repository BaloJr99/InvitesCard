export interface IFullInvite {
  id: string;
  family: string;
  entriesNumber: number;
  entriesConfirmed: number | null;
  message: string | null;
  confirmation: boolean | null;
  phoneNumber: string;
  kidsAllowed: boolean;
  dateOfConfirmation: string | null;
  isMessageRead: boolean;
  eventId: string;
  inviteGroupId: string;
  inviteViewed: string;
}

export type IUpsertInvite = Omit<
  IFullInvite,
  | 'entriesConfirmed'
  | 'message'
  | 'confirmation'
  | 'dateOfConfirmation'
  | 'isMessageRead'
>;

export type IInviteGroup = Pick<
  IFullInvite,
  | 'id'
  | 'family'
  | 'entriesConfirmed'
  | 'confirmation'
  | 'entriesNumber'
  | 'inviteViewed'
> & { beingDeleted: boolean };

export type IBulkInvite = Pick<
  IFullInvite,
  | 'family'
  | 'entriesNumber'
  | 'phoneNumber'
  | 'kidsAllowed'
  | 'eventId'
  | 'inviteGroupId'
> & { inviteGroupName: string; isNewInviteGroup: boolean };

export type IErrorInvite = Omit<
  IUpsertInvite,
  'id' | 'eventId' | 'entriesNumber' | 'inviteViewed'
> & { entriesNumber: string };

export type IConfirmation = Pick<
  IFullInvite,
  | 'confirmation'
  | 'dateOfConfirmation'
  | 'entriesConfirmed'
  | 'entriesNumber'
  | 'id'
  | 'message'
>;

export type IUserInvite = Pick<
  IFullInvite,
  'id' | 'family' | 'entriesNumber' | 'confirmation' | 'kidsAllowed' | 'eventId'
> & {
  dateOfEvent: string;
  maxDateOfConfirmation: string;
  nameOfCelebrated: string;
  typeOfEvent: string;
};

export type IDashboardInvite = Omit<IConfirmation, 'id' | 'message'>;

export interface IInviteAction {
  invite: IUpsertInvite;
  isNew: boolean;
  delete: boolean;
}

export interface IEventTypeResolved {
  eventType: string;
  error?: string;
}

export interface ITimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
