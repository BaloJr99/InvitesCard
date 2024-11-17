import { IToken } from 'src/app/core/models/tokens';
import {
  IFullUser,
  ISearchUser,
  IUpsertUser,
  IUser,
  IUserDropdownData,
  IUserEventsInfo,
  IUserProfile,
  IUserProfilePhoto,
} from 'src/app/core/models/users';
import {
  ButtonAction,
  CommonModalType,
  EventType,
  ImageUsage,
} from 'src/app/core/models/enum';
import {
  IDashboardEvent,
  IDropdownEvent,
  IEventInformation,
  IFullEvent,
} from 'src/app/core/models/events';
import {
  IBulkMessageResponse,
  ICommonModal,
  IMessage,
  IMessageResponse,
  INotification,
  ISpinner,
  ITable,
} from 'src/app/core/models/common';
import {
  IBulkInvite,
  IConfirmation,
  IDashboardInvite,
  IFullInvite,
  ISweetXvUserInvite,
  IUpsertInvite,
} from 'src/app/core/models/invites';
import {
  IDeleteFile,
  IDownloadAudio,
  IDownloadFiles,
  IDownloadImage,
  IFullFile,
  IUpdateImage,
  IUploadImage,
} from 'src/app/core/models/images';
import { IInviteGroups } from 'src/app/core/models/inviteGroups';
import { ILog } from 'src/app/core/models/logs';
import { IRole } from 'src/app/core/models/roles';
import {
  IBaseSettings,
  ISaveTheDateSetting,
  ISweetXvSetting,
} from 'src/app/core/models/settings';

export const fullUserMock: IFullUser = {
  id: '2e1ba1a6-e0c2-4382-acf4-e1933a88ea77',
  username: 'Test',
  email: 'Test@gmail.com',
  password: 'P@ssw0rd',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '1234567890',
  gender: 'T',
  isActive: true,
  profilePhoto: 'Test.jpg',
  profilePhotoSource: 'Test.jpg',
  roles: [
    {
      id: 'c13dc4c2-4b59-457e-a9e7-97b3a2910ca0',
      name: 'Test',
      isActive: true,
    },
  ],
};

export const userMock: IUser = {
  id: fullUserMock.id,
  email: fullUserMock.email,
  profilePhoto: fullUserMock.profilePhoto,
  roles: fullUserMock.roles,
  username: fullUserMock.username,
};

export const userEventsInfoMock: IUserEventsInfo = {
  id: fullUserMock.id,
  email: fullUserMock.email,
  username: fullUserMock.username,
  isActive: fullUserMock.isActive,
  numEntries: 1,
  numEvents: 1,
};

export const userDropdownDataMock: IUserDropdownData = {
  id: fullUserMock.id,
  username: fullUserMock.username,
};

export const searchUserMock: ISearchUser = {
  id: fullUserMock.id,
  email: fullUserMock.email,
  isActive: fullUserMock.isActive,
  roles: fullUserMock.roles,
  username: fullUserMock.username,
};

export const upsertUserMock: IUpsertUser = {
  id: fullUserMock.id,
  email: fullUserMock.email,
  isActive: fullUserMock.isActive,
  roles: fullUserMock.roles.map((role) => role.id),
  username: fullUserMock.username,
};

export const userProfileMock: IUserProfile = {
  id: fullUserMock.id,
  email: fullUserMock.email,
  firstName: fullUserMock.firstName,
  lastName: fullUserMock.lastName,
  phoneNumber: fullUserMock.phoneNumber,
  gender: fullUserMock.gender,
  password: fullUserMock.password,
  profilePhoto: fullUserMock.profilePhoto,
  username: fullUserMock.username,
};

export const userProfilePhotoMock: IUserProfilePhoto = {
  id: fullUserMock.id,
  profilePhotoSource: fullUserMock.profilePhotoSource,
};

export const loginDataMock = {
  usernameOrEmail: fullUserMock.username,
  password: fullUserMock.password,
};

export const tokenMock: IToken = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};

export const messageResponseMock: IMessageResponse = {
  id: 'ffeeff83-432a-45f6-aa40-c10014b7a308',
  message: 'Test Message',
};

export const notificationsMock: INotification[] = [
  {
    id: '2f435cdf-d3e6-45cc-a62b-15f9667e1879',
    family: 'Test Family',
    confirmation: true,
    dateOfConfirmation: '2021-07-01',
    isMessageRead: false,
  },
];

export const messagesMock: IMessage[] = [
  {
    family: 'Test Family',
    message: 'Test Message',
    date: '2021-07-01',
    time: '12:00',
  },
];

export const commonModalMock: ICommonModal = {
  modalTitle: 'Test Title',
  modalBody: 'Test Body',
  modalType: CommonModalType.Confirm,
};

