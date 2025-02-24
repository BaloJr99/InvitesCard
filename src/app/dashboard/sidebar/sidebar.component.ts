import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/core/models/enum';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterModule, CommonModule],
})
export class SidebarComponent implements OnInit {
  isAdmin = false;

  constructor(private tokenService: TokenStorageService) {}

  ngOnInit(): void {
    const userInformation = this.tokenService.getTokenValues();
    this.isAdmin = userInformation
      ? userInformation.roles.some((r) => r.name == Roles.Admin)
      : false;
  }
}
