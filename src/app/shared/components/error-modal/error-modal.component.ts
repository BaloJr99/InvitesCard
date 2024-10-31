import { Component, OnInit } from '@angular/core';
import {} from 'bootstrap';
import { IZodErrors } from 'src/app/core/models/common';
import { ErrorModalService } from 'src/app/core/services/error.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css'],
})
export class ErrorModalComponent implements OnInit {
  errorTriggered = false;
  errorMessage = '';

  constructor(public errorService: ErrorModalService) {}

  ngOnInit(): void {
    this.errorService.errorResponse$.subscribe({
      next: (information) => {
        if (information.hasError && information.serverError) {
          this.errorMessage = information.serverError.error;
          if (information.serverError.status === 422) {
            const zodErrorMessage = information.serverError.error as IZodErrors[];
            this.errorMessage = zodErrorMessage
              .map((error, index) => {
                  return `${index === 0 ? '' : '\n'}${error.path.join(' ').toLocaleUpperCase()}: ${error.message}`
              }).join(', ');
          }
        }

        if (
          information.serverError?.status !== undefined &&
          information.serverError.status !== 401 &&
          information.serverError.status !== 404 &&
          information.serverError.status !== 409
        ) {
          this.errorTriggered = information.hasError;
          $('#errorModal').modal('show');
        }
      },
    });
  }
}
