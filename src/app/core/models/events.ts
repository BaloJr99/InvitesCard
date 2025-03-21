import { EventType } from './enum';
import { IFullInvite } from './invites';
import { IBaseSettings } from './settings';

export interface IFullEvent {
  id: string;
  nameOfEvent: string;
  dateOfEvent: string;
  maxDateOfConfirmation: string;
  nameOfCelebrated: string;
  typeOfEvent: EventType;
  userId: string;
}

export type IDashboardEvent = Pick<
  IFullEvent,
  'id' | 'nameOfEvent' | 'dateOfEvent'
>;

export type IDropdownEvent = Pick<
  IFullEvent,
  'id' | 'nameOfEvent' | 'typeOfEvent'
>;

export type IEventSettings = Pick<IBaseSettings, 'settings'> &
  Pick<IFullEvent, 'typeOfEvent'>;

export interface IEventAction {
  event: IFullEvent;
  isNew: boolean;
}

export interface IStatistic {
  name: string;
  value: number;
  color: string;
}

export interface IEventResolved {
  invites: IFullInvite[];
  isDeadlineMet: boolean;
  id: string;
}
