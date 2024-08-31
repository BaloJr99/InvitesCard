import { HttpErrorResponse } from "@angular/common/http"

export interface IError {
  hasError: boolean,
  serverError: HttpErrorResponse | null
}

export interface IMessageResponse {
  id: string,
  message: string
}

export interface INotification {
  id: string,
  family: string,
  confirmation: boolean,
  dateOfConfirmation: string,
  isMessageRead: boolean
}

export interface IMessage {
  family: string,
  message: string
}

export interface ISpinner {
  isLoading: boolean,
  message: string
}