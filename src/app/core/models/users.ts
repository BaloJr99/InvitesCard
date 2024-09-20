import { IRole } from "./roles"

export interface IAuthUser {
  usernameOrEmail: string,
  email: string
}

export interface IFullUser {
  username: string,
  email: string,
  password: string,
  roles: string[]
}

export interface IUserBasicInfo {
  id: string,
  username: string
}

export interface IUser extends IUserBasicInfo {
  email: string,
  isActive: boolean,
  profilePhoto: string,
  roles: IRole[]
}

export interface IUserEventsInfo {
  id: string,
  username: string,
  email: string,
  isActive: boolean,
  numEvents: number,
  numEntries: number
}

export interface IUserAction {
  user: IUser,
  isNew: boolean
}

export interface IUserProfile {
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  password: string,
  gender: string,
  profilePhoto: string
}

export interface IUserProfilePhoto {
  userId: string,
  profilePhotoSource: string
}