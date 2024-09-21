import { FormControl } from '@angular/forms';

export interface IFullImage {
  id: string;
  imageUrl: string;
  publicId: string;
  image: string;
  eventId: string;
  imageUsage: string;
}

export type IUploadImage = Pick<IFullImage, 'image' | 'eventId'>;
export type IDownloadImage = Omit<IFullImage, 'image' | 'eventId'>;
export type IDeleteImage = Pick<IFullImage, 'id' | 'publicId'>;
export type IUpdateImage = Pick<IFullImage, 'id' | 'imageUsage'>;

export interface IUpdateImageArray {
  id: FormControl<string>;
  imageUsage: FormControl<string>;
}
