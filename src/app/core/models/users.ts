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
  _id: string,
  username: string
}

export interface IUser extends IUserBasicInfo {
  email: string,
  isActive: boolean,
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