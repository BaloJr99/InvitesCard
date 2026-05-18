import { Component, OnInit, inject } from '@angular/core';
import { Roles } from 'src/app/core/models/enum';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterModule],
})
export class SidebarComponent implements OnInit {
  private tokenService = inject(TokenStorageService);

  isAdmin = false;

  ngOnInit(): void {
    const userInformation = this.tokenService.getTokenValues();
    this.isAdmin = userInformation
      ? userInformation.roles.some((r) => r.name == Roles.Admin)
      : false;
  }
}
