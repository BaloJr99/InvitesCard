import { EventType } from './enum';
import { IFullInvite } from './invites';
import { IBaseSettings } from './settings';

export interface IFullEvent {
  id: string;
  nameOfEvent: string;
  dateOfEvent: string;
  maxDateOfConfirmation: string;
  nameOfCelebrated: string;
  eventTypeId: string;
  userId: string;
}

export type IDashboardEvent = Pick<
  IFullEvent,
  'id' | 'nameOfEvent' | 'dateOfEvent'
>;

export type IDropdownEvent = Pick<IFullEvent, 'id' | 'nameOfEvent'> & {
  typeOfEvent: EventType;
};

export type IEventSettings = Pick<IBaseSettings, 'settings'> & {
  typeOfEvent: EventType;
};

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
