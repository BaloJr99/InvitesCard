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
  IEventSettings,
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
  IInviteSection,
  ISaveTheDateUserInvite,
  IUserInvite,
  IUpsertInvite,
  IWeddingUserInvite,
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
  IWeddingSetting,
} from 'src/app/core/models/settings';

export const roleMock: IRole = {
  id: '674a68009dc087f77323d40d',
  isActive: true,
  name: 'admin',
};

export const fullUserMock: IFullUser = {
  id: '67453cad9303eeb77b31203d',
  username: 'playwright-admin',
  email: 'bchavez.testing@gmail.com',
  password: 'P4ssw0rd',
  firstName: 'Playwright',
  lastName: 'Admin',
  phoneNumber: '1234567890',
  gender: 'O',
  isActive: true,
  profilePhoto: 'Test.jpg',
  profilePhotoSource: 'Test.jpg',
  roles: [roleMock],
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
  access_token:
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
    typeOfEvent: EventType.SaveTheDate,
  },
  {
    id: '18dec379-5571-4b91-87da-eef2f2f5c1b2',
    nameOfEvent: 'Test Event 2',
    typeOfEvent: EventType.Xv,
  },
];

export const eventInformationMock: IEventSettings = {
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
  dateOfConfirmation: new Date().toISOString(),
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

export const sweetXvUserInviteMock: IUserInvite = {
  id: confirmedInviteMock.id,
  confirmation: confirmedInviteMock.confirmation,
  maxDateOfConfirmation:
    fullEventsMock.maxDateOfConfirmation.concat('T06:00:00Z'),
  entriesNumber: confirmedInviteMock.entriesNumber,
  eventId: confirmedInviteMock.eventId,
  family: confirmedInviteMock.family,
  kidsAllowed: confirmedInviteMock.kidsAllowed,
  dateOfEvent: fullEventsMock.dateOfEvent.concat('T06:00:00Z'),
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
  dateOfError: '2021-07-01T06:00:00Z',
  exceptionMessage: 'Test Exception',
  userId: fullUserMock.id,
};

export const baseSectionsMock: IInviteSection[] = [
  {
    sectionId: 'inviteInfo',
    name: 'Información de la invitación',
    disabled: true,
    selected: true,
    order: 0,
    draggable: false,
  },
  {
    sectionId: 'dressCodeInfo',
    name: 'Código de vestimenta',
    disabled: false,
    selected: true,
    order: 3,
    draggable: true,
  },
  {
    sectionId: 'giftsInfo',
    name: 'Regalos',
    disabled: false,
    selected: true,
    order: 4,
    draggable: true,
  },
  {
    sectionId: 'confirmationInfo',
    name: 'Formulario',
    disabled: true,
    selected: true,
    order: 5,
    draggable: true,
  },
];

export const sweetXvSectionsMock: IInviteSection[] = [
  baseSectionsMock[0],
  {
    sectionId: 'ceremonyInfo',
    name: 'Información de la ceremonia',
    disabled: false,
    selected: true,
    order: 1,
    draggable: true,
  },
  {
    sectionId: 'receptionInfo',
    name: 'Información de la recepción',
    disabled: false,
    selected: true,
    order: 1,
    draggable: true,
  },
  baseSectionsMock[1],
  baseSectionsMock[2],
  baseSectionsMock[3],
];

export const weddingSectionsMock: IInviteSection[] = [
  baseSectionsMock[0],
  {
    sectionId: 'itineraryInfo',
    name: 'Itinerario',
    draggable: true,
    disabled: false,
    selected: true,
    order: 1,
  },
  {
    ...baseSectionsMock[1],
    order: 2,
  },
  {
    ...baseSectionsMock[2],
    order: 3,
  },
  {
    ...baseSectionsMock[3],
    order: 4,
  },
  {
    sectionId: 'accomodationInfo',
    name: 'Hospedaje',
    draggable: true,
    disabled: true,
    selected: true,
    order: 5,
  },
  {
    sectionId: 'galleryInfo',
    name: 'Galería',
    draggable: true,
    disabled: true,
    selected: true,
    order: 6,
  },
];

export const sweetXvSettingMock: ISweetXvSetting = {
  sections: sweetXvSectionsMock,
  eventId: fullEventsMock.id,
  primaryColor: '#000000',
  secondaryColor: '#000000',
  firstSectionSentences: 'Test Sentences;Test Sentences',
  secondSectionSentences: 'Test Sentences',
  parents: 'Test Parent;Test Mother',
  godParents: 'Test Godparent; Test Godparent',
  massAddress: 'Test Address',
  massTime: '12:00',
  massUrl: 'https://fakepath/Test',
  receptionAddress: 'Test Address',
  receptionPlace: 'Test Place',
  receptionTime: '12:00',
  receptionUrl: 'https://fakepath/Test',
  dressCodeColor: 'Test color',
};

export const saveTheDateSettingMock: ISaveTheDateSetting = {
  eventId: fullEventsMock.id,
  primaryColor: '#000000',
  secondaryColor: '#000000',
  receptionPlace: 'Test Place',
  copyMessage: '[invite_url]',
  hotelInformation: 'https://fakepath/Test',
  hotelName: 'Test Hotel',
};

export const weddingSettingMock: IWeddingSetting = {
  sections: weddingSectionsMock,
  eventId: fullEventsMock.id,
  primaryColor: '#000000',
  secondaryColor: '#FFFFFF',
  weddingPrimaryColor: '#000000',
  weddingSecondaryColor: '#FFFFFF',
  weddingCopyMessage: 'Test Copy Message',
  receptionPlace: 'Test Reception Place',
  groomParents: 'Test Father;Test Mother',
  brideParents: 'Test Father;Test Mother',
  massUrl: 'https://fakepath.com',
  massTime: '18:30',
  massPlace: 'Test Mass Place',
  venueUrl: 'https://fakepath.com',
  venueTime: '20:00',
  venuePlace: 'Test Venue Place',
  civilPlace: 'Test Civil Place',
  civilTime: '19:00',
  civilUrl: 'https://fakepath.com',
  dressCodeColor: 'White',
  copyMessage: 'Test Copy Message',
  hotelInformation: 'Test Hotel Information',
  hotelName: 'Test Hotel Name',
  hotelAddress: 'Test Hotel Address',
  hotelPhone: '1234567890',
  hotelUrl: 'https://fakepath.com',
  cardNumber: '1111222233334444',
  clabeBank: '123456789012345678',
};

export const baseSettingMock: IBaseSettings = {
  eventId: fullEventsMock.id,
  settings: JSON.stringify(saveTheDateSettingMock),
};

export const sweetXvBaseSettingMock: IBaseSettings = {
  eventId: fullEventsMock.id,
  settings: JSON.stringify(sweetXvSettingMock),
};

export const saveTheDateBaseSettingMock: IBaseSettings = {
  eventId: fullEventsMock.id,
  settings: JSON.stringify(saveTheDateSettingMock),
};

export const weddingBaseSettingMock: IBaseSettings = {
  eventId: fullEventsMock.id,
  settings: JSON.stringify(weddingSettingMock),
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
  tableId: 'test-table',
  data: [
    {
      Name: 'Test Name',
    },
    {
      Name: 'Test Name 2',
    },
  ],
  headers: [
    {
      text: 'Name',
      sortable: true,
    },
  ],
  tableIndex: 0,
};

export const tableDataWithButtonsMock: ITable = {
  ...tableDataMock,
  headers: [...tableDataMock.headers, { text: 'Actions' }],
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
  headers: [...tableDataMock.headers, { text: 'Actions' }],
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
  headers: [{ text: '' }, ...tableDataMock.headers],
  useCheckbox: true,
};

export const tableDataWithFilterableHeaders: ITable = {
  ...tableDataMock,
  headers: [
    {
      text: 'Name',
      filterable: true,
    },
    { text: 'Actions' },
  ],
  buttons: [
    {
      accessibleText: 'Test Button',
      action: ButtonAction.Copy,
      innerHtml: 'Test',
    },
  ],
};

export const saveTheDateUserInviteMock: ISaveTheDateUserInvite = {
  id: newInviteMock.id,
  dateOfEvent: fullEventsMock.dateOfEvent.concat('T06:00:00Z'),
  eventId: newInviteMock.eventId,
  family: newInviteMock.family,
  nameOfCelebrated: 'Braulio;Brisa',
  maxDateOfConfirmation:
    fullEventsMock.maxDateOfConfirmation.concat('T06:00:00Z'),
  needsAccomodation: newInviteMock.needsAccomodation,
  typeOfEvent: fullEventsMock.typeOfEvent,
};

export const weddingUserInviteMock: IWeddingUserInvite = {
  id: newInviteMock.id,
  dateOfEvent: fullEventsMock.dateOfEvent.concat('T06:00:00Z'),
  eventId: newInviteMock.eventId,
  family: newInviteMock.family,
  nameOfCelebrated: 'Braulio;Brisa',
  maxDateOfConfirmation:
    fullEventsMock.maxDateOfConfirmation.concat('T06:00:00Z'),
  typeOfEvent: fullEventsMock.typeOfEvent,
  confirmation: confirmedInviteMock.confirmation,
  entriesNumber: confirmedInviteMock.entriesNumber,
  kidsAllowed: confirmedInviteMock.kidsAllowed,
};

export const showCeremonySection: IInviteSection[] = [
  {
    sectionId: 'inviteInfo',
    name: 'Información de la invitación',
    disabled: true,
    selected: true,
    order: 0,
    draggable: false,
  },
  {
    sectionId: 'ceremonyInfo',
    name: 'Información de la ceremonia',
    disabled: false,
    selected: true,
    order: 1,
    draggable: true,
  },
  {
    sectionId: 'receptionInfo',
    name: 'Información de la recepción',
    disabled: false,
    selected: false,
    order: 2,
    draggable: true,
  },
  {
    sectionId: 'dressCodeInfo',
    name: 'Código de vestimenta',
    disabled: false,
    selected: false,
    order: 3,
    draggable: true,
  },
  {
    sectionId: 'giftsInfo',
    name: 'Regalos',
    disabled: false,
    selected: false,
    order: 4,
    draggable: true,
  },
];

export const showReceptionSection: IInviteSection[] = [
  {
    sectionId: 'inviteInfo',
    name: 'Información de la invitación',
    disabled: true,
    selected: true,
    order: 0,
    draggable: false,
  },
  {
    sectionId: 'ceremonyInfo',
    name: 'Información de la ceremonia',
    disabled: false,
    selected: true,
    order: 1,
    draggable: true,
  },
  {
    sectionId: 'receptionInfo',
    name: 'Información de la recepción',
    disabled: false,
    selected: true,
    order: 2,
    draggable: true,
  },
  {
    sectionId: 'dressCodeInfo',
    name: 'Código de vestimenta',
    disabled: false,
    selected: false,
    order: 3,
    draggable: true,
  },
  {
    sectionId: 'giftsInfo',
    name: 'Regalos',
    disabled: false,
    selected: false,
    order: 4,
    draggable: true,
  },
];

export const showDressCodeSection: IInviteSection[] = [
  {
    sectionId: 'inviteInfo',
    name: 'Información de la invitación',
    disabled: true,
    selected: true,
    order: 0,
    draggable: false,
  },
  {
    sectionId: 'ceremonyInfo',
    name: 'Información de la ceremonia',
    disabled: false,
    selected: true,
    order: 1,
    draggable: true,
  },
  {
    sectionId: 'receptionInfo',
    name: 'Información de la recepción',
    disabled: false,
    selected: true,
    order: 2,
    draggable: true,
  },
  {
    sectionId: 'dressCodeInfo',
    name: 'Código de vestimenta',
    disabled: false,
    selected: true,
    order: 3,
    draggable: true,
  },
  {
    sectionId: 'giftsInfo',
    name: 'Regalos',
    disabled: false,
    selected: false,
    order: 4,
    draggable: true,
  },
];

export const showGiftsSection: IInviteSection[] = [
  {
    sectionId: 'inviteInfo',
    name: 'Información de la invitación',
    disabled: true,
    selected: true,
    order: 0,
    draggable: false,
  },
  {
    sectionId: 'ceremonyInfo',
    name: 'Información de la ceremonia',
    disabled: false,
    selected: true,
    order: 1,
    draggable: true,
  },
  {
    sectionId: 'receptionInfo',
    name: 'Información de la recepción',
    disabled: false,
    selected: true,
    order: 2,
    draggable: true,
  },
  {
    sectionId: 'dressCodeInfo',
    name: 'Código de vestimenta',
    disabled: false,
    selected: true,
    order: 3,
    draggable: true,
  },
  {
    sectionId: 'giftsInfo',
    name: 'Regalos',
    disabled: false,
    selected: true,
    order: 4,
    draggable: true,
  },
];
