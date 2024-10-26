import { FormControl } from '@angular/forms';

export interface IFullFile {
  id: string;
  fileUrl: string;
  publicId: string;
  image: string;
  eventId: string;
  imageUsage: string;
}

export type IUploadImage = Pick<IFullFile, 'image' | 'eventId'>;
export type IDownloadImage = Omit<IFullFile, 'image' | 'eventId'>;
export type IDownloadAudio = Omit<IFullFile, 'image' | 'eventId' | 'imageUsage'>;
export interface IDownloadFiles {
  eventImages: IDownloadImage[];
  eventAudios: IDownloadAudio[];
};
export type IDeleteFile = Pick<IFullFile, 'id' | 'publicId'>;
export type IUpdateImage = Pick<IFullFile, 'id' | 'imageUsage'>;

export interface IUpdateImageArray {
  id: FormControl<string>;
  imageUsage: FormControl<string>;
}
