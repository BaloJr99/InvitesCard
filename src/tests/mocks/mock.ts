import { IEntry } from "src/shared/interfaces";

export const validUser = {
  username: '00132126',
  password: '123456',
  email: 'test@gmail.com',
  confirmPassword: '123456'
};

export const invalidPasswordUser = {
  username: '00132126',
  password: '123456',
  email: 'test@gmail.com',
  confirmPassword: '00132125'
}

export const blankUser = {
  username: '',
  password: '',
  email: '',
  confirmPassword: ''
};

export const validEntryConfirmation = {
  confirmation: true,
  entriesConfirmed: 4,
  message: 'Felicitaciones fofy'
}

export const emptyMessageEntryConfirmation = {
  confirmation: true,
  entriesConfirmed: 4,
  message: ''
}

export const canceledEntryConfirmation = {
  confirmation: false,
  entriesConfirmed: '',
  message: 'Felicitaciones fofy'
}

export const canceledEmptyMessageEntryConfirmation = {
  confirmation: false,
  entriesConfirmed: 0,
  message: ''
}

export const invalidEntryConfirmation = {
  confirmation: true,
  entriesConfirmed: '',
  message: null
}

export const entryConfirmed: IEntry = {
  id: '',
  family: 'Familia Rojas',
  entriesNumber: 5,
  entriesConfirmed: 0,
  message: '',
  confirmation: true,
  phoneNumber: '',
  groupSelected: 'dadFamily',
  kidsAllowed: true,
  dateOfConfirmation: '',
  isMessageRead: false
}

export const emptyConfirmationEntry: IEntry = {
  id: '1',
  family: 'Familia Rojas',
  entriesNumber: 5,
  entriesConfirmed: null,
  message: null,
  confirmation: null,
  phoneNumber: '',
  groupSelected: 'dadFamily',
  kidsAllowed: true,
  dateOfConfirmation: null,
  isMessageRead: false
}