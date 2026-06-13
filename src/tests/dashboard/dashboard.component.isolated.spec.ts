import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CommonInvitesService } from 'src/app/core/services/common-invites.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';

describe('Dashboard Component (Isolated Test)', () => {
  let component: DashboardComponent;
  const tokenSpy = jasmine.createSpyObj('TokenService', ['']);
  const socketSpy = jasmine.createSpyObj('SocketService', ['']);
  const commonInvitesSpy = jasmine.createSpyObj('CommonInvitesService', ['']);
  const router = jasmine.createSpyObj('Router', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStorageService, useValue: tokenSpy },
        { provide: SocketService, useValue: socketSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
        { provide: Router, useValue: router },
      ],
    });

    component = TestBed.createComponent(DashboardComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
