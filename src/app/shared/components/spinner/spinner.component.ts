import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  showSpinner = false;
  text = '';
  showInviteLoader = false;

  constructor(private loader: LoaderService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loader.loading$.subscribe({
      next: (spinner) => {
        this.showSpinner = spinner.isLoading;
        this.text = spinner.message;
        this.showInviteLoader = spinner.showInviteLoader;
        this.cd.detectChanges();
      },
    });
  }
}
