import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.css'],
})
export class NotAuthorizedComponent {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService
  ) {}

  logout(): void {
    this.tokenService.signOut();
    this.router.navigate(['/auth/login']);
  }
}
