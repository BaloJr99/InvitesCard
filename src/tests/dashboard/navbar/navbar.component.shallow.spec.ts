import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NavbarComponent } from 'src/app/dashboard/navbar/navbar.component';

describe('Navbar Component (Shallow Test)', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['']);
    const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
