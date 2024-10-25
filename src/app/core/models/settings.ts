import { EventType } from './enum';

export interface IBaseSettings {
  eventId: string;
  settings: string;
}

export interface ISetting {
  eventId: string;
  primaryColor: string;
  secondaryColor: string;
  parents: string;
  godParents: string;
  firstSectionSentences: string;
  secondSectionSentences: string;
  massUrl: string;
  massTime: string;
  massAddress: string;
  receptionUrl: string;
  receptionTime: string;
  receptionPlace: string;
  receptionAddress: string;
  dressCodeColor: string;
}

export interface ISaveTheDateSetting {
  eventId: string;
  primaryColor: string;
  secondaryColor: string;
  receptionPlace: string;
  copyMessage: string;
  hotelName: string;
  hotelInformation: string;
}

export interface ISettingAction {
  eventId: string;
  isNew: boolean;
  eventType: EventType;
}
