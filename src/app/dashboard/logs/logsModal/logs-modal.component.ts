import { Component, Input, OnInit } from '@angular/core';
import { ILog } from 'src/app/core/models/logs';

@Component({
  selector: 'app-log-modal',
  templateUrl: './logs-modal.component.html',
  styleUrls: ['./logs-modal.component.css']
})
export class LogsModalComponent implements OnInit {
  @Input() log: ILog | undefined = undefined;

  ngOnInit(): void {
    $('#logModal').on('hidden.bs.modal', () => {
      this.log = undefined;
    });
  }
}
