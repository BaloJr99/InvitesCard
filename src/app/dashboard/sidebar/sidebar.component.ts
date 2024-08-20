import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/core/services/token-storage.service';
import { Roles } from 'src/shared/enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAdmin = false;

  constructor(private tokenService: TokenStorageService) { }

  ngOnInit(): void {
    const userInformation = this.tokenService.getTokenValues();
    if (userInformation) {
      this.isAdmin = userInformation.roles.some(r => r.name == Roles.Admin);
    }
  }
}
