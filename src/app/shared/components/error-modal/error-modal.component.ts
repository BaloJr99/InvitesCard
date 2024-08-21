import { Component, OnInit } from '@angular/core';
import { } from 'bootstrap';
import { ErrorModalService } from 'src/app/core/services/error.service';

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
        if (
          information.error?.status !== undefined && 
          information.error.status !== 401 && 
          information.error.status !== 404 &&
          information.error.status !== 409) {
          this.errorTriggered = information.hasError;
          $("#errorModal").modal("show");
        }
      }
    })
  }
}
