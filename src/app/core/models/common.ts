import { HttpErrorResponse } from '@angular/common/http';
import { IUpsertInvite } from './invites';
import { IInviteGroups } from './inviteGroups';
import { ButtonAction, CommonModalType, SelectAction } from './enum';

export interface IError {
  hasError: boolean;
  serverError: HttpErrorResponse | null;
}

export interface ICommonModal {
  modalTitle: string;
  modalBody: string;
  modalType: CommonModalType;
}

export interface IMessageResponse {
  id: string;
  message: string;
}

export interface IBulkResults {
  inviteGroupsGenerated: IInviteGroups[];
  invitesGenerated: IUpsertInvite[];
}

export type IBulkMessageResponse = Pick<IMessageResponse, 'message'> &
  IBulkResults;

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
  showInviteLoader: boolean;
}

export interface IZodErrors {
  message: string;
  code: string;
  path: string[];
}

export interface ITable {
  tableIndex: number;
  useCheckbox?: boolean;
  headers: string[];
  data: { [key: string]: string }[];
  buttons?: ITableButtons[];
}

export interface ITableButtons {
  innerHtml: string;
  accessibleText: string;
  action: ButtonAction;
  isDisabled?: boolean;
  styles?: string;
}

export interface IPageButtons {
  pageNumber: number;
  accessibleText: string;
  isPage: boolean;
}

export interface IEmitAction {
  action: ButtonAction | SelectAction;
  data?: { [key: string]: string };
}
