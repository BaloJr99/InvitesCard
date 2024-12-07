import { EventType } from 'src/app/core/models/enum';
import { IUserProfile } from 'src/app/core/models/users';

const generateEventDate = (
  oldDate: boolean = false,
  isDeadline: boolean = false
) => {
  const date = new Date();
  if (oldDate) {
    date.setDate(date.getDate() - 1);

    if (isDeadline) {
      date.setDate(date.getDate() - 6);
    }
  } else {
    date.setDate(date.getDate() + 30);

    if (isDeadline) {
      date.setDate(date.getDate() - 10);
    }
  }

  return date.toISOString().split('T')[0];
};

export const invitesAdminUser: IUserProfile = {
  username: 'playwright-invites',
  password: 'P4ssw0rd',
  email: 'bchavez.testing@gmail.com',
  firstName: 'Playwright',
  lastName: 'Invites',
  gender: 'M',
  id: '',
  phoneNumber: '1234567890',
  profilePhoto: '',
};

export const sweetXvEventMock = {
  nameOfEvent: 'Sweet XV',
  dateOfEvent: generateEventDate(),
  maxDateOfConfirmation: generateEventDate(),
  typeOfEvent: EventType.Xv,
  nameOfCelebrated: 'Test name',
  assignedUser: 'playwright-invites',
};

export const saveTheDateEventMock = {
  nameOfEvent: 'Save the date',
  dateOfEvent: generateEventDate(),
  maxDateOfConfirmation: generateEventDate(),
  typeOfEvent: EventType.SaveTheDate,
  nameOfCelebrated: 'Test name',
  assignedUser: 'playwright-invites',
};

export const groupMock = {
  inviteGroup: 'Test group',
};

export const confirmedInviteMock = {
  family: 'Test family',
  inviteGroup: 'Test group',
  entriesNumber: 5,
  contactNumber: '1234567890',
  kidsAllowed: true,
};
