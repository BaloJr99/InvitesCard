import { IRole } from './roles';

export interface IFullUser {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  isActive: boolean;
  profilePhoto: string;
  profilePhotoSource: string;
  roles: IRole[];
}

export type IAuthUser = Pick<IFullUser, 'password'> & {
  usernameOrEmail: string;
};

export type ISearchUser = Pick<
  IFullUser,
  'id' | 'username' | 'email' | 'isActive' | 'roles'
>;

export type IUpsertUser = Omit<ISearchUser, 'roles'> & { roles: string[] };

export type IUserDropdownData = Pick<IFullUser, 'id' | 'username'>;

export type IUser = IUserDropdownData &
  Pick<IFullUser, 'email' | 'profilePhoto' | 'roles'>;

export type IUserEventsInfo = Omit<ISearchUser, 'roles'> & {
  numEvents: number;
  numEntries: number;
};

export type IUserProfile = Omit<
  IFullUser,
  'isActive' | 'profilePhotoSource' | 'roles'
>;

export type IUserProfilePhoto = Pick<IFullUser, 'id' | 'profilePhotoSource'>;

export interface IUserAction {
  user: IUpsertUser;
  isNew: boolean;
}
