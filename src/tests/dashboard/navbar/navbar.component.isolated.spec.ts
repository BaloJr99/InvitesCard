import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonInvitesService } from 'src/app/core/services/common-invites.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NavbarComponent } from 'src/app/dashboard/navbar/navbar.component';

describe('Navbar Component (Isolated Test)', () => {
  let component: NavbarComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['']);
  const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
  const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);
  const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: InvitesService, useValue: invitesSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
      ],
    });

    component = TestBed.createComponent(NavbarComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
