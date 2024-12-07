import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css',
})
export class TestingComponent {
  constructor(
    private environmentService: EnvironmentService,
    private loaderService: LoaderService,
    private toastrService: ToastrService
  ) {}

  cleanEnvironment(): void {
    this.loaderService.setLoading(true);
    this.environmentService
      .cleanEnvironment()
      .subscribe({
        next: () => {
          this.toastrService.success('Environment cleaned successfully');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }
}
