import { HttpErrorResponse } from '@angular/common/http';
import { IUpsertInvite } from './invites';
import { IInviteGroups } from './inviteGroups';

export interface IError {
  hasError: boolean;
  serverError: HttpErrorResponse | null;
}

export interface IMessageResponse {
  id: string;
  message: string;
}

export interface IBulkResults {
  inviteGroupsGenerated: IInviteGroups[],
  invitesGenerated: IUpsertInvite[],
};

export type IBulkMessageResponse = Pick<IMessageResponse, 'message'> & IBulkResults;

export interface INotification {
  id: string;
  family: string;
  confirmation: boolean;
  dateOfConfirmation: string;
  isMessageRead: boolean;
}

export interface IMessage {
  family: string;
  message: string;
  date: string;
  time: string;
}

export interface ISpinner {
  isLoading: boolean;
  message: string;
}