export const fullEventsMock: IFullEvent = {
  id: 'dc7b4321-1379-4be5-8070-91e28ae8fd5d',
  allowCreateInvites: 1,
  dateOfEvent: '2021-07-01',
  maxDateOfConfirmation: '2021-09-01',
  nameOfCelebrated: 'Test',
  nameOfEvent: 'Test Event',
  typeOfEvent: EventType.None,
  userId: fullUserMock.id,
};

export const dashboardEventsMock: IDashboardEvent[] = [
  {
    id: fullEventsMock.id,
    allowCreateInvites: fullEventsMock.allowCreateInvites,
    dateOfEvent: fullEventsMock.dateOfEvent,
    nameOfEvent: fullEventsMock.nameOfEvent,
  },
  {
    id: 'd87ab8cc-fa70-4b14-b5e0-b9da10b396bf',
    allowCreateInvites: 0,
    dateOfEvent: '2021-10-01',
    nameOfEvent: 'Test Event 2',
  },
];

export const dropdownEventsMock: IDropdownEvent[] = [
  {
    id: fullEventsMock.id,
    nameOfEvent: fullEventsMock.nameOfEvent,
    typeOfEvent: fullEventsMock.typeOfEvent,
  },
];

export const eventInformationMock: IEventInformation = {
  settings: '',
  typeOfEvent: fullEventsMock.typeOfEvent,
};

export const fullInvitesGroupsMock: IInviteGroups = {
  id: '4ab19b3e-53ba-4017-9c05-2d3ee285aff8',
  eventId: fullEventsMock.id,
  inviteGroup: 'Test Group',
};

export const upsertInviteMock: IUpsertInvite = {
  id: '6e8196c7-ce28-4658-b4f0-df7fe5a1a2d1',
  eventId: fullEventsMock.id,
  family: 'Test Family',
  kidsAllowed: true,
  entriesNumber: 2,
  inviteGroupId: fullInvitesGroupsMock.id,
  phoneNumber: '1234567890',
};

export const newInviteMock: IFullInvite = {
  ...upsertInviteMock,
  confirmation: null,
  dateOfConfirmation: null,
  entriesConfirmed: null,
  isMessageRead: false,
  message: null,
  inviteViewed: false,
  needsAccomodation: null,
};

export const confirmedInviteMock: IFullInvite = {
  ...upsertInviteMock,
  id: '20f13da8-2b38-45e5-907f-4ef2a93ff159',
  confirmation: true,
  dateOfConfirmation: new Date().toISOString().substring(0, 10),
  entriesConfirmed: 2,
  inviteViewed: true,
  isMessageRead: false,
  message: 'Test Message',
  needsAccomodation: true,
};

export const notConfirmedInviteMock: IFullInvite = {
  ...upsertInviteMock,
  id: 'dfc2dc7a-02fa-42c9-b125-fbc7e460bbf7',
  confirmation: false,
  dateOfConfirmation: '2021-07-01',
  entriesConfirmed: 0,
  inviteViewed: true,
  isMessageRead: false,
  message: 'Test Message',
  needsAccomodation: true,
};

export const fullFileMock: IFullFile = {
  id: 'd1b1d4e6-6c7e-4b1f-8c7f-7b4e2b1d7e6c',
  eventId: fullEventsMock.id,
  fileUrl: 'https://fakepath/Test.jpg',
  image: 'base64',
  imageUsage: ImageUsage.Both,
  publicId: 'test',
};

export const uploadImageMock: IUploadImage = {
  eventId: fullEventsMock.id,
  image: 'base64',
};

export const updateImageMock: IUpdateImage = {
  id: fullFileMock.id,
  imageUsage: fullFileMock.imageUsage,
};

export const downloadImageMock: IDownloadImage = {
  id: '96261de3-d4a4-408f-8e78-ea40550bcd31',
  fileUrl: 'https://fakepath/Test.jpg',
  publicId: 'test',
  imageUsage: ImageUsage.Both,
};

export const downloadMusicMock: IDownloadAudio = {
  id: '71d00c38-9a14-41fc-b56b-7b7974d7522c',
  fileUrl: 'https://fakepath/Test.mp3',
  publicId: 'test',
};

export const deleteFileMock: IDeleteFile = {
  id: fullFileMock.id,
  publicId: fullFileMock.publicId,
};

export const downloadFileMock: IDownloadFiles = {
  eventImages: [downloadImageMock],
  eventAudios: [downloadMusicMock],
};

export const dashboardInvitesMock: IDashboardInvite = {
  eventId: fullEventsMock.id,
  confirmation: confirmedInviteMock.confirmation,
  dateOfConfirmation: confirmedInviteMock.dateOfConfirmation,
  entriesConfirmed: confirmedInviteMock.entriesConfirmed,
  entriesNumber: confirmedInviteMock.entriesNumber,
};

