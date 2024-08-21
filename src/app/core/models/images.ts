import { FormControl } from "@angular/forms"

export interface IUploadImage {
  image: string
  eventId: string
}

export interface IDownloadImage {
  id: string,
  imageUrl: string,
  publicId: string,
  imageUsage: string
}

export interface IDeleteImage {
  id: string,
  publicId: string
}

export interface IUpdateImage {
  id: string,
  imageUsage: string
}

export interface IUpdateImageArray {
  id: FormControl<string>,
  imageUsage: FormControl<string>
}