import { Component } from '@angular/core';
import { map } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  imports: [CommonModule],
})
export class SpinnerComponent {
  constructor(private loader: LoaderService) {}

  vm$ = this.loader.loading$.pipe(
    map((spinner) => {
      return {
        showSpinner: spinner.isLoading,
        text: spinner.message,
        showInviteLoader: spinner.showInviteLoader,
      };
    })
  );
}
