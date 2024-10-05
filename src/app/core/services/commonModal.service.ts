import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ICommonModal } from '../models/common';
import { CommonModalResponse } from '../models/enum';

@Injectable({
  providedIn: 'root',
})
export class CommonModalService {
  private _commonModalData = new Subject<ICommonModal>();
  commonModalData$ = this._commonModalData.asObservable();

  private _commonModalResponse = new Subject<CommonModalResponse>();
  commonModalResponse$ = this._commonModalResponse.asObservable();

  setData(commonModalData: ICommonModal) {
    this._commonModalData.next({
      ...commonModalData
    });
  }

  sendResponse(response: CommonModalResponse) {
    this._commonModalResponse.next(response);
  }
}
