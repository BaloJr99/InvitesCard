import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IError } from "src/shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService {
  private _errorResponse = new Subject<IError>();
  errorResponse = this._errorResponse.asObservable();
  
  setError(hasError: boolean, error: HttpErrorResponse | null) {
    this._errorResponse.next({ hasError, error } as IError);
  }
}