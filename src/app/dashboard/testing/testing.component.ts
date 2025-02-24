import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css',
  imports: [RouterModule],
})
export class TestingComponent {
  constructor(
    private environmentService: EnvironmentService,
    private toastrService: ToastrService
  ) {}

  cleanEnvironment(): void {
    this.environmentService.cleanEnvironment().subscribe({
      next: () => {
        this.toastrService.success('Environment cleaned successfully');
      },
    });
  }
}
