import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISpinner } from '../models/common';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = new BehaviorSubject<ISpinner>({
    isLoading: false,
    message: '',
    showInviteLoader: false,
  });
  loading$ = this.loading.asObservable();

  setLoading(isLoading: boolean, message = '', showInviteLoader = false): void {
    this.loading.next({
      isLoading,
      message,
      showInviteLoader,
    });
  }
}
