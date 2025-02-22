import { Component } from '@angular/core';
import {} from 'bootstrap';
import { map } from 'rxjs';
import { IZodErrors } from 'src/app/core/models/common';
import { ErrorModalService } from 'src/app/core/services/error.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css'],
  standalone: false,
})
export class ErrorModalComponent {
  constructor(public errorService: ErrorModalService) {}

  vm$ = this.errorService.errorResponse$.pipe(
    map((information) => {
      let errorTriggered = false;
      let errorMessage = '';

      if (information.hasError && information.serverError) {
        errorMessage = information.serverError.error;
        if (information.serverError.status === 422) {
          const zodErrorMessage = information.serverError.error as IZodErrors[];
          errorMessage = zodErrorMessage
            .map((error, index) => {
              return `${index === 0 ? '' : '\n'}${error.path
                .join(' ')
                .toLocaleUpperCase()}: ${error.message}`;
            })
            .join(', ');
        }
      }

      if (
        information.serverError?.status !== undefined &&
        information.serverError.status !== 401 &&
        information.serverError.status !== 404 &&
        information.serverError.status !== 409
      ) {
        errorTriggered = information.hasError;
        $('#errorModal').modal('show');
      }

      return {
        errorTriggered,
        errorMessage,
      };
    })
  );
}
