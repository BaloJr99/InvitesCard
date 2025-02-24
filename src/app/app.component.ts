import { Component } from '@angular/core';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { RouterOutlet } from '@angular/router';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [SpinnerComponent, RouterOutlet, ErrorModalComponent],
})
export class AppComponent {}
