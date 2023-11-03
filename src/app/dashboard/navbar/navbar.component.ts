import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/core/services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() email = "";
  @Input() username = "";
  @Output() searchEntries = new EventEmitter<string>();

  searchForm!: FormGroup;

  constructor(
    private router: Router, 
    private tokenService: TokenStorageService, 
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchInput: ""
    })
  }
  
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

  search(): void {
    this.searchEntries.emit(this.searchForm.get("searchInput")?.value)
    this.searchForm.reset();
  }
}
