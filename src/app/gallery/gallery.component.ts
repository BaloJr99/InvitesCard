import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  vm$ = this.route.params.pipe(
    map(() => {
      let currentRoute = this.route;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      if (!currentRoute.snapshot.params['id']) { 
        this.router.navigate(['/auth/login']);
      }

      return {
        nameOfEvent: currentRoute.snapshot.params['id'],
      };
    })
  );
}
