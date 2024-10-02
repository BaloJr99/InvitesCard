import { ISettingType } from './enum';

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

export interface ISettingAction {
  eventId: string;
  isNew: boolean;
  settingType: ISettingType;
}
