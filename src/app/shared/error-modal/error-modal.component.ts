import { Component, OnInit } from '@angular/core';
import { ErrorModalService } from 'src/core/services/error.service';
import { } from 'bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {
  errorTriggered = false;

  constructor(public errorService: ErrorModalService) { }

  ngOnInit(): void {
    this.errorService.errorResponse.subscribe({
      next: (information) => {
        if (information.error?.status !== undefined && information.error.status !== 401 && information.error.status !== 404) {
          this.errorTriggered = information.hasError;
          $("#errorModal").modal("show");
        }
      }
    })
  }
}
