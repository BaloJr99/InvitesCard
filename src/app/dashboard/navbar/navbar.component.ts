import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/core/services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router, private tokenService: TokenStorageService) { }
  toggleMenu(): void {
    const toggleMenu = document.querySelector(".menu");
    if (toggleMenu) {
      toggleMenu.classList.toggle("active");
    }
  }

  logout(): void {
    this.tokenService.signOut();
    this.router.navigate(['/account/login']);
  }

  search(event: Event): void {
    event.preventDefault()
    console.log("Pending")
  }
}
