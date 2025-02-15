import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ILog } from 'src/app/core/models/logs';

@Component({
  selector: 'app-log-modal',
  templateUrl: './logs-modal.component.html',
  styleUrls: ['./logs-modal.component.css'],
})
export class LogsModalComponent {
  private log = new BehaviorSubject<ILog | undefined>(undefined);
  log$ = this.log.asObservable();
  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set logValue(value: ILog) {
    this.log.next(value);
  }
  @Input() set showModalValue(value: boolean) {
    this.showModal.next(value);
  }

  @Output() closeModal = new EventEmitter<void>();

  vm$ = combineLatest([this.log$, this.showModal$]).pipe(
    map(([log, showModal]) => {
      if (showModal) {
        $('#logModal').modal('show');
        $('#logModal').on('hidden.bs.modal', () => {
          this.closeModal.emit();
        });
      } else {
        $('#logModal').modal('hide');
      }

      return log;
    })
  );
}