export const sweetXvUserInviteMock: ISweetXvUserInvite = {
  id: confirmedInviteMock.id,
  confirmation: confirmedInviteMock.confirmation,
  maxDateOfConfirmation: '2021-10-01',
  entriesNumber: confirmedInviteMock.entriesNumber,
  eventId: confirmedInviteMock.eventId,
  family: confirmedInviteMock.family,
  kidsAllowed: confirmedInviteMock.kidsAllowed,
  dateOfEvent: fullEventsMock.dateOfEvent,
  nameOfCelebrated: fullEventsMock.nameOfCelebrated,
  typeOfEvent: fullEventsMock.typeOfEvent,
};

export const confirmationInviteMock: IConfirmation = {
  id: confirmedInviteMock.id,
  entriesNumber: confirmedInviteMock.entriesNumber,
  confirmation: confirmedInviteMock.confirmation,
  dateOfConfirmation: confirmedInviteMock.dateOfConfirmation,
  entriesConfirmed: confirmedInviteMock.entriesConfirmed,
  message: confirmedInviteMock.message,
};

export const bulkInvitesMock: IBulkInvite = {
  eventId: fullEventsMock.id,
  inviteGroupId: fullInvitesGroupsMock.id,
  entriesNumber: upsertInviteMock.entriesNumber,
  family: upsertInviteMock.family,
  inviteGroupName: fullInvitesGroupsMock.inviteGroup,
  isNewInviteGroup: true,
  kidsAllowed: upsertInviteMock.kidsAllowed,
  phoneNumber: upsertInviteMock.phoneNumber,
};

export const bulkMessageResponseMock: IBulkMessageResponse = {
  inviteGroupsGenerated: [{ ...fullInvitesGroupsMock }],
  invitesGenerated: [{ ...upsertInviteMock }],
  message: 'Test Message',
};

export const logMock: ILog = {
  id: 'c6e03960-5939-4411-8b46-e68a55f9d6af',
  customError: 'Test Error',
  dateOfError: '2021-07-01',
  exceptionMessage: 'Test Exception',
  userId: fullUserMock.id,
};

export const roleMock: IRole = {
  id: 'd2f93adc-c1ae-45a1-a688-90273a58131a',
  isActive: true,
  name: 'Test Role',
};

export const baseSettingMock: IBaseSettings = {
  eventId: fullEventsMock.id,
  settings: 'Test Settings',
};

export const sweetXvSetting: ISweetXvSetting = {
  eventId: fullEventsMock.id,
  primaryColor: '#000000',
  secondaryColor: '#000000',
  firstSectionSentences: 'Test Sentences',
  secondSectionSentences: 'Test Sentences',
  parents: 'Test Parents',
  godParents: 'Test Godparents',
  massAddress: 'Test Address',
  massTime: '12:00',
  massUrl: 'https://fakepath/Test',
  receptionAddress: 'Test Address',
  receptionPlace: 'Test Place',
  receptionTime: '12:00',
  receptionUrl: 'https://fakepath/Test',
  dressCodeColor: 'Test color',
};

export const saveTheDateSetting: ISaveTheDateSetting = {
  eventId: fullEventsMock.id,
  primaryColor: '#000000',
  secondaryColor: '#000000',
  receptionPlace: 'Test Place',
  copyMessage: 'Test Message',
  hotelInformation: 'Test Information',
  hotelName: 'Test Hotel',
};

export const showSpinnerMock: ISpinner = {
  isLoading: true,
  message: 'Test Spinner',
  showInviteLoader: false,
};

export const showInviteLoaderMock: ISpinner = {
  isLoading: false,
  message: 'Test Invite',
  showInviteLoader: true,
};

export const validFileMock: File = new File(
  [
    `Familia,Numero de pases,Telefóno,Niños permitidos,Grupo\n${upsertInviteMock.family},${upsertInviteMock.entriesNumber},${upsertInviteMock.phoneNumber},${upsertInviteMock.kidsAllowed},${upsertInviteMock.inviteGroupId}`,
  ],
  'test-file.csv',
  { type: 'text/plain' }
);

export const invalidFileMock: File = new File(
  [`Familia,Numero de pases,Telefóno,Niños permitidos,Grupo`],
  'test-file.csv',
  { type: 'text/plain' }
);

export const tableDataMock: ITable = {
  data: [
    {
      Name: 'Test Name',
    },
    {
      Name: 'Test Name 2',
    },
  ],
  headers: ['Name'],
  tableIndex: 0,
};

export const tableDataWithButtonsMock: ITable = {
  ...tableDataMock,
  headers: [...tableDataMock.headers, 'Actions'],
  buttons: [
    {
      accessibleText: 'Test Button',
      action: ButtonAction.Copy,
      innerHtml: 'Test',
    },
  ],
};

export const tableDataWithDisabledButtonsMock: ITable = {
  ...tableDataMock,
  headers: [...tableDataMock.headers, 'Actions'],
  buttons: [
    {
      accessibleText: 'Test Button',
      action: ButtonAction.Copy,
      innerHtml: 'Test',
      isDisabled: true,
    },
  ],
};

export const tableDataWithCheckboxMock: ITable = {
  ...tableDataMock,
  headers: ['', ...tableDataMock.headers],
  useCheckbox: true,
};
