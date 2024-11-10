import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Injectable,
} from '@angular/core';
import { ICommonModal } from '../models/common';
import { CommonModalComponent } from 'src/app/shared/components/common-modal/common-modal.component';
import { Observable, Subject } from 'rxjs';
import { CommonModalResponse } from '../models/enum';

@Injectable({
  providedIn: 'root',
})
export class CommonModalService {
  private componentRef!: ComponentRef<CommonModalComponent>;
  private componentSubscriber!: Subject<CommonModalResponse>;

  constructor(private applicationRef: ApplicationRef) {}

  open(options: ICommonModal): Observable<CommonModalResponse> {
    const environmentInjector = this.applicationRef.injector;

    this.componentRef = createComponent(CommonModalComponent, {
      environmentInjector,
    });

    this.applicationRef.attachView(this.componentRef.hostView);

    const root = document.getElementsByTagName('app-root')[0];
    root.appendChild(this.componentRef.location.nativeElement);

    this.componentRef.instance.options = options;
    this.componentRef.instance.closeModal.subscribe(() => this.closeModal());
    this.componentRef.instance.confirmModal.subscribe(() =>
      this.confirmModal()
    );

    this.componentSubscriber = new Subject<CommonModalResponse>();
    return this.componentSubscriber.asObservable();
  }

  closeModal() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
  }

  confirmModal() {
    this.componentSubscriber.next(CommonModalResponse.Confirm);
    this.closeModal();
  }
}
