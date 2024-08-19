import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/core/services/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  showSpinner = false;

  constructor(
    private loader: LoaderService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loader.loading$.subscribe({
      next: (value) => {
        this.showSpinner = value;
        this.cd.detectChanges();
      }
    })
  }
}
