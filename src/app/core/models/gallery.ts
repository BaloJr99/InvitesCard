export interface IAlbum {
  id: string;
  nameOfAlbum: string;
  dateOfAlbum: string;
  eventId: string;
  isActive: boolean;
  thumbnail: string;
}

export type IUpsertAlbum = Omit<IAlbum, 'isActive' | 'dateOfAlbum'>;

export interface IAlbumAction {
  album: IUpsertAlbum;
  isNew: boolean;
}

export interface IAlbumResolved {
  isActive: boolean;
  eventId: string;
}

export interface IFullAlbumImage {
  id: string;
  fileUrl: string;
  publicId: string;
  albumId: string;
  isActive: boolean;
  image: string;
}

export type IAlbumImage = Omit<IFullAlbumImage, 'image'>;

export type IUploadAlbumImage = Pick<IFullAlbumImage, 'image' | 'albumId'>;
