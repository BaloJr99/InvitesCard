import { EventType } from './enum';
import { IInviteSection } from './invites';

export interface IBaseSettings {
  eventId: string;
  settings: string;
}

export interface ISweetXvSetting {
  sections: IInviteSection[];
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

export interface IWeddingSetting {
  sections: IInviteSection[];
  eventId: string;
  primaryColor: string;
  secondaryColor: string;
  weddingPrimaryColor: string;
  weddingSecondaryColor: string;
  weddingCopyMessage: string;
  groomParents: string;
  brideParents: string;
  receptionPlace: string;
  copyMessage: string;
  hotelName: string;
  hotelAddress: string;	
  hotelPhone: string;
  hotelUrl: string;
  hotelInformation: string;
  massUrl: string;
  massTime: string;
  massPlace: string;
  venueUrl: string;
  venueTime: string;
  venuePlace: string;
  civilUrl: string;
  civilTime: string;
  civilPlace: string;
  dressCodeColor: string;
  cardNumber: string;
  clabeBank: string;
}

export interface ISettingAction {
  eventId: string;
  isNew: boolean;
  eventType: EventType;
}
